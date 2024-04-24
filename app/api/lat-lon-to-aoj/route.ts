// pages/api/findAOJ.ts
import AOJ from "@/lib/AOJ";
import { findAOJ } from "@/lib/find-aoj";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.lat || !body.lon) {
    return new Response("Invalid input", {
      status: 400,
    });
  }

  const result = await findAOJ(body.lat, body.lon);
  if (result) {
    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } else {
    return new Response("Area not found", {
      status: 400,
    });
  }
}


