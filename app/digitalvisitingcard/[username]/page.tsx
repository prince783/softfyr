import { notFound } from "next/navigation";

import connectDB from "@/app/lib/db";
import DigitalCard from "@/app/models/DigitalCard";

import PublicCardClient from "./PublicCardClient";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function DigitalVisitingCardPage({
  params,
}: PageProps) {
  const { username } = await params;

  await connectDB();

  const card = await DigitalCard.findOne({
    username: username.toLowerCase(),
    paymentStatus: "paid",
    isPublished: true,
  }).lean();

  if (!card) {
    notFound();
  }

  const plainCard = JSON.parse(
    JSON.stringify(card)
  );

  return (
    <PublicCardClient
      card={plainCard}
    />
  );
}