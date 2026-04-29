import { prisma } from "./prisma";

export async function logAction(
  userId: string | null,
  action: string,
  details?: Record<string, unknown> | string | null,
  req?: Request,
): Promise<void> {
  try {
    await prisma.log.create({
      data: {
        userId: userId ?? undefined,
        action,
        details:
          typeof details === "string"
            ? details
            : details
            ? JSON.stringify(details)
            : null,
        ip: req
          ? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
            req.headers.get("x-real-ip") ??
            null
          : null,
        userAgent: req?.headers.get("user-agent") ?? null,
      },
    });
  } catch (err) {
    // Logging must never crash the caller.
    console.error("[logger] failed to record log:", err);
  }
}
