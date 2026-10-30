"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  loginUserApi,
  registerUserApi,
  verifyOtpApi,
  resendOtpApi,
  UserProfile,
} from "@/api/functions/user.api";
import { useAuthStore } from "@/zustand/auth.zustand";
import {
  Eye,
  EyeOff,
  X,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  LogIn,
  UserPlus,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: UserProfile, token: string) => void;
}

interface AuthFormInputs {
  name: string;
  email: string;
  password: string;
  otp: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<"login" | "register" | "otp">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [otpEmail, setOtpEmail] = useState("");

  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AuthFormInputs>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      otp: "",
    },
  });

  const otpWatch = watch("otp") || "";

  useEffect(() => {
    if (!isOpen) {
      reset();
      setMode("login");
      setErrorMsg("");
      setSuccessMsg("");
      setShowPassword(false);
    }
  }, [isOpen, reset]);

  // Resend OTP countdown
  useEffect(() => {
    if (mode !== "otp" || resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, resendCooldown]);

  if (!isOpen) return null;

  const handleAuthSubmit = async (data: AuthFormInputs) => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await registerUserApi({
          name: data.name.trim() || data.email.split("@")[0],
          email: data.email.trim(),
          password: data.password,
          role: "jobSeeker",
        });

        if (res.status) {
          setOtpEmail(data.email.trim());
          setMode("otp");
          setResendCooldown(60);
          setSuccessMsg(
            res.message || "A 6-digit verification code has been sent to your email!"
          );
        } else {
          setErrorMsg(res.message || "Registration failed.");
        }
      } else if (mode === "login") {
        const res = await loginUserApi({
          email: data.email.trim(),
          password: data.password,
        });

        if (res.requireOtp) {
          setOtpEmail(data.email.trim());
          setMode("otp");
          setResendCooldown(60);
          setSuccessMsg("Please verify your email. A verification code was sent.");
          return;
        }

        if (res.status && res.user && res.token) {
          setSuccessMsg(res.message || "Logged in successfully!");
          setAuth(res.user, res.token);
          onSuccess?.(res.user, res.token);
          setTimeout(() => {
            onClose();
          }, 600);
        } else {
          setErrorMsg(res.message || "Login failed.");
        }
      } else if (mode === "otp") {
        const emailToVerify = otpEmail || data.email.trim();
        const res = await verifyOtpApi({
          email: emailToVerify,
          otp: data.otp.trim(),
        });

        if (res.status && res.user && res.token) {
          setSuccessMsg(res.message || "Email verified successfully!");
          setAuth(res.user, res.token);
          onSuccess?.(res.user, res.token);
          setTimeout(() => {
            onClose();
          }, 600);
        } else {
          setErrorMsg(res.message || "Invalid verification code.");
        }
      }
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setErrorMsg(
        apiErr.response?.data?.message ||
          apiErr.message ||
          "Authentication request failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setErrorMsg("");
    try {
      const res = await resendOtpApi({ email: otpEmail });
      if (res.status) {
        setSuccessMsg(res.message || "New OTP sent to your email!");
        setResendCooldown(60);
      } else {
        setErrorMsg(res.message || "Failed to resend OTP.");
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
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {mode === "login"
                ? "Sign in to WorkSphere"
                : mode === "register"
                ? "Create Candidate Profile"
                : "Verify Email Address"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {mode === "login"
                ? "Access vetted tech roles and manage your applications."
                : mode === "register"
                ? "Join top tech talent with verified compensation insight."
                : `Enter the 6-digit code sent to ${otpEmail}`}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector Tabs (Login vs Register) */}
        {mode !== "otp" && (
          <div className="flex items-center bg-gray-100 p-1 rounded-xl mt-4">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === "login"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === "register"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <UserPlus size={14} />
              <span>Create Account</span>
            </button>
          </div>
        )}

        {/* Notifications / Alerts */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(handleAuthSubmit)}
          className="mt-4 space-y-3.5"
        >
          {/* OTP Mode */}
          {mode === "otp" ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="modal-otp"
                  className="block text-xs font-bold text-gray-700 mb-1"
                >
                  6-Digit OTP Code
                </label>
                <input
                  id="modal-otp"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  autoComplete="one-time-code"
                  {...register("otp", {
                    required: mode === "otp" ? "OTP is required" : false,
                    pattern: {
                      value: /^\d{6}$/,
                      message: "Please enter a 6-digit code",
                    },
                  })}
                  className="w-full px-4 py-2.5 text-center tracking-[10px] text-2xl font-bold font-mono rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
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
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"
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

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-xs text-gray-500 hover:text-gray-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || resending}
                  className="text-xs text-indigo-600 hover:underline font-semibold disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed cursor-pointer"
                >
                  {resending
                    ? "Sending..."
                    : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend Code"}
                </button>
              </div>
            </div>
          ) : (
            /* Login & Register Modes */
            <>
              {mode === "register" && (
                <div>
                  <label
                    htmlFor="modal-name"
                    className="block text-xs font-bold text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="modal-name"
                    type="text"
                    placeholder="e.g. Alex Morgan"
                    {...register("name", {
                      required:
                        mode === "register" ? "Full name is required" : false,
                      minLength: {
                        value: 3,
                        message: "Name must be at least 3 characters",
                      },
                    })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:bg-white text-xs transition-colors"
                  />
                  {errors.name && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="modal-email"
                  className="block text-xs font-bold text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="modal-email"
                  type="email"
                  placeholder="candidate@worksphere.com"
                  {...register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Please enter a valid email",
                    },
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:bg-white text-xs transition-colors"
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="modal-password"
                  className="block text-xs font-bold text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="modal-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      mode === "register"
                        ? "Create password (min. 6 chars)"
                        : "Enter your password"
                    }
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className="w-full pl-3.5 pr-10 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:bg-white text-xs transition-colors"
                  />
                  {/* Eye / EyeOff Password Visibility Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer p-0.5"
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
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {mode === "login" ? (
                      <>
                        <LogIn size={15} />
                        <span>Sign In</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={15} />
                        <span>Create Account & Get OTP</span>
                      </>
                    )}
                  </>
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
