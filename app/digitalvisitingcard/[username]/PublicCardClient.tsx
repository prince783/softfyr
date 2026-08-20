"use client";

import {
  DigitalCardProvider,
} from "@/app/dashboard/projects/create-project/digicards/components/DigitalCardEditor";

import {
  PublicCardPreview,
} from "@/app/dashboard/projects/create-project/digicards/components/LivePreview";

import type {
  DigitalCardData,
} from "@/app/dashboard/projects/create-project/digicards/components/DigitalCardEditor";

interface Props {
  card: DigitalCardData;
}

export default function PublicCardClient({
  card,
}: Props) {
  return (
    <DigitalCardProvider
      initialCard={card}
    >
      <PublicCardPreview
        template={card.templateId}
      />
    </DigitalCardProvider>
  );
}