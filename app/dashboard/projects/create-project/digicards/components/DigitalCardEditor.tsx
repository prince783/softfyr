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

  /*
   * IMPORTANT:
   * Selected template is now stored inside card state.
   */
  templateId: string;

  fullName: string;
  companyName: string;
  designation: string;
  profilePhoto: string;

  tagline: string;
  aboutCompany: string;

  mobile: string;
  whatsapp: string;
  email: string;
  website: string;
  address: string;
  googleMapLink: string;

  businessDetails: BusinessDetails;

  socialLinks: SocialLinks;

  gallery: GalleryImage[];

  videos: GalleryVideo[];

  certificates: GalleryCertificate[];

  backgroundColor: string;

  /*
   * These fields are already being used by
   * LivePreview / ActionSettingsPreview.
   */
  showCall?: boolean;
  showWhatsapp?: boolean;
  showEmail?: boolean;
  showWebsite?: boolean;
  showLocation?: boolean;
  showCustomButton?: boolean;

  customButtonLabel?: string;
  cardLink?: string;
}

/* =========================================================
   EMPTY CARD
========================================================= */

export const emptyCard: DigitalCardData = {
  _id: undefined,

  /*
   * DEFAULT TEMPLATE
   *
   * Change this only if your first template
   * has a different ID.
   */
  templateId: "template-1",

  fullName: "",
  companyName: "",
  designation: "",
  profilePhoto: "",

  tagline: "",
  aboutCompany: "",

  mobile: "",
  whatsapp: "",
  email: "",
  website: "",
  address: "",
  googleMapLink: "",

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

  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    youtube: "",
    telegram: "",
    other: "",
  },

  gallery: [],

  videos: [],

  certificates: [],

  backgroundColor: "#17142E",

  showCall: true,
  showWhatsapp: true,
  showEmail: true,
  showWebsite: true,
  showLocation: true,
  showCustomButton: false,

  customButtonLabel: "",
  cardLink: "",
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
        typeof (item as any).url === "string"
      ) {
        const image = item as any;

        return {
          url: image.url,

          ...(typeof image.publicId === "string"
            ? {
                publicId: image.publicId,
              }
            : {}),

          ...(typeof image.name === "string"
            ? {
                name: image.name,
              }
            : {}),
        };
      }

      return null;
    })
   .filter(
  (item): item is GalleryImage =>
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

      const item = video as any;

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
      (video): video is GalleryVideo =>
        Boolean(video)
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

      const item = certificate as any;

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
            : typeof item.file === "string"
              ? item.file
              : "",

        ...(typeof item.publicId === "string"
          ? {
              publicId: item.publicId,
            }
          : {}),
      };
    })
    .filter(
      (
        certificate
      ): certificate is GalleryCertificate =>
        Boolean(certificate) &&
        typeof certificate?.url === "string" &&
        certificate.url.trim().length > 0
    );
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
     * Always keep a valid template.
     */
    templateId:
      typeof source.templateId === "string" &&
      source.templateId.trim()
        ? source.templateId
        : emptyCard.templateId,

    /* =====================================================
       BUSINESS DETAILS
    ===================================================== */

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

    /* =====================================================
       SOCIAL LINKS
    ===================================================== */

    socialLinks: {
      ...emptyCard.socialLinks,

      ...(source.socialLinks || {}),
    },

    /* =====================================================
       GALLERY
    ===================================================== */

    gallery: normalizeGallery(
      source.gallery
    ),

    /* =====================================================
       VIDEOS
    ===================================================== */

    videos: normalizeVideos(
      source.videos
    ),

    /* =====================================================
       CERTIFICATES
    ===================================================== */

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

              const response =
                await fetch(
                  "/api/digital-cards",
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body:
                      JSON.stringify(
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
        const currentCard =
          card;

        const nextCard =
          normalizeCard({
            ...currentCard,

            [key]: value,
          });

        /*
         * IMPORTANT:
         *
         * This immediately updates React state.
         *
         * Therefore:
         *
         * updateCard("templateId", "template-2")
         *
         * immediately causes LivePreview to render
         * template-2.
         */
        setCard(nextCard);

        try {
          setSaving(true);

          if (!cardId) {
            await createCard(
              nextCard
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

                body:
                  JSON.stringify({
                    [key]: value,
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

          if (!cardId) {
            await createCard(
              card
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

                body:
                  JSON.stringify(
                    card
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