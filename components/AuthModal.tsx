"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  loginUserApi,
  registerUserApi,
  verifyOtpApi,
  resendOtpApi,
  sendEmailOtpApi,
  verifyEmailOtpApi,
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
  MailCheck,
  Send,
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
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [otpEmail, setOtpEmail] = useState("");

  // Pre-registration Email Verification states
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmailValue, setVerifiedEmailValue] = useState("");
  const [showInlineOtp, setShowInlineOtp] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false);
  const [emailOtpCooldown, setEmailOtpCooldown] = useState(0);

  // Standalone OTP screen countdown
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AuthFormInputs>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      otp: "",
    },
  });

  const emailWatch = watch("email") || "";
  const otpWatch = watch("otp") || "";

  useEffect(() => {
    if (!isOpen) {
      reset();
      setMode("login");
      setErrorMsg("");
      setSuccessMsg("");
      setShowPassword(false);
      setIsEmailVerified(false);
      setVerifiedEmailValue("");
      setShowInlineOtp(false);
      setEmailOtp("");
      setEmailOtpCooldown(0);
    }
  }, [isOpen, reset]);

  // Inline Email OTP cooldown timer
  useEffect(() => {
    if (emailOtpCooldown <= 0) return;
    const timer = setInterval(() => {
      setEmailOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [emailOtpCooldown]);

  // Standalone OTP screen countdown timer
  useEffect(() => {
    if (mode !== "otp" || resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, resendCooldown]);

  if (!isOpen) return null;

  // Handle "Verify" button click next to email during signup
  const handleSendEmailVerification = async () => {
    const emailToVerify = emailWatch.trim().toLowerCase();
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailToVerify || !emailRegex.test(emailToVerify)) {
      setErrorMsg("Please enter a valid email address first.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setSendingEmailOtp(true);

    try {
      const res = await sendEmailOtpApi({ email: emailToVerify });
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
          "Could not send verification code. Please check your email."
      );
    } finally {
      setSendingEmailOtp(false);
    }
  };

  // Handle inline OTP confirmation
  const handleConfirmEmailOtp = async () => {
    const emailToVerify = emailWatch.trim().toLowerCase();
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
        email: emailToVerify,
        otp: cleanOtp,
      });

      if (res.status) {
        setIsEmailVerified(true);
        setVerifiedEmailValue(emailToVerify);
        setShowInlineOtp(false);
        setEmailOtp("");
        setSuccessMsg("Email verified successfully! Please enter your name & password to complete registration.");
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
          "Invalid or expired verification code."
      );
    } finally {
      setVerifyingEmailOtp(false);
    }
  };

  // Main form submit (Register / Login / Standalone OTP)
  const handleAuthSubmit = async (data: AuthFormInputs) => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (mode === "register") {
        const cleanEmail = data.email.trim().toLowerCase();

        // Ensure user verified their email before registering
        if (!isEmailVerified || verifiedEmailValue !== cleanEmail) {
          setErrorMsg(
            "Please click the 'Verify' button next to your email to verify your email address before creating an account."
          );
          setLoading(false);
          return;
        }

        const res = await registerUserApi({
          name: data.name.trim() || cleanEmail.split("@")[0],
          email: cleanEmail,
          password: data.password,
          role: "jobSeeker",
        });

        if (res.status) {
          // Registration complete & verified -> move smoothly back to Login form
          setSuccessMsg(
            "Account registered successfully! Please sign in with your email and password."
          );
          setValue("email", cleanEmail);
          setValue("password", "");
          setIsEmailVerified(false);
          setVerifiedEmailValue("");
          setTimeout(() => {
            setMode("login");
          }, 1200);
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
          setSuccessMsg("Please verify your email. A verification code has been sent.");
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
          setErrorMsg(res.message || "Sign in failed.");
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

  const handleResendStandaloneOtp = async () => {
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
                ? "Verify your email to create a secure candidate profile."
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
          {/* Standalone OTP Mode (e.g. for unverified login attempts) */}
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
                  onClick={handleResendStandaloneOtp}
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
              {/* Email Address Field with "Verify" button */}
              <div>
                <label
                  htmlFor="modal-email"
                  className="block text-xs font-bold text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <input
                    id="modal-email"
                    type="email"
                    readOnly={mode === "register" && isEmailVerified}
                    placeholder="candidate@worksphere.com"
                    {...register("email", {
                      required: "Email address is required",
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
                    className={`w-full pl-3.5 pr-24 py-2 rounded-xl border text-xs transition-colors ${
                      mode === "register" && isEmailVerified
                        ? "bg-emerald-50/60 border-emerald-300 text-emerald-900 font-medium"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                    }`}
                  />

                  {/* Verification action inside email field during Register mode */}
                  {mode === "register" && (
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
                          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                        >
                          {sendingEmailOtp ? (
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <MailCheck size={13} />
                          )}
                          <span>
                            {emailOtpCooldown > 0
                              ? `${emailOtpCooldown}s`
                              : "Verify"}
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="mt-1 text-[11px] text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Inline OTP Verification Box (shown during Register mode when user clicks "Verify") */}
              {mode === "register" && showInlineOtp && !isEmailVerified && (
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
                      className="flex-1 px-3 py-1.5 text-center tracking-[6px] font-mono font-bold text-base rounded-lg bg-white border border-indigo-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-600"
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

              {/* Full Name Field (Register only) */}
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

              {/* Password Field */}
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

              {/* Submit Button */}
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
                        <span>Create Verified Account</span>
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
