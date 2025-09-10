import { NextResponse } from "next/server";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "@/components/utils/swagger";
import express from "express";

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Next.js App Router ke liye ek wrapper banana padta hai
export async function GET() {
  return NextResponse.json(swaggerSpec);
}
