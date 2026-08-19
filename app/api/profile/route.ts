import {
  NextResponse,
} from "next/server";

import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,

      user: {
        id: user._id.toString(),
        name: user.name,
        designation:
          user.designation,
        companyName:
          user.companyName,
        email: user.email,
        mobile: user.mobile,
        isVerified:
          user.isVerified,
        createdAt:
          user.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "PROFILE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch profile.",
      },
      { status: 500 }
    );
  }
}