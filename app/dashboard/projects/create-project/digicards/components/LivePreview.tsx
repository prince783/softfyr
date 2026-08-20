"use client";

import {
  Phone,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  Map,
  Share2,
  Image as ImageIcon,
  Clock3,
  MoreVertical,
  Plus,
  Send,
} from "lucide-react";

import { useDigitalCard } from "./DigitalCardEditor";

interface LivePreviewProps {
  currentStep: number;
  template?: string;
}

/* =========================================================
   TEMPLATE DATA
========================================================= */

function getTemplateData(template?: string) {
  switch (template) {
    case "template-2":
      return {
        background:
          "linear-gradient(145deg,#1769e0 0%,#287ce8 55%,#0e56c7 100%)",
        accent: "#ffffff",
        button: "#ffffff",
        buttonText: "#1769e0",
      };

    case "template-3":
      return {
        background:
          "linear-gradient(145deg,#111111 0%,#191919 55%,#000000 100%)",
        accent: "#f0b400",
        button: "#f0b400",
        buttonText: "#111111",
      };

    case "template-4":
      return {
        background:
          "linear-gradient(145deg,#15945f 0%,#24a86f 55%,#087348 100%)",
        accent: "#ffffff",
        button: "#ffffff",
        buttonText: "#15945f",
      };

    case "template-5":
      return {
        background:
          "linear-gradient(145deg,#6737e8 0%,#7438d7 55%,#4c20ba 100%)",
        accent: "#ffffff",
        button: "#ffffff",
        buttonText: "#6737e8",
      };

    case "template-1":
    default:
      return {
        background:
          "linear-gradient(145deg,#17133a 0%,#21194e 55%,#100d29 100%)",
        accent: "#6737e8",
        button: "#6737e8",
        buttonText: "#ffffff",
      };
  }
}

/* =========================================================
   MAIN LIVE PREVIEW
========================================================= */

export default function LivePreview({
  currentStep,
  template = "template-1",
}: LivePreviewProps) {
  const { card } = useDigitalCard();

  /*
   * IMPORTANT
   * Always use the template selected from the parent.
   */
  const activeTemplate = template || card.templateId || "template-1";

  const templateData = getTemplateData(activeTemplate);

  return (
    <div
      className="
        relative
        h-[600px]
        w-[282px]
        min-h-[600px]
        min-w-[282px]
        max-h-[600px]
        max-w-[282px]
        shrink-0
        overflow-hidden
        rounded-[25px]
        text-white
        shadow-[0_15px_30px_rgba(21,20,60,0.20)]
      "
      style={{
        background: templateData.background,
        transition: "background 300ms ease",
      }}
    >
      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[90px]
          top-[70px]
          h-[230px]
          w-[230px]
          rounded-full
          opacity-10
          blur-[75px]
        "
        style={{
          backgroundColor: templateData.accent,
        }}
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-[90px]
          bottom-[60px]
          h-[210px]
          w-[210px]
          rounded-full
          opacity-10
          blur-[70px]
        "
        style={{
          backgroundColor: templateData.accent,
        }}
      />

      {/* =====================================================
          TEMPLATE 2 DECORATION
      ===================================================== */}

      {activeTemplate === "template-2" && (
        <>
          <div
            className="
              pointer-events-none
              absolute
              -right-[60px]
              -top-[55px]
              h-[160px]
              w-[160px]
              rounded-full
              border-[30px]
              border-white/10
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-[70px]
              -left-[50px]
              h-[180px]
              w-[180px]
              rounded-full
              bg-white/[0.05]
            "
          />
        </>
      )}

      {/* =====================================================
          TEMPLATE 3 DECORATION
      ===================================================== */}

      {activeTemplate === "template-3" && (
        <div
          className="
            pointer-events-none
            absolute
            right-[-50px]
            top-[120px]
            h-[180px]
            w-[180px]
            rotate-45
            border
            border-[#f0b400]/20
          "
        />
      )}

      {/* =====================================================
          TEMPLATE 4 DECORATION
      ===================================================== */}

      {activeTemplate === "template-4" && (
        <div
          className="
            pointer-events-none
            absolute
            -bottom-[70px]
            -right-[60px]
            h-[190px]
            w-[190px]
            rounded-full
            bg-white/[0.06]
          "
        />
      )}

      {/* =====================================================
          TEMPLATE 5 DECORATION
      ===================================================== */}

      {activeTemplate === "template-5" && (
        <>
          <div
            className="
              pointer-events-none
              absolute
              -left-[70px]
              top-[80px]
              h-[180px]
              w-[180px]
              rounded-full
              bg-white/[0.08]
              blur-[10px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -right-[70px]
              bottom-[100px]
              h-[200px]
              w-[200px]
              rounded-full
              bg-white/[0.08]
              blur-[10px]
            "
          />
        </>
      )}

      {/* =====================================================
          THREE DOT MENU
      ===================================================== */}

      <button
        type="button"
        className="
          absolute
          right-[13px]
          top-[17px]
          z-30
          text-white/90
        "
        aria-label="More options"
      >
        <MoreVertical size={18} strokeWidth={2} />
      </button>

      {/* =====================================================
          SCROLLABLE PREVIEW
      ===================================================== */}

      <div
        className="
          relative
          z-10
          h-full
          w-full
          overflow-y-auto
          px-[22px]
          py-[24px]
          pb-[85px]
          scrollbar-none
        "
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {currentStep === 1 && <BasicPreview />}

        {currentStep === 2 && <ContactPreview />}

        {currentStep === 3 && <SocialPreview />}

        {currentStep === 4 && <ServicesPreview />}

        {currentStep === 5 && <GalleryPreview />}

        {currentStep === 6 && <ActionSettingsPreview />}

        {currentStep === 7 && <FullPreview />}
      </div>

      {/* =====================================================
          SAVE CONTACT

          IMPORTANT:
          Background and button now follow selected template.
      ===================================================== */}

      {currentStep !== 6 && currentStep !== 7 && (
        <SaveButton
          background={templateData.background}
          buttonBackground={templateData.button}
          buttonText={templateData.buttonText}
        />
      )}
    </div>
  );
}

/* =========================================================
   STEP 1 - BASIC DETAILS
========================================================= */

function BasicPreview() {
  const { card } = useDigitalCard();

  return (
    <div>
      <ProfileHeader />

      <div className="mt-[12px] h-px w-full bg-white/[0.10]" />

      {card.tagline?.trim() && (
        <div className="mt-[12px] flex justify-center">
          <p className="w-[150px] text-center text-[12px] font-medium leading-[17px] text-white/85">
            {card.tagline}
          </p>
        </div>
      )}

      <QuickActions />

      {/* ABOUT */}
      <div className="mt-[12px] border-t border-white/[0.10] pt-[8px]">
        <h3 className="text-[13px] font-semibold text-white">About Company</h3>

        <p className="mt-[6px] text-[11px] leading-[16px] text-white/75">
          {card.aboutCompany || "Your company information will appear here."}
        </p>
      </div>

      {/* SERVICES */}
      <div className="mt-[13px] border-t border-white/[0.10] pt-[12px]">
        <h3 className="text-[13px] font-semibold text-white">Our Services</h3>

        {card.businessDetails?.services?.length ? (
          <div className="mt-[6px] space-y-[5px]">
            {card.businessDetails.services.map((service, index) => (
              <div
                key={`${service}-${index}`}
                className="flex items-center gap-[7px]"
              >
                <span className="text-[13px] font-bold leading-none text-[#10c968]">
                  ✓
                </span>

                <span className="text-[11px] leading-[15px] text-white/80">
                  {service}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyMessage>Your services will appear here.</EmptyMessage>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   STEP 2 - CONTACT
========================================================= */

function ContactPreview() {
  const { card } = useDigitalCard();

  const hasContact =
    Boolean(card.mobile) ||
    Boolean(card.whatsapp) ||
    Boolean(card.email) ||
    Boolean(card.website) ||
    Boolean(card.address) ||
    Boolean(card.googleMapLink);

  return (
    <div>
      <ProfileHeader />

      <div className="mt-[14px] border-t border-white/[0.10] pt-[13px]">
        <h3 className="text-[13px] font-semibold text-white">
          Contact Details
        </h3>

        <div className="mt-[10px] space-y-[6px]">
          {card.mobile && (
            <ContactRow icon={<Phone size={14} />} value={card.mobile} />
          )}

          {card.whatsapp && (
            <ContactRow
              icon={<MessageCircle size={15} />}
              value={card.whatsapp}
            />
          )}

          {card.email && (
            <ContactRow icon={<Mail size={14} />} value={card.email} />
          )}

          {card.website && (
            <ContactRow icon={<Globe size={14} />} value={card.website} />
          )}

          {card.address && (
            <ContactRow icon={<MapPin size={14} />} value={card.address} />
          )}

          {card.googleMapLink && (
            <a
              href={card.googleMapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                items-center
                gap-[8px]
                pt-[3px]
                text-[11px]
                text-purple-300
                transition
                hover:text-purple-200
              "
            >
              <Map size={14} />
              <span>View on Google Maps</span>
            </a>
          )}

          <SocialIcons socialLinks={card.socialLinks} />

          {!hasContact && (
            <EmptyMessage>
              Add your contact details to see them here.
            </EmptyMessage>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STEP 3 - SOCIAL LINKS
========================================================= */

function SocialPreview() {
  const { card } = useDigitalCard();

  const socialLinks = card.socialLinks ?? {};

  const hasSocialLinks = Boolean(
    socialLinks.facebook?.trim() ||
    socialLinks.instagram?.trim() ||
    socialLinks.linkedin?.trim() ||
    socialLinks.youtube?.trim() ||
    socialLinks.twitter?.trim() ||
    socialLinks.telegram?.trim(),
  );

  return (
    <div>
      <ProfileHeader />

      {card.tagline?.trim() && (
        <div className="mt-[12px] flex justify-center">
          <p className="w-[150px] text-center text-[12px] font-medium leading-[17px] text-white/85">
            {card.tagline}
          </p>
        </div>
      )}

      <QuickActions />

      <div className="mt-[14px] border-t border-white/[0.10] pt-[13px]">
        <h3 className="text-[11px] font-semibold text-white">Follow Me</h3>

        {hasSocialLinks ? (
          <SocialIcons socialLinks={socialLinks} />
        ) : (
          <EmptyMessage>Add your social links to see them here.</EmptyMessage>
        )}

        <p className="mb-3 mt-6 text-xs">View My Location</p>

        {card.address?.trim() ? (
          <ContactRow icon={<MapPin size={14} />} value={card.address} />
        ) : (
          <EmptyMessage>Add your location to see it here.</EmptyMessage>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   STEP 4 - SERVICES
========================================================= */

function ServicesPreview() {
  const { card } = useDigitalCard();

  const workingHours = card.businessDetails?.workingHours ?? {
    weekday: {
      from: "09:00 AM",
      to: "07:00 PM",
    },
    weekend: {
      from: "10:00 AM",
      to: "04:00 PM",
    },
  };

  const services = card.businessDetails?.services ?? [];

  return (
    <div>
      <ProfileHeader />

      <div className="mt-[12px] h-px w-full bg-white/[0.10]" />

      {card.tagline?.trim() && (
        <div className="mt-[12px] flex justify-center">
          <p className="w-[150px] text-center text-[12px] font-medium leading-[17px] text-white/85">
            {card.tagline}
          </p>
        </div>
      )}

      <QuickActions />

      <div className="mt-[13px] border-t border-white/[0.10] pt-[13px]">
        <h3 className="text-[13px] font-semibold text-white">Our Services</h3>

        {services.length === 0 ? (
          <EmptyMessage>Your services will appear here.</EmptyMessage>
        ) : (
          <div className="mt-[6px] space-y-[5px]">
            {services.map((service, index) => (
              <div
                key={`${service}-${index}`}
                className="
                  flex
                  items-center
                  gap-[7px]
                  rounded-md
                  bg-white/[0.06]
                  px-[9px]
                  py-[7px]
                "
              >
                <span className="text-[13px] font-bold text-[#10c968]">✓</span>

                <p className="text-[11px] leading-[15px] text-white/80">
                  {service || "Service"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-[12px] border-t border-white/[0.10] pt-[13px]">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-semibold text-white">
            Working Hours
          </h3>

          <Clock3 size={14} className="text-white/50" />
        </div>

        <div className="mt-[5px] space-y-[5px]">
          <WorkingHourRow
            day="Mon - Fri"
            from={workingHours.weekday.from}
            to={workingHours.weekday.to}
          />

          <WorkingHourRow
            day="Sat - Sun"
            from={workingHours.weekend.from}
            to={workingHours.weekend.to}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STEP 5 - GALLERY
========================================================= */

function GalleryPreview() {
  const { card } = useDigitalCard();

  const gallery = card.gallery ?? [];
  const services = card.businessDetails?.services ?? [];

  return (
    <div>
      <ProfileHeader />

      <div className="mt-[10px] border-t border-white/[0.10] pt-[13px]">
        {card.tagline?.trim() && (
          <div className="flex justify-center">
            <p className="w-[150px] text-center text-[12px] font-medium leading-[17px] text-white/85">
              {card.tagline}
            </p>
          </div>
        )}

        <QuickActions />

        <div className="mt-[13px] border-t border-white/[0.10] pt-[12px]">
          <h3 className="text-[13px] font-semibold text-white">Our Services</h3>

          {services.length > 0 ? (
            <div className="mt-[6px] space-y-[5px]">
              {services.slice(0, 4).map((service, index) => (
                <div
                  key={`${service}-${index}`}
                  className="flex items-center gap-[7px]"
                >
                  <span className="text-[13px] font-bold leading-none text-[#10c968]">
                    ✓
                  </span>

                  <span className="text-[11px] leading-[15px] text-white/80">
                    {service}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyMessage>Your services will appear here.</EmptyMessage>
          )}
        </div>

        <div className="mt-[12px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[7px]">
              <ImageIcon size={15} />

              <h3 className="text-[13px] font-semibold text-white">Gallery</h3>
            </div>

            {gallery.length > 0 && (
              <button
                type="button"
                className="text-[9px] font-medium text-purple-300 transition hover:text-purple-200"
              >
                View All
              </button>
            )}
          </div>

          {gallery.length === 0 ? (
            <EmptyMessage>Your gallery images will appear here.</EmptyMessage>
          ) : (
            <div className="mt-[9px] grid grid-cols-3 gap-[5px]">
              {gallery.slice(0, 3).map((image, index) => (
                <div
                  key={`${image.url}-${index}`}
                  className="
        h-[65px]
        w-full
        overflow-hidden
        rounded-[5px]
        bg-white/[0.05]
      "
                >
                  <img
                    src={image.url}
                    alt={`Gallery ${index + 1}`}
                    className="
          h-full
          w-full
          object-cover
          transition
          duration-200
          hover:scale-105
        "
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STEP 6 - ACTION SETTINGS
========================================================= */

function ActionSettingsPreview() {
  const { card } = useDigitalCard();

  const socialLinks = card.socialLinks ?? {};

  const showCall = card.showCall ?? true;
  const showWhatsapp = card.showWhatsapp ?? true;
  const showEmail = card.showEmail ?? true;
  const showWebsite = card.showWebsite ?? true;
  const showLocation = card.showLocation ?? true;
  const showCustomButton = card.showCustomButton ?? false;

  const hasPrimaryActions =
    showCall ||
    showWhatsapp ||
    showEmail ||
    showWebsite ||
    showLocation ||
    showCustomButton;

  return (
    <div>
      <ProfileHeader />

      {card.tagline?.trim() && (
        <div className="mt-[12px] flex justify-center">
          <p className="w-[150px] text-center text-[12px] font-medium leading-[17px] text-white/85">
            {card.tagline}
          </p>
        </div>
      )}

      <div className="mt-[12px] h-px w-full bg-white/[0.10]" />

      <div className="mt-[13px]">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-semibold text-white">
            Contact & Actions
          </h3>

          <Share2 size={14} className="text-white/50" />
        </div>

        {!hasPrimaryActions ? (
          <EmptyMessage>No actions are enabled for your card.</EmptyMessage>
        ) : (
          <div className="mt-[8px] grid grid-cols-4 gap-[4px]">
            {showCall && (
              <ActionPreviewButton
                icon={<Phone size={15} />}
                label="Call"
                background="#34478e"
              />
            )}

            {showWhatsapp && (
              <ActionPreviewButton
                icon={<MessageCircle size={15} />}
                label="WhatsApp"
                background="#13b95c"
              />
            )}

            {showEmail && (
              <ActionPreviewButton
                icon={<Mail size={15} />}
                label="Email"
                background="#6540c8"
              />
            )}

            {showWebsite && (
              <ActionPreviewButton
                icon={<Globe size={15} />}
                label="Website"
                background="#1672e9"
              />
            )}

            {showLocation && (
              <ActionPreviewButton
                icon={<MapPin size={15} />}
                label="Location"
                background="#6737E8"
              />
            )}

            {showCustomButton && (
              <ActionPreviewButton
                icon={<Plus size={15} />}
                label={card.customButtonLabel?.trim() || "Custom Button"}
                background="#5631C8"
              />
            )}
          </div>
        )}
      </div>

      <div className="mt-[10px] border-t border-white/[0.10] pt-[12px]">
        <h3 className="text-[13px] font-semibold text-white">Our Services</h3>

        {card.businessDetails?.services?.length ? (
          <div className="mt-[6px] space-y-[5px]">
            {card.businessDetails.services.map((service, index) => (
              <div
                key={`${service}-${index}`}
                className="flex items-center gap-[7px]"
              >
                <span className="text-[13px] font-bold leading-none text-[#10c968]">
                  ✓
                </span>

                <span className="text-[11px] leading-[15px] text-white/80">
                  {service}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyMessage>Your services will appear here.</EmptyMessage>
        )}
      </div>

      <div className="mt-[12px] border-t border-white/[0.10] pt-[13px]">
        <h3 className="text-[11px] font-semibold text-white">Follow Me</h3>

        <SocialIcons socialLinks={socialLinks} />
      </div>
    </div>
  );
}

/* =========================================================
   STEP 7 - FULL PREVIEW
========================================================= */

function FullPreview() {
  const { card } = useDigitalCard();

  const socialLinks = card.socialLinks ?? {};

  const showCall = card.showCall ?? true;
  const showWhatsapp = card.showWhatsapp ?? true;
  const showEmail = card.showEmail ?? true;
  const showWebsite = card.showWebsite ?? true;
  const showLocation = card.showLocation ?? true;
  const showCustomButton = card.showCustomButton ?? false;

  const hasPrimaryActions =
    showCall ||
    showWhatsapp ||
    showEmail ||
    showWebsite ||
    showLocation ||
    showCustomButton;

  return (
    <div>
      <ProfileHeader />

      {card.tagline?.trim() && (
        <div className="mt-[12px] flex justify-center">
          <p className="w-[150px] text-center text-[12px] font-medium leading-[15px] text-white/85">
            {card.tagline}
          </p>
        </div>
      )}

      <div className="mt-[10px] h-px w-full bg-white/[0.10]" />

      <div className="mt-[8px]">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-semibold text-white">
            Contact & Actions
          </h3>

          <Share2 size={14} className="text-white/50" />
        </div>

        {!hasPrimaryActions ? (
          <EmptyMessage>No actions are enabled for your card.</EmptyMessage>
        ) : (
          <div className="mt-[4px] grid grid-cols-4 gap-[4px]">
            {showCall && (
              <ActionPreviewButton
                icon={<Phone size={15} />}
                label="Call"
                background="#34478e"
              />
            )}

            {showWhatsapp && (
              <ActionPreviewButton
                icon={<MessageCircle size={15} />}
                label="WhatsApp"
                background="#13b95c"
              />
            )}

            {showEmail && (
              <ActionPreviewButton
                icon={<Mail size={15} />}
                label="Email"
                background="#6540c8"
              />
            )}

            {showWebsite && (
              <ActionPreviewButton
                icon={<Globe size={15} />}
                label="Website"
                background="#1672e9"
              />
            )}

            {showLocation && (
              <ActionPreviewButton
                icon={<MapPin size={15} />}
                label="Location"
                background="#6737E8"
              />
            )}

            {showCustomButton && (
              <ActionPreviewButton
                icon={<Plus size={15} />}
                label={card.customButtonLabel?.trim() || "Custom Button"}
                background="#5631C8"
              />
            )}
          </div>
        )}
      </div>

      <div className="mt-[8px] border-t border-white/[0.10] pt-[12px]">
        <h3 className="text-[13px] font-semibold text-white">Our Services</h3>

        {card.businessDetails?.services?.length ? (
          <div className="mt-[6px] space-y-[5px]">
            {card.businessDetails.services.map((service, index) => (
              <div
                key={`${service}-${index}`}
                className="flex items-center gap-[7px]"
              >
                <span className="text-[13px] font-bold leading-none text-[#10c968]">
                  ✓
                </span>

                <span className="text-[11px] leading-[15px] text-white/80">
                  {service}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyMessage>Your services will appear here.</EmptyMessage>
        )}
      </div>

      <div className="mt-[8px] border-t border-white/[0.10] pt-[13px]">
        <h3 className="text-[11px] font-semibold text-white">Follow Me</h3>

        <SocialIcons socialLinks={socialLinks} />
      </div>
    </div>
  );
}
/* =========================================================
   PUBLIC FULL CARD PREVIEW
   Used by PublicCardClient.tsx

   IMPORTANT:
   This does NOT replace the existing LivePreview.
   It is a separate complete public-card renderer.
========================================================= */

export function PublicCardPreview({
  template = "template-1",
}: {
  template?: string;
}) {
  const { card } = useDigitalCard();

  const activeTemplate =
    template || card.templateId || "template-1";

  const templateData = getTemplateData(activeTemplate);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#eef1f5] px-3 py-5 sm:px-6">
      {/* =====================================================
          PHONE / CARD FRAME
      ===================================================== */}

      <div
        className="
          relative
          w-full
          max-w-[390px]
          overflow-hidden
          rounded-[32px]
          border-[5px]
          border-[#202020]
          bg-white
          shadow-[0_25px_70px_rgba(0,0,0,0.25)]
        "
      >
        {/* =================================================
            TOP HEADER
        ================================================= */}

        <PublicHeader
          card={card}
          templateData={templateData}
        />

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="bg-white px-[14px] pb-[85px] pt-[10px]">

          {/* -----------------------------------------------
              QUICK CONTACT ACTIONS
          ------------------------------------------------ */}

          <PublicQuickActions card={card} />

          {/* -----------------------------------------------
              LOCATION + WORKING HOURS
          ------------------------------------------------ */}

          <PublicLocationHours
            card={card}
            accent={templateData.accent}
          />

          {/* -----------------------------------------------
              ABOUT
          ------------------------------------------------ */}

          <PublicAbout
            card={card}
            accent={templateData.accent}
          />

          {/* -----------------------------------------------
              SERVICES
          ------------------------------------------------ */}

          <PublicServices
            card={card}
            accent={templateData.accent}
          />

          {/* -----------------------------------------------
              SOCIAL LINKS
          ------------------------------------------------ */}

          <PublicSocialLinks
            card={card}
            accent={templateData.accent}
          />

          {/* -----------------------------------------------
              GALLERY
          ------------------------------------------------ */}

          <PublicGallery
            card={card}
            accent={templateData.accent}
          />

          {/* -----------------------------------------------
              VIDEOS
          ------------------------------------------------ */}

          <PublicVideos
            card={card}
            accent={templateData.accent}
          />
        </div>

        {/* =================================================
            SAVE CONTACT
        ================================================= */}

        <PublicSaveContact
          card={card}
          templateData={templateData}
        />
      </div>
    </div>
  );
}

/* =========================================================
   TYPES USED ONLY BY PUBLIC PREVIEW
========================================================= */

type PublicGalleryItem = {
  url?: string;
  title?: string;
};

type PublicVideoItem = {
  url?: string;
  thumbnail?: string;
  title?: string;
  duration?: string;
};

type PublicCardExtraData = {
  coverImage?: string;

  videos?: PublicVideoItem[];

  businessDetails?: {
    services?: string[];

    workingHours?: {
      weekday?: {
        from?: string;
        to?: string;
      };

      weekend?: {
        from?: string;
        to?: string;
      };
    };

    videos?: PublicVideoItem[];
  };
};

/* =========================================================
   HEADER
========================================================= */

function PublicHeader({
  card,
  templateData,
}: {
  card: DigitalCardData;
  templateData: ReturnType<typeof getTemplateData>;
}) {
  const extraCard = card as DigitalCardData & PublicCardExtraData;

  const coverImage = extraCard.coverImage;

  return (
    <div className="relative">

      {/* ================================================
          COVER AREA
      ================================================= */}

      <div
        className="relative h-[145px] overflow-hidden"
        style={{
          background: templateData.background,
        }}
      >

        {/* Optional cover image */}

        {coverImage ? (
          <img
            src={coverImage}
            alt="Cover"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            {/* Decorative shapes */}

            <div className="absolute -left-[60px] -top-[30px] h-[150px] w-[230px] rotate-[35deg] bg-white/10" />

            <div className="absolute -left-[90px] top-[60px] h-[100px] w-[240px] rotate-[30deg] bg-white/15" />

            <div className="absolute right-[-40px] top-[10px] h-[140px] w-[140px] rounded-full border-[18px] border-white/10" />

            <div className="absolute right-[30px] bottom-[-50px] h-[150px] w-[150px] rounded-full bg-white/10" />
          </>
        )}

        {/* ============================================
            SAVE CONTACT
        ============================================ */}

        <button
          type="button"
          onClick={() => downloadVCard(card)}
          className="
            absolute
            left-[12px]
            top-[12px]
            z-20
            flex
            items-center
            gap-[5px]
            rounded-full
            bg-white
            px-[10px]
            py-[6px]
            text-[9px]
            font-semibold
            text-[#123f86]
            shadow-sm
          "
        >
          <span className="text-[11px]">♙</span>
          Save Contact
        </button>

        {/* ============================================
            SHARE
        ============================================ */}

        <button
          type="button"
          onClick={async () => {
            try {
              if (navigator.share) {
                await navigator.share({
                  title:
                    card.fullName ||
                    card.companyName ||
                    "Digital Visiting Card",
                  text:
                    card.tagline ||
                    card.companyName ||
                    "Digital Visiting Card",
                  url: window.location.href,
                });
              } else {
                await navigator.clipboard.writeText(
                  window.location.href,
                );
              }
            } catch {
              // User cancelled sharing.
            }
          }}
          className="
            absolute
            right-[12px]
            top-[12px]
            z-20
            flex
            items-center
            gap-[5px]
            rounded-full
            bg-white
            px-[10px]
            py-[6px]
            text-[9px]
            font-semibold
            text-[#123f86]
            shadow-sm
          "
        >
          <span className="text-[11px]">↗</span>
          Share Card
        </button>
      </div>

      {/* =================================================
          PROFILE IMAGE
      ================================================= */}

      <div className="relative flex justify-center">

        <div
          className="
            absolute
            -top-[50px]
            h-[100px]
            w-[100px]
            overflow-hidden
            rounded-full
            border-[2px]
            bg-white
            p-[3px]
          "
          style={{
            borderColor: templateData.accent,
          }}
        >
          {card.profilePhoto ? (
            <img
              src={card.profilePhoto}
              alt={card.fullName || "Profile"}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#ead0bd] text-[30px]">
              👤
            </div>
          )}
        </div>

        {/* Verified icon */}

        <div
          className="
            absolute
            -right-[50px]
            -top-[20px]
            flex
            h-[22px]
            w-[22px]
            items-center
            justify-center
            rounded-full
            border-2
            border-white
            bg-[#22c55e]
            text-[11px]
            font-bold
            text-white
          "
        >
          ✓
        </div>
      </div>

      {/* =================================================
          PROFILE TEXT
      ================================================= */}

      <div className="px-4 pb-[10px] pt-[58px] text-center">

        <h1 className="text-[20px] font-bold leading-[25px] text-[#111827]">
          {card.fullName || "Your Name"}
        </h1>

        <p
          className="mt-[2px] text-[11px] font-semibold"
          style={{
            color: templateData.accent,
          }}
        >
          {card.designation || "Designation"}
        </p>

        <p className="mt-[2px] text-[11px] font-medium text-[#374151]">
          {card.companyName || "Company Name"}
        </p>

        <div
          className="mx-auto mt-[8px] h-[1px] w-[160px]"
          style={{
            backgroundColor: `${templateData.accent}55`,
          }}
        />

        {card.tagline?.trim() && (
          <p className="mx-auto mt-[7px] max-w-[260px] text-[9px] leading-[14px] text-[#6b7280]">
            {card.tagline}
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   QUICK ACTIONS
========================================================= */

function PublicQuickActions({
  card,
}: {
  card: DigitalCardData;
}) {
  const showCall = card.showCall ?? true;
  const showWhatsapp = card.showWhatsapp ?? true;
  const showEmail = card.showEmail ?? true;
  const showWebsite = card.showWebsite ?? true;

  return (
    <div className="grid grid-cols-4 gap-[5px]">

      {showCall && (
        <PublicAction
          icon={<Phone size={17} />}
          label="Call"
          href={card.mobile ? `tel:${card.mobile}` : undefined}
        />
      )}

      {showWhatsapp && (
        <PublicAction
          icon={<MessageCircle size={17} />}
          label="WhatsApp"
          href={getWhatsappUrl(card.whatsapp || card.mobile)}
        />
      )}

      {showEmail && (
        <PublicAction
          icon={<Mail size={17} />}
          label="Email"
          href={card.email ? `mailto:${card.email}` : undefined}
        />
      )}

      {showWebsite && (
        <PublicAction
          icon={<Globe size={17} />}
          label="Website"
          href={normalizeUrl(card.website)}
        />
      )}
    </div>
  );
}

/* =========================================================
   PUBLIC ACTION
========================================================= */

function PublicAction({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
}) {
  const content = (
    <>
      <div
        className="
          flex
          h-[38px]
          w-[38px]
          items-center
          justify-center
          rounded-[9px]
          border
          border-[#e5e7eb]
          bg-white
          text-[#0756b5]
          shadow-[0_2px_7px_rgba(0,0,0,0.06)]
        "
      >
        {icon}
      </div>

      <span className="mt-[3px] text-[8px] font-medium text-[#374151]">
        {label}
      </span>
    </>
  );

  if (!href) {
    return (
      <div className="flex flex-col items-center">
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      target={
        href.startsWith("http")
          ? "_blank"
          : undefined
      }
      rel={
        href.startsWith("http")
          ? "noopener noreferrer"
          : undefined
      }
      className="flex flex-col items-center"
    >
      {content}
    </a>
  );
}

/* =========================================================
   LOCATION + HOURS
========================================================= */

function PublicLocationHours({
  card,
  accent,
}: {
  card: DigitalCardData;
  accent: string;
}) {
  const workingHours =
    card.businessDetails?.workingHours;

  const from =
    workingHours?.weekday?.from ||
    "09:00 AM";

  const to =
    workingHours?.weekday?.to ||
    "07:00 PM";

  return (
    <div
      className="
        mt-[8px]
        overflow-hidden
        rounded-[8px]
        text-white
      "
      style={{
        background: "#063b88",
      }}
    >
      <div className="grid grid-cols-2">

        {/* LOCATION */}

        <a
          href={
            card.googleMapLink ||
            undefined
          }
          target={
            card.googleMapLink
              ? "_blank"
              : undefined
          }
          rel={
            card.googleMapLink
              ? "noopener noreferrer"
              : undefined
          }
          className="
            flex
            min-h-[48px]
            items-center
            gap-[7px]
            border-r
            border-white/10
            px-[10px]
          "
        >
          <div className="flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full bg-white/10">
            <MapPin size={14} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[9px] font-semibold">
              {card.address || "Add your location"}
            </p>

            <p className="mt-[1px] text-[7px] text-white/70">
              View on Map
            </p>
          </div>
        </a>

        {/* HOURS */}

        <div className="flex min-h-[48px] items-center gap-[7px] px-[10px]">
          <div className="flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full bg-white/10">
            <Clock3 size={14} />
          </div>

          <div>
            <p className="text-[9px] font-semibold">
              Mon - Sat
            </p>

            <p className="mt-[1px] text-[7px] text-white/70">
              {from} - {to}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ABOUT
========================================================= */

function PublicAbout({
  card,
  accent,
}: {
  card: DigitalCardData;
  accent: string;
}) {
  if (!card.aboutCompany?.trim()) {
    return null;
  }

  return (
    <section className="mt-[13px]">

      <PublicSectionTitle
        icon="♙"
        title="About Me"
        accent={accent}
      />

      <p
        className="
          mt-[5px]
          line-clamp-3
          text-[9px]
          leading-[14px]
          text-[#4b5563]
        "
      >
        {card.aboutCompany}
      </p>

      <div className="mt-[5px] flex justify-end">
        <button
          type="button"
          className="
            rounded-[5px]
            px-[9px]
            py-[5px]
            text-[8px]
            font-semibold
            text-white
          "
          style={{
            backgroundColor: accent,
          }}
        >
          Read More
        </button>
      </div>
    </section>
  );
}

/* =========================================================
   SERVICES
========================================================= */

function PublicServices({
  card,
  accent,
}: {
  card: DigitalCardData;
  accent: string;
}) {
  const services =
    card.businessDetails?.services || [];

  if (!services.length) {
    return null;
  }

  return (
    <section className="mt-[13px]">

      <div className="flex items-center justify-between">

        <PublicSectionTitle
          icon="▣"
          title="Our Services"
          accent={accent}
        />

        <button
          type="button"
          className="flex items-center gap-[2px] text-[8px] font-semibold"
          style={{
            color: accent,
          }}
        >
          View All
          <span className="text-[12px]">→</span>
        </button>
      </div>

      <div className="mt-[6px] grid grid-cols-5 gap-[4px]">
        {services.slice(0, 5).map(
          (service, index) => (
            <div
              key={`${service}-${index}`}
              className="
                flex
                min-h-[65px]
                flex-col
                items-center
                justify-center
                rounded-[7px]
                border
                border-[#e5e7eb]
                bg-white
                px-[3px]
                py-[5px]
                text-center
                shadow-[0_2px_6px_rgba(0,0,0,0.05)]
              "
            >
              <div
                className="mb-[3px]"
                style={{
                  color: accent,
                }}
              >
                <Globe size={14} />
              </div>

              <p className="line-clamp-2 text-[7px] font-medium leading-[10px] text-[#374151]">
                {service || "Service"}
              </p>
            </div>
          ),
        )}
      </div>
    </section>
  );
}

/* =========================================================
   SOCIAL LINKS
========================================================= */

function PublicSocialLinks({
  card,
  accent,
}: {
  card: DigitalCardData;
  accent: string;
}) {
  const social = card.socialLinks || {};

  const items = [
    {
      value: social.facebook,
      label: "Facebook",
      content: "f",
      className: "bg-[#1877F2]",
    },
    {
      value: social.instagram,
      label: "Instagram",
      content: "◎",
      className:
        "bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#FCAF45]",
    },
    {
      value: social.linkedin,
      label: "LinkedIn",
      content: "in",
      className: "bg-[#0A66C2]",
    },
    {
      value: social.youtube,
      label: "YouTube",
      content: "▶",
      className: "bg-[#FF0000]",
    },
    {
      value: social.twitter,
      label: "X",
      content: "𝕏",
      className: "bg-black",
    },
    {
      value: social.telegram,
      label: "Telegram",
      content: "➤",
      className: "bg-[#229ED9]",
    },
  ].filter((item) => item.value?.trim());

  if (!items.length) {
    return null;
  }

  return (
    <section className="mt-[13px]">

      <PublicSectionTitle
        icon="⌘"
        title="Connect With Me"
        accent={accent}
      />

      <div className="mt-[7px] flex flex-wrap items-center gap-[11px]">
        {items.map((item) => (
          <a
            key={item.label}
            href={normalizeUrl(item.value)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className={`
              flex
              h-[28px]
              w-[28px]
              items-center
              justify-center
              rounded-full
              ${item.className}
              text-[14px]
              font-bold
              text-white
              shadow-sm
              transition
              hover:scale-110
            `}
          >
            {item.content}
          </a>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   GALLERY
========================================================= */

function PublicGallery({
  card,
  accent,
}: {
  card: DigitalCardData;
  accent: string;
}) {
  const gallery =
    (card.gallery || []) as PublicGalleryItem[];

  if (!gallery.length) {
    return null;
  }

  return (
    <section className="mt-[13px]">

      <div className="flex items-center justify-between">

        <PublicSectionTitle
          icon="▧"
          title="Gallery"
          accent={accent}
        />

        <button
          type="button"
          className="text-[8px] font-semibold"
          style={{
            color: accent,
          }}
        >
          View All →
        </button>
      </div>

      <div className="mt-[6px] grid grid-cols-4 gap-[4px]">
        {gallery.slice(0, 4).map(
          (image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="
                h-[52px]
                overflow-hidden
                rounded-[6px]
                bg-[#f3f4f6]
              "
            >
              {image.url ? (
                <img
                  src={image.url}
                  alt={
                    image.title ||
                    `Gallery ${index + 1}`
                  }
                  className="
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-200
                    hover:scale-105
                  "
                />
              ) : null}
            </div>
          ),
        )}
      </div>
    </section>
  );
}

/* =========================================================
   VIDEOS
========================================================= */

function PublicVideos({
  card,
  accent,
}: {
  card: DigitalCardData;
  accent: string;
}) {
  const extraCard =
    card as DigitalCardData & PublicCardExtraData;

  const videos =
    extraCard.videos ||
    extraCard.businessDetails?.videos ||
    [];

  if (!videos.length) {
    return null;
  }

  return (
    <section className="mt-[13px]">

      <div className="flex items-center justify-between">

        <PublicSectionTitle
          icon="▣"
          title="Videos"
          accent={accent}
        />

        <button
          type="button"
          className="text-[8px] font-semibold"
          style={{
            color: accent,
          }}
        >
          View All →
        </button>
      </div>

      <div className="mt-[6px] grid grid-cols-3 gap-[5px]">
        {videos.slice(0, 3).map(
          (video, index) => (
            <a
              key={`${video.url}-${index}`}
              href={video.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="
                relative
                h-[70px]
                overflow-hidden
                rounded-[7px]
                bg-[#063b88]
              "
            >
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={
                    video.title ||
                    `Video ${index + 1}`
                  }
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${accent}, #063b88)`,
                  }}
                />
              )}

              <div className="absolute inset-0 bg-black/20" />

              <div className="absolute left-[5px] bottom-[5px] right-[5px]">
                <p className="line-clamp-2 text-[7px] font-semibold text-white">
                  {video.title ||
                    `Video ${index + 1}`}
                </p>
              </div>

              <div className="absolute right-[5px] top-[5px] flex h-[21px] w-[21px] items-center justify-center rounded-full bg-black/50 text-[8px] text-white">
                ▶
              </div>

              {video.duration && (
                <span className="absolute bottom-[5px] right-[5px] rounded bg-black/60 px-[3px] py-[1px] text-[6px] text-white">
                  {video.duration}
                </span>
              )}
            </a>
          ),
        )}
      </div>
    </section>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function PublicSectionTitle({
  icon,
  title,
  accent,
}: {
  icon: string;
  title: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-[5px]">
      <span
        className="text-[12px] font-bold"
        style={{
          color: accent,
        }}
      >
        {icon}
      </span>

      <h2
        className="text-[10px] font-bold"
        style={{
          color: accent,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

/* =========================================================
   SAVE TO CONTACTS
========================================================= */

function PublicSaveContact({
  card,
  templateData,
}: {
  card: DigitalCardData;
  templateData: ReturnType<typeof getTemplateData>;
}) {
  return (
    <div
      className="
        absolute
        bottom-0
        left-0
        right-0
        z-30
        bg-white
        px-[14px]
        pb-[12px]
        pt-[8px]
      "
    >
      <button
        type="button"
        onClick={() => downloadVCard(card)}
        className="
          flex
          h-[38px]
          w-full
          items-center
          justify-center
          gap-[5px]
          rounded-[7px]
          text-[10px]
          font-semibold
          text-white
          shadow-sm
        "
        style={{
          background:
            templateData.background,
        }}
      >
        <span className="text-[12px]">
          ↓
        </span>

        Save to Contacts
      </button>
    </div>
  );
}

/* =========================================================
   URL HELPER
========================================================= */

function normalizeUrl(
  url?: string,
) {
  if (!url?.trim()) {
    return undefined;
  }

  const value = url.trim();

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `https://${value}`;
}

/* =========================================================
   WHATSAPP HELPER
========================================================= */

function getWhatsappUrl(
  number?: string,
) {
  if (!number?.trim()) {
    return undefined;
  }

  const cleanNumber =
    number.replace(/\D/g, "");

  if (!cleanNumber) {
    return undefined;
  }

  let finalNumber = cleanNumber;

  /*
   * India number support.
   * If already contains country code,
   * it will not be changed.
   */

  if (
    finalNumber.length === 10
  ) {
    finalNumber = `91${finalNumber}`;
  }

  return `https://wa.me/${finalNumber}`;
}

/* =========================================================
   DOWNLOAD VCARD
========================================================= */

function downloadVCard(
  card: DigitalCardData,
) {
  const name =
    card.fullName ||
    card.companyName ||
    "Digital Contact";

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(name)}`,
  ];

  if (card.companyName) {
    lines.push(
      `ORG:${escapeVCard(card.companyName)}`,
    );
  }

  if (card.designation) {
    lines.push(
      `TITLE:${escapeVCard(card.designation)}`,
    );
  }

  if (card.mobile) {
    lines.push(
      `TEL;TYPE=CELL:${escapeVCard(card.mobile)}`,
    );
  }

  if (card.email) {
    lines.push(
      `EMAIL:${escapeVCard(card.email)}`,
    );
  }

  if (card.website) {
    lines.push(
      `URL:${escapeVCard(card.website)}`,
    );
  }

  if (card.address) {
    lines.push(
      `ADR;TYPE=WORK:;;${escapeVCard(card.address)}`,
    );
  }

  lines.push("END:VCARD");

  const blob = new Blob(
    [lines.join("\r\n")],
    {
      type: "text/vcard;charset=utf-8",
    },
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download =
    `${name.replace(
      /[^a-z0-9]/gi,
      "_",
    )}.vcf`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/* =========================================================
   VCARD ESCAPE
========================================================= */

function escapeVCard(
  value: string,
) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/* =========================================================
   PROFILE HEADER
========================================================= */

function ProfileHeader() {
  const { card } = useDigitalCard();

  return (
    <div className="text-center">
      <div
        className="
          mx-auto
          h-[80px]
          w-[80px]
          overflow-hidden
          rounded-full
          border-[3px]
          border-[#7d4cff]
          bg-[#f1d0b6]
          p-[3px]
        "
      >
        {card.profilePhoto ? (
          <img
            src={card.profilePhoto}
            alt={card.fullName || "Profile"}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#e9cbb5] text-[25px]">
            👤
          </div>
        )}
      </div>

      <h2
        className="
          mt-[8px]
          text-[16px]
          font-semibold
          leading-[25px]
          tracking-[-0.2px]
          text-white
        "
      >
        {card.fullName || "Your Name"}
      </h2>

      <p className="mt-[1px] text-[12px] font-medium text-white/85">
        {card.designation || "Designation"}
      </p>

      <p className="mt-[2px] text-[12px] text-white/75">
        {card.companyName || "Company Name"}
      </p>
    </div>
  );
}

/* =========================================================
   QUICK ACTIONS
========================================================= */

function QuickActions() {
  return (
    <div className="mt-[13px] grid grid-cols-4 items-start gap-[4px]">
      <QuickAction
        icon={<Phone size={16} strokeWidth={2.5} />}
        label="Call"
        background="#34478e"
      />

      <QuickAction
        icon={<MessageCircle size={17} strokeWidth={2.5} />}
        label="WhatsApp"
        background="#13b95c"
      />

      <QuickAction
        icon={<Mail size={16} strokeWidth={2.3} />}
        label="Email"
        background="#6540c8"
      />

      <QuickAction
        icon={<Globe size={16} strokeWidth={2.3} />}
        label="Website"
        background="#1672e9"
      />
    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon,
  label,
  background,
}: {
  icon: React.ReactNode;
  label: string;
  background: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="
          flex
          h-[34px]
          w-[34px]
          items-center
          justify-center
          rounded-full
          text-white
        "
        style={{
          backgroundColor: background,
        }}
      >
        {icon}
      </div>

      <span className="mt-[4px] text-[9px] font-medium text-white/75">
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   ACTION BUTTON
========================================================= */

function ActionPreviewButton({
  icon,
  label,
  background,
}: {
  icon: React.ReactNode;
  label: string;
  background: string;
}) {
  return (
    <div
      className="
        flex
        min-h-[55px]
        flex-col
        items-center
        justify-center
        gap-[4px]
        px-[3px]
        py-[5px]
      "
    >
      <div
        className="
          flex
          h-[32px]
          w-[32px]
          shrink-0
          items-center
          justify-center
          rounded-full
          text-white
        "
        style={{
          backgroundColor: background,
        }}
      >
        {icon}
      </div>

      <p className="max-w-full truncate text-center text-[9px] font-medium text-white/90">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   SOCIAL ICONS
========================================================= */

function SocialIcons({
  socialLinks,
}: {
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    telegram?: string;
    other?: string;
  };
}) {
  const openSocialLink = (url?: string) => {
    if (!url?.trim()) return;

    let finalUrl = url.trim();

    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = `https://${finalUrl}`;
    }

    window.open(finalUrl, "_blank", "noopener,noreferrer");
  };

  const items = [
    {
      value: socialLinks?.facebook,
      label: "Facebook",
      className: "bg-[#1877F2]",
      content: <span className="text-[20px] font-bold leading-none">f</span>,
    },
    {
      value: socialLinks?.instagram,
      label: "Instagram",
      className: "bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#FCAF45]",
      content: <span className="text-[20px] leading-none">◎</span>,
    },
    {
      value: socialLinks?.linkedin,
      label: "LinkedIn",
      className: "bg-[#0A66C2]",
      content: <span className="text-[18px] font-bold leading-none">in</span>,
    },
    {
      value: socialLinks?.youtube,
      label: "YouTube",
      className: "bg-[#FF0000]",
      content: <span className="text-[18px] leading-none">▶</span>,
    },
    {
      value: socialLinks?.twitter,
      label: "X",
      className: "bg-black",
      content: (
        <span className="text-[20px] font-semibold leading-none">𝕏</span>
      ),
    },
    {
      value: socialLinks?.telegram,
      label: "Telegram",
      className: "bg-[#229ED9]",
      content: <Send size={17} fill="white" strokeWidth={2} />,
    },
  ];

  const visibleItems = items.filter((item) => item.value?.trim());

  if (visibleItems.length === 0) {
    return <EmptyMessage>Add your social links to see them here.</EmptyMessage>;
  }

  return (
    <div className="mt-[9px] flex flex-wrap items-center gap-[10px]">
      {visibleItems.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => openSocialLink(item.value)}
          aria-label={item.label}
          className={`
            flex
            h-[35px]
            w-[35px]
            shrink-0
            items-center
            justify-center
            rounded-full
            ${item.className}
            text-white
            shadow-md
            transition
            duration-200
            hover:scale-110
            hover:shadow-lg
            active:scale-95
          `}
        >
          {item.content}
        </button>
      ))}
    </div>
  );
}

/* =========================================================
   WORKING HOURS
========================================================= */

function WorkingHourRow({
  day,
  from,
  to,
}: {
  day: string;
  from: string;
  to: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-md bg-white/[0.06] px-[9px] py-[8px]">
      <span className="text-[10px] font-medium text-white/70">{day}</span>

      <span className="text-[10px] font-medium text-white/90">
        {from}

        <span className="mx-[4px] text-white/40">-</span>

        {to}
      </span>
    </div>
  );
}

/* =========================================================
   CONTACT ROW
========================================================= */

function ContactRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-[8px] rounded-md bg-white/[0.07] px-[8px] py-[7px]">
      <div
        className="
          flex
          h-[28px]
          w-[28px]
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#6737E8]
          text-white
        "
      >
        {icon}
      </div>

      <span className="min-w-0 break-all text-[10.5px] leading-[14px] text-white/90">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   EMPTY MESSAGE
========================================================= */

function EmptyMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-[10px] rounded-md bg-white/[0.05] px-[10px] py-[12px] text-center">
      <p className="text-[10px] leading-[15px] text-white/50">{children}</p>
    </div>
  );
}

/* =========================================================
   SAVE CONTACT
========================================================= */

function SaveButton({
  background,
  buttonBackground,
  buttonText,
}: {
  background: string;
  buttonBackground: string;
  buttonText: string;
}) {
  return (
    <div
      className="
        absolute
        bottom-0
        left-0
        right-0
         px-[22px]
        pb-[18px]
        pt-[12px]
       
      "
      style={{
        /*
         * IMPORTANT:
         * This was previously hard-coded as:
         *
         * bg-[#171636]/95
         *
         * Now the selected template background
         * continues behind Save Contact.
         */
        background: background,
      }}
    >
      <button
        type="button"
        className="
          h-[37px]
          w-full
          rounded-[5px]
          text-[12px]
          font-semibold
          
         
        "
        style={{
          backgroundColor: buttonBackground,
          color: buttonText,
        }}
      >
        Save Contact
      </button>
    </div>
  );
}
