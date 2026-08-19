"use client";

import {
  PhoneCall,
  MessageCircle,
  Mail,
  Globe2,
  MapPin,
  Plus,
  Copy,
  LockKeyhole,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { useDigitalCard } from "../DigitalCardEditor";

export default function ActionSettings() {
  const { card, updateCard } = useDigitalCard();

  /*
   * Extra Action Settings fields.
   * This allows the component to work even if these fields
   * are not yet added to your existing DigitalCardData type.
   */
  const settings = card as typeof card & {
    showCall?: boolean;
    showWhatsapp?: boolean;
    showEmail?: boolean;
    showWebsite?: boolean;
    showLocation?: boolean;
    showCustomButton?: boolean;

    customButtonLabel?: string;
    customButtonLink?: string;

    cardLink?: string;

    seoVisible?: boolean;

    passwordProtection?: boolean;
    cardPassword?: string;
  };

  /*
   * Update additional Action Settings fields.
   */
  const setSetting = (
    key: string,
    value: unknown
  ) => {
    (
      updateCard as (
        key: string,
        value: unknown
      ) => void
    )(key, value);
  };

  return (
    <div>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="mb-[20px]">
        <h1 className="text-[15px] font-semibold leading-[20px] text-[#222]">
          Step 6 - Contact & Action Settings
        </h1>

        <p className="mt-[4px] text-[9px] leading-[14px] text-[#858585]">
          Choose the actions you want to show and how people
          can connect with you.
        </p>
      </div>

      {/* ================================================= */}
      {/* PRIMARY ACTIONS */}
      {/* ================================================= */}

      <div className="mb-[20px]">

        <h2 className="text-[10px] font-semibold leading-[14px] text-[#454545]">
          Primary Actions
        </h2>

        <p className="mt-[3px] text-[8px] leading-[12px] text-[#999]">
          Select the main actions to display on your card.
        </p>

<div className="mt-[12px] grid grid-cols-2 gap-x-[12px] gap-y-[12px]">
          {/* CALL */}

          <ActionToggle
          
            icon={
              <PhoneCall
                size={14}
                strokeWidth={2}
              />
            }
            label="Call"
            enabled={settings.showCall ?? true}
            onChange={(value) =>
              setSetting(
                "showCall",
                value
              )
            }
          />

          {/* WHATSAPP */}

          <ActionToggle
            icon={
              <MessageCircle
                size={14}
                strokeWidth={2}
              />
            }
            label="WhatsApp"
            enabled={
              settings.showWhatsapp ?? true
            }
            onChange={(value) =>
              setSetting(
                "showWhatsapp",
                value
              )
            }
          />

          {/* EMAIL */}

          <ActionToggle
            icon={
              <Mail
                size={14}
                strokeWidth={2}
              />
            }
            label="Email"
            enabled={
              settings.showEmail ?? true
            }
            onChange={(value) =>
              setSetting(
                "showEmail",
                value
              )
            }
          />

          {/* WEBSITE */}

          <ActionToggle
            icon={
              <Globe2
                size={14}
                strokeWidth={2}
              />
            }
            label="Website"
            enabled={
              settings.showWebsite ?? true
            }
            onChange={(value) =>
              setSetting(
                "showWebsite",
                value
              )
            }
          />

          {/* LOCATION */}

          <ActionToggle
            icon={
              <MapPin
                size={14}
                strokeWidth={2}
              />
            }
            label="Location"
            enabled={
              settings.showLocation ?? true
            }
            onChange={(value) =>
              setSetting(
                "showLocation",
                value
              )
            }
          />

          {/* CUSTOM BUTTON */}

          <ActionToggle
            icon={
              <Plus
                size={14}
                strokeWidth={2}
              />
            }
            label="Custom Button"
            enabled={
              settings.showCustomButton ??
              false
            }
            onChange={(value) =>
              setSetting(
                "showCustomButton",
                value
              )
            }
          />

        </div>
      </div>

      {/* ================================================= */}
      {/* CUSTOM BUTTON SETTINGS */}
      {/* ================================================= */}

      {settings.showCustomButton && (
        <div className="mb-[20px]">

          <h2 className="text-[10px] font-semibold leading-[14px] text-[#454545]">
            Custom Button{" "}
            <span className="font-normal text-[#999]">
              (Optional)
            </span>
          </h2>

          <p className="mt-[3px] text-[8px] leading-[12px] text-[#999]">
            Add a custom button with your own label and link.
          </p>

          <div className="mt-[12px] space-y-[13px]">

            <SmallInput
              label="Button Label"
              placeholder="e.g. Book Appointment"
              value={
                settings.customButtonLabel ??
                ""
              }
              onChange={(value) =>
                setSetting(
                  "customButtonLabel",
                  value
                )
              }
            />

            <SmallInput
              label="Button Link"
              type="url"
              placeholder="https://yourlink.com"
              value={
                settings.customButtonLink ??
                ""
              }
              onChange={(value) =>
                setSetting(
                  "customButtonLink",
                  value
                )
              }
            />

          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* CARD SETTINGS */}
      {/* ================================================= */}

      <div className="mb-[20px]">

        <h2 className="text-[10px] font-semibold leading-[14px] text-[#454545]">
          Card Settings
        </h2>

        <p className="mt-[3px] text-[8px] leading-[12px] text-[#999]">
          Configure your card link and visibility settings.
        </p>

        <div className="mt-[12px]">

          <label
            htmlFor="cardLink"
            className="block text-[8px] font-medium leading-[10px] text-[#454545]"
          >
            Your Card Link
          </label>

          <div className="mt-[5px] flex h-[27px] w-full items-center rounded-[5px] border border-[#dedede] bg-white px-[8px]">

            <input
              id="cardLink"
              type="text"
              value={
                settings.cardLink ?? ""
              }
              onChange={(e) =>
                setSetting(
                  "cardLink",
                  e.target.value
                )
              }
              placeholder="https://miniw.../yourname"
              className="min-w-0 flex-1 bg-transparent text-[8px] text-[#454545] outline-none placeholder:text-[#a1a1a1]"
            />

            <button
              type="button"
              onClick={() => {
                if (
                  settings.cardLink &&
                  typeof navigator !==
                    "undefined" &&
                  navigator.clipboard
                ) {
                  navigator.clipboard
                    .writeText(
                      settings.cardLink
                    )
                    .catch(() => {});
                }
              }}
              className="ml-[5px] flex shrink-0 items-center gap-[4px] rounded-[4px] px-[5px] py-[3px] text-[7px] font-medium text-[#6335e9] transition hover:bg-[#faf8ff]"
            >
              <Copy
                size={10}
                strokeWidth={2}
              />

              Copy
            </button>

          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* SEO SETTINGS */}
      {/* ================================================= */}

      <div className="mb-[20px]">

        <h2 className="text-[10px] font-semibold leading-[14px] text-[#454545]">
          SEO / Search Engine Visibility
        </h2>

        <p className="mt-[3px] text-[8px] leading-[12px] text-[#999]">
          Do you want your card to be visible on search engines?
        </p>

        <div className="mt-[12px] flex gap-[25px]">

          <RadioOption
            selected={
              settings.seoVisible !== false
            }
            onClick={() =>
              setSetting(
                "seoVisible",
                true
              )
            }
            title="Yes, make it visible"
            subtitle="Recommended"
          />

          <RadioOption
            selected={
              settings.seoVisible === false
            }
            onClick={() =>
              setSetting(
                "seoVisible",
                false
              )
            }
            title="No, keep it private"
            subtitle="Only shareable via link"
          />

        </div>
      </div>

      {/* ================================================= */}
      {/* PASSWORD PROTECTION */}
      {/* ================================================= */}

      <div className="mb-[20px]">

        <h2 className="text-[10px] font-semibold leading-[14px] text-[#454545]">
          Password Protection{" "}
          <span className="font-normal text-[#999]">
            (Optional)
          </span>
        </h2>

        <p className="mt-[3px] text-[8px] leading-[12px] text-[#999]">
          Do you want to protect your card with a password?
        </p>

        <div className="mt-[12px]">

          <ActionToggle
            icon={
              <LockKeyhole
                size={14}
                strokeWidth={2}
              />
            }
            label="Enable Password Protection"
            enabled={
              settings.passwordProtection ??
              false
            }
            onChange={(value) =>
              setSetting(
                "passwordProtection",
                value
              )
            }
          />

        </div>

        {settings.passwordProtection && (
          <div className="mt-[13px]">

            <SmallInput
              label="Card Password"
              type="password"
              placeholder="Enter password"
              value={
                settings.cardPassword ?? ""
              }
              onChange={(value) =>
                setSetting(
                  "cardPassword",
                  value
                )
              }
            />

          </div>
        )}

      </div>

      {/* ================================================= */}
      {/* INFORMATION BOX */}
      {/* ================================================= */}

      <div className="mt-[18px] rounded-[5px] border border-dashed border-[#ded6ff] bg-[#faf8ff] px-[9px] py-[8px]">

        <div className="flex items-start gap-[7px]">

          <LockKeyhole
            size={12}
            strokeWidth={2.5}
            className="mt-[1px] shrink-0 text-[#6335e9]"
          />

          <div>

            <p className="text-[8px] font-medium leading-[11px] text-[#666]">
              Configure the actions shown on your card.
            </p>

            <p className="mt-[2px] text-[7px] leading-[10px] text-[#999]">
              Only enabled actions will be visible to visitors.
            </p>

          </div>

        </div>
      </div>

      {/* ================================================= */}
      {/* NAVIGATION BUTTONS */}
      {/* ================================================= */}

      {/* <div className="mt-[20px] flex items-center justify-between border-t border-[#eeeeee] pt-[15px]">

        <button
          type="button"
          className="flex h-[29px] items-center gap-[5px] rounded-[5px] border border-[#dedede] bg-white px-[10px] text-[8px] font-medium text-[#555] transition hover:bg-[#fafafa]"
        >
          <ArrowLeft
            size={11}
            strokeWidth={2}
          />

          Previous
        </button>

        <button
          type="button"
          className="flex h-[29px] items-center gap-[5px] rounded-[5px] bg-[#6335e9] px-[12px] text-[8px] font-medium text-white transition hover:bg-[#5427d5]"
        >
          Save & Next

          <ArrowRight
            size={11}
            strokeWidth={2}
          />
        </button>

      </div> */}
    </div>
  );
}

/* ========================================================= */
/* ACTION TOGGLE */
/* Same toggle style as your SocialLink component */
/* ========================================================= */
function ActionToggle({
  icon,
  label,
  enabled,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div
      className="
        flex
        h-[42px]
        w-full
        items-center
        justify-between
        rounded-[7px]
        border
        border-[#e5e5e5]
        bg-white
        px-[10px]
      "
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-[10px]">

        {/* ICON */}
        <div
          className={`
            flex
            h-[23px]
            w-[23px]
            items-center
            justify-center
            rounded-[6px]
            ${
              enabled
                ? "bg-[#6335e9] text-white"
                : "bg-[#f1f1f1] text-[#999999]"
            }
          `}
        >
          {icon}
        </div>

        {/* LABEL */}
        <span className="text-[9px] font-medium text-[#454545]">
          {label}
        </span>

      </div>

      {/* TOGGLE */}
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        aria-label={`Toggle ${label}`}
        aria-pressed={enabled}
        className={`
          relative
          flex
          h-[19px]
          w-[35px]
          shrink-0
          items-center
          rounded-full
          transition-colors
          duration-200
          ${
            enabled
              ? "bg-[#6335e9]"
              : "bg-[#d1d1d1]"
          }
        `}
      >
        <span
          className={`
            absolute
            top-[3px]
            flex
            h-[13px]
            w-[13px]
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-[0_1px_3px_rgba(0,0,0,0.18)]
            transition-transform
            duration-200
            ${
              enabled
                ? "translate-x-[19px]"
                : "translate-x-[3px]"
            }
          `}
        >
          {enabled ? (
            <Check
              size={8}
              strokeWidth={3}
              className="text-[#6335e9]"
            />
          ) : (
            <X
              size={8}
              strokeWidth={3}
              className="text-[#999999]"
            />
          )}
        </span>
      </button>
    </div>
  );
}

/* ========================================================= */
/* SMALL INPUT */
/* ========================================================= */

function SmallInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>

      <label className="block text-[8px] font-medium leading-[10px] text-[#454545]">
        {label}
      </label>

      <input
        type={type}
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
  );
}

/* ========================================================= */
/* RADIO OPTION */
/* ========================================================= */

function RadioOption({
  selected,
  onClick,
  title,
  subtitle,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-start gap-[7px] text-left"
    >

      {/* RADIO */}

      <span
        className={`
          mt-[1px]
          flex
          h-[12px]
          w-[12px]
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          ${
            selected
              ? "border-[#6335e9]"
              : "border-[#cfcfcf]"
          }
        `}
      >

        {selected && (
          <span className="h-[6px] w-[6px] rounded-full bg-[#6335e9]" />
        )}

      </span>

      {/* TEXT */}

      <span>

        <span className="block text-[8px] font-medium leading-[10px] text-[#454545]">
          {title}
        </span>

        <span
          className={`
            mt-[2px]
            block
            text-[7px]
            leading-[10px]
            ${
              selected
                ? "text-[#6335e9]"
                : "text-[#999]"
            }
          `}
        >
          {subtitle}
        </span>

      </span>

    </button>
  );
}