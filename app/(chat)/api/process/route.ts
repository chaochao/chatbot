import { auth } from "@/app/(auth)/auth";
import { ChatbotError } from "@/lib/errors";
import { getProcessReport } from "@/lib/process/findings";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }
  return Response.json(getProcessReport());
}
