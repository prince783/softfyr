"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Check,
  ShieldCheck,
  Smartphone,
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
   NORMALIZE MOBILE
========================================================= */

function normalizeMobile(value: string): string {
  let mobile = String(value || "").replace(/\D/g, "");

  /*
   * If number comes as:
   *
   * 919876543210
   *
   * convert to:
   *
   * 9876543210
   */

  if (mobile.length === 12 && mobile.startsWith("91")) {
    mobile = mobile.slice(2);
  }

  /*
   * If somehow +91 is present after cleaning,
   * the above handles it.
   */

  return mobile.slice(0, 10);
}

/* =========================================================
   ERROR MESSAGE
========================================================= */

function getMsg91ErrorMessage(
  error: unknown,
  fallback: string,
): string {
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
  if (
    typeof data !== "object" ||
    data === null
  ) {
    return "";
  }

  const response = data as Msg91Response;

  const values: unknown[] = [
    response.reqId,
    response.req_id,
    response.requestId,
    response.request_id,
  ];

  if (
    response.data &&
    typeof response.data === "object"
  ) {
    values.push(
      response.data.reqId,
      response.data.req_id,
      response.data.requestId,
      response.data.request_id,
    );
  }

  for (const value of values) {
    if (
      typeof value === "string" &&
      value.trim()
    ) {
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
    const value = data.trim();

    if (value.split(".").length === 3) {
      return value;
    }

    return "";
  }

  if (
    typeof data !== "object" ||
    data === null
  ) {
    return "";
  }

  const response = data as Msg91Response;

  const tokens: unknown[] = [
    response.access_token,
    response.accessToken,
    response.token,
    response["access-token"],
  ];

  if (
    response.data &&
    typeof response.data === "object"
  ) {
    const nested =
      response.data as Record<string, unknown>;

    tokens.push(
      nested.access_token,
      nested.accessToken,
      nested.token,
      nested["access-token"],
    );
  }

  for (const token of tokens) {
    if (
      typeof token === "string" &&
      token.trim()
    ) {
      const value = token.trim();

      if (value.split(".").length === 3) {
        return value;
      }
    }
  }

  return "";
}

/* =========================================================
   LOGIN PAGE
========================================================= */

export default function LoginPage() {
  const router = useRouter();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] =
    useState<"mobile" | "otp">("mobile");

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const [error, setError] = useState("");

  const [msg91Ready, setMsg91Ready] =
    useState(false);

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

  const handleMsg91Error = useCallback(
    (error: unknown) => {
      setMsg91Ready(false);

      setError(
        getMsg91ErrorMessage(
          error,
          "MSG91 OTP service could not be initialized.",
        ),
      );
    },
    [],
  );

  /* =======================================================
     MOBILE CHANGE
  ======================================================= */

  const handleMobileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = normalizeMobile(
      e.target.value,
    );

    setMobile(value);
    setError("");
  };

  /* =======================================================
     OTP CHANGE
  ======================================================= */

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(value);
    setError("");
  };

  /* =======================================================
     SEND OTP
  ======================================================= */

  const handleSendOtp = async () => {
    const normalizedMobile =
      normalizeMobile(mobile);

    if (normalizedMobile.length !== 10) {
      setError(
        "Please enter a valid 10-digit mobile number.",
      );
      return;
    }

    if (!msg91Ready) {
      setError(
        "MSG91 OTP service is not ready. Please wait.",
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * ==========================================
       * CHECK USER IN DATABASE
       * ==========================================
       */

      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            mobile: normalizedMobile,
          }),
        },
      );

      let result: {
        success?: boolean;
        message?: string;
        code?: string;
      } = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      console.log(
        "LOGIN USER CHECK:",
        result,
      );

      /*
       * ==========================================
       * USER DOES NOT EXIST
       * ==========================================
       */

      if (
        response.status === 404 ||
        result.code === "USER_NOT_FOUND"
      ) {
        setLoading(false);

        setError(
          "No account found with this mobile number. Please register first.",
        );

        return;
      }

      if (
        !response.ok ||
        result.success !== true
      ) {
        setLoading(false);

        setError(
          result.message ||
            "Unable to check your account.",
        );

        return;
      }

      /*
       * ==========================================
       * SAVE NORMALIZED MOBILE
       * ==========================================
       */

      sessionStorage.setItem(
        "login_mobile",
        normalizedMobile,
      );

      sessionStorage.setItem(
        "msg91_mobile",
        normalizedMobile,
      );

      /*
       * ==========================================
       * CHECK MSG91
       * ==========================================
       */

      if (
        typeof window.sendOtp !==
        "function"
      ) {
        setLoading(false);

        setError(
          "MSG91 OTP service is not ready. Please wait.",
        );

        return;
      }

      /*
       * ==========================================
       * SEND OTP TO MSG91
       * ==========================================
       */

      const identifier =
        `91${normalizedMobile}`;

      window.sendOtp(
        identifier,

        /* SUCCESS */
        (data) => {
          console.log(
            "LOGIN OTP SENT:",
            data,
          );

          const reqId =
            getReqId(data);

          if (reqId) {
            sessionStorage.setItem(
              "msg91_req_id",
              reqId,
            );
          } else {
            sessionStorage.removeItem(
              "msg91_req_id",
            );
          }

          setMobile(normalizedMobile);
          setOtp("");
          setError("");
          setLoading(false);
          setStep("otp");
        },

        /* FAILURE */
        (error) => {
          console.error(
            "LOGIN OTP ERROR:",
            error,
          );

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
      console.error(
        "LOGIN CHECK ERROR:",
        error,
      );

      setLoading(false);

      setError(
        getMsg91ErrorMessage(
          error,
          "Unable to check account.",
        ),
      );
    }
  };

  /* =======================================================
     VERIFY OTP
  ======================================================= */

 const handleVerifyOtp = () => {
  if (otp.length !== 6) {
    setError("Please enter the 6-digit OTP.");
    return;
  }

  if (typeof window.verifyOtp !== "function") {
    setError("MSG91 OTP service is not ready. Please wait.");
    return;
  }

  const storedMobile =
    sessionStorage.getItem("login_mobile") ||
    sessionStorage.getItem("msg91_mobile");

  const storedReqId =
    sessionStorage.getItem("msg91_req_id");

  const verificationMobile =
    storedMobile || mobile;

  const reqId =
    storedReqId || undefined;

  if (verificationMobile.length !== 10) {
    setError(
      "Mobile number is invalid. Please request OTP again.",
    );

    setStep("mobile");
    return;
  }

  setLoading(true);
  setError("");

  try {
    window.verifyOtp(
      otp,

      /* ==========================================
         OTP SUCCESS
      ========================================== */

      async (data) => {
        console.log(
          "MSG91 OTP VERIFIED SUCCESS:",
          data,
        );

        /*
         * IMPORTANT:
         *
         * Do NOT require accessToken here.
         *
         * Your MSG91 Widget has already verified
         * the OTP successfully.
         */

        try {
          const response = await fetch(
            "/api/auth/msg91-verify",
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              credentials: "include",

              body: JSON.stringify({
                mobile: verificationMobile,
              }),
            },
          );

          const result =
            await response.json();

          console.log(
            "LOGIN FINALIZATION:",
            result,
          );

          if (!response.ok) {
            throw new Error(
              result?.message ||
                "Unable to complete login.",
            );
          }

          if (result?.success !== true) {
            throw new Error(
              result?.message ||
                "Unable to complete login.",
            );
          }

          /*
           * Clear temporary login data
           */

          sessionStorage.removeItem(
            "msg91_req_id",
          );

          sessionStorage.removeItem(
            "msg91_mobile",
          );

          sessionStorage.removeItem(
            "login_mobile",
          );

          setLoading(false);
          setError("");

          /*
           * LOGIN SUCCESS
           */

          router.replace("/dashboard");
        } catch (error) {
          console.error(
            "LOGIN FINALIZATION ERROR:",
            error,
          );

          setLoading(false);

          setError(
            getMsg91ErrorMessage(
              error,
              "Unable to complete login.",
            ),
          );
        }
      },

      /* ==========================================
         OTP FAILURE
      ========================================== */

      (error) => {
        console.error(
          "MSG91 VERIFY OTP ERROR:",
          error,
        );

        setLoading(false);

        setError(
          getMsg91ErrorMessage(
            error,
            "Invalid OTP. Please try again.",
          ),
        );
      },

      reqId,
    );
  } catch (error) {
    console.error(
      "VERIFY OTP EXCEPTION:",
      error,
    );

    setLoading(false);

    setError(
      getMsg91ErrorMessage(
        error,
        "Unable to verify OTP. Please try again.",
      ),
    );
  }
};

  /* =======================================================
     RESEND OTP
  ======================================================= */

  const handleResendOtp = () => {
    if (loading || resending) {
      return;
    }

    if (
      typeof window.retryOtp !==
      "function"
    ) {
      setError(
        "MSG91 OTP service is not ready.",
      );

      return;
    }

    const storedMobile =
      sessionStorage.getItem(
        "login_mobile",
      );

    const normalizedMobile =
      normalizeMobile(
        storedMobile || mobile,
      );

    if (
      normalizedMobile.length !== 10
    ) {
      setError(
        "Mobile number is invalid.",
      );

      return;
    }

    const reqId =
      sessionStorage.getItem(
        "msg91_req_id",
      );

    setResending(true);
    setError("");

    /*
     * ==========================================
     * IF REQUEST ID DOES NOT EXIST
     * SEND NEW OTP
     * ==========================================
     */

    if (!reqId) {
      const identifier =
        `91${normalizedMobile}`;

      try {
        window.sendOtp(
          identifier,

          /* SUCCESS */
          (data) => {
            const newReqId =
              getReqId(data);

            if (newReqId) {
              sessionStorage.setItem(
                "msg91_req_id",
                newReqId,
              );
            }

            sessionStorage.setItem(
              "msg91_mobile",
              normalizedMobile,
            );

            sessionStorage.setItem(
              "login_mobile",
              normalizedMobile,
            );

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
                "Unable to resend OTP.",
              ),
            );
          },
        );
      } catch (error) {
        setResending(false);

        setError(
          getMsg91ErrorMessage(
            error,
            "Unable to resend OTP.",
          ),
        );
      }

      return;
    }

    /*
     * ==========================================
     * RETRY EXISTING OTP
     * ==========================================
     */

    try {
      window.retryOtp(
        null,

        /* SUCCESS */
        (data) => {
          const newReqId =
            getReqId(data);

          if (newReqId) {
            sessionStorage.setItem(
              "msg91_req_id",
              newReqId,
            );
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
        getMsg91ErrorMessage(
          error,
          "Unable to resend OTP.",
        ),
      );
    }
  };

  /* =======================================================
     CHANGE NUMBER
  ======================================================= */

  const handleChangeNumber = () => {
    sessionStorage.removeItem(
      "msg91_req_id",
    );

    sessionStorage.removeItem(
      "msg91_mobile",
    );

    sessionStorage.removeItem(
      "login_mobile",
    );

    setMobile("");
    setOtp("");
    setStep("mobile");
    setError("");
  };

  /* =======================================================
     FORM SUBMIT
  ======================================================= */

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (step === "mobile") {
      handleSendOtp();
    } else {
      handleVerifyOtp();
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Msg91Otp
        onReady={handleMsg91Ready}
        onError={handleMsg91Error}
      />

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
            max-w-[400px]
            rounded-[28px]
            border
            border-white/80
            bg-white/95
            px-4
            py-8
            shadow-[0_25px_80px_rgba(50,60,110,0.15)]
            backdrop-blur-xl
            sm:px-10
            sm:py-12
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
              {step === "mobile" ? (
                <>
                  Welcome Back <span>👋</span>
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
              {step === "mobile"
                ? "Login to continue to your account"
                : `Enter the OTP sent to +91 ${mobile}`}
            </p>
          </div>

          {/* Steps */}
          <div
            className="
              mx-auto
              mt-9
              flex
              max-w-[320px]
              items-start
            "
          >
            {/* Mobile */}
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
                    step === "mobile"
                      ? "bg-[#f1edff] text-[#663cff]"
                      : "bg-[#6d42ef] text-white shadow-lg shadow-indigo-200"
                  }
                `}
              >
                {step === "otp" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Smartphone className="h-5 w-5" />
                )}
              </div>

              <span
                className={`
                  mt-2
                  whitespace-nowrap
                  text-[13px]
                  font-medium
                  ${
                    step === "mobile"
                      ? "text-[#663cff]"
                      : "text-slate-400"
                  }
                `}
              >
                Mobile Number
              </span>
            </div>

            {/* Line */}
            <div
              className={`
                mt-6
                h-[1px]
                flex-1
                transition-all
                ${
                  step === "otp"
                    ? "bg-[#6d42ef]"
                    : "bg-[#dfe2ee]"
                }
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
                  ${
                    step === "otp"
                      ? "text-[#663cff]"
                      : "text-slate-400"
                  }
                `}
              >
                OTP Verification
              </span>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-10"
          >
            {/* MOBILE */}
            {step === "mobile" && (
              <>
                <label
                  htmlFor="mobile"
                  className="
                    mb-2
                    block
                    text-[15px]
                    font-medium
                    text-[#162544]
                  "
                >
                  Mobile Number
                </label>

                <div
                  className={`
                    flex
                    h-[58px]
                    overflow-hidden
                    rounded-xl
                    border
                    bg-white
                    transition-all
                    focus-within:border-[#7650ed]
                    focus-within:ring-4
                    focus-within:ring-[#7650ed]/10
                    ${
                      error
                        ? "border-red-400"
                        : "border-[#dfe3ed]"
                    }
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
                      className="h-[18px] w-auto object-cover"
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
                    onChange={
                      handleMobileChange
                    }
                    placeholder="Enter your mobile number"
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
              </>
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
                    ${
                      error
                        ? "border-red-400"
                        : "border-[#dfe3ed]"
                    }
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
                    onChange={
                      handleOtpChange
                    }
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
                    onClick={
                      handleChangeNumber
                    }
                    className="
                      font-medium
                      text-slate-500
                      transition-colors
                      hover:text-[#6d42ef]
                    "
                  >
                    Change number
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleResendOtp
                    }
                    disabled={
                      loading ||
                      resending
                    }
                    className="
                      font-semibold
                      text-[#6d42ef]
                      transition-colors
                      hover:text-[#5427d5]
                      disabled:opacity-50
                    "
                  >
                    {resending
                      ? "Sending..."
                      : "Resend OTP"}
                  </button>
                </div>
              </>
            )}

            {/* Error */}
            {error && (
              <div
                className="
                  mt-4
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

            {/* Submit */}
            <button
              type="submit"
              disabled={
                loading ||
                (step === "mobile" &&
                  !msg91Ready)
              }
              className="
                mt-8
                flex
                h-[56px]
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

                  {step === "mobile"
                    ? "Checking account..."
                    : "Verifying OTP..."}
                </>
              ) : (
                <>
                  {step === "mobile"
                    ? msg91Ready
                      ? "Send OTP"
                      : "Loading OTP Service..."
                    : "Verify OTP"}

                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Register */}
            <div
              className="
                mt-5
                text-center
                text-[14px]
                text-[#8a95ad]
              "
            >
              <span>
                New to Softfyr?{" "}
              </span>

              <Link
                href="/register"
                className="
                  font-semibold
                  text-[#6d42ef]
                  hover:underline
                "
              >
                Create an account
              </Link>
            </div>

            {/* Security */}
            <div
              className="
                mt-8
                flex
                items-center
                justify-center
                gap-2
                text-center
                text-[14px]
                text-[#8a95ad]
              "
            >
              <ShieldCheck
                className="
                  h-[18px]
                  w-[18px]
                  shrink-0
                  text-[#7d8bab]
                "
              />

              <span>
                We never share your number with anyone
              </span>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}