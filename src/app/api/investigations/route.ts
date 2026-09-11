import { NextResponse } from "next/server";

import { startInvestigation } from "@/lib/investigations/start-investigation";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.alertId) {
      return NextResponse.json(
        { error: "Alert ID is required" },
        { status: 400 },
      );
    }

    const investigation = await startInvestigation({
      alertId: body.alertId,
    });

    return NextResponse.json(investigation, { status: 201 });
  } catch (error) {
    console.error("Failed to start investigation:", error);

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (error.message === "Alert not found") {
        return NextResponse.json({ error: "Alert not found" }, { status: 404 });
      }

      if (error.message === "Investigation already exists for this alert") {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
    }

    return NextResponse.json(
      { error: "Failed to start investigation" },
      { status: 500 },
    );
  }
}
