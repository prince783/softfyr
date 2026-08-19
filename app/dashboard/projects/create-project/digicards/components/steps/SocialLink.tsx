"use client";

import {
  Send,
  Info,
  Check,
  X,
} from "lucide-react";

import { useDigitalCard } from "../DigitalCardEditor";

export default function SocialLink() {
  const { card, updateCard } = useDigitalCard();

  /*
   * Always use socialLinks from the card.
   * This prevents undefined errors for old MongoDB documents.
   */
  const socialLinks = card.socialLinks ?? {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    youtube: "",
    telegram: "",
    other: "",
  };

  /*
   * Social toggle states
   *
   * A social link is considered enabled when
   * a value exists.
   */
  const facebookEnabled =
    Boolean(socialLinks.facebook);

  const instagramEnabled =
    Boolean(socialLinks.instagram);

  const linkedinEnabled =
    Boolean(socialLinks.linkedin);

  const youtubeEnabled =
    Boolean(socialLinks.youtube);

  const twitterEnabled =
    Boolean(socialLinks.twitter);

  const telegramEnabled =
    Boolean(socialLinks.telegram);

  /*
   * Update one social link
   *
   * IMPORTANT:
   * We update the complete socialLinks object
   * so the other social links are NOT deleted.
   */
  const updateSocialLink = (
    field:
      | "facebook"
      | "instagram"
      | "linkedin"
      | "youtube"
      | "twitter"
      | "telegram"
      | "other",
    value: string
  ) => {
    updateCard("socialLinks", {
      ...socialLinks,
      [field]: value,
    });
  };

  /*
   * Toggle social media
   *
   * Since enabled/disabled states are not part of
   * DigitalCardData, we use the existence of the URL
   * as the enabled state.
   *
   * Turning OFF removes the saved URL.
   */
  const toggleSocial = (
    field:
      | "facebook"
      | "instagram"
      | "linkedin"
      | "youtube"
      | "twitter"
      | "telegram"
  ) => {
    const currentlyEnabled =
      Boolean(socialLinks[field]);

    updateCard("socialLinks", {
      ...socialLinks,
      [field]: currentlyEnabled
        ? ""
        : socialLinks[field],
    });
  };

  return (
    <div>
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="mb-[20px]">
        <h1 className="text-[15px] font-semibold leading-[20px] text-[#222]">
          Step 3 - Social Media
        </h1>

        <p className="mt-[4px] text-[9px] leading-[14px] text-[#858585]">
          Add your social media profiles which will be shown
          on your card.
        </p>
      </div>

      {/* =================================================
          SOCIAL MEDIA LIST
      ================================================== */}

      <div className="space-y-[15px]">

        {/* =================================================
            FACEBOOK
        ================================================== */}

        <SocialInput
          label="Facebook"
          value={socialLinks.facebook}
          placeholder="https://www.facebook.com/yourusername"
          icon={
            <span className="text-[15px] font-bold leading-none">
              f
            </span>
          }
          iconClassName="bg-[#3168b8]"
          enabled={facebookEnabled}
          onChange={(value) =>
            updateSocialLink(
              "facebook",
              value
            )
          }
          onToggle={() =>
            toggleSocial("facebook")
          }
        />

        {/* =================================================
            INSTAGRAM
        ================================================== */}

        <SocialInput
          label="Instagram"
          value={socialLinks.instagram}
          placeholder="https://www.instagram.com/yourusername"
          icon={
            <span className="text-[14px] font-bold leading-none">
              ◎
            </span>
          }
          iconClassName="bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"
          enabled={instagramEnabled}
          onChange={(value) =>
            updateSocialLink(
              "instagram",
              value
            )
          }
          onToggle={() =>
            toggleSocial("instagram")
          }
        />

        {/* =================================================
            LINKEDIN
        ================================================== */}

        <SocialInput
          label="LinkedIn"
          value={socialLinks.linkedin}
          placeholder="https://www.linkedin.com/in/yourusername"
          icon={
            <span className="text-[9px] font-bold leading-none">
              in
            </span>
          }
          iconClassName="bg-[#0879b9]"
          enabled={linkedinEnabled}
          onChange={(value) =>
            updateSocialLink(
              "linkedin",
              value
            )
          }
          onToggle={() =>
            toggleSocial("linkedin")
          }
        />

        {/* =================================================
            YOUTUBE
        ================================================== */}

        <SocialInput
          label="YouTube"
          value={socialLinks.youtube}
          placeholder="https://www.youtube.com/@yourusername"
          icon={
            <span className="text-[9px] font-bold leading-none">
              ▶
            </span>
          }
          iconClassName="bg-[#ff0000]"
          enabled={youtubeEnabled}
          onChange={(value) =>
            updateSocialLink(
              "youtube",
              value
            )
          }
          onToggle={() =>
            toggleSocial("youtube")
          }
        />

        {/* =================================================
            X / TWITTER
        ================================================== */}

        <SocialInput
          label="X (Twitter)"
          value={socialLinks.twitter}
          placeholder="https://x.com/yourusername"
          icon={
            <span className="text-[12px] font-bold leading-none">
              𝕏
            </span>
          }
          iconClassName="bg-black"
          enabled={twitterEnabled}
          onChange={(value) =>
            updateSocialLink(
              "twitter",
              value
            )
          }
          onToggle={() =>
            toggleSocial("twitter")
          }
        />

        {/* =================================================
            TELEGRAM
        ================================================== */}

        <SocialInput
          label="Telegram"
          value={socialLinks.telegram}
          placeholder="https://t.me/username"
          icon={
            <Send
              size={13}
              fill="white"
              strokeWidth={2}
            />
          }
          iconClassName="bg-[#229ed9]"
          enabled={telegramEnabled}
          onChange={(value) =>
            updateSocialLink(
              "telegram",
              value
            )
          }
          onToggle={() =>
            toggleSocial("telegram")
          }
        />
      </div>

      {/* =================================================
          INFORMATION BOX
      ================================================== */}

      <div className="mt-[18px] rounded-[5px] border border-dashed border-[#ded6ff] bg-[#faf8ff] px-[9px] py-[8px]">
        <div className="flex items-start gap-[7px]">

          <Info
            size={12}
            strokeWidth={2.5}
            className="mt-[1px] shrink-0 text-[#6335e9]"
          />

          <div>
            <p className="text-[8px] font-medium leading-[11px] text-[#666]">
              Add your active social media links.
            </p>

            <p className="mt-[2px] text-[7px] leading-[10px] text-[#999]">
              Only added links will be visible on your card.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SOCIAL INPUT COMPONENT
========================================================= */

function SocialInput({
  label,
  value,
  placeholder,
  icon,
  iconClassName,
  enabled,
  onChange,
  onToggle,
}: {
  label: string;
  value: string;
  placeholder: string;
  icon: React.ReactNode;
  iconClassName: string;
  enabled: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-end gap-[10px]">

      {/* ===============================================
          SOCIAL ICON
      =============================================== */}

      <div
        className={`
          mb-[1px]
          flex
          h-[23px]
          w-[23px]
          shrink-0
          items-center
          justify-center
          rounded-[5px]
          text-white
          ${iconClassName}
        `}
      >
        {icon}
      </div>

      {/* ===============================================
          LABEL + INPUT
      =============================================== */}

      <div className="min-w-0 flex-1">

        <label className="block text-[8px] font-medium leading-[10px] text-[#454545]">
          {label}
        </label>

        <input
          type="url"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className="
            mt-[5px]
            h-[27px]
            w-full
            rounded-[5px]
            border
            border-[#dedede]
            bg-white
            px-[8px]
            text-[8px]
            text-[#454545]
            outline-none
            transition
            placeholder:text-[#a1a1a1]
            focus:border-[#6335e9]
            focus:ring-[2px]
            focus:ring-[#6335e9]/10
          "
        />
      </div>

      {/* ===============================================
          TOGGLE
      =============================================== */}

      <button
        type="button"
        onClick={onToggle}
        aria-label={`Toggle ${label}`}
        aria-pressed={enabled}
        className={`
          relative
          mb-[3px]
          flex
          h-[15px]
          w-[29px]
          shrink-0
          items-center
          rounded-full
          transition-colors
          duration-200
          ${
            enabled
              ? "bg-[#6335e9]"
              : "bg-[#cfd2da]"
          }
        `}
      >
        {/* Toggle Circle */}

        <span
          className={`
            absolute
            top-[2px]
            flex
            h-[11px]
            w-[11px]
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-[0_1px_3px_rgba(0,0,0,0.18)]
            transition-transform
            duration-200
            ${
              enabled
                ? "translate-x-[16px]"
                : "translate-x-[2px]"
            }
          `}
        >
          {enabled ? (
            <Check
              size={7}
              strokeWidth={3}
              className="text-[#6335e9]"
            />
          ) : (
            <X
              size={7}
              strokeWidth={3}
              className="text-[#9ca0aa]"
            />
          )}
        </span>
      </button>
    </div>
  );
}