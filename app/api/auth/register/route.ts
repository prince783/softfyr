import {
  NextRequest,
  NextResponse,
} from "next/server";

import connectDB from "@/app/lib/db";
import { createSession } from "@/app/lib/auth";
import User from "@/app/models/User";

interface RegisterRequest {
  name?: string;
  designation?: string;
  companyName?: string;
  email?: string;
  mobile?: string;
  accessToken?: string;
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as RegisterRequest;

    const name = String(
      body.name || ""
    ).trim();

    const designation = String(
      body.designation || ""
    ).trim();

    const companyName = String(
      body.companyName || ""
    ).trim();

    const email = String(
      body.email || ""
    )
      .trim()
      .toLowerCase();

    const mobile = String(
      body.mobile || ""
    )
      .replace(/\D/g, "")
      .slice(-10);

    const accessToken = String(
      body.accessToken || ""
    ).trim();

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required.",
        },
        { status: 400 }
      );
    }

    if (!designation) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Designation is required.",
        },
        { status: 400 }
      );
    }

    if (!companyName) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Company name is required.",
        },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email is required.",
        },
        { status: 400 }
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (mobile.length !== 10) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Valid 10-digit mobile number is required.",
        },
        { status: 400 }
      );
    }

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please verify your mobile number first.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // DATABASE
    // -----------------------------

    await connectDB();

    const existingMobile =
      await User.findOne({ mobile });

    if (existingMobile) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This mobile number is already registered. Please login.",
        },
        { status: 409 }
      );
    }

    const existingEmail =
      await User.findOne({ email });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This email address is already registered.",
        },
        { status: 409 }
      );
    }

    // -----------------------------
    // CREATE USER
    // -----------------------------

    const user = await User.create({
      name,
      designation,
      companyName,
      email,
      mobile,
      isVerified: true,
    });

    // -----------------------------
    // CREATE APP SESSION
    // -----------------------------

    await createSession(
      user._id.toString()
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Registration successful.",

        user: {
          id: user._id.toString(),
          name: user.name,
          designation: user.designation,
          companyName:
            user.companyName,
          email: user.email,
          mobile: user.mobile,
          isVerified:
            user.isVerified,
          createdAt:
            user.createdAt,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    // Handle MongoDB duplicate key
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code ===
        11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Mobile number or email is already registered.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong during registration.",
      },
      { status: 500 }
    );
  }
}