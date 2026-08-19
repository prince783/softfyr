"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    initSendOTP?: (config: {
      widgetId: string;
      tokenAuth: string;
      exposeMethods: boolean;
      identifier?: string;
      captchaRenderId?: string;
      success?: (data: unknown) => void;
      failure?: (error: unknown) => void;
    }) => void;

    sendOtp?: (
      identifier: string,
      success?: (data: unknown) => void,
      failure?: (error: unknown) => void
    ) => void;

    verifyOtp?: (
      otp: string | number,
      success?: (data: unknown) => void,
      failure?: (error: unknown) => void,
      reqId?: string
    ) => void;

    retryOtp?: (
      channel: string | null,
      success?: (data: unknown) => void,
      failure?: (error: unknown) => void,
      reqId?: string
    ) => void;
  }
}

interface Msg91OtpProps {
  onReady?: () => void;
  onError?: (error: unknown) => void;
}

const MSG91_SCRIPT =
  "https://verify.msg91.com/otp-provider.js";

let scriptPromise: Promise<void> | null = null;
let widgetInitialized = false;

export default function Msg91Otp({
  onReady,
  onError,
}: Msg91OtpProps) {
  const readyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const widgetId =
      process.env.NEXT_PUBLIC_MSG91_WIDGET_ID;

    const tokenAuth =
      process.env.NEXT_PUBLIC_MSG91_WIDGET_TOKEN;

    if (!widgetId) {
      onError?.(
        "MSG91 Widget ID is missing."
      );
      return;
    }

    if (!tokenAuth) {
      onError?.(
        "MSG91 Widget Token is missing."
      );
      return;
    }

    /*
     * -----------------------------------------
     * Load MSG91 SDK
     * -----------------------------------------
     */

    const loadScript = (): Promise<void> => {
      if (
        typeof window.initSendOTP ===
        "function"
      ) {
        return Promise.resolve();
      }

      if (scriptPromise) {
        return scriptPromise;
      }

      scriptPromise =
        new Promise<void>(
          (resolve, reject) => {
            const existing =
              document.querySelector<HTMLScriptElement>(
                `script[src="${MSG91_SCRIPT}"]`
              );

            if (existing) {
              existing.addEventListener(
                "load",
                () => resolve(),
                { once: true }
              );

              existing.addEventListener(
                "error",
                () =>
                  reject(
                    new Error(
                      "MSG91 OTP script failed to load."
                    )
                  ),
                { once: true }
              );

              return;
            }

            const script =
              document.createElement(
                "script"
              );

            script.src =
              MSG91_SCRIPT;

            script.async = true;

            script.onload = () => {
              console.log(
                "MSG91 OTP SDK loaded."
              );

              resolve();
            };

            script.onerror = () => {
              reject(
                new Error(
                  "MSG91 OTP SDK failed to load."
                )
              );
            };

            document.head.appendChild(
              script
            );
          }
        );

      return scriptPromise;
    };

    /*
     * -----------------------------------------
     * Wait for exposed methods
     * -----------------------------------------
     */

    const waitForMethods = () => {
      let attempts = 0;

      const timer =
        window.setInterval(() => {
          if (cancelled) {
            clearInterval(timer);
            return;
          }

          attempts++;

          const sendReady =
            typeof window.sendOtp ===
            "function";

          const verifyReady =
            typeof window.verifyOtp ===
            "function";

          const retryReady =
            typeof window.retryOtp ===
            "function";

          console.log(
            "MSG91 methods:",
            {
              sendOtp: sendReady,
              verifyOtp: verifyReady,
              retryOtp: retryReady,
            }
          );

          /*
           * We require send + verify.
           *
           * retry is optional depending on
           * widget configuration.
           */
          if (
            sendReady &&
            verifyReady
          ) {
            clearInterval(timer);

            if (!readyRef.current) {
              readyRef.current = true;

              console.log(
                "MSG91 OTP SERVICE READY"
              );

              onReady?.();
            }

            return;
          }

          if (attempts >= 50) {
            clearInterval(timer);

            onError?.(
              "MSG91 OTP methods were not exposed. Check Widget ID and Widget Token."
            );
          }
        }, 200);
    };

    /*
     * -----------------------------------------
     * Initialize Widget
     * -----------------------------------------
     */

    const initialize = async () => {
      try {
        await loadScript();

        if (cancelled) {
          return;
        }

        if (
          typeof window.initSendOTP !==
          "function"
        ) {
          throw new Error(
            "MSG91 initSendOTP is not available."
          );
        }

        if (!widgetInitialized) {
          console.log(
            "Initializing MSG91 Widget..."
          );

          /*
           * CAPTCHA is intentionally NOT
           * configured because you disabled
           * CAPTCHA in the MSG91 widget.
           */
          window.initSendOTP({
            widgetId,
            tokenAuth,
            exposeMethods: true,

            success: (data) => {
              console.log(
                "MSG91 widget initialized:",
                data
              );
            },

            failure: (error) => {
              console.error(
                "MSG91 widget initialization failed:",
                error
              );

              onError?.(error);
            },
          });

          widgetInitialized = true;
        }

        waitForMethods();
      } catch (error) {
        console.error(
          "MSG91 initialization error:",
          error
        );

        onError?.(
          error instanceof Error
            ? error.message
            : error
        );
      }
    };

    initialize();

    return () => {
      cancelled = true;
    };
  }, [onReady, onError]);

  return null;
}