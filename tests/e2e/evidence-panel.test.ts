import { expect, test } from "@playwright/test";

test("finding evidence uses real vendors and restores keyboard focus", async ({
  page,
}) => {
  await page.goto("/");
  const finding = page.getByRole("button", {
    exact: true,
    name: "No recorded security review",
  });
  await finding.click();
  const panel = page.getByRole("complementary", {
    name: "No recorded security review",
  });
  await expect(
    panel.getByRole("columnheader", { name: "Observed · Vendor 07" })
  ).toBeVisible();
  await expect(
    panel.getByRole("row").filter({
      has: page.getByRole("rowheader", { name: /^4 Security review/ }),
    })
  ).toContainText("No recorded event");
  await expect(
    panel
      .getByRole("navigation", { name: "Affected vendors" })
      .getByRole("button")
  ).toHaveCount(8);
  await expect(
    panel.getByRole("button", { name: "Close evidence" })
  ).toBeFocused();
  await panel.evaluate(async (element) => {
    await Promise.all(
      element.getAnimations().map((animation) => animation.finished)
    );
  });
  await expect(
    panel.getByRole("region", { name: "Suggested next step" })
  ).toBeInViewport();
  await page.screenshot({
    fullPage: true,
    path: "docs/screens/2-evidence-panel.png",
  });

  await panel
    .getByRole("button", { name: "Vendor 19 No recorded review" })
    .click();
  await expect(
    panel.getByRole("columnheader", { name: "Observed · Vendor 19" })
  ).toBeVisible();
  const report = await (await page.request.get("/api/process")).json();
  const contract = report.cases["VND-019"].find(
    (event: { activity: string }) => event.activity === "Contract review"
  );
  await expect(
    panel.locator(`time[datetime="${contract.timestamp}"]`)
  ).toBeVisible();
  await page.reload();
  await expect(
    panel.getByRole("columnheader", { name: "Observed · Vendor 19" })
  ).toBeVisible();

  await panel.getByRole("button", { exact: true, name: "Dismiss" }).click();
  await expect(panel.getByRole("button", { name: "Undo" })).toBeFocused();
  await expect(
    panel.getByRole("region", { name: "Suggested next step" })
  ).toHaveCount(0);
  await panel.getByRole("button", { name: "Undo" }).click();
  await expect(
    panel.getByRole("button", { exact: true, name: "Copy" })
  ).toBeFocused();
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await panel.getByRole("button", { exact: true, name: "Copy" }).click();
  await expect(page.getByTestId("toast")).toContainText(
    "Suggested next step copied"
  );
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("Vendor 19");
  expect(copied).toContain("SOP step 4");
  expect(copied).toContain("Advice only · nothing is sent");
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(finding).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(panel).toBeVisible();
  await expect(
    panel.getByRole("columnheader", { name: "Observed · Vendor 07" })
  ).toBeVisible();
});

test("preserves duplicate and non-SOP events", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", {
      exact: true,
      name: "Contract review before security approval",
    })
    .click();
  let panel = page.getByRole("complementary");
  await expect(
    panel.getByRole("columnheader", { name: "Observed · Vendor 06" })
  ).toBeVisible();
  const contractRow = panel.getByRole("row").filter({
    has: page.getByRole("rowheader", { name: /^5 Contract review/ }),
  });
  await expect(contractRow).toContainText("Recorded twice");
  await expect(contractRow.locator("time")).toHaveCount(2);
  await panel.getByRole("button", { name: "Close evidence" }).click();
  await page
    .getByRole("button", {
      exact: true,
      name: "“Request more info” is not in the SOP",
    })
    .click();
  panel = page.getByRole("complementary");
  await expect(
    panel.getByRole("rowheader", { name: /Not in SOP/ })
  ).toBeVisible();
  await expect(
    panel
      .getByRole("row")
      .filter({ has: page.getByRole("rowheader", { name: /Not in SOP/ }) })
  ).toContainText("Request more info");
  await expect(
    panel
      .getByRole("navigation", { name: "Affected vendors" })
      .getByRole("button")
  ).toHaveCount(12);
});

test("small screens support selection, reduced motion and close", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const finding = page.getByRole("button", {
    exact: true,
    name: "No recorded security review",
  });
  await finding.click();
  const panel = page.getByRole("complementary");
  await expect(panel).toBeVisible();
  expect(
    await panel.evaluate((element) => getComputedStyle(element).animationName)
  ).toBe("none");
  await panel
    .getByRole("button", { name: "Vendor 60 No recorded review" })
    .click();
  await expect(
    panel.getByRole("columnheader", { name: "Observed · Vendor 60" })
  ).toBeVisible();
  const width = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  expect(width.scroll).toBeLessThanOrEqual(width.viewport);
  await page.screenshot({
    fullPage: true,
    path: "docs/screens/2-evidence-panel-mobile.png",
  });
  await panel.getByRole("button", { name: "Close evidence" }).click();
  await expect(finding).toBeVisible();
  await expect(finding).toBeFocused();
});

test("loading, empty and retry states keep the home usable", async ({
  page,
}) => {
  let release: () => void = () => undefined;
  const loading = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/process", async (route) => {
    await loading;
    await route.continue();
  });
  await page.goto("/");
  await expect(page.locator('[aria-busy="true"]')).toBeVisible();
  release();
  await expect(
    page.getByRole("button", {
      exact: true,
      name: "No recorded security review",
    })
  ).toBeVisible();
  const report = await (await page.request.get("/api/process")).json();
  await page.unroute("**/api/process");
  await page.route("**/api/process", (route) =>
    route.fulfill({
      json: {
        ...report,
        findings: [],
        headline: "No differences found against SOP v3.",
      },
    })
  );
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "No differences found against SOP v3." })
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Ranked findings" })
  ).toContainText("Ask a question");
  await page.unroute("**/api/process");
  await page.route("**/api/process", (route) =>
    route.fulfill({ json: { message: "Records unavailable" }, status: 503 })
  );
  await page.reload();
  await expect(
    page.getByText("Could not load the onboarding records.")
  ).toBeVisible();
  await expect(page.getByTestId("multimodal-input")).toBeVisible();
  await page.unroute("**/api/process");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(
    page.getByRole("button", {
      exact: true,
      name: "No recorded security review",
    })
  ).toBeVisible();
});

test("slow vendor shows where the time went", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", {
      exact: true,
      name: "Over the 10-business-day target",
    })
    .click();
  const panel = page.getByRole("complementary", {
    name: "Over the 10-business-day target",
  });
  await panel.getByRole("button", { name: /^Vendor 11/ }).click();
  await expect(
    panel.getByText(/Waited 11 days before Contract review/)
  ).toBeVisible();
});

test("clicking the open finding again closes the panel", async ({ page }) => {
  await page.goto("/");
  const card = page.getByRole("button", {
    exact: true,
    name: "No recorded security review",
  });
  const panel = page.getByRole("complementary", {
    name: "No recorded security review",
  });
  await card.click();
  await expect(panel).toBeVisible();
  await card.click();
  await expect(panel).toBeHidden();
});

test("clicking outside the panel closes it", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { exact: true, name: "No recorded security review" })
    .click();
  const panel = page.getByRole("complementary", {
    name: "No recorded security review",
  });
  await expect(panel).toBeVisible();
  await panel.getByRole("columnheader", { name: /SOP v3/ }).click();
  await expect(panel).toBeVisible();
  await page.getByText(/vendors have a possible gap/).click();
  await expect(panel).toBeHidden();
});

test("a compact findings bar follows the chat when the cards scroll away", async ({
  page,
}) => {
  await page.goto("/");
  const input = page.getByPlaceholder("Ask anything...");
  await input.fill("What happened with Vendor 11?");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(3000);
  await input.fill("hi");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(3000);
  await input.fill("hello");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(3000);
  const bar = page.getByRole("navigation", { name: "Findings" });
  await expect(bar).toBeVisible();
  await bar.getByRole("button", { name: /Over the 10/ }).click();
  await expect(
    page.getByRole("complementary", { name: "Over the 10-business-day target" })
  ).toBeVisible();
});
