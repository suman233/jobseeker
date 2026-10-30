"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { verifyOtpApi, resendOtpApi } from "@/api/functions/user.api";
import { useAuthStore } from "@/zustand/auth.zustand";
import {
  Mail,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  RotateCw,
  ArrowLeft,
  Briefcase,
} from "lucide-react";

interface OtpFormData {
  otp: string;
}

function OtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OtpFormData>({
    defaultValues: { otp: "" },
  });

  const otpWatch = watch("otp") || "";

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const onSubmit = async (data: OtpFormData) => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await verifyOtpApi({
        email: emailParam,
        otp: data.otp.trim(),
      });

      if (res.status && res.user && res.token) {
        setSuccessMsg(res.message || "Email verified successfully!");
        setAuth(res.user, res.token);
        setTimeout(() => {
          router.push("/dashboard/my-profile");
        }, 800);
      } else {
        setErrorMsg(res.message || "Invalid or expired OTP code.");
      }
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setErrorMsg(
        apiErr.response?.data?.message ||
          apiErr.message ||
          "Failed to verify OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending || !emailParam) return;
    setResending(true);
    setErrorMsg("");
    try {
      const res = await resendOtpApi({ email: emailParam });
      if (res.status) {
        setSuccessMsg(res.message || "New OTP has been sent to your email!");
        setResendCooldown(60);
      } else {
        setErrorMsg(res.message || "Could not resend OTP code.");
      }
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setErrorMsg(apiErr.response?.data?.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Briefcase size={18} className="stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 font-sans">
            WorkSphere
          </span>
        </div>

        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
          <Mail size={24} />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Verify Your Email
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          Please enter the 6-digit code sent to{" "}
          <strong className="text-gray-900">{emailParam || "your email"}</strong>
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="otp"
              className="block text-xs font-bold text-gray-700 mb-1"
            >
              6-Digit OTP Code
            </label>
            <input
              id="otp"
              type="text"
              maxLength={6}
              placeholder="123456"
              autoComplete="one-time-code"
              {...register("otp", {
                required: "OTP is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Please enter a valid 6-digit code",
                },
              })}
              className="w-full px-4 py-3 text-center tracking-[10px] text-2xl font-bold font-mono rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
            />
            {errors.otp && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.otp.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || otpWatch.length !== 6}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Verify Code</span>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-between pt-4 mt-2 text-xs border-t border-gray-100">
          <Link
            href="/auth/login"
            className="text-gray-500 hover:text-gray-800 transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            <span>Back to Login</span>
          </Link>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || resending}
            className="text-indigo-600 hover:underline font-semibold disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCw size={13} className={resending ? "animate-spin" : ""} />
            <span>
              {resending
                ? "Sending..."
                : resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend Code"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <OtpContent />
    </Suspense>
  );
}
