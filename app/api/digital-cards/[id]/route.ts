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

function isObject(
  value: unknown
): value is Record<string, unknown> {
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
       REQUEST BODY
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
       FIND CARD
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
       USERNAME
    ===================================================== */

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "username"
      )
    ) {
      if (
        typeof body.username !== "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Username must be a string",
          },
          { status: 400 }
        );
      }

      const username = body.username
        .trim()
        .toLowerCase();

      card.username = username;
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
        (card as any)[field] =
          body[field];
      }
    }

    /* =====================================================
       PAYMENT & PUBLICATION
    ===================================================== */

    const validPaymentStatuses = [
      "pending",
      "paid",
      "failed",
    ];

    if (
      Object.prototype.hasOwnProperty.call(
       body,
       "paymentStatus"
      )
    ) {
      const paymentStatus = body.paymentStatus;

      if (
       typeof paymentStatus !== "string" ||
       !validPaymentStatuses.includes(
         paymentStatus
       )
      ) {
       return NextResponse.json(
         {
           success: false,
           message:
             "paymentStatus must be one of: pending, paid, failed",
         },
         { status: 400 }
       );
      }

      card.paymentStatus = paymentStatus;

      if (paymentStatus === "paid") {
       card.isPublished = true;
       if (!card.paidAt) {
         card.paidAt = new Date();
       }
      }
    }

    if (
      Object.prototype.hasOwnProperty.call(
       body,
       "paymentId"
      )
    ) {
      card.paymentId =
       body.paymentId === null ||
       body.paymentId === undefined
         ? null
         : String(body.paymentId);
    }

    if (
      Object.prototype.hasOwnProperty.call(
       body,
       "paidAt"
      )
    ) {
      if (body.paidAt === null) {
       card.paidAt = null;
      } else if (
       body.paidAt === undefined ||
       body.paidAt === ""
      ) {
       card.paidAt = null;
      } else {
       const paidAtDate =
         body.paidAt instanceof Date
           ? body.paidAt
           : new Date(body.paidAt as string);

       if (Number.isNaN(paidAtDate.getTime())) {
         return NextResponse.json(
           {
             success: false,
             message: "paidAt must be a valid date",
           },
           { status: 400 }
         );
       }

       card.paidAt = paidAtDate;
      }
    }

    if (
      Object.prototype.hasOwnProperty.call(
       body,
       "isPublished"
      )
    ) {
      if (typeof body.isPublished !== "boolean") {
       return NextResponse.json(
         {
           success: false,
           message: "isPublished must be a boolean",
         },
         { status: 400 }
       );
      }

      if (
       body.isPublished === true &&
       card.paymentStatus !== "paid"
      ) {
       return NextResponse.json(
         {
           success: false,
           message:
             "isPublished can only be true after payment is marked as paid",
         },
         { status: 400 }
       );
      }

      card.isPublished = body.isPublished;
    }

    if (card.paymentStatus === "paid") {
      card.isPublished = true;
      if (!card.paidAt) {
       card.paidAt = new Date();
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
            message:
              "Invalid businessDetails data",
          },
          { status: 400 }
        );
      }

      card.businessDetails = {
        ...(card.businessDetails || {}),
        ...(body.businessDetails as any),

        workingHours: {
          ...(card.businessDetails
            ?.workingHours || {}),
          ...(
            (body.businessDetails as any)
              .workingHours || {}
          ),
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
            message:
              "Invalid socialLinks data",
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
            message:
              "Gallery must be an array",
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
              message:
                "Invalid gallery image",
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

      card.gallery = gallery as any;
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
            message:
              "Videos must be an array",
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
              message:
                "Invalid video data",
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
              message:
                "Video URL is required",
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
       CERTIFICATES
    ===================================================== */

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "certificates"
      )
    ) {
      if (
        !Array.isArray(body.certificates)
      ) {
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

      for (
        const certificate of body.certificates
      ) {
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
            typeof certificate.publicId ===
            "string"
              ? certificate.publicId
              : "",

          name: certificate.name,

          size:
            typeof certificate.size === "number"
              ? certificate.size
              : 0,
        });
      }

      card.certificates =
        certificates as any;
    }

    /* =====================================================
       SAVE CARD
    ===================================================== */

    await card.save();

    /* =====================================================
       GET UPDATED CARD
    ===================================================== */

    const savedCard =
      await DigitalCard.findById(id).lean();

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

    if (
      error instanceof Error &&
      error.message.includes("duplicate key")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This username is already taken",
        },
        { status: 409 }
      );
    }

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
          message:
            "Digital card not found",
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