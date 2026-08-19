"use client";

import React, { useCallback, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";

import Msg91Otp from "@/app/components/Msg91Otp";

interface Msg91Response {
  type?: string;
  message?: string;

  reqId?: string;
  req_id?: string;
  requestId?: string;
  request_id?: string;

  access_token?: string;
  accessToken?: string;
  token?: string;
  "access-token"?: string;

  data?: {
    reqId?: string;
    req_id?: string;
    requestId?: string;
    request_id?: string;

    access_token?: string;
    accessToken?: string;
    token?: string;
    "access-token"?: string;

    [key: string]: unknown;
  };

  [key: string]: unknown;
}

/* =========================================================
   ERROR MESSAGE
========================================================= */

function getMsg91ErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null) {
    const obj = error as {
      message?: string;
      error?: string;
    };

    return obj.message || obj.error || fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  return fallback;
}

/* =========================================================
   GET REQUEST ID
========================================================= */

function getReqId(data: unknown): string {
  if (typeof data !== "object" || data === null) {
    return "";
  }

  const response = data as Msg91Response;

  const values: unknown[] = [
    response.reqId,
    response.req_id,
    response.requestId,
    response.request_id,
  ];

  if (response.data && typeof response.data === "object") {
    values.push(
      response.data.reqId,
      response.data.req_id,
      response.data.requestId,
      response.data.request_id,
    );
  }

  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

/* =========================================================
   GET ACCESS TOKEN
========================================================= */

function getAccessToken(data: unknown): string {
  if (typeof data === "string") {
    return data.trim();
  }

  if (typeof data !== "object" || data === null) {
    return "";
  }

  const response = data as Msg91Response;

  const tokens: unknown[] = [
    response.access_token,
    response.accessToken,
    response.token,
    response["access-token"],
    response.message,
  ];

  if (response.data && typeof response.data === "object") {
    const nested = response.data as Record<string, unknown>;

    tokens.push(
      nested.access_token,
      nested.accessToken,
      nested.token,
      nested["access-token"],
      nested.message,
    );
  }

  for (const token of tokens) {
    if (typeof token === "string" && token.trim()) {
      const value = token.trim();

      /*
       * MSG91 Widget returns a JWT.
       *
       * JWT format:
       * header.payload.signature
       */
      if (value.split(".").length === 3) {
        return value;
      }
    }
  }

  return "";
}

/* =========================================================
   REGISTER PAGE
========================================================= */

export default function RegisterPage() {
  const router = useRouter();

  /* =======================================================
     FORM STATES
  ======================================================= */

  const [name, setName] = useState("");

  const [designation, setDesignation] = useState("");

  const [companyName, setCompanyName] = useState("");

  const [email, setEmail] = useState("");

  const [mobile, setMobile] = useState("");

  const [profession, setProfession] = useState("");

  const [otp, setOtp] = useState("");

  const [step, setStep] = useState<"details" | "otp">("details");

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);

  const [error, setError] = useState("");

  const [msg91Ready, setMsg91Ready] = useState(false);

  /* =======================================================
     MSG91 READY
  ======================================================= */

  const handleMsg91Ready = useCallback(() => {
    setMsg91Ready(true);
    setError("");
  }, []);

  /* =======================================================
     MSG91 ERROR
  ======================================================= */

  const handleMsg91Error = useCallback((error: unknown) => {
    setMsg91Ready(false);

    setError(
      getMsg91ErrorMessage(
        error,
        "MSG91 OTP service could not be initialized.",
      ),
    );
  }, []);

  /* =======================================================
     INPUT HANDLERS
  ======================================================= */

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError("");
  };

  const handleDesignationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesignation(e.target.value);
    setError("");
  };

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
    setError("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);

    setMobile(value);
    setError("");
  };

  const handleProfessionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfession(e.target.value);
    setError("");
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);

    setOtp(value);
    setError("");
  };

  /* =======================================================
     VALIDATE FORM
  ======================================================= */

  const validateForm = () => {
    if (!name.trim()) {
      setError("Please enter your full name.");
      return false;
    }

    if (!designation.trim()) {
      setError("Please enter your designation.");
      return false;
    }

    if (!companyName.trim()) {
      setError("Please enter your company name.");
      return false;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return false;
    }

    if (!profession.trim()) {
      setError("Please enter your profession or industry.");
      return false;
    }

    return true;
  };

  /* =======================================================
     SEND OTP
========================================================= */

  const handleSendOtp = () => {
    if (!validateForm()) {
      return;
    }

    if (typeof window.sendOtp !== "function") {
      setError("MSG91 OTP service is not ready. Please wait.");
      return;
    }

    setLoading(true);
    setError("");

    const identifier = `91${mobile}`;

    try {
      window.sendOtp(
        identifier,

        /* SUCCESS */
        (data) => {
          const reqId = getReqId(data);

          /*
           * Store temporary registration
           * information in sessionStorage.
           *
           * This data will be removed
           * after successful registration.
           */

          sessionStorage.setItem("msg91_mobile", mobile);

          sessionStorage.setItem("register_name", name.trim());

          sessionStorage.setItem("register_designation", designation.trim());

          sessionStorage.setItem("register_companyName", companyName.trim());

          sessionStorage.setItem("register_email", email.trim());

          sessionStorage.setItem("register_profession", profession.trim());

          if (reqId) {
            sessionStorage.setItem("msg91_req_id", reqId);
          } else {
            sessionStorage.removeItem("msg91_req_id");
          }

          setOtp("");
          setError("");
          setLoading(false);
          setStep("otp");
        },

        /* FAILURE */
        (error) => {
          setLoading(false);

          setError(
            getMsg91ErrorMessage(
              error,
              "Unable to send OTP. Please try again.",
            ),
          );
        },
      );
    } catch (error) {
      setLoading(false);

      setError(
        getMsg91ErrorMessage(error, "Unable to send OTP. Please try again."),
      );
    }
  };

  /* =======================================================
     VERIFY OTP
========================================================= */

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    if (typeof window.verifyOtp !== "function") {
      setError("MSG91 OTP service is not ready. Please wait.");
      return;
    }

    const storedMobile = sessionStorage.getItem("msg91_mobile");

    const storedReqId = sessionStorage.getItem("msg91_req_id");

    const storedName = sessionStorage.getItem("register_name");

    const storedDesignation = sessionStorage.getItem("register_designation");

    const storedCompanyName = sessionStorage.getItem("register_companyName");

    const storedEmail = sessionStorage.getItem("register_email");

    const storedProfession = sessionStorage.getItem("register_profession");

    const verificationMobile = storedMobile || mobile;

    const registrationName = storedName || name;

    const registrationDesignation = storedDesignation || designation;

    const registrationCompanyName = storedCompanyName || companyName;

    const registrationEmail = storedEmail || email;

    const registrationProfession = storedProfession || profession;

    const reqId = storedReqId || undefined;

    if (verificationMobile.length !== 10) {
      setError("Mobile number is invalid. Please request OTP again.");

      setStep("details");

      return;
    }

    setLoading(true);
    setError("");

    try {
      window.verifyOtp(
        otp,

        /* =================================================
           SUCCESS
        ================================================= */

        async (data) => {
          const accessToken = getAccessToken(data);

          if (!accessToken) {
            setLoading(false);

            setError(
              "OTP verified, but MSG91 did not return a valid verification token.",
            );

            return;
          }

          try {
            /*
             * ==============================================
             * REGISTER USER IN YOUR BACKEND
             * ==============================================
             *
             * IMPORTANT:
             *
             * Old:
             * /api/auth/msg91-register
             *
             * New:
             * /api/auth/register
             */

            const response = await fetch("/api/auth/register", {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              /*
               * Important:
               *
               * Backend creates an
               * HttpOnly session cookie.
               */
              credentials: "include",

              body: JSON.stringify({
                name: registrationName.trim(),

                designation: registrationDesignation.trim(),

                companyName: registrationCompanyName.trim(),

                email: registrationEmail.trim().toLowerCase(),

                mobile: verificationMobile,

                profession: registrationProfession.trim(),

                /*
                 * MSG91 Widget JWT
                 */
                accessToken,
              }),
            });

            const result = await response.json();

            /*
             * ==============================================
             * BACKEND ERROR
             * ==============================================
             */

            if (!response.ok) {
              throw new Error(result?.message || "Registration failed.");
            }

            if (result?.success !== true) {
              throw new Error(result?.message || "Registration failed.");
            }

            /*
             * ==============================================
             * REGISTRATION SUCCESS
             * ==============================================
             *
             * At this point:
             *
             * MSG91 OTP  ✅
             * MongoDB    ✅
             * Session    ✅
             *
             */

            sessionStorage.removeItem("msg91_req_id");

            sessionStorage.removeItem("msg91_mobile");

            sessionStorage.removeItem("register_name");

            sessionStorage.removeItem("register_designation");

            sessionStorage.removeItem("register_companyName");

            sessionStorage.removeItem("register_email");

            sessionStorage.removeItem("register_profession");

            setLoading(false);
            setError("");

            /*
             * Go to dashboard.
             *
             * Backend session cookie
             * will be used there.
             */

            router.replace("/dashboard");
          } catch (error) {
            setLoading(false);

            setError(
              getMsg91ErrorMessage(error, "Unable to complete registration."),
            );
          }
        },

        /* =================================================
           OTP FAILURE
        ================================================= */

        (error) => {
          setLoading(false);

          setError(
            getMsg91ErrorMessage(error, "Invalid OTP. Please try again."),
          );
        },

        reqId,
      );
    } catch (error) {
      setLoading(false);

      setError(
        getMsg91ErrorMessage(error, "Unable to verify OTP. Please try again."),
      );
    }
  };

  /* =======================================================
     RESEND OTP
========================================================= */

  /* =======================================================
   RESEND OTP
========================================================= */

  const handleResendOtp = () => {
    if (loading || resending) {
      return;
    }

    /*
     * Capture MSG91 functions locally.
     *
     * TypeScript considers window.sendOtp and
     * window.retryOtp optional, so storing them
     * after checking their types guarantees that
     * they are callable inside the callbacks.
     */

    const sendOtp = window.sendOtp;
    const retryOtp = window.retryOtp;

    if (typeof sendOtp !== "function" || typeof retryOtp !== "function") {
      setError("MSG91 OTP service is not ready.");
      return;
    }

    const reqId = sessionStorage.getItem("msg91_req_id");

    /*
     * ==============================================
     * IF NO REQUEST ID
     * SEND A COMPLETELY NEW OTP
     * ==============================================
     */

    if (!reqId) {
      setResending(true);
      setError("");

      const identifier = `91${mobile}`;

      try {
        sendOtp(
          identifier,

          /* SUCCESS */
          (data) => {
            const newReqId = getReqId(data);

            if (newReqId) {
              sessionStorage.setItem("msg91_req_id", newReqId);
            }

            sessionStorage.setItem("msg91_mobile", mobile);

            setOtp("");
            setResending(false);
            setError("");
          },

          /* FAILURE */
          (error) => {
            setResending(false);

            setError(getMsg91ErrorMessage(error, "Unable to resend OTP."));
          },
        );
      } catch (error) {
        setResending(false);

        setError(getMsg91ErrorMessage(error, "Unable to resend OTP."));
      }

      return;
    }

    /*
     * ==============================================
     * RETRY EXISTING OTP
     * ==============================================
     */

    setResending(true);
    setError("");

    try {
      retryOtp(
        null,

        /* SUCCESS */
        (data) => {
          const newReqId = getReqId(data);

          if (newReqId) {
            sessionStorage.setItem("msg91_req_id", newReqId);
          }

          setOtp("");
          setResending(false);
          setError("");
        },

        /* FAILURE */
        (error) => {
          setResending(false);

          setError(
            getMsg91ErrorMessage(
              error,
              "Unable to resend OTP. Please try again.",
            ),
          );
        },

        reqId,
      );
    } catch (error) {
      setResending(false);

      setError(
        getMsg91ErrorMessage(error, "Unable to resend OTP. Please try again."),
      );
    }
  };

  /* =======================================================
     CHANGE DETAILS
========================================================= */

  const handleChangeDetails = () => {
    sessionStorage.removeItem("msg91_req_id");

    sessionStorage.removeItem("msg91_mobile");

    sessionStorage.removeItem("register_name");

    sessionStorage.removeItem("register_designation");

    sessionStorage.removeItem("register_companyName");

    sessionStorage.removeItem("register_email");

    sessionStorage.removeItem("register_profession");

    setOtp("");
    setStep("details");
    setError("");
  };

  /* =======================================================
     FORM SUBMIT
========================================================= */

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (step === "details") {
      handleSendOtp();
    } else {
      handleVerifyOtp();
    }
  };

  /* =======================================================
     COMMON INPUT STYLE
========================================================= */

  const inputWrapper = `
    flex
    h-[50px]
    items-center
    rounded-xl
    border
    border-[#dfe3ed]
    bg-white
    px-4
    transition-all
    focus-within:border-[#7650ed]
    focus-within:ring-4
    focus-within:ring-[#7650ed]/10
  `;

  /* =======================================================
     UI
========================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* MSG91 */}

      <Msg91Otp onReady={handleMsg91Ready} onError={handleMsg91Error} />

      {/* Background */}

      <Image
        src="/bgofweb.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-white/5" />

      {/* Main */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-4
          py-8
          sm:px-6
        "
      >
        <div
          className="
            w-full
            max-w-[430px]
            rounded-[28px]
            border
            border-white/80
            bg-white/95
            px-4
            py-8
            shadow-[0_25px_80px_rgba(50,60,110,0.15)]
            backdrop-blur-xl
            sm:px-10
            sm:py-10
          "
        >
          {/* Heading */}

          <div className="text-center">
            <h1
              className="
                text-[28px]
                font-bold
                tracking-tight
                text-[#152342]
                sm:text-[30px]
              "
            >
              {step === "details" ? (
                <>
                  Create Account <span>👋</span>
                </>
              ) : (
                <>
                  Verify OTP <span>🔐</span>
                </>
              )}
            </h1>

            <p
              className="
                mt-2
                text-[16px]
                text-[#687896]
              "
            >
              {step === "details"
                ? "Create your Softfyr account"
                : `Enter the OTP sent to +91 ${mobile}`}
            </p>
          </div>

          {/* Steps */}

          <div
            className="
              mx-auto
              mt-8
              flex
              max-w-[320px]
              items-start
            "
          >
            {/* Details */}

            <div className="flex flex-col items-center">
              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  transition-all
                  ${
                    step === "details"
                      ? "bg-[#f1edff] text-[#663cff]"
                      : "bg-[#6d42ef] text-white shadow-lg shadow-indigo-200"
                  }
                `}
              >
                {step === "otp" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>

              <span
                className={`
                  mt-2
                  whitespace-nowrap
                  text-[13px]
                  font-medium
                  ${step === "details" ? "text-[#663cff]" : "text-slate-400"}
                `}
              >
                Your Details
              </span>
            </div>

            {/* Line */}

            <div
              className={`
                mt-6
                h-[1px]
                flex-1
                transition-all
                ${step === "otp" ? "bg-[#6d42ef]" : "bg-[#dfe2ee]"}
              `}
            />

            {/* OTP */}

            <div className="flex flex-col items-center">
              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  transition-all
                  ${
                    step === "otp"
                      ? "border-[#6d42ef] bg-[#f1edff] text-[#663cff]"
                      : "border-[#e2e5ee] bg-white text-[#8c98b2]"
                  }
                `}
              >
                <ShieldCheck className="h-5 w-5" />
              </div>

              <span
                className={`
                  mt-2
                  whitespace-nowrap
                  text-[13px]
                  font-medium
                  ${step === "otp" ? "text-[#663cff]" : "text-slate-400"}
                `}
              >
                OTP Verification
              </span>
            </div>
          </div>

          {/* Form */}

          <form onSubmit={handleSubmit} className="mt-8">
            {/* DETAILS */}

            {step === "details" && (
              <div
                className="
                  max-h-[455px]
                  overflow-y-auto
                  pr-1
                "
              >
                {/* FULL NAME */}

                <label
                  htmlFor="name"
                  className="
                    mb-1.5
                    block
                    text-[14px]
                    font-medium
                    text-[#162544]
                  "
                >
                  Full Name
                </label>

                <div className={`${inputWrapper} mb-3`}>
                  <User
                    className="
                      mr-3
                      h-4.5
                      w-4.5
                      shrink-0
                      text-[#8c98b2]
                    "
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Enter your full name"
                    className="
                      w-full
                      bg-transparent
                      text-[14px]
                      text-[#172542]
                      outline-none
                      placeholder:text-[#a5aec1]
                    "
                  />
                </div>

                {/* DESIGNATION */}

                <label
                  htmlFor="designation"
                  className="
                    mb-1.5
                    block
                    text-[14px]
                    font-medium
                    text-[#162544]
                  "
                >
                  Designation
                </label>

                <div className={`${inputWrapper} mb-3`}>
                  <BriefcaseBusiness
                    className="
                      mr-3
                      h-4.5
                      w-4.5
                      shrink-0
                      text-[#8c98b2]
                    "
                  />

                  <input
                    id="designation"
                    name="designation"
                    type="text"
                    value={designation}
                    onChange={handleDesignationChange}
                    placeholder="e.g. Software Developer"
                    className="
                      w-full
                      bg-transparent
                      text-[14px]
                      text-[#172542]
                      outline-none
                      placeholder:text-[#a5aec1]
                    "
                  />
                </div>

                {/* COMPANY */}

                <label
                  htmlFor="companyName"
                  className="
                    mb-1.5
                    block
                    text-[14px]
                    font-medium
                    text-[#162544]
                  "
                >
                  Company Name
                </label>

                <div className={`${inputWrapper} mb-3`}>
                  <Building2
                    className="
                      mr-3
                      h-4.5
                      w-4.5
                      shrink-0
                      text-[#8c98b2]
                    "
                  />

                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={companyName}
                    onChange={handleCompanyNameChange}
                    placeholder="Enter company name"
                    className="
                      w-full
                      bg-transparent
                      text-[14px]
                      text-[#172542]
                      outline-none
                      placeholder:text-[#a5aec1]
                    "
                  />
                </div>

                {/* EMAIL */}

                <label
                  htmlFor="email"
                  className="
                    mb-1.5
                    block
                    text-[14px]
                    font-medium
                    text-[#162544]
                  "
                >
                  Email Address
                </label>

                <div className={`${inputWrapper} mb-3`}>
                  <Mail
                    className="
                      mr-3
                      h-4.5
                      w-4.5
                      shrink-0
                      text-[#8c98b2]
                    "
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    className="
                      w-full
                      bg-transparent
                      text-[14px]
                      text-[#172542]
                      outline-none
                      placeholder:text-[#a5aec1]
                    "
                  />
                </div>

                {/* MOBILE */}

                <label
                  htmlFor="mobile"
                  className="
                    mb-1.5
                    block
                    text-[14px]
                    font-medium
                    text-[#162544]
                  "
                >
                  Mobile Number
                </label>

                <div
                  className={`
                    mb-3
                    flex
                    h-[50px]
                    overflow-hidden
                    rounded-xl
                    border
                    bg-white
                    transition-all
                    focus-within:border-[#7650ed]
                    focus-within:ring-4
                    focus-within:ring-[#7650ed]/10
                    ${error ? "border-red-400" : "border-[#dfe3ed]"}
                  `}
                >
                  <div
                    className="
                      flex
                      w-[115px]
                      shrink-0
                      items-center
                      gap-3
                      border-r
                      border-[#e8eaf0]
                      px-4
                    "
                  >
                    <Image
                      src="/india.jpg"
                      alt="India"
                      width={24}
                      height={18}
                      className="object-cover"
                    />

                    <span
                      className="
                        text-[15px]
                        font-medium
                        text-[#253454]
                      "
                    >
                      +91
                    </span>
                  </div>

                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={mobile}
                    onChange={handleMobileChange}
                    placeholder="Enter mobile number"
                    className="
                      min-w-0
                      flex-1
                      bg-transparent
                      px-4
                      text-[14px]
                      text-[#172542]
                      outline-none
                      placeholder:text-[#a5aec1]
                    "
                  />
                </div>

                {/* PROFESSION */}

                <label
                  htmlFor="profession"
                  className="
                    mb-1.5
                    block
                    text-[14px]
                    font-medium
                    text-[#162544]
                  "
                >
                  Profession / Industry
                </label>

                <div className={`${inputWrapper} mb-3`}>
                  <BriefcaseBusiness
                    className="
                      mr-3
                      h-4.5
                      w-4.5
                      shrink-0
                      text-[#8c98b2]
                    "
                  />

                  <input
                    id="profession"
                    name="profession"
                    type="text"
                    value={profession}
                    onChange={handleProfessionChange}
                    placeholder="e.g. IT, Finance, Marketing"
                    className="
                      w-full
                      bg-transparent
                      text-[14px]
                      text-[#172542]
                      outline-none
                      placeholder:text-[#a5aec1]
                    "
                  />
                </div>
              </div>
            )}

            {/* OTP */}

            {step === "otp" && (
              <>
                <label
                  htmlFor="otp"
                  className="
                    mb-2
                    block
                    text-[15px]
                    font-medium
                    text-[#162544]
                  "
                >
                  Enter OTP
                </label>

                <div
                  className={`
                    flex
                    h-[58px]
                    items-center
                    rounded-xl
                    border
                    bg-white
                    px-4
                    transition-all
                    focus-within:border-[#7650ed]
                    focus-within:ring-4
                    focus-within:ring-[#7650ed]/10
                    ${error ? "border-red-400" : "border-[#dfe3ed]"}
                  `}
                >
                  <ShieldCheck
                    className="
                      mr-3
                      h-5
                      w-5
                      shrink-0
                      text-[#7650ed]
                    "
                  />

                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    autoFocus
                    className="
                      w-full
                      bg-transparent
                      text-center
                      text-[20px]
                      font-semibold
                      tracking-[8px]
                      text-[#172542]
                      outline-none
                      placeholder:text-[14px]
                      placeholder:font-normal
                      placeholder:tracking-normal
                      placeholder:text-[#a5aec1]
                    "
                  />
                </div>

                {/* OTP ACTIONS */}

                <div
                  className="
                    mt-3
                    flex
                    justify-between
                    text-sm
                  "
                >
                  <button
                    type="button"
                    onClick={handleChangeDetails}
                    className="
                      font-medium
                      text-slate-500
                      transition-colors
                      hover:text-[#6d42ef]
                    "
                  >
                    Change details
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading || resending}
                    className="
                      font-semibold
                      text-[#6d42ef]
                      transition-colors
                      hover:text-[#5427d5]
                      disabled:opacity-50
                    "
                  >
                    {resending ? "Sending..." : "Resend OTP"}
                  </button>
                </div>
              </>
            )}

            {/* ERROR */}

            {error && (
              <div
                className="
                  mt-3
                  rounded-lg
                  border
                  border-red-100
                  bg-red-50
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-red-500
                "
              >
                {error}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading || (step === "details" && !msg91Ready)}
              className="
                mt-5
                flex
                h-[52px]
                w-full
                items-center
                justify-center
                gap-3
                rounded-xl
                bg-gradient-to-r
                from-[#7144ed]
                via-[#7138ee]
                to-[#6531e7]
                text-[16px]
                font-semibold
                text-white
                shadow-[0_10px_25px_rgba(108,63,235,0.25)]
                transition-all
                hover:scale-[1.01]
                hover:shadow-[0_14px_30px_rgba(108,63,235,0.32)]
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            >
              {loading ? (
                <>
                  <span
                    className="
                      h-5
                      w-5
                      animate-spin
                      rounded-full
                      border-2
                      border-white/40
                      border-t-white
                    "
                  />

                  {step === "details"
                    ? "Sending OTP..."
                    : "Creating Account..."}
                </>
              ) : (
                <>
                  {step === "details"
                    ? msg91Ready
                      ? "Create Account"
                      : "Loading OTP Service..."
                    : "Verify & Create Account"}

                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* LOGIN LINK */}

            <div
              className="
                mt-4
                text-center
                text-[14px]
                text-[#8a95ad]
              "
            >
              <span>Already have an account? </span>

              <Link
                href="/login"
                className="
                  font-semibold
                  text-[#6d42ef]
                  transition-colors
                  hover:text-[#5427d5]
                  hover:underline
                "
              >
                Login
              </Link>
            </div>

            {/* SECURITY */}

            <div
              className="
                mt-5
                flex
                items-center
                justify-center
                gap-2
                text-center
                text-[13px]
                text-[#8a95ad]
              "
            >
              <ShieldCheck
                className="
                  h-[17px]
                  w-[17px]
                  shrink-0
                  text-[#7d8bab]
                "
              />

              <span>We never share your number with anyone</span>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
