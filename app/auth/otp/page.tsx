"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { verifyOtpApi, resendOtpApi } from "@/api/functions/user.api";
import { useAuthStore } from "@/zustand/auth.zustand";

interface OtpFormData {
  otp: string;
}

function OtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email] = useState(emailParam);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(
    email ? `A 6-digit verification code was sent to ${email}` : ""
  );

  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OtpFormData>({
    defaultValues: {
      otp: "",
    },
  });

  const otpValue = watch("otp") || "";

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const onSubmit = async (data: OtpFormData) => {
    if (!email) {
      setErrorMsg("Email address is missing. Please sign up or login again.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await verifyOtpApi({
        email: email.trim().toLowerCase(),
        otp: data.otp.trim(),
      });

      if (res.status && res.token && res.user) {
        setSuccessMsg(res.message || "Email verified successfully!");
        setAuth(res.user, res.token);
        setTimeout(() => {
          router.push("/dashboard/my-profile");
        }, 800);
      } else {
        setErrorMsg(res.message || "Invalid OTP code.");
      }
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(
        apiErr.response?.data?.message ||
        apiErr.message ||
        "Verification failed. Please check the OTP code."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || resendCooldown > 0 || resending) return;
    setErrorMsg("");
    setResending(true);

    try {
      const res = await resendOtpApi({
        email: email.trim().toLowerCase(),
      });
      if (res.status) {
        setSuccessMsg("A new verification code has been sent to your email!");
        setResendCooldown(60);
      } else {
        setErrorMsg(res.message || "Could not resend OTP.");
      }
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(
        apiErr.response?.data?.message ||
        apiErr.message ||
        "Failed to resend verification code."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-gutter py-space-xl">
      <div className="w-full max-w-md bg-surface-container-lowest p-space-xl rounded-2xl shadow-xl border border-surface-container">
        {/* Brand */}
        <div className="flex items-center gap-space-sm mb-space-lg">
          <img
            alt="WorkSphere Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1Uvn_q5sMy6ZFlruW4qTx3MUU0DgKXJb3-GrOKP1u92HxxUoXSF6FcKU9LwEVAX0plxGfq90R6IEmEaTYZT8o5tjIMlNwQqRZRzp9w526wNddubsHU3y2csTc7vuG1Rj74eJG_dYbXU3gavTSYDmdDpqABqX4GonMoZ15AuLk3nT-WjEDKGzhArW0lPSVD0SlaSAtVSgEbnbaEAEQCJJrnmwGTMw9y_LY1qLwGNDoo"
          />
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
            WorkSphere
          </span>
        </div>

        {/* Icon & Title */}
        <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed mb-4">
          <span className="material-symbols-outlined text-[28px]">mark_email_read</span>
        </div>

        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mb-1">
          Verify Your Email
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-lg">
          {email ? (
            <>
              Enter the 6-digit verification code sent to{" "}
              <strong className="text-on-surface">{email}</strong>.
            </>
          ) : (
            "Please enter your verification code below."
          )}
        </p>

        {errorMsg && (
          <div className="mb-space-md p-space-sm rounded-lg bg-error-container text-on-error-container text-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-space-md p-space-sm rounded-lg bg-secondary-fixed text-on-secondary-fixed text-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-space-md">
          <div>
            <label
              htmlFor="otp"
              className="block font-label-md text-label-md text-on-surface font-medium mb-1.5"
            >
              6-Digit Verification Code
            </label>
            <div className="relative">
              <input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="123456"
                autoComplete="one-time-code"
                {...register("otp", {
                  required: "Verification code is required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Please enter all 6 digits",
                  },
                })}
                className="w-full px-space-md py-3 text-center tracking-[10px] text-2xl font-bold font-mono rounded-xl bg-surface-container-low border border-surface-container text-on-surface placeholder:tracking-normal placeholder:font-sans placeholder:text-base placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest"
              />
            </div>
            {errors.otp && (
              <p className="mt-1 text-label-sm text-error">{errors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || otpValue.length !== 6}
            className="w-full py-2.5 px-space-md rounded-xl bg-primary text-on-primary font-headline-sm text-body-md font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Verify & Activate Account</span>
              </>
            )}
          </button>
        </form>

        {/* Resend section */}
        <div className="mt-space-lg pt-space-md border-t border-surface-container flex flex-col items-center gap-2 text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Didn&apos;t receive the code?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || resending}
            className="font-headline-sm text-body-sm text-primary hover:underline font-semibold disabled:text-on-surface-variant disabled:no-underline disabled:cursor-not-allowed flex items-center gap-1"
          >
            {resending ? (
              <span>Sending new code...</span>
            ) : resendCooldown > 0 ? (
              <span>Resend code in {resendCooldown}s</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                <span>Resend Code</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-space-md text-center">
          <Link
            href="/auth/login"
            className="font-body-sm text-on-surface-variant hover:text-on-surface transition-colors inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <OtpContent />
    </Suspense>
  );
}
