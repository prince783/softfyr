"use client";

import { useState } from "react";

import {
  Check,
  User,
  Phone,
  Share2,
  BriefcaseBusiness,
  Image as ImageIcon,
  Settings,
  Link2,
  ChevronRight,
  Copy,
  Rocket,
} from "lucide-react";

import { useDigitalCard } from "../DigitalCardEditor";

type PublishProps = {
  onEditSection?: (step: number) => void;
  onPublish?: () => void;
};

export default function Publish({
  onEditSection = () => {},
  onPublish = () => {},
}: PublishProps) {
  const { card } = useDigitalCard();

  const publishCard = card as typeof card & {
    username?: string;
    name?: string;
    phone?: string;
    services?: unknown[];
    template?: string;
  };

  const [publishType, setPublishType] =
    useState<"now" | "schedule" | "draft">("now");

  const [copied, setCopied] = useState(false);

  const cardLink =
    card.cardLink ||
    `http://localhost:3000/digitalvisitingcard/${
      publishCard.username || "your-card"
    }`;

  /*
   * =========================================================
   * COPY CARD LINK
   * =========================================================
   */

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cardLink);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Unable to copy link", error);
    }
  };

  /*
   * =========================================================
   * REVIEW SECTIONS
   * =========================================================
   *
   * IMPORTANT:
   *
   * 1 = Basic Details
   * 2 = Contact
   * 3 = Social
   * 4 = Business
   * 5 = Gallery
   * 6 = Action Settings
   */

  const sections = [
    {
      icon: <User size={13} />,
      title: "Personal Information",

      value: `${publishCard.name || card.fullName || "Your Name"}${
        card.designation ? `, ${card.designation}` : ""
      }`,

      editStep: 1,
    },

    {
      icon: <Phone size={13} />,
      title: "Contact Details",

      value:
        [
          publishCard.phone || card.mobile ? "Phone" : null,

          card.email ? "Email" : null,

          card.website ? "Website" : null,

          card.address ? "Address" : null,
        ]
          .filter(Boolean)
          .join(", ") || "No contact details added",

      editStep: 2,
    },

    {
      icon: <Share2 size={13} />,
      title: "Social Media",

      value: getSocialCount(card),

      editStep: 3,
    },

    {
      icon: <BriefcaseBusiness size={13} />,
      title: "Business Details",

      value:
        publishCard.services &&
        publishCard.services.length > 0
          ? `${publishCard.services.length} service${
              publishCard.services.length === 1 ? "" : "s"
            } added`
          : "No services added",

      editStep: 4,
    },

    {
      icon: <ImageIcon size={13} />,
      title: "Portfolio / Gallery",

      value: "Gallery content and media",

      editStep: 5,
    },

    {
      icon: <Settings size={13} />,
      title: "Actions & Settings",

      value: "Actions, custom button and settings",

      editStep: 6,
    },

    {
      icon: <Link2 size={13} />,
      title: "Design & Template",

      value:
        publishCard.template ||
        card.templateId ||
        "Default Template",

      /*
       * Design/template controls are currently
       * located in the main editor, so send
       * the user to Step 1 where the editor begins.
       */
      editStep: 1,
    },
  ];

  return (
    <div className="w-full max-w-[760px]">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-[20px]">
        <h1 className="text-[15px] font-semibold leading-[20px] text-[#222]">
          Step 7 - Review & Publish
        </h1>

        <p className="mt-[4px] text-[9px] leading-[14px] text-[#858585]">
          Review your card details and publish
          your digital visiting card.
        </p>
      </div>

      {/* =================================================
          READY STATUS
      ================================================= */}

      <div className="rounded-[6px] border border-[#e5e5e5] bg-white px-[11px] py-[10px]">
        <div className="flex items-start gap-[9px]">
          <div className="flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full bg-[#dff7e9] text-[#32b86c]">
            <Check size={13} strokeWidth={3} />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-semibold leading-[12px] text-[#333]">
              Your card is ready to go live!
            </p>

            <p className="mt-[2px] text-[7px] leading-[10px] text-[#858585]">
              Please review the details below
              before publishing.
            </p>
          </div>
        </div>

        {/* =================================================
            REVIEW ITEMS
        ================================================= */}

        <div className="mt-[9px] overflow-hidden rounded-[5px] border border-[#eeeeee]">
          {sections.map((section, index) => (
            <ReviewItem
              key={section.title}
              icon={section.icon}
              title={section.title}
              value={section.value}
              last={index === sections.length - 1}
              onEdit={() =>
                onEditSection(section.editStep)
              }
            />
          ))}
        </div>
      </div>

      {/* =================================================
          PUBLISHING SETTINGS
      ================================================= */}

      <div className="mt-[10px] rounded-[6px] border border-[#e5e5e5] bg-white px-[10px] py-[10px]">
        <div className="mb-[10px]">
          <h2 className="text-[9px] font-semibold text-[#333]">
            Publishing Settings
          </h2>

          <p className="mt-[2px] text-[7px] leading-[10px] text-[#858585]">
            Choose how you want to publish your
            card.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-[18px]">
          {/* LEFT */}

          <div className="space-y-[9px]">
            {/* PUBLISH NOW */}

            <PublishOption
              selected={publishType === "now"}
              onClick={() => setPublishType("now")}
              title={
                <span className="flex items-center gap-[5px]">
                  Publish Now

                  <span className="rounded-[3px] bg-[#e4f8eb] px-[4px] py-[1px] text-[6px] font-semibold text-[#32a866]">
                    Recommended
                  </span>
                </span>
              }
              description="Make your card live immediately."
            />

            {/* SCHEDULE */}

            <PublishOption
              selected={publishType === "schedule"}
              onClick={() =>
                setPublishType("schedule")
              }
              title="Schedule for Later"
              description="Choose date and time to publish."
            />

            {/* DRAFT */}

            <PublishOption
              selected={publishType === "draft"}
              onClick={() => setPublishType("draft")}
              title="Keep as Draft"
              description="Continue editing later."
            />
          </div>

          {/* RIGHT */}

          <div>
            <p className="text-[8px] font-semibold text-[#444]">
              Card Link (Your Unique Link)
            </p>

            <div className="mt-[5px] flex h-[27px] items-center overflow-hidden rounded-[4px] border border-[#dedede] bg-white">
              <div className="min-w-0 flex-1 px-[7px]">
                <p className="truncate text-[7px] text-[#666]">
                  {cardLink}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="
                  flex
                  h-full
                  shrink-0
                  items-center
                  gap-[3px]
                  border-l
                  border-[#eeeeee]
                  px-[7px]
                  text-[7px]
                  font-medium
                  text-[#6335e9]
                  transition
                  hover:bg-[#faf8ff]
                "
              >
                {copied ? (
                  <>
                    <Check size={9} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={9} />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="mt-[9px]">
              <p className="text-[8px] font-semibold text-[#444]">
                Card Status
              </p>

              <span className="mt-[4px] inline-flex rounded-[3px] bg-[#e4f8eb] px-[6px] py-[2px] text-[6px] font-semibold text-[#32a866]">
                Ready to Publish
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          PUBLISH BUTTON
      ================================================= */}

      <div className="mt-[14px] flex justify-end">
        {/* <button
          type="button"
          onClick={onPublish}
          disabled={
            publishType === "draft"
          }
          className="
            flex
            h-[32px]
            items-center
            gap-[6px]
            rounded-[5px]
            bg-[#6335e9]
            px-[15px]
            text-[8px]
            font-semibold
            text-white
            shadow-[0_3px_8px_rgba(99,53,233,0.18)]
            transition
            hover:bg-[#5428d5]
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Rocket size={11} />

          Publish & Live
        </button> */}
      </div>
    </div>
  );
}

/* =========================================================
   REVIEW ITEM
========================================================= */

function ReviewItem({
  icon,
  title,
  value,
  last,
  onEdit,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  last: boolean;
  onEdit: () => void;
}) {
  return (
    <div
      className={`
        flex
        min-h-[42px]
        items-center
        gap-[8px]
        px-[8px]
        ${
          !last
            ? "border-b border-[#eeeeee]"
            : ""
        }
      `}
    >
      {/* ICON */}

      <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[4px] bg-[#f1edff] text-[#6335e9]">
        {icon}
      </div>

      {/* TEXT */}

      <div className="min-w-0 flex-1">
        <p className="text-[7px] font-medium leading-[10px] text-[#555]">
          {title}
        </p>

        <p className="mt-[1px] truncate text-[7px] leading-[10px] text-[#888]">
          {value}
        </p>
      </div>

      {/* EDIT */}

      <button
        type="button"
        onClick={onEdit}
        className="
          flex
          shrink-0
          cursor-pointer
          items-center
          gap-[3px]
          text-[7px]
          font-medium
          text-[#6335e9]
          transition
          hover:text-[#4e25c7]
        "
      >
        Edit

        <ChevronRight size={9} />
      </button>
    </div>
  );
}

/* =========================================================
   PUBLISH OPTION
========================================================= */

function PublishOption({
  selected,
  onClick,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-[6px] text-left"
    >
      {/* RADIO */}

      <span
        className={`
          mt-[1px]
          flex
          h-[10px]
          w-[10px]
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          ${
            selected
              ? "border-[#6335e9]"
              : "border-[#c9c9c9]"
          }
        `}
      >
        {selected && (
          <span className="h-[5px] w-[5px] rounded-full bg-[#6335e9]" />
        )}
      </span>

      <span>
        <span className="block text-[8px] font-medium leading-[10px] text-[#444]">
          {title}
        </span>

        <span className="mt-[2px] block text-[6px] leading-[9px] text-[#999]">
          {description}
        </span>
      </span>
    </button>
  );
}

/* =========================================================
   SOCIAL COUNT
========================================================= */

function getSocialCount(card: any) {
  const socialLinks = card.socialLinks ?? {};

  const count = [
    socialLinks.facebook,
    socialLinks.instagram,
    socialLinks.linkedin,
    socialLinks.youtube,
    socialLinks.twitter,
    socialLinks.telegram,
    socialLinks.other,
  ].filter(
    (value) =>
      typeof value === "string" &&
      value.trim().length > 0
  ).length;

  return `${count} social profile${
    count === 1 ? "" : "s"
  } added`;
}