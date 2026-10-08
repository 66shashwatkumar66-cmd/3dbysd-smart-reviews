import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      businessName,
      rating,
      experiences,
      tone = "casual",
      length = "medium",
      language = "English",
    } = body;

    if (
      !businessName ||
      !rating ||
      !Array.isArray(experiences) ||
      experiences.length === 0
    ) {
      return NextResponse.json(
        {
          error: "Missing review information.",
        },
        {
          status: 400,
        }
      );
    }

    const prompt = `
You are helping a customer write a genuine Google review.

Business name:
${businessName}

Customer rating:
${rating}/5

Things the customer explicitly liked:
${experiences.join(", ")}

Preferred tone:
${tone}

Preferred length:
${length}

Language:
${language}

Write ONE natural customer review based ONLY on the information provided above.

Strict rules:
- Only mention the experiences explicitly selected by the customer.
- The ${rating}/5 rating must be reflected naturally in the review.
- Do not invent food, drinks, prices, staff names, wait times, locations, events, or other details.
- Do not claim the customer will return unless that information was explicitly provided.
- Do not say the customer highly recommends the business unless explicitly provided.
- Do not add experiences that were not selected.
- Do not exaggerate.
- Do not mention AI.
- Do not use hashtags.
- Do not use quotation marks.
- Keep the review natural and concise.
- Return ONLY the review text.
`;

    const response = await openai.responses.create({
      model: "gpt-6-luna",
      input: prompt,
      max_output_tokens: 180,
    });

    const review = response.output_text.trim();

    return NextResponse.json({
      review,
    });
  } catch (error) {
    console.error("Review generation error:", error);

    return NextResponse.json(
      {
        error: "Unable to generate the review right now.",
      },
      {
        status: 500,
      }
    );
  }
}