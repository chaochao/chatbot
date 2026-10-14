# AI UX — stream, stop, retry, show evidence

Use for any AI slice. Follow [STACK.md](STACK.md) and run [UX-CHECKLIST.md](UX-CHECKLIST.md) before shipping. These are integration patterns, not a complete endpoint: wire in the project's request schema, authorized context loader and provider adapter.

## User contract

| State | What the user sees | Actions |
|---|---|---|
| Idle | A labeled question field with a useful example | Ask |
| Connecting | “Preparing an answer…” immediately | Stop |
| Streaming | Partial answer, clearly labeled “Generating…” | Stop |
| Complete | Answer and named evidence links | Ask another |
| Stopped | Partial answer + “Stopped. This answer is incomplete.” | Retry |
| Failed / timed out | Partial answer + plain explanation | Retry |
| Rate limited | “The AI service is busy. Try again shortly.” | Retry after any server-specified delay |

Disable duplicate submits while active. Keep the question on every outcome. Retry repeats the **submitted** question and context, not an edited draft, and starts a new answer; keep the previous partial answer visible in the previous attempt. Do not automatically retry an AI request. A new attempt must never append to an old answer.

Render text with React text nodes (`<p className="whitespace-pre-wrap">{text}</p>`), never `dangerouslySetInnerHTML`. Announce status changes with `role="status"`; don't announce every token. Keep keyboard focus on usable controls when Stop disappears. Auto-scroll only while the user is already at the bottom.

## One stream contract, real and mock

POST `/api/ask` with a Zod-validated question and context selector. Resolve identity and tenant on the server; authorize the selected context before opening the stream. Send compact, precomputed facts and allowed evidence references, not raw tables. Treat source text as data, not instructions. Keep model keys server-side.

Use SSE over `fetch` so the request can have a body and an abort signal. Each frame has one `event:` line, one JSON `data:` line, and a blank line. JSON-encode newlines inside text. The contract below is application-owned, independent of the provider's wire format.

| Event | JSON data | Meaning |
|---|---|---|
| `meta` | `{ "provider": "mock" }` or `{ "provider": "live" }` | Actual adapter used; show “Demo response” for mock |
| `delta` | `{ "text": "…" }` | Append plain text |
| `done` | `{ "citations": [] }` | Terminal success with server-resolved evidence |
| `error` | `{ "message": "The AI took too long to answer." }` | Terminal failure; preserve partial text |

Require a terminal event; a closed connection alone is not success. Before SSE starts, use ordinary HTTP errors (including 429). After it starts, send an `error` event; HTTP status can no longer describe the failure. Never send raw provider errors to the browser.

### Server: propagate cancellation and clean up

Hono route fragment for `server/ask.ts`. `generate({ signal })` is an async iterable of text chunks. Its real implementation passes that signal to the upstream `fetch`; its mock implementation also stops on abort. Provider parsing, input validation and authorization are separate from this fragment.

```ts
import { streamSSE } from 'hono/streaming'

// Inside the validated, authorized route:
return streamSSE(c, async (stream) => {
  const controller = new AbortController()
  stream.onAbort(() => controller.abort())
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, 30_000)
  let text = ''
  try {
    await stream.writeSSE({ event: 'meta', data: JSON.stringify({ provider }) })
    for await (const chunk of generate({ signal: controller.signal })) {
      controller.signal.throwIfAborted()
      text += chunk
      await stream.writeSSE({ event: 'delta', data: JSON.stringify({ text: chunk }) })
    }
    controller.signal.throwIfAborted()
    // Parse with Zod, then resolve only against authorized DB records.
    const citations = await resolveCitations(text, controller.signal)
    controller.signal.throwIfAborted()
    await stream.writeSSE({ event: 'done', data: JSON.stringify({ citations }) })
  } catch {
    if (!stream.aborted) {
      const message = timedOut
        ? 'The AI took too long to answer.'
        : 'The answer could not finish. Try again.'
      await stream.writeSSE({ event: 'error', data: JSON.stringify({ message }) })
    }
  } finally {
    clearTimeout(timer)
    controller.abort()
  }
})
```

Map a recognized upstream rate limit to the busy message and its retry delay in the provider adapter. Bound question length, context size and output tokens. Stop cancels generation; it is not Undo for any already-completed data mutation. Keep this answer endpoint read-only.

### Client: parse frames across network chunks

This JavaScript helper can live in `src/api.ts` after adding TypeScript types. It handles split frames, split UTF-8 characters and both LF and CRLF separators. It deliberately supports the single-data-line contract above, not arbitrary SSE features. `onEvent` must validate event payloads with shared Zod schemas before updating UI.

```js
async function readAnswer(response, onEvent) {
  if (response.status === 429) throw new Error('The AI service is busy. Try again shortly.')
  if (!response.ok || !response.body) throw new Error('Could not start the answer. Try again.')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  try {
    while (true) {
      const { value, done } = await reader.read()
      buffer += decoder.decode(value, { stream: !done })
      let boundary
      while ((boundary = /\r?\n\r?\n/.exec(buffer))) {
        const frame = buffer.slice(0, boundary.index)
        buffer = buffer.slice(boundary.index + boundary[0].length)
        const lines = frame.split(/\r?\n/)
        const event = lines.find(line => line.startsWith('event:'))?.slice(6).trim()
        const data = lines.find(line => line.startsWith('data:'))?.slice(5).trim()
        if (!event || data === undefined) continue
        const payload = JSON.parse(data)
        onEvent(event, payload)
        if (event === 'error') throw new Error(payload.message)
        if (event === 'done') return
      }
      if (done) throw new Error('Connection lost. This answer is incomplete.')
    }
  } finally {
    await reader.cancel().catch(() => {})
    reader.releaseLock()
  }
}
```

### React: Stop and Retry ownership

Inside the answer component, use one controller per attempt. The integration functions below are app-specific: `beginAttempt` preserves the previous answer and creates an empty attempt; `applyEvent` validates and appends to it; `finishAttempt` changes status without clearing text. Treat `meta` as provider disclosure, `delta` as streaming, and `done` as complete.

```tsx
const active = useRef<AbortController | null>(null)
const submitted = useRef<AskInput | null>(null) // Your shared Zod-inferred input type.

async function ask(input: AskInput) {
  if (active.current) return
  const controller = new AbortController()
  active.current = controller
  submitted.current = structuredClone(input)
  beginAttempt(input)
  try {
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal,
    })
    await readAnswer(response, (event, payload) => {
      if (active.current === controller) applyEvent(event, payload)
    })
  } catch (error) {
    if (active.current === controller) {
      finishAttempt(controller.signal.aborted ? 'stopped' : 'error',
        controller.signal.aborted ? 'Stopped. This answer is incomplete.'
          : error instanceof Error ? error.message : 'Could not finish. Try again.')
    }
  } finally {
    if (active.current === controller) active.current = null
  }
}

function stop() { active.current?.abort() }
function retry() { if (submitted.current) void ask(submitted.current) }
useEffect(() => () => {
  active.current?.abort()
  active.current = null
}, [])
```

Import `useRef` and `useEffect` from React. Disable Retry until the active attempt settles, and use React state for the visible busy status. Key the panel by selected item (`key={selectedId}`) so changing context unmounts and cancels the old stream. Do not use a ref alone to drive rendered status.

## Citations: names on screen, IDs inside the protocol

Ask the model for structured claim/reference pairs; validate their shape with Zod. The server resolves references against the **current tenant's authorized DB records**. Never accept model-supplied labels or URLs as authoritative. Return only server-generated destinations and human-readable labels.

```ts
// authorizedEvidence was loaded from the DB for this user and context.
const citations = parsedClaims.map(({ claim, evidenceId }) => {
  const evidence = authorizedEvidence.get(evidenceId)
  return evidence
    ? { claim, status: 'linked' as const, label: evidence.name,
        href: `/items/${encodeURIComponent(evidence.id)}` }
    : { claim, status: 'unavailable' as const, label: 'Evidence unavailable' }
})
```

Render a named link beside its claim, or the non-clickable “Evidence unavailable” label. A found reference means **the record exists and is accessible**, not that the claim is correct. Label deterministic checks precisely; keep human review separate. Mark uncited claims as unsupported. Do not interpret every bracketed phrase as a citation. If using inline markers during streaming, buffer incomplete markers and replace them with named chips; never flash raw IDs. Until resolution finishes, show “Evidence pending”.

If records are renamed, merged or removed after an answer, resolve again when opened and show stale/unavailable evidence honestly. Mock mode uses the same contract and must be visibly disclosed. Verify the live provider from `meta`, not merely the presence of a key.

## Slice acceptance checks

- [ ] A slow answer displays incremental text; Stop before the first token and mid-answer cancels the upstream call (verify server-side).
- [ ] Retry preserves the prior partial answer and starts a separate attempt with the same submitted input; double clicks cannot start two streams.
- [ ] Disconnect, timeout and 429 keep text and offer a useful next action; EOF without `done` is a failure.
- [ ] Changing selection/unmounting cancels; old events cannot update the new panel.
- [ ] Known, missing and cross-tenant references yield named links or unavailable labels; no raw IDs reach visible text.
- [ ] Model HTML displays as text; keyboard and status announcements work; mock/live disclosure matches the adapter.

## Agent output to UI (generative UI, Within's core problem)

Rule: **the model chooses *what* to show from a fixed menu; the code decides *how* to draw it.** The model never writes components or coordinates.

### Three layers
1. **By rule (zero model time):** tool name + output schema → view. A ranked list → cards; a series → line chart; a process → flow diagram.
2. **Model selects:** one `view` enum field in the same structured output as the answer. A few tokens, no second call.
3. **Model generates (rare):** a declarative spec (Mermaid / Vega-Lite), validated and rendered in a sandbox, with fallback. A generated view that gets good feedback is promoted to the catalog after human review.

### Contract (shared Zod)
```ts
// shared/ui-spec.ts
import { z } from 'zod'

const Citation = z.object({ claimId: z.string(), sourceId: z.string() }) // resolved server-side to a label + href

const FlowNode = z.object({
  id: z.string(), label: z.string(),
  kind: z.enum(['step', 'decision', 'handoff', 'system']),
  sourceIds: z.array(z.string()).default([]),       // every node traceable
  stats: z.object({ count: z.number(), medianMs: z.number() }).partial().optional(),
})
const FlowEdge = z.object({
  id: z.string(), from: z.string(), to: z.string(),
  label: z.string().optional(),                      // "if amount > $10k"
  share: z.number().min(0).max(1).optional(),        // 0.73 → 73% of cases
})

export const UiSpec = z.discriminatedUnion('view', [
  z.object({ view: z.literal('text'), text: z.string() }),
  z.object({ view: z.literal('table'), columns: z.array(z.string()), rows: z.array(z.record(z.unknown())) }),
  z.object({ view: z.literal('cards'), items: z.array(z.object({ id: z.string(), title: z.string(), summary: z.string() })) }),
  z.object({ view: z.literal('flow'), nodes: z.array(FlowNode), edges: z.array(FlowEdge) }), // IDs only, never x/y
])
export type UiSpec = z.infer<typeof UiSpec>
export const AnswerPart = z.object({ answer: z.string(), spec: UiSpec, citations: z.array(Citation) })
```

### Registry + fallback (client)
```tsx
const registry: { [K in UiSpec['view']]: React.ComponentType<{ spec: Extract<UiSpec, { view: K }> }> } = {
  text: TextView, table: TableView, cards: CardsView, flow: FlowView,
}

export function SpecView({ raw }: { raw: unknown }) {
  const parsed = UiSpec.safeParse(raw)
  if (!parsed.success) return <FallbackView raw={raw} />   // table + text, logged, never a crash
  const View = registry[parsed.data.view] as React.ComponentType<{ spec: UiSpec }>
  return <View spec={parsed.data} />
}
```

### Stream the view first
Add an SSE event `view` (`{ "view": "flow" }`) sent as soon as the tool is chosen. The client mounts that component's **shaped skeleton** immediately; `spec` data fills in on `done`. The user sees structure in ~200 ms. No layout jump.

### Flow view (deterministic diagram)
- Transform data → `{nodes, edges}` in a **pure, tested** function in `shared/`.
- Lay out with `@dagrejs/dagre` (fast, simple) or `elkjs` (better for big graphs) — in a Web Worker if > ~300 nodes.
- Render with `@xyflow/react` (React Flow): custom node components, `fitView`, `MiniMap`, `Controls`.
- Click a node → side panel: what it is, stats in plain words, **citations** (source events / records). Hover → small preview.
- Edge labels carry the **if conditions** and share ("73% of cases").
- Big graph: start from one entity (1-hop), group into collapsed clusters, search to focus, hide edges below a share threshold. Past a few thousand visible nodes → WebGL (Sigma / deck.gl). Show less before drawing faster.

### Acceptance checks
- [ ] Invalid spec renders the fallback, never a blank screen; the error is logged.
- [ ] The view skeleton appears before data; nothing jumps when data lands.
- [ ] Every node and claim opens its source; missing sources say "Source unavailable".
- [ ] Same input → same picture (deterministic layout).
