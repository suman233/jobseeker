"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  registerUserApi,
  sendEmailOtpApi,
  verifyEmailOtpApi,
} from "@/api/functions/user.api";
import {
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  Briefcase,
  MailCheck,
  ShieldCheck,
  X,
} from "lucide-react";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Email verification state
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmailValue, setVerifiedEmailValue] = useState("");
  const [showInlineOtp, setShowInlineOtp] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false);
  const [emailOtpCooldown, setEmailOtpCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const emailWatch = watch("email") || "";

  useEffect(() => {
    if (emailOtpCooldown <= 0) return;
    const timer = setInterval(() => {
      setEmailOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [emailOtpCooldown]);

  const handleSendEmailVerification = async () => {
    const cleanEmail = emailWatch.trim().toLowerCase();
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMsg("Please enter a valid email address first.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setSendingEmailOtp(true);

    try {
      const res = await sendEmailOtpApi({ email: cleanEmail });
      if (res.status) {
        setShowInlineOtp(true);
        setEmailOtpCooldown(60);
        setSuccessMsg(
          res.message || "A 6-digit verification code has been sent to your email!"
        );
      } else {
        setErrorMsg(res.message || "Failed to send verification code.");
      }
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setErrorMsg(
        apiErr.response?.data?.message ||
          apiErr.message ||
          "Could not send verification code."
      );
    } finally {
      setSendingEmailOtp(false);
    }
  };

  const handleConfirmEmailOtp = async () => {
    const cleanEmail = emailWatch.trim().toLowerCase();
    const cleanOtp = emailOtp.trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setVerifyingEmailOtp(true);

    try {
      const res = await verifyEmailOtpApi({
        email: cleanEmail,
        otp: cleanOtp,
      });

      if (res.status) {
        setIsEmailVerified(true);
        setVerifiedEmailValue(cleanEmail);
        setShowInlineOtp(false);
        setEmailOtp("");
        setSuccessMsg(
          "Email verified successfully! Please enter your name and password to complete registration."
        );
      } else {
        setErrorMsg(res.message || "Invalid or expired verification code.");
      }
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setErrorMsg(
        apiErr.response?.data?.message ||
          apiErr.message ||
          "Failed to verify code."
      );
    } finally {
      setVerifyingEmailOtp(false);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    const cleanEmail = data.email.trim().toLowerCase();

    if (!isEmailVerified || verifiedEmailValue !== cleanEmail) {
      setErrorMsg(
        "Please click 'Verify' next to your email address before creating an account."
      );
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await registerUserApi({
        name: data.name.trim(),
        email: cleanEmail,
        password: data.password,
        role: "jobSeeker",
      });

      if (res.status) {
        setSuccessMsg(
          "Account created successfully! Redirecting you to sign in..."
        );
        setTimeout(() => {
          router.push("/auth/login");
        }, 1200);
      } else {
        setErrorMsg(res.message || "Registration failed.");
      }
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setErrorMsg(
        apiErr.response?.data?.message ||
          apiErr.message ||
          "Failed to register candidate account."
      );
    } finally {
      setLoading(false);
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

        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Create Candidate Profile
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          Verify your email to create an authenticated high-growth talent profile.
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
          {/* Email Address with Verify Button */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <input
                id="email"
                type="email"
                readOnly={isEmailVerified}
                placeholder="candidate@worksphere.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Please enter a valid email",
                  },
                  onChange: () => {
                    if (isEmailVerified) {
                      setIsEmailVerified(false);
                      setVerifiedEmailValue("");
                    }
                  },
                })}
                className={`w-full pl-3.5 pr-24 py-2.5 rounded-xl border text-xs transition-colors ${
                  isEmailVerified
                    ? "bg-emerald-50/60 border-emerald-300 text-emerald-900 font-medium"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                }`}
              />

              <div className="absolute right-1.5 flex items-center">
                {isEmailVerified ? (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    <CheckCircle2 size={13} className="text-emerald-700" />
                    <span>Verified</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEmailVerified(false);
                        setVerifiedEmailValue("");
                      }}
                      className="ml-1 text-[10px] text-emerald-600 underline hover:text-emerald-900 cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendEmailVerification}
                    disabled={
                      sendingEmailOtp ||
                      !emailWatch ||
                      !/^\S+@\S+\.\S+$/.test(emailWatch) ||
                      emailOtpCooldown > 0
                    }
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    {sendingEmailOtp ? (
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <MailCheck size={13} />
                    )}
                    <span>
                      {emailOtpCooldown > 0 ? `${emailOtpCooldown}s` : "Verify"}
                    </span>
                  </button>
                )}
              </div>
            </div>
            {errors.email && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Inline OTP Verification Card */}
          {showInlineOtp && !isEmailVerified && (
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2.5 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between text-xs text-indigo-950 font-medium">
                <span className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck size={14} className="text-indigo-600" />
                  Enter 6-Digit Email Code
                </span>
                <button
                  type="button"
                  onClick={() => setShowInlineOtp(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-[11px] text-gray-600">
                Code sent to <strong className="text-indigo-900">{emailWatch}</strong>
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="flex-1 px-3 py-2 text-center tracking-[6px] font-mono font-bold text-base rounded-lg bg-white border border-indigo-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
                <button
                  type="button"
                  onClick={handleConfirmEmailOtp}
                  disabled={verifyingEmailOtp || emailOtp.length !== 6}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs transition-all cursor-pointer"
                >
                  {verifyingEmailOtp ? (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-gray-500">Didn&apos;t receive it?</span>
                <button
                  type="button"
                  onClick={handleSendEmailVerification}
                  disabled={emailOtpCooldown > 0 || sendingEmailOtp}
                  className="text-indigo-600 hover:underline font-bold disabled:text-gray-400 disabled:no-underline cursor-pointer"
                >
                  {emailOtpCooldown > 0
                    ? `Resend in ${emailOtpCooldown}s`
                    : "Resend Code"}
                </button>
              </div>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Alex Morgan"
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:bg-white text-xs transition-colors"
            />
            {errors.name && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create password (min. 6 characters)"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:bg-white text-xs transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Creating Verified Profile...</span>
              </>
            ) : (
              <>
                <UserPlus size={15} />
                <span>Create Verified Account</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Already registered?{" "}
          <Link
            href="/auth/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
