"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Card = {
  id: number;
  card_id: string;
  business_name: string | null;
  google_review_url: string | null;
  status: string;
  created_at: string;
};

export default function CardsPage() {
  const supabase = createClient();

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const [businessName, setBusinessName] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadCards() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      setCards(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadCards();
  }, []);

  function selectCard(card: Card) {
    setSelectedCard(card);
    setBusinessName(card.business_name || "");
    setGoogleReviewUrl(card.google_review_url || "");
    setMessage("");
    setError("");
  }

  async function saveCard() {
    if (!selectedCard) return;

    if (!businessName.trim()) {
      setError("Business name is required.");
      return;
    }

    if (!googleReviewUrl.trim()) {
      setError("Google review URL is required.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    const { error } = await supabase
      .from("cards")
      .update({
        business_name: businessName.trim(),
        google_review_url: googleReviewUrl.trim(),
        status: "assigned",
        updated_at: new Date().toISOString(),
      })
      .eq("card_id", selectedCard.card_id);

    if (error) {
      console.error(error);
      setError(error.message);
      setSaving(false);
      return;
    }

    setMessage(`Card ${selectedCard.card_id} assigned successfully.`);

    setSelectedCard(null);
    setBusinessName("");
    setGoogleReviewUrl("");

    await loadCards();

    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-[#fffdf7] px-5 py-8 text-[#202124]">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-block rotate-[-2deg] rounded-lg bg-[#4285f4] px-3 py-1 text-xs font-black text-white">
            3DBYSD SMART REVIEWS
          </div>

          <h1 className="text-4xl font-black tracking-tight">
            Card Management
          </h1>

          <p className="mt-2 text-gray-500">
            Assign NFC / QR cards to businesses.
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-5 rounded-2xl border-2 border-black bg-[#e8f5e9] p-4 font-bold text-[#137333]">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl border-2 border-black bg-[#fff0f0] p-4 font-bold text-[#ea4335]">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">

          {/* Cards */}
          <section className="rounded-[28px] border-[3px] border-black bg-white p-5 shadow-[7px_7px_0_#4285f4]">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">
                  Your cards
                </h2>

                <p className="text-sm text-gray-500">
                  {cards.length} card{cards.length !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={loadCards}
                className="rounded-xl border-2 border-black bg-[#fbbc04] px-4 py-2 text-sm font-black shadow-[3px_3px_0_#202124]"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center font-bold text-gray-400">
                Loading cards...
              </div>
            ) : cards.length === 0 ? (
              <div className="rounded-2xl bg-gray-100 p-6 text-center font-bold">
                No cards found.
              </div>
            ) : (
              <div className="space-y-3">
                {cards.map((card) => {
                  const assigned =
                    card.status === "assigned" &&
                    !!card.business_name;

                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => selectCard(card)}
                      className={`w-full rounded-2xl border-2 border-black p-4 text-left transition hover:-translate-y-0.5 ${
                        selectedCard?.id === card.id
                          ? "bg-[#e8f0fe] shadow-[3px_3px_0_#4285f4]"
                          : "bg-[#f8f9fa]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">

                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-gray-400">
                            Card
                          </p>

                          <p className="text-xl font-black">
                            #{card.card_id}
                          </p>
                        </div>

                        <div className="text-right">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              assigned
                                ? "bg-[#d7f5df] text-[#137333]"
                                : "bg-[#fff3cd] text-[#8a6100]"
                            }`}
                          >
                            {assigned ? "ASSIGNED" : "AVAILABLE"}
                          </span>

                          <p className="mt-1 text-sm font-bold text-gray-600">
                            {card.business_name || "No business assigned"}
                          </p>
                        </div>

                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Assignment form */}
          <section className="rounded-[28px] border-[3px] border-black bg-white p-5 shadow-[7px_7px_0_#34a853]">

            <h2 className="text-xl font-black">
              {selectedCard
                ? `Assign Card #${selectedCard.card_id}`
                : "Select a card"}
            </h2>

            {!selectedCard ? (
              <div className="mt-8 rounded-2xl bg-[#f8f9fa] p-6 text-center">
                <div className="text-4xl">💳</div>

                <p className="mt-3 font-bold text-gray-500">
                  Select a card from the list to assign it to a business.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-5">

                <div>
                  <label className="mb-2 block text-sm font-black">
                    Business name
                  </label>

                  <input
                    value={businessName}
                    onChange={(event) =>
                      setBusinessName(event.target.value)
                    }
                    placeholder="e.g. Test Cafe"
                    className="w-full rounded-xl border-2 border-black bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-[#4285f4]/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black">
                    Google review URL
                  </label>

                  <input
                    value={googleReviewUrl}
                    onChange={(event) =>
                      setGoogleReviewUrl(event.target.value)
                    }
                    placeholder="https://g.page/r/..."
                    className="w-full rounded-xl border-2 border-black bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-[#4285f4]/20"
                  />

                  <p className="mt-2 text-xs font-medium text-gray-400">
                    Paste the business's direct Google review link.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={saving}
                  onClick={saveCard}
                  className={`w-full rounded-2xl border-[3px] border-black px-5 py-4 font-black shadow-[4px_4px_0_#202124] ${
                    saving
                      ? "cursor-not-allowed bg-gray-200 text-gray-400"
                      : "bg-[#34a853] text-white"
                  }`}
                >
                  {saving ? "Saving..." : "✓ Assign Card"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCard(null);
                    setBusinessName("");
                    setGoogleReviewUrl("");
                    setError("");
                    setMessage("");
                  }}
                  className="w-full py-2 text-sm font-bold text-gray-500"
                >
                  Cancel
                </button>

              </div>
            )}
          </section>
        </div>

        {/* Card URL preview */}
        {selectedCard && (
          <div className="mt-6 rounded-2xl border-2 border-black bg-white p-5">
            <p className="text-xs font-black uppercase tracking-wider text-gray-400">
              Card URL
            </p>

            <p className="mt-1 break-all font-mono text-sm">
              {typeof window !== "undefined"
                ? `${window.location.origin}/r/${selectedCard.card_id}`
                : `/r/${selectedCard.card_id}`}
            </p>
          </div>
        )}

      </div>
    </main>
  );
}