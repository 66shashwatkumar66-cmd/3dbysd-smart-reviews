"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Card = {
  card_id: string;
  business_name: string | null;
  google_review_url: string | null;
  status: string;
};

const experiences = [
  { emoji: "☕", label: "Food & Drinks" },
  { emoji: "😊", label: "Friendly Staff" },
  { emoji: "✨", label: "Ambience" },
  { emoji: "⚡", label: "Fast Service" },
  { emoji: "💰", label: "Value for Money" },
  { emoji: "❤️", label: "Overall Experience" },
];

export default function CardReview({
  cardID,
}: {
  cardID: string;
}) {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rating, setRating] = useState(0);
  const [step, setStep] = useState(1);

  const [selectedExperiences, setSelectedExperiences] = useState<string[]>(
    []
  );

  const [review, setReview] = useState("");
  const [copied, setCopied] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");

  useEffect(() => {
    async function loadCard() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("card_id", cardID)
        .single();

      if (error) {
        console.error(error);
        setError(error.message);
        setLoading(false);
        return;
      }

      setCard(data);
      setLoading(false);
    }

    loadCard();
  }, [cardID]);

  function toggleExperience(label: string) {
    setSelectedExperiences((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  }

  // =========================
  // AI REVIEW GENERATION
  // =========================

  async function generateReview() {
    if (!card || selectedExperiences.length === 0 || rating === 0) {
      return;
    }

    setGenerating(true);
    setGenerateError("");

    try {
      const response = await fetch("/api/generate-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName: card.business_name || "this place",
          rating,
          experiences: selectedExperiences,
          tone: "casual",
          length: "medium",
          language: "English",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to generate review."
        );
      }

      if (!data.review) {
        throw new Error("The AI returned an empty review.");
      }

      setReview(data.review);
      setStep(3);
    } catch (error) {
      console.error("Review generation failed:", error);

      setGenerateError(
        "We couldn't create your review right now. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  }

  // =========================
  // COPY REVIEW
  // =========================

  async function copyReview() {
    try {
      await navigator.clipboard.writeText(review);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  // =========================
  // GOOGLE REVIEW
  // =========================

  function continueToGoogle() {
    if (!card?.google_review_url) {
      alert(
        "Google review link hasn't been configured for this card yet."
      );
      return;
    }

    window.open(card.google_review_url, "_blank");
  }

  const selectedNames = useMemo(
    () => selectedExperiences.join(", "),
    [selectedExperiences]
  );

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-[#fffdf7]">
        <div className="text-center">
          <div className="text-5xl animate-bounce">
            ✨
          </div>

          <p className="mt-4 font-bold text-gray-600">
            Loading your experience...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error || !card) {
    return (
      <main className="min-h-screen grid place-items-center bg-[#fffdf7] p-6">
        <div className="max-w-md rounded-[28px] border-2 border-black bg-white p-8 text-center shadow-[8px_8px_0_#4285f4]">
          <div className="text-5xl">
            😕
          </div>

          <h1 className="mt-4 text-2xl font-black">
            Card not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error || `Card ${cardID} does not exist.`}
          </p>
        </div>
      </main>
    );
  }

  const businessName =
    card.business_name || "Your Business";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffdf7] px-5 py-8 text-[#202124]">

      {/* =========================
          BACKGROUND DECORATIONS
      ========================= */}

      <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-[#fbbc04]/40" />

      <div className="pointer-events-none absolute -right-24 top-40 h-64 w-64 rounded-full bg-[#4285f4]/20" />

      <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#34a853]/20" />

      <div className="relative mx-auto max-w-md">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-5 flex items-center justify-between">

          <div className="rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-black tracking-wide shadow-[3px_3px_0_#202124]">
            ✨ SMART REVIEW
          </div>

          <div className="rotate-6 text-3xl">
            {step === 1 && "👋"}
            {step === 2 && "💭"}
            {step === 3 && "✨"}
          </div>

        </div>

        {/* =========================
            MAIN CARD
        ========================= */}

        <section className="rounded-[32px] border-[3px] border-black bg-white p-6 shadow-[9px_9px_0_#4285f4]">

          {/* =========================
              BUSINESS
          ========================= */}

          <div className="flex items-center gap-4">

            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border-2 border-black bg-[#fbbc04] text-3xl shadow-[3px_3px_0_#202124]">
              ☕
            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                You visited
              </p>

              <h1 className="text-2xl font-black leading-tight">
                {businessName}
              </h1>

            </div>

          </div>

          {/* =====================================================
              STEP 1 — RATING
          ===================================================== */}

          {step === 1 && (
            <>
              <div className="mt-8">

                <div className="mb-2 inline-block -rotate-2 rounded-lg bg-[#ea4335] px-3 py-1 text-xs font-black text-white">
                  30 SEC REVIEW
                </div>

                <h2 className="text-[42px] font-black leading-[0.95] tracking-tight">
                  How was
                  <br />
                  your visit?
                </h2>

                <p className="mt-4 text-base leading-relaxed text-gray-500">
                  Tell us how you felt. Pick a rating and we'll help
                  you turn your experience into a genuine review.
                </p>

              </div>

              {/* Rating */}

              <div className="mt-8">

                <p className="mb-3 text-sm font-black">
                  Your rating
                </p>

                <div className="flex justify-between rounded-2xl border-2 border-black bg-[#f8f9fa] px-3 py-4">

                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-4xl transition-transform duration-150 hover:scale-110 ${
                        star <= rating
                          ? "opacity-100"
                          : "opacity-25 grayscale"
                      }`}
                      aria-label={`${star} star${
                        star > 1 ? "s" : ""
                      }`}
                    >
                      ⭐
                    </button>
                  ))}

                </div>

                <div className="mt-3 text-center text-sm font-bold">

                  {rating === 0 &&
                    "Tap a star to rate your experience"}

                  {rating === 1 &&
                    "We'll try to do better 💙"}

                  {rating === 2 &&
                    "Thanks for being honest."}

                  {rating === 3 &&
                    "Pretty decent 👍"}

                  {rating === 4 &&
                    "Sounds like a great visit! ✨"}

                  {rating === 5 &&
                    "That's what we like to hear! 🎉"}

                </div>

              </div>

              {/* Continue */}

              <button
                type="button"
                disabled={rating === 0}
                className={`mt-7 w-full rounded-2xl border-[3px] border-black px-5 py-4 text-base font-black transition ${
                  rating === 0
                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                    : "bg-[#4285f4] text-white shadow-[4px_4px_0_#202124]"
                }`}
                onClick={() => {
                  if (rating > 0) {
                    setStep(2);
                  }
                }}
              >
                Continue →
              </button>
            </>
          )}

          {/* =====================================================
              STEP 2 — EXPERIENCE
          ===================================================== */}

          {step === 2 && (
            <>
              <div className="mt-8">

                <div className="mb-2 inline-block rotate-2 rounded-lg bg-[#fbbc04] px-3 py-1 text-xs font-black">
                  QUICK QUESTION
                </div>

                <h2 className="text-[40px] font-black leading-[0.95] tracking-tight">
                  What did
                  <br />
                  you like?
                </h2>

                <p className="mt-4 text-base leading-relaxed text-gray-500">
                  Pick everything that made your experience better.
                </p>

              </div>

              {/* Experience options */}

              <div className="mt-7 grid grid-cols-2 gap-3">

                {experiences.map((experience) => {

                  const selected =
                    selectedExperiences.includes(
                      experience.label
                    );

                  return (
                    <button
                      key={experience.label}
                      type="button"
                      onClick={() =>
                        toggleExperience(
                          experience.label
                        )
                      }
                      className={`rounded-2xl border-[2px] border-black p-4 text-left transition ${
                        selected
                          ? "bg-[#34a853] text-white shadow-[3px_3px_0_#202124]"
                          : "bg-[#f8f9fa] hover:bg-white"
                      }`}
                    >

                      <div className="text-2xl">
                        {experience.emoji}
                      </div>

                      <div className="mt-2 text-sm font-black leading-tight">
                        {experience.label}
                      </div>

                      {selected && (
                        <div className="mt-1 text-xs font-bold">
                          ✓ Selected
                        </div>
                      )}

                    </button>
                  );
                })}

              </div>

              {/* AI GENERATE BUTTON */}

              <button
                type="button"
                disabled={
                  selectedExperiences.length === 0 ||
                  generating
                }
                className={`mt-7 w-full rounded-2xl border-[3px] border-black px-5 py-4 text-base font-black transition ${
                  selectedExperiences.length === 0 ||
                  generating
                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                    : "bg-[#4285f4] text-white shadow-[4px_4px_0_#202124]"
                }`}
                onClick={generateReview}
              >
                {generating
                  ? "✨ Creating your review..."
                  : "✨ Create my review"}
              </button>

              {/* AI ERROR */}

              {generateError && (
                <div className="mt-4 rounded-xl border-2 border-[#ea4335] bg-[#fff0f0] p-3 text-center text-sm font-bold text-[#ea4335]">
                  {generateError}
                </div>
              )}

              {/* Back */}

              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-3 w-full py-2 text-sm font-bold text-gray-500"
              >
                ← Change rating
              </button>

            </>
          )}

          {/* =====================================================
              STEP 3 — AI REVIEW
          ===================================================== */}

          {step === 3 && (
            <>
              <div className="mt-8">

                <div className="mb-2 inline-block -rotate-2 rounded-lg bg-[#34a853] px-3 py-1 text-xs font-black text-white">
                  YOUR REVIEW ✨
                </div>

                <h2 className="text-[39px] font-black leading-[0.95] tracking-tight">
                  Almost
                  <br />
                  ready!
                </h2>

                <p className="mt-4 text-base leading-relaxed text-gray-500">
                  We turned your answers into a review. Edit it so
                  it sounds exactly like you.
                </p>

              </div>

              {/* Summary */}

              <div className="mt-6 rounded-2xl border-2 border-black bg-[#f8f9fa] p-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-bold">
                    Your rating
                  </span>

                  <span className="text-lg">
                    {"⭐".repeat(rating)}
                  </span>

                </div>

                <div className="mt-3">

                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    You liked
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {selectedNames}
                  </p>

                </div>

              </div>

              {/* Review editor */}

              <div className="mt-5">

                <label
                  htmlFor="review"
                  className="mb-2 block text-sm font-black"
                >
                  Your review
                </label>

                <textarea
                  id="review"
                  value={review}
                  onChange={(event) =>
                    setReview(event.target.value)
                  }
                  rows={8}
                  className="w-full resize-none rounded-2xl border-[2px] border-black bg-white p-4 text-[15px] leading-relaxed outline-none focus:ring-4 focus:ring-[#4285f4]/30"
                />

                <p className="mt-2 text-right text-xs font-bold text-gray-400">
                  {review.length} characters
                </p>

              </div>

              {/* Copy */}

              <button
                type="button"
                onClick={copyReview}
                className="mt-2 w-full rounded-2xl border-[3px] border-black bg-[#fbbc04] px-5 py-4 text-base font-black shadow-[4px_4px_0_#202124]"
              >
                {copied
                  ? "✓ Review copied!"
                  : "📋 Copy review"}
              </button>

              {/* Google */}

              <button
                type="button"
                onClick={continueToGoogle}
                className="mt-4 w-full rounded-2xl border-[3px] border-black bg-[#4285f4] px-5 py-4 text-base font-black text-white shadow-[4px_4px_0_#202124]"
              >
                Continue to Google →
              </button>

              {/* Back */}

              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-3 w-full py-2 text-sm font-bold text-gray-500"
              >
                ← Change what I liked
              </button>

            </>
          )}

          {/* Footer */}

          <div className="mt-6 flex items-center justify-between text-[11px] font-bold text-gray-400">
            <span>
              Card #{card.card_id}
            </span>

            <span>
              Powered by 3DBYSD
            </span>
          </div>

        </section>

        {/* Bottom sticker */}

        <div className="mt-7 flex justify-center">

          <div className="-rotate-3 rounded-2xl border-2 border-black bg-[#34a853] px-5 py-3 text-sm font-black text-white shadow-[4px_4px_0_#202124]">
            Your feedback matters 💚
          </div>

        </div>

      </div>

    </main>
  );
}