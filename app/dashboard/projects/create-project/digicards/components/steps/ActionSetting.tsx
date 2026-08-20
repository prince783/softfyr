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
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useDigitalCard } from "../DigitalCardEditor";

export default function ActionSettings() {
  const { card, updateCard } = useDigitalCard();

  /* =====================================================
     EXTRA ACTION SETTINGS
  ===================================================== */

  const settings = card as typeof card & {
    _id?: string;
    id?: string;

    showCall?: boolean;
    showWhatsapp?: boolean;
    showEmail?: boolean;
    showWebsite?: boolean;
    showLocation?: boolean;
    showCustomButton?: boolean;

    customButtonLabel?: string;
    customButtonLink?: string;

    username?: string;

    /* OLD CARD LINK - kept for compatibility */
    cardLink?: string;

    seoVisible?: boolean;

    passwordProtection?: boolean;
    cardPassword?: string;
  };

  /* =====================================================
     CURRENT CARD ID
  ===================================================== */

  const currentCardId =
    settings._id ||
    settings.id ||
    "";

  /* =====================================================
     USERNAME STATE
  ===================================================== */

  const [username, setUsername] =
    useState<string>(
      settings.username ?? ""
    );

  const [usernameStatus, setUsernameStatus] =
    useState<
      | "idle"
      | "checking"
      | "available"
      | "taken"
      | "invalid"
    >("idle");

  const [usernameMessage, setUsernameMessage] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  /* =====================================================
     UPDATE ADDITIONAL SETTINGS
  ===================================================== */

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

  /* =====================================================
     NORMALIZE USERNAME
  ===================================================== */

  const normalizeUsername = (
    value: string
  ) => {
    return value
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9_-]/g, "")
      .slice(0, 30);
  };

  /* =====================================================
     SYNC USERNAME WHEN CARD LOADS
  ===================================================== */

  useEffect(() => {
    const cardUsername =
      settings.username ?? "";

    setUsername(cardUsername);
  }, [settings.username]);

  /* =====================================================
     PUBLIC CARD URL
  ===================================================== */

  const getPublicCardUrl = (
    value: string
  ) => {
    if (!value) {
      return "";
    }

    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";

    return `${origin}/digitalvisitingcard/${value}`;
  };

  const cardUrl =
    getPublicCardUrl(username);

  /* =====================================================
     USERNAME CHECK
  ===================================================== */

  useEffect(() => {
    const cleanUsername =
      normalizeUsername(username);

    /* ===================================================
       EMPTY
    =================================================== */

    if (!cleanUsername) {
      setUsernameStatus("idle");
      setUsernameMessage("");
      return;
    }

    /* ===================================================
       INVALID LENGTH
    =================================================== */

    if (
      cleanUsername.length < 3 ||
      cleanUsername.length > 30
    ) {
      setUsernameStatus("invalid");
      setUsernameMessage(
        "Username must be 3-30 characters."
      );
      return;
    }

    /* ===================================================
       INVALID CHARACTERS
    =================================================== */

    if (
      !/^[a-z0-9_-]{3,30}$/.test(
        cleanUsername
      )
    ) {
      setUsernameStatus("invalid");
      setUsernameMessage(
        "Only letters, numbers, hyphens and underscores are allowed."
      );
      return;
    }

    /* ===================================================
       START CHECKING
    =================================================== */

    setUsernameStatus("checking");
    setUsernameMessage(
      "Checking username..."
    );

    const controller =
      new AbortController();

    const timeout = setTimeout(
      async () => {
        try {
          /* =================================================
             BUILD API URL
          ================================================= */

          const params =
            new URLSearchParams();

          params.set(
            "username",
            cleanUsername
          );

          /*
           * IMPORTANT:
           * Send current card ID when editing.
           *
           * This allows backend to exclude the
           * current card from duplicate checking.
           */

          if (currentCardId) {
            params.set(
              "cardId",
              currentCardId
            );
          }

          const response =
            await fetch(
              `/api/digital-cards/check-username?${params.toString()}`,
              {
                method: "GET",
                signal:
                  controller.signal,
                cache: "no-store",
              }
            );

          const data =
            await response.json();

          /* =================================================
             API ERROR
          ================================================= */

          if (!response.ok) {
            setUsernameStatus(
              "invalid"
            );

            setUsernameMessage(
              data?.message ||
                "Unable to check username."
            );

            return;
          }

          /* =================================================
             USERNAME AVAILABLE
          ================================================= */

          if (data?.available === true) {
            setUsernameStatus(
              "available"
            );

            setUsernameMessage(
              "Username is available"
            );

            return;
          }

          /* =================================================
             USERNAME TAKEN
          ================================================= */

          setUsernameStatus("taken");

          setUsernameMessage(
            data?.message ||
              "Username is already taken"
          );
        } catch (error) {
          /* ===============================================
             ABORTED REQUEST
          =============================================== */

          if (
            error instanceof DOMException &&
            error.name === "AbortError"
          ) {
            return;
          }

          console.error(
            "Username check error:",
            error
          );

          setUsernameStatus(
            "invalid"
          );

          setUsernameMessage(
            "Unable to check username."
          );
        }
      },
      500
    );

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [
    username,
    currentCardId,
  ]);

  /* =====================================================
     USERNAME CHANGE
  ===================================================== */

  const handleUsernameChange = (
    value: string
  ) => {
    const cleanUsername =
      normalizeUsername(value);

    setUsername(cleanUsername);

    /*
     * Immediately reset status.
     *
     * This prevents the previous
     * "available" / "taken" status
     * from showing for the new username.
     */

    if (!cleanUsername) {
      setUsernameStatus("idle");
      setUsernameMessage("");
    } else {
      setUsernameStatus("checking");
      setUsernameMessage(
        "Checking username..."
      );
    }

    /* ===================================================
       SAVE USERNAME INTO EDITOR
    =================================================== */

    setSetting(
      "username",
      cleanUsername
    );

    /* ===================================================
       KEEP OLD CARD LINK
       FOR BACKWARD COMPATIBILITY
    =================================================== */

    if (cleanUsername) {
      setSetting(
        "cardLink",
        getPublicCardUrl(
          cleanUsername
        )
      );
    } else {
      setSetting(
        "cardLink",
        ""
      );
    }

    setCopied(false);
  };

  /* =====================================================
     COPY URL
  ===================================================== */

  const handleCopyUrl = async () => {
    if (!cardUrl) {
      return;
    }

    if (
      typeof navigator ===
        "undefined" ||
      !navigator.clipboard
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        cardUrl
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
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
          Choose the actions you want to show and how
          people can connect with you.
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
          Select the main actions to display on your
          card.
        </p>

        <div className="mt-[12px] grid grid-cols-2 gap-x-[12px] gap-y-[12px]">
          <ActionToggle
            icon={
              <PhoneCall
                size={14}
                strokeWidth={2}
              />
            }
            label="Call"
            enabled={
              settings.showCall ?? true
            }
            onChange={(value) =>
              setSetting(
                "showCall",
                value
              )
            }
          />

          <ActionToggle
            icon={
              <MessageCircle
                size={14}
                strokeWidth={2}
              />
            }
            label="WhatsApp"
            enabled={
              settings.showWhatsapp ??
              true
            }
            onChange={(value) =>
              setSetting(
                "showWhatsapp",
                value
              )
            }
          />

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

          <ActionToggle
            icon={
              <Globe2
                size={14}
                strokeWidth={2}
              />
            }
            label="Website"
            enabled={
              settings.showWebsite ??
              true
            }
            onChange={(value) =>
              setSetting(
                "showWebsite",
                value
              )
            }
          />

          <ActionToggle
            icon={
              <MapPin
                size={14}
                strokeWidth={2}
              />
            }
            label="Location"
            enabled={
              settings.showLocation ??
              true
            }
            onChange={(value) =>
              setSetting(
                "showLocation",
                value
              )
            }
          />

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
            Add a custom button with your own label
            and link.
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
          Configure your username and visibility
          settings.
        </p>

        {/* =================================================
            USERNAME
        ================================================= */}

        <div className="mt-[12px]">
          <label
            htmlFor="username"
            className="block text-[8px] font-medium leading-[10px] text-[#454545]"
          >
            Choose Your Username
          </label>

          <p className="mt-[3px] text-[7px] leading-[10px] text-[#999]">
            Your username will be used to create your
            digital visiting card URL.
          </p>

          {/* USERNAME INPUT */}

          <div
            className={`
              mt-[7px]
              flex
              h-[30px]
              w-full
              items-center
              overflow-hidden
              rounded-[5px]
              border
              bg-white
              transition
              ${
                usernameStatus ===
                "taken"
                  ? "border-[#ef4444]"
                  : usernameStatus ===
                    "available"
                  ? "border-[#22c55e]"
                  : usernameStatus ===
                    "invalid"
                  ? "border-[#ef4444]"
                  : "border-[#dedede]"
              }
            `}
          >
            {/* FIXED PREFIX */}

            <div className="flex h-full shrink-0 items-center border-r border-[#eeeeee] bg-[#fafafa] px-[7px]">
              <span className="text-[7px] font-medium text-[#777]">
                /digitalvisitingcard/
              </span>
            </div>

            {/* USERNAME */}

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) =>
                handleUsernameChange(
                  e.target.value
                )
              }
              placeholder="yourname"
              autoComplete="off"
              spellCheck={false}
              className="
                min-w-0
                flex-1
                bg-transparent
                px-[7px]
                text-[8px]
                text-[#333]
                outline-none
                placeholder:text-[#aaa]
              "
            />

            {/* STATUS ICON */}

            <div className="mr-[7px] flex shrink-0 items-center">
              {usernameStatus ===
                "checking" && (
                <span className="h-[11px] w-[11px] animate-spin rounded-full border-2 border-[#d9d9d9] border-t-[#6335e9]" />
              )}

              {usernameStatus ===
                "available" && (
                <div className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#22c55e]">
                  <Check
                    size={9}
                    strokeWidth={3}
                    className="text-white"
                  />
                </div>
              )}

              {usernameStatus ===
                "taken" && (
                <div className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#ef4444]">
                  <X
                    size={9}
                    strokeWidth={3}
                    className="text-white"
                  />
                </div>
              )}

              {usernameStatus ===
                "invalid" && (
                <div className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#ef4444]">
                  <X
                    size={9}
                    strokeWidth={3}
                    className="text-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* USERNAME STATUS */}

          {usernameMessage && (
            <p
              className={`
                mt-[4px]
                text-[7px]
                leading-[10px]
                ${
                  usernameStatus ===
                  "available"
                    ? "text-[#22a447]"
                    : usernameStatus ===
                        "checking"
                    ? "text-[#999]"
                    : "text-[#ef4444]"
                }
              `}
            >
              {usernameStatus ===
                "available" && "✓ "}

              {usernameStatus ===
                "taken" && "✕ "}

              {usernameStatus ===
                "invalid" && "✕ "}

              {usernameMessage}
            </p>
          )}

          {/* =================================================
              GENERATED CARD URL
          ================================================= */}

          {username &&
            usernameStatus ===
              "available" && (
              <div className="mt-[9px]">
                <label className="block text-[8px] font-medium leading-[10px] text-[#454545]">
                  Your Card URL
                </label>

                <div className="mt-[5px] flex h-[27px] w-full items-center rounded-[5px] border border-[#dedede] bg-[#fafafa] px-[8px]">
                  <span className="min-w-0 flex-1 truncate text-[7px] text-[#6335e9]">
                    {cardUrl}
                  </span>

                  <button
                    type="button"
                    onClick={
                      handleCopyUrl
                    }
                    className="
                      ml-[5px]
                      flex
                      shrink-0
                      items-center
                      gap-[4px]
                      rounded-[4px]
                      px-[5px]
                      py-[3px]
                      text-[7px]
                      font-medium
                      text-[#6335e9]
                      transition
                      hover:bg-[#f1edff]
                    "
                  >
                    {copied ? (
                      <>
                        <Check
                          size={10}
                          strokeWidth={2.5}
                        />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy
                          size={10}
                          strokeWidth={2}
                        />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          {/* =================================================
              TAKEN MESSAGE
          ================================================= */}

          {usernameStatus ===
            "taken" && (
            <div className="mt-[8px] rounded-[5px] border border-[#fee2e2] bg-[#fff7f7] px-[8px] py-[6px]">
              <p className="text-[7px] leading-[10px] text-[#dc2626]">
                This username is already being used.
                Please choose another username.
              </p>
            </div>
          )}
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
          Do you want your card to be visible on search
          engines?
        </p>

        <div className="mt-[12px] flex gap-[25px]">
          <RadioOption
            selected={
              settings.seoVisible !==
              false
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
              settings.seoVisible ===
              false
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
          Do you want to protect your card with a
          password?
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
                settings.cardPassword ??
                ""
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
              Configure the actions shown on your
              card.
            </p>

            <p className="mt-[2px] text-[7px] leading-[10px] text-[#999]">
              Only enabled actions will be visible to
              visitors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* ACTION TOGGLE */
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
      <div className="flex items-center gap-[10px]">
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

        <span className="text-[9px] font-medium text-[#454545]">
          {label}
        </span>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange(!enabled)
        }
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