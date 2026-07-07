import { NextResponse } from "next/server";
import { ZodError } from "zod";

/** Consistent JSON responses for API routes. */

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json(
    { success: false, error: message, details },
    { status: 400 },
  );
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

export function serverError(message = "Something went wrong") {
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}

/** Turns thrown errors (esp. ZodError) into a clean 400/500 response. */
export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return badRequest("Validation failed", error.flatten().fieldErrors);
  }
  console.error("[API_ERROR]", error);
  return serverError();
}
