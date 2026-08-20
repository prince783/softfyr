"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from "react";

/* =========================================================
   TYPES
========================================================= */

export interface WorkingHour {
  from: string;
  to: string;
}

export interface WorkingHours {
  weekday: WorkingHour;
  weekend: WorkingHour;
}

export interface BusinessDetails {
  businessName: string;
  businessType: string;
  gstNumber: string;
  description: string;

  companyLogo: string;
  coverBanner: string;

  services: string[];

  workingHours: WorkingHours;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;
  telegram: string;
  other: string;
}

/* =========================================================
   GALLERY TYPES
========================================================= */

export interface GalleryImage {
  url: string;
  publicId?: string;
  name?: string;
}

export interface GalleryVideo {
  id: string;
  url: string;
  platform: "youtube" | "vimeo";
}

export interface GalleryCertificate {
  id: string;
  name: string;
  size: number;
  url: string;
  publicId?: string;
}

/* =========================================================
   DIGITAL CARD
========================================================= */

export interface DigitalCardData {
  _id?: string;

  userId?: string | null;

  /*
   * PUBLIC USERNAME
   *
   * Example:
   * /digitalvisitingcard/prince123
   */
  username: string;

  /*
   * SELECTED TEMPLATE
   */
  templateId: string;

  /* =====================================================
     BASIC DETAILS
  ===================================================== */

  fullName: string;
  companyName: string;
  designation: string;
  profilePhoto: string;

  tagline: string;
  aboutCompany: string;

  /* =====================================================
     CONTACT DETAILS
  ===================================================== */

  mobile: string;
  whatsapp: string;
  email: string;
  website: string;
  address: string;
  googleMapLink: string;

  /* =====================================================
     BUSINESS
  ===================================================== */

  businessDetails: BusinessDetails;

  /* =====================================================
     SOCIAL
  ===================================================== */

  socialLinks: SocialLinks;

  /* =====================================================
     GALLERY
  ===================================================== */

  gallery: GalleryImage[];

  videos: GalleryVideo[];

  certificates: GalleryCertificate[];

  /* =====================================================
     DESIGN
  ===================================================== */

  backgroundColor: string;

  /* =====================================================
     ACTION SETTINGS
  ===================================================== */

  showCall: boolean;
  showWhatsapp: boolean;
  showEmail: boolean;
  showWebsite: boolean;
  showLocation: boolean;
  showCustomButton: boolean;

  customButtonLabel: string;
  customButtonLink: string;

  /*
   * Old compatibility field
   */
  cardLink: string;

  /* =====================================================
     SEO
  ===================================================== */

  seoVisible: boolean;

  /* =====================================================
     PASSWORD
  ===================================================== */

  passwordProtection: boolean;
  cardPassword: string;

  /* =====================================================
     PUBLICATION
  ===================================================== */

  isPublished?: boolean;
}

/* =========================================================
   EMPTY CARD
========================================================= */

export const emptyCard: DigitalCardData = {
  _id: undefined,

  userId: null,

  /*
   * IMPORTANT
   * USERNAME MUST EXIST HERE
   */
  username: "",

  /*
   * DEFAULT TEMPLATE
   */
  templateId: "template-1",

  /* BASIC DETAILS */

  fullName: "",
  companyName: "",
  designation: "",
  profilePhoto: "",

  tagline: "",
  aboutCompany: "",

  /* CONTACT */

  mobile: "",
  whatsapp: "",
  email: "",
  website: "",
  address: "",
  googleMapLink: "",

  /* BUSINESS */

  businessDetails: {
    businessName: "",
    businessType: "",
    gstNumber: "",
    description: "",

    companyLogo: "",
    coverBanner: "",

    services: [],

    workingHours: {
      weekday: {
        from: "09:00 AM",
        to: "07:00 PM",
      },

      weekend: {
        from: "10:00 AM",
        to: "04:00 PM",
      },
    },
  },

  /* SOCIAL */

  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    youtube: "",
    telegram: "",
    other: "",
  },

  /* MEDIA */

  gallery: [],

  videos: [],

  certificates: [],

  /* DESIGN */

  backgroundColor: "#17142E",

  /* ACTION SETTINGS */

  showCall: true,
  showWhatsapp: true,
  showEmail: true,
  showWebsite: true,
  showLocation: true,
  showCustomButton: false,

  customButtonLabel: "",
  customButtonLink: "",

  cardLink: "",

  /* SEO */

  seoVisible: true,

  /* PASSWORD */

  passwordProtection: false,
  cardPassword: "",

  /* PUBLICATION */

  isPublished: false,
};

/* =========================================================
   CONTEXT TYPE
========================================================= */

interface DigitalCardContextType {
  card: DigitalCardData;

  updateCard: <K extends keyof DigitalCardData>(
    key: K,
    value: DigitalCardData[K]
  ) => Promise<void>;

  saveCard: () => Promise<void>;

  loading: boolean;

  saving: boolean;

  cardId: string | null;
}

/* =========================================================
   CONTEXT
========================================================= */

const DigitalCardContext =
  createContext<DigitalCardContextType | undefined>(
    undefined
  );

/* =========================================================
   NORMALIZE GALLERY
========================================================= */

function normalizeGallery(
  gallery: unknown
): GalleryImage[] {
  if (!Array.isArray(gallery)) {
    return [];
  }

  return gallery
    .map((item) => {
      if (typeof item === "string") {
        return {
          url: item,
        };
      }

      if (
        item &&
        typeof item === "object" &&
        typeof (item as GalleryImage).url ===
          "string"
      ) {
        const image =
          item as GalleryImage;

        return {
          url: image.url,

          ...(typeof image.publicId ===
          "string"
            ? {
                publicId:
                  image.publicId,
              }
            : {}),

          ...(typeof image.name ===
          "string"
            ? {
                name: image.name,
              }
            : {}),
        };
      }

      return null;
    })
    .filter(
      (
        item
      ): item is GalleryImage =>
        item !== null &&
        typeof item.url === "string" &&
        item.url.trim().length > 0
    );
}

/* =========================================================
   NORMALIZE VIDEOS
========================================================= */

function normalizeVideos(
  videos: unknown
): GalleryVideo[] {
  if (!Array.isArray(videos)) {
    return [];
  }

  return videos
    .map((video) => {
      if (
        !video ||
        typeof video !== "object"
      ) {
        return null;
      }

      const item =
        video as Partial<GalleryVideo>;

      return {
        id:
          typeof item.id === "string"
            ? item.id
            : crypto.randomUUID(),

        url:
          typeof item.url === "string"
            ? item.url
            : "",

        platform:
          item.platform === "vimeo"
            ? "vimeo"
            : "youtube",
      };
    })
    .filter(
      (
        video
      ): video is GalleryVideo =>
        Boolean(video) &&
        video.url.trim().length > 0
    );
}

/* =========================================================
   NORMALIZE CERTIFICATES
========================================================= */

function normalizeCertificates(
  certificates: unknown
): GalleryCertificate[] {
  if (!Array.isArray(certificates)) {
    return [];
  }

  return certificates
    .map((certificate) => {
      if (
        !certificate ||
        typeof certificate !== "object"
      ) {
        return null;
      }

      const item =
        certificate as Partial<GalleryCertificate>;

      return {
        id:
          typeof item.id === "string"
            ? item.id
            : crypto.randomUUID(),

        name:
          typeof item.name === "string"
            ? item.name
            : "",

        size:
          typeof item.size === "number"
            ? item.size
            : 0,

        url:
          typeof item.url === "string"
            ? item.url
            : "",

        ...(typeof item.publicId ===
        "string"
          ? {
              publicId:
                item.publicId,
            }
          : {}),
      };
    })
    .filter(
      (
        certificate
      ): certificate is GalleryCertificate =>
        Boolean(certificate) &&
        certificate.url.trim().length > 0
    );
}

/* =========================================================
   NORMALIZE USERNAME
========================================================= */

function normalizeUsername(
  value: unknown
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 30);
}

/* =========================================================
   NORMALIZE CARD
========================================================= */

function normalizeCard(
  data?: Partial<DigitalCardData> | null
): DigitalCardData {
  const source = data || {};

  return {
    ...emptyCard,

    ...source,

    /*
     * IMPORTANT:
     * Preserve username from API / ActionSettings
     */
    username: normalizeUsername(
      source.username
    ),

    /*
     * ALWAYS KEEP VALID TEMPLATE
     */
    templateId:
      typeof source.templateId === "string" &&
      source.templateId.trim()
        ? source.templateId
        : emptyCard.templateId,

    /* BUSINESS DETAILS */

    businessDetails: {
      ...emptyCard.businessDetails,

      ...(source.businessDetails || {}),

      services:
        Array.isArray(
          source.businessDetails?.services
        )
          ? source.businessDetails.services
          : emptyCard.businessDetails.services,

      workingHours: {
        ...emptyCard.businessDetails
          .workingHours,

        ...(source.businessDetails
          ?.workingHours || {}),

        weekday: {
          ...emptyCard.businessDetails
            .workingHours.weekday,

          ...(source.businessDetails
            ?.workingHours?.weekday || {}),
        },

        weekend: {
          ...emptyCard.businessDetails
            .workingHours.weekend,

          ...(source.businessDetails
            ?.workingHours?.weekend || {}),
        },
      },
    },

    /* SOCIAL LINKS */

    socialLinks: {
      ...emptyCard.socialLinks,

      ...(source.socialLinks || {}),
    },

    /* GALLERY */

    gallery: normalizeGallery(
      source.gallery
    ),

    /* VIDEOS */

    videos: normalizeVideos(
      source.videos
    ),

    /* CERTIFICATES */

    certificates:
      normalizeCertificates(
        source.certificates
      ),
  };
}

/* =========================================================
   PROVIDER
========================================================= */

export function DigitalCardProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [card, setCard] =
    useState<DigitalCardData>(
      normalizeCard(emptyCard)
    );

  const [cardId, setCardId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const creatingCardRef =
    useRef<Promise<string> | null>(
      null
    );

  /* =====================================================
     LOAD CARD
  ===================================================== */

  const loadCard = useCallback(
    async () => {
      try {
        setLoading(true);

        const savedCardId =
          localStorage.getItem(
            "digitalCardId"
          );

        if (!savedCardId) {
          setCard(
            normalizeCard(emptyCard)
          );

          setCardId(null);

          return;
        }

        setCardId(savedCardId);

        const response =
          await fetch(
            `/api/digital-cards/${savedCardId}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          localStorage.removeItem(
            "digitalCardId"
          );

          setCardId(null);

          setCard(
            normalizeCard(emptyCard)
          );

          return;
        }

        if (
          data.success &&
          data.card
        ) {
          setCard(
            normalizeCard(
              data.card
            )
          );
        }
      } catch (error) {
        console.error(
          "LOAD CARD ERROR:",
          error
        );

        setCard(
          normalizeCard(emptyCard)
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  /* =====================================================
     CREATE CARD
  ===================================================== */

  const createCard =
    useCallback(
      async (
        initialData: Partial<DigitalCardData>
      ): Promise<string> => {
        if (
          creatingCardRef.current
        ) {
          return creatingCardRef.current;
        }

        const createPromise =
          (async () => {
            try {
              setSaving(true);

              const newCard =
                normalizeCard(
                  initialData
                );

              /*
               * DEBUG
               * Check browser console
               */
              console.log(
                "CREATING CARD WITH USERNAME:",
                newCard.username
              );

              const response =
                await fetch(
                  "/api/digital-cards",
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    /*
                     * username is included here
                     */
                    body: JSON.stringify(
                      newCard
                    ),
                  }
                );

              const data =
                await response.json();

              if (!response.ok) {
                throw new Error(
                  data.message ||
                    "Failed to create card"
                );
              }

              if (
                !data.card?._id
              ) {
                throw new Error(
                  "Card ID was not returned"
                );
              }

              const newId =
                String(
                  data.card._id
                );

              localStorage.setItem(
                "digitalCardId",
                newId
              );

              setCardId(newId);

              setCard(
                normalizeCard(
                  data.card
                )
              );

              return newId;
            } catch (error) {
              console.error(
                "CREATE CARD ERROR:",
                error
              );

              throw error;
            } finally {
              setSaving(false);
            }
          })();

        creatingCardRef.current =
          createPromise;

        try {
          return await createPromise;
        } finally {
          creatingCardRef.current =
            null;
        }
      },
      []
    );

  /* =====================================================
     UPDATE CARD
  ===================================================== */

  const updateCard =
    useCallback(
      async <
        K extends keyof DigitalCardData
      >(
        key: K,
        value: DigitalCardData[K]
      ) => {
        const nextCard =
          normalizeCard({
            ...card,
            [key]: value,
          });

        /*
         * IMMEDIATELY UPDATE UI
         */
        setCard(nextCard);

        try {
          setSaving(true);

          /*
           * CREATE FIRST CARD
           */
          if (!cardId) {
            await createCard(
              nextCard
            );

            return;
          }

          /*
           * UPDATE ONLY CHANGED FIELD
           */
          const response =
            await fetch(
              `/api/digital-cards/${cardId}`,
              {
                method: "PATCH",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  [key]:
                    nextCard[key],
                }),
              }
            );

          const data =
            await response.json();

          console.log(
            "PATCH STATUS:",
            response.status
          );

          console.log(
            "PATCH RESPONSE:",
            data
          );

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to save card"
            );
          }

          /*
           * UPDATE LOCAL STATE WITH
           * SERVER RESPONSE
           */
          if (data.card) {
            setCard(
              normalizeCard(
                data.card
              )
            );
          }
        } catch (error) {
          console.error(
            "UPDATE CARD ERROR:",
            error
          );
        } finally {
          setSaving(false);
        }
      },
      [
        card,
        cardId,
        createCard,
      ]
    );

  /* =====================================================
     MANUAL SAVE
  ===================================================== */

  const saveCard =
    useCallback(
      async () => {
        try {
          setSaving(true);

          const normalizedCard =
            normalizeCard(card);

          console.log(
            "SAVING CARD:",
            normalizedCard
          );

          console.log(
            "SAVING USERNAME:",
            normalizedCard.username
          );

          if (!cardId) {
            await createCard(
              normalizedCard
            );

            return;
          }

          const response =
            await fetch(
              `/api/digital-cards/${cardId}`,
              {
                method: "PATCH",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                /*
                 * SEND COMPLETE CARD
                 */
                body: JSON.stringify(
                  normalizedCard
                ),
              }
            );

          const data =
            await response.json();

          console.log(
            "SAVE STATUS:",
            response.status
          );

          console.log(
            "SAVE RESPONSE:",
            data
          );

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to save card"
            );
          }

          if (data.card) {
            setCard(
              normalizeCard(
                data.card
              )
            );
          }
        } catch (error) {
          console.error(
            "SAVE CARD ERROR:",
            error
          );

          throw error;
        } finally {
          setSaving(false);
        }
      },
      [
        card,
        cardId,
        createCard,
      ]
    );

  /* =====================================================
     PROVIDER
  ===================================================== */

  return (
    <DigitalCardContext.Provider
      value={{
        card,
        updateCard,
        saveCard,
        loading,
        saving,
        cardId,
      }}
    >
      {children}
    </DigitalCardContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useDigitalCard() {
  const context =
    useContext(
      DigitalCardContext
    );

  if (!context) {
    throw new Error(
      "useDigitalCard must be used inside DigitalCardProvider"
    );
  }

  return context;
}