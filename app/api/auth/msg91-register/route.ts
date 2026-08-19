// import { NextRequest, NextResponse } from "next/server";

// import connectDB from "@/app/lib/db";
// import User from "@/app/models/User";

// interface RegisterRequest {
//   name?: string;
//   designation?: string;
//   companyName?: string;
//   email?: string;
//   mobile?: string;
//   accessToken?: string;
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body =
//       (await request.json()) as RegisterRequest;

//     const name = String(body.name || "").trim();

//     const designation = String(
//       body.designation || "",
//     ).trim();

//     const companyName = String(
//       body.companyName || "",
//     ).trim();

//     const email = String(body.email || "")
//       .trim()
//       .toLowerCase();

//     const mobile = String(body.mobile || "")
//       .replace(/\D/g, "")
//       .slice(0, 10);

//     const accessToken = String(
//       body.accessToken || "",
//     ).trim();

//     // ==========================================
//     // VALIDATION
//     // ==========================================

//     if (!name) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Name is required.",
//         },
//         { status: 400 },
//       );
//     }

//     if (!designation) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Designation is required.",
//         },
//         { status: 400 },
//       );
//     }

//     if (!companyName) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Company name is required.",
//         },
//         { status: 400 },
//       );
//     }

//     if (!email) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Email is required.",
//         },
//         { status: 400 },
//       );
//     }

//     // Basic email validation
//     const emailRegex =
//       /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Please enter a valid email address.",
//         },
//         { status: 400 },
//       );
//     }

//     if (mobile.length !== 10) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "Valid 10-digit mobile number is required.",
//         },
//         { status: 400 },
//       );
//     }

//     if (!accessToken) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "MSG91 verification token is missing.",
//         },
//         { status: 400 },
//       );
//     }

//     // ==========================================
//     // CONNECT MONGODB
//     // ==========================================

//     await connectDB();

//     // ==========================================
//     // CHECK MOBILE ALREADY EXISTS
//     // ==========================================

//     const existingMobile = await User.findOne({
//       mobile,
//     });

//     if (existingMobile) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "This mobile number is already registered. Please login.",
//         },
//         { status: 409 },
//       );
//     }

//     // ==========================================
//     // CHECK EMAIL ALREADY EXISTS
//     // ==========================================

//     const existingEmail = await User.findOne({
//       email,
//     });

//     if (existingEmail) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "This email address is already registered.",
//         },
//         { status: 409 },
//       );
//     }

//     // ==========================================
//     // CREATE USER IN MONGODB
//     // ==========================================

//     const user = await User.create({
//       name,
//       designation,
//       companyName,
//       email,
//       mobile,

//       // OTP has already been verified
//       isVerified: true,
//     });

//     // ==========================================
//     // CREATE LOGIN SESSION
//     // ==========================================

//     const response = NextResponse.json(
//       {
//         success: true,
//         message: "Registration successful.",

//         user: {
//           id: user._id.toString(),
//           name: user.name,
//           designation: user.designation,
//           companyName: user.companyName,
//           email: user.email,
//           mobile: user.mobile,
//           isVerified: user.isVerified,
//           createdAt: user.createdAt,
//         },
//       },
//       {
//         status: 201,
//       },
//     );

//     // ==========================================
//     // SAVE VERIFIED MOBILE IN HTTP-ONLY COOKIE
//     // ==========================================

//     response.cookies.set(
//       "verified_mobile",
//       mobile,
//       {
//         httpOnly: true,

//         secure:
//           process.env.NODE_ENV === "production",

//         sameSite: "lax",

//         path: "/",

//         maxAge: 60 * 60 * 24 * 7,
//       },
//     );

//     return response;
//   } catch (error) {
//     console.error(
//       "REGISTER ERROR:",
//       error,
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           "Something went wrong during registration.",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }