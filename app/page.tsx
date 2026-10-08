import CardReview from "@/components/CardReview";

export default async function CardPage({
  params,
}: {
  params: Promise<{ cardID: string }>;
}) {
  const { cardID } = await params;

  return <CardReview cardID={cardID} />;
}
