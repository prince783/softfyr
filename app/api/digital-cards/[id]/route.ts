import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/app/lib/db";
import DigitalCard from "@/app/models/DigitalCard";

export const runtime = "nodejs";

/* =========================================================
   TYPES
========================================================= */

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/* =========================================================
   HELPERS
========================================================= */

function isObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

/* =========================================================
   GET
========================================================= */

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid card ID",
        },
        { status: 400 }
      );
    }

    const card = await DigitalCard.findById(id).lean();

    if (!card) {
      return NextResponse.json(
        {
          success: false,
          message: "Digital card not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      card,
    });
  } catch (error) {
    console.error("GET DIGITAL CARD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch digital card",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   PATCH
========================================================= */

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    /* =====================================================
       VALIDATE ID
    ===================================================== */

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid card ID",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       BODY
    ===================================================== */

    const body = await request.json();

    if (!isObject(body)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       FIND CARD FIRST
       
       We use findById + save instead of relying only on
       findByIdAndUpdate. This makes nested arrays such as
       gallery/certificates much safer.
    ===================================================== */

    const card = await DigitalCard.findById(id);

    if (!card) {
      return NextResponse.json(
        {
          success: false,
          message: "Digital card not found",
        },
        { status: 404 }
      );
    }

    /* =====================================================
       BASIC FIELDS
    ===================================================== */

    const basicFields = [
      "userId",

      "fullName",
      "companyName",
      "designation",
      "profilePhoto",

      "tagline",
      "aboutCompany",

      "mobile",
      "whatsapp",
      "email",
      "website",
      "address",
      "googleMapLink",

      "backgroundColor",
    ];

    for (const field of basicFields) {
      if (
        Object.prototype.hasOwnProperty.call(
          body,
          field
        )
      ) {
        (card as any)[field] = body[field];
      }
    }

    /* =====================================================
       BUSINESS DETAILS
    ===================================================== */

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "businessDetails"
      )
    ) {
      if (!isObject(body.businessDetails)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid businessDetails data",
          },
          { status: 400 }
        );
      }

      card.businessDetails = {
        ...(card.businessDetails || {}),
        ...(body.businessDetails as any),

        workingHours: {
          ...(card.businessDetails?.workingHours || {}),
          ...((body.businessDetails as any)
            .workingHours || {}),
        },
      } as any;
    }

    /* =====================================================
       SOCIAL LINKS
    ===================================================== */

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "socialLinks"
      )
    ) {
      if (!isObject(body.socialLinks)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid socialLinks data",
          },
          { status: 400 }
        );
      }

      card.socialLinks = {
        ...(card.socialLinks || {}),
        ...(body.socialLinks as any),
      } as any;
    }

    /* =====================================================
       GALLERY
       
       Expected:
       
       gallery: [
         {
           url: "/uploads/gallery/abc.jpg",
           publicId: "...",
           name: "abc.jpg"
         }
       ]
    ===================================================== */

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "gallery"
      )
    ) {
      if (!Array.isArray(body.gallery)) {
        return NextResponse.json(
          {
            success: false,
            message: "Gallery must be an array",
          },
          { status: 400 }
        );
      }

      if (body.gallery.length > 12) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You can upload up to 12 gallery images",
          },
          { status: 400 }
        );
      }

      const gallery = [];

      for (const image of body.gallery) {
        if (!isObject(image)) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid gallery image",
            },
            { status: 400 }
          );
        }

        if (
          typeof image.url !== "string" ||
          image.url.trim() === ""
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Gallery image URL is required",
            },
            { status: 400 }
          );
        }

        gallery.push({
          url: image.url,
          publicId:
            typeof image.publicId === "string"
              ? image.publicId
              : "",
          name:
            typeof image.name === "string"
              ? image.name
              : "",
        });
      }

      /*
       * IMPORTANT:
       * Replace the entire gallery with the latest
       * frontend gallery.
       */

      card.gallery = gallery as any;

      console.log(
        "GALLERY SAVING:",
        card.gallery
      );
    }

    /* =====================================================
       VIDEOS
    ===================================================== */

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "videos"
      )
    ) {
      if (!Array.isArray(body.videos)) {
        return NextResponse.json(
          {
            success: false,
            message: "Videos must be an array",
          },
          { status: 400 }
        );
      }

      const videos = [];

      for (const video of body.videos) {
        if (!isObject(video)) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid video data",
            },
            { status: 400 }
          );
        }

        if (
          typeof video.url !== "string" ||
          video.url.trim() === ""
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "Video URL is required",
            },
            { status: 400 }
          );
        }

        if (
          video.platform !== "youtube" &&
          video.platform !== "vimeo"
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Video platform must be youtube or vimeo",
            },
            { status: 400 }
          );
        }

        videos.push({
          url: video.url,
          platform: video.platform,
        });
      }

      card.videos = videos as any;
    }

    /* =====================================================
       CERTIFICATES / PDF
       
       Expected:
       
       certificates: [
         {
           id: "...",
           name: "certificate.pdf",
           size: 123456,
           url: "/uploads/certificates/abc.pdf",
           publicId: "..."
         }
       ]
    ===================================================== */

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "certificates"
      )
    ) {
      if (!Array.isArray(body.certificates)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Certificates must be an array",
          },
          { status: 400 }
        );
      }

      if (body.certificates.length > 10) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You can upload up to 10 certificates",
          },
          { status: 400 }
        );
      }

      const certificates = [];

      for (const certificate of body.certificates) {
        if (!isObject(certificate)) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Invalid certificate data",
            },
            { status: 400 }
          );
        }

        if (
          typeof certificate.url !== "string" ||
          certificate.url.trim() === ""
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Certificate PDF URL is required",
            },
            { status: 400 }
          );
        }

        if (
          typeof certificate.name !== "string"
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Certificate name is required",
            },
            { status: 400 }
          );
        }

        certificates.push({
          url: certificate.url,

          publicId:
            typeof certificate.publicId === "string"
              ? certificate.publicId
              : "",

          name: certificate.name,

          size:
            typeof certificate.size === "number"
              ? certificate.size
              : 0,
        });
      }

      /*
       * IMPORTANT:
       * Save the complete PDF array.
       */

      card.certificates = certificates as any;

      console.log(
        "CERTIFICATES SAVING:",
        card.certificates
      );
    }

    /* =====================================================
       SAVE MONGOOSE DOCUMENT
    ===================================================== */

    await card.save();

    /* =====================================================
       RETURN FRESH CARD FROM DATABASE
    ===================================================== */

    const savedCard =
      await DigitalCard.findById(id).lean();

    console.log(
      "SAVED GALLERY:",
      savedCard?.gallery
    );

    console.log(
      "SAVED CERTIFICATES:",
      savedCard?.certificates
    );

    return NextResponse.json({
      success: true,
      message:
        "Digital card updated successfully",
      card: savedCard,
    });
  } catch (error) {
    console.error(
      "UPDATE DIGITAL CARD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update digital card",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   DELETE
========================================================= */

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid card ID",
        },
        { status: 400 }
      );
    }

    const card =
      await DigitalCard.findByIdAndDelete(id);

    if (!card) {
      return NextResponse.json(
        {
          success: false,
          message: "Digital card not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Digital card deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE DIGITAL CARD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete digital card",
      },
      { status: 500 }
    );
  }
}