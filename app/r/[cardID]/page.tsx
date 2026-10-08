import { Suspense } from "react";
import CardReview from "@/components/CardReview";

function Loading() {
  return (
    <main className="min-h-screen grid place-items-center bg-[#fffdf7]">
      <div className="text-center">
        <div className="text-5xl animate-bounce">✨</div>
        <p className="mt-4 font-bold text-gray-600">
          Loading your experience...
        </p>
      </div>
    </main>
  );
}

async function CardPageContent({
  params,
}: {
  params: Promise<{ cardID: string }>;
}) {
  const { cardID } = await params;

  return <CardReview cardID={cardID} />;
}

export default function CardPage({
  params,
}: {
  params: Promise<{ cardID: string }>;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <CardPageContent params={params} />
    </Suspense>
  );
}