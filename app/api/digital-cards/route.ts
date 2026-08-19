import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/app/lib/db";
import DigitalCard from "@/app/models/DigitalCard";

export const runtime = "nodejs";

/* =========================================================
   TYPES
========================================================= */

interface GalleryItem {
  url: string;
  publicId?: string;
  name?: string;
}

interface VideoItem {
  url: string;
  platform: "youtube" | "vimeo";
}

interface CertificateItem {
  url: string;
  publicId?: string;
  name: string;
  size: number;
}

/* =========================================================
   DEFAULT BUSINESS DETAILS
========================================================= */

const defaultBusinessDetails = {
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
};

/* =========================================================
   DEFAULT SOCIAL LINKS
========================================================= */

const defaultSocialLinks = {
  facebook: "",
  instagram: "",
  linkedin: "",
  twitter: "",
  youtube: "",
  telegram: "",
  other: "",
};

/* =========================================================
   NORMALIZE GALLERY
========================================================= */

function normalizeGallery(
  gallery: unknown
): GalleryItem[] {
  if (!Array.isArray(gallery)) {
    return [];
  }

  return gallery
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) &&
        typeof item === "object" &&
        !Array.isArray(item)
    )
    .map((item) => ({
      url:
        typeof item.url === "string"
          ? item.url
          : "",

      publicId:
        typeof item.publicId === "string"
          ? item.publicId
          : "",

      name:
        typeof item.name === "string"
          ? item.name
          : "",
    }))
    .filter(
      (item) => item.url.trim().length > 0
    );
}

/* =========================================================
   NORMALIZE VIDEOS
========================================================= */

function normalizeVideos(
  videos: unknown
): VideoItem[] {
  if (!Array.isArray(videos)) {
    return [];
  }

  return videos
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) &&
        typeof item === "object" &&
        !Array.isArray(item)
    )
    .map((item) => ({
      url:
        typeof item.url === "string"
          ? item.url
          : "",

      platform:
        item.platform === "vimeo"
          ? "vimeo"
          : "youtube",
    }))
    .filter(
      (item) => item.url.trim().length > 0
    );
}

/* =========================================================
   NORMALIZE CERTIFICATES
========================================================= */

function normalizeCertificates(
  certificates: unknown
): CertificateItem[] {
  if (!Array.isArray(certificates)) {
    return [];
  }

  return certificates
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) &&
        typeof item === "object" &&
        !Array.isArray(item)
    )
    .map((item) => ({
      url:
        typeof item.url === "string"
          ? item.url
          : "",

      publicId:
        typeof item.publicId === "string"
          ? item.publicId
          : "",

      name:
        typeof item.name === "string"
          ? item.name
          : "",

      size:
        typeof item.size === "number"
          ? item.size
          : 0,
    }))
    .filter(
      (item) =>
        item.url.trim().length > 0 &&
        item.name.trim().length > 0
    );
}

/* =========================================================
   POST
   CREATE DIGITAL CARD
========================================================= */

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body = await request.json();

    /* =====================================================
       VALIDATE BODY
    ===================================================== */

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       BUSINESS DETAILS
    ===================================================== */

    const businessDetails = {
      ...defaultBusinessDetails,

      ...(body.businessDetails || {}),

      workingHours: {
        ...defaultBusinessDetails.workingHours,

        ...(body.businessDetails?.workingHours || {}),

        weekday: {
          ...defaultBusinessDetails.workingHours.weekday,

          ...(body.businessDetails?.workingHours
            ?.weekday || {}),
        },

        weekend: {
          ...defaultBusinessDetails.workingHours.weekend,

          ...(body.businessDetails?.workingHours
            ?.weekend || {}),
        },
      },

      services:
        Array.isArray(
          body.businessDetails?.services
        )
          ? body.businessDetails.services.filter(
              (service: unknown) =>
                typeof service === "string"
            )
          : [],
    };

    /* =====================================================
       SOCIAL LINKS
    ===================================================== */

    const socialLinks = {
      ...defaultSocialLinks,

      ...(body.socialLinks || {}),
    };

    /* =====================================================
       GALLERY
    ===================================================== */

    const gallery =
      normalizeGallery(body.gallery);

    /* =====================================================
       MAX 12 GALLERY IMAGES
    ===================================================== */

    if (gallery.length > 12) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You can upload up to 12 gallery images",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       VIDEOS
    ===================================================== */

    const videos =
      normalizeVideos(body.videos);

    /* =====================================================
       CERTIFICATES
    ===================================================== */

    const certificates =
      normalizeCertificates(
        body.certificates
      );

    /* =====================================================
       CREATE DIGITAL CARD
    ===================================================== */

    const card =
      await DigitalCard.create({
        /* USER */

        userId:
          typeof body.userId === "string"
            ? body.userId
            : null,

        /* BASIC */

        fullName:
          typeof body.fullName === "string"
            ? body.fullName
            : "",

        companyName:
          typeof body.companyName === "string"
            ? body.companyName
            : "",

        designation:
          typeof body.designation === "string"
            ? body.designation
            : "",

        profilePhoto:
          typeof body.profilePhoto === "string"
            ? body.profilePhoto
            : "",

        tagline:
          typeof body.tagline === "string"
            ? body.tagline
            : "",

        aboutCompany:
          typeof body.aboutCompany === "string"
            ? body.aboutCompany
            : "",

        /* CONTACT */

        mobile:
          typeof body.mobile === "string"
            ? body.mobile
            : "",

        whatsapp:
          typeof body.whatsapp === "string"
            ? body.whatsapp
            : "",

        email:
          typeof body.email === "string"
            ? body.email
            : "",

        website:
          typeof body.website === "string"
            ? body.website
            : "",

        address:
          typeof body.address === "string"
            ? body.address
            : "",

        googleMapLink:
          typeof body.googleMapLink === "string"
            ? body.googleMapLink
            : "",

        /* BUSINESS */

        businessDetails,

        /* SOCIAL */

        socialLinks,

        /* =================================================
           GALLERY
        ================================================= */

        gallery,

        /* =================================================
           VIDEOS
        ================================================= */

        videos,

        /* =================================================
           CERTIFICATES
        ================================================= */

        certificates,

        /* DESIGN */

        backgroundColor:
          typeof body.backgroundColor === "string" &&
          body.backgroundColor.trim()
            ? body.backgroundColor
            : "#17142E",
      });

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        success: true,
        message:
          "Digital card created successfully",
        card,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE DIGITAL CARD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create digital card",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   GET
   GET DIGITAL CARDS
========================================================= */

export async function GET(
  request: NextRequest
) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const userId =
      searchParams.get("userId");

    /* =====================================================
       GET USER CARDS
    ===================================================== */

    if (userId) {
      const cards =
        await DigitalCard.find({
          userId,
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      return NextResponse.json({
        success: true,
        cards,
      });
    }

    /* =====================================================
       GET ALL CARDS
    ===================================================== */

    const cards =
      await DigitalCard.find()
        .sort({
          createdAt: -1,
        })
        .limit(50)
        .lean();

    return NextResponse.json({
      success: true,
      cards,
    });
  } catch (error) {
    console.error(
      "GET DIGITAL CARDS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch digital cards",
      },
      {
        status: 500,
      }
    );
  }
}