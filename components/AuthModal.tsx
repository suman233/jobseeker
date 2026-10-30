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
        // OTP verification step
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
        response?: {
          data?: { requireOtp?: boolean; email?: string; message?: string };
        };
        message?: string;
      };

      if (apiErr.response?.data?.requireOtp) {
        setOtpEmail(apiErr.response.data.email || data.email.trim());
        setMode("otp");
        setResendCooldown(60);
        setErrorMsg(
          apiErr.response.data.message ||
            "Please verify your email with the 6-digit OTP code sent to your email."
        );
        return;
      }

      setErrorMsg(
        apiErr.response?.data?.message ||
          apiErr.message ||
          "Failed to connect to backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!otpEmail || resendCooldown > 0 || resending) return;
    setErrorMsg("");
    setResending(true);

    try {
      const res = await resendOtpApi({ email: otpEmail });
      if (res.status) {
        setSuccessMsg("A new verification code has been sent!");
        setResendCooldown(60);
      } else {
        setErrorMsg(res.message || "Failed to resend verification code.");
      }
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setErrorMsg(
        apiErr.response?.data?.message ||
          apiErr.message ||
          "Failed to resend code."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm transition-opacity duration-200"
    >
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-space-lg shadow-2xl relative border border-surface-container animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-space-md border-b border-surface-container">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">
                {mode === "otp"
                  ? "mark_email_read"
                  : mode === "register"
                  ? "person_add"
                  : "person"}
              </span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                {mode === "otp"
                  ? "Email Verification"
                  : mode === "register"
                  ? "Create Candidate Profile"
                  : "Candidate Sign In"}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {mode === "otp"
                  ? "Enter the 6-digit code sent to your email"
                  : mode === "register"
                  ? "Join WorkSphere to apply for roles"
                  : "Sign in to manage your applications"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mt-space-md p-space-sm rounded-lg bg-error-container text-on-error-container text-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mt-space-md p-space-sm rounded-lg bg-secondary-fixed text-on-secondary-fixed text-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              check_circle
            </span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleAuthSubmit)}
          className="mt-space-md space-y-space-md"
        >
          {/* OTP Mode */}
          {mode === "otp" ? (
            <div className="space-y-space-md">
              <div className="text-center py-2">
                <p className="text-body-sm text-on-surface-variant">
                  Verification code sent to{" "}
                  <strong className="text-on-surface font-semibold">
                    {otpEmail}
                  </strong>
                </p>
              </div>

              <div>
                <label
                  htmlFor="modal-otp"
                  className="block font-label-md text-label-md text-on-surface font-medium mb-1.5"
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
                  className="w-full px-space-md py-3 text-center tracking-[8px] text-2xl font-bold font-mono rounded-xl bg-surface-container-low border border-surface-container text-on-surface placeholder:tracking-normal placeholder:font-sans placeholder:text-base placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest"
                />
                {errors.otp && (
                  <p className="mt-1 text-label-sm text-error">
                    {errors.otp.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otpWatch.length !== 6}
                className="w-full py-2.5 px-space-md rounded-xl bg-primary text-on-primary font-headline-sm text-body-md font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">
                      verified
                    </span>
                    <span>Verify Code</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_back
                  </span>
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || resending}
                  className="text-body-sm text-primary hover:underline font-semibold disabled:text-on-surface-variant disabled:no-underline disabled:cursor-not-allowed"
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
                    className="block font-label-md text-label-md text-on-surface font-medium mb-1"
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
                    className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest text-body-md"
                  />
                  {errors.name && (
                    <p className="mt-1 text-label-sm text-error">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="modal-email"
                  className="block font-label-md text-label-md text-on-surface font-medium mb-1"
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
                  className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest text-body-md"
                />
                {errors.email && (
                  <p className="mt-1 text-label-sm text-error">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="modal-password"
                  className="block font-label-md text-label-md text-on-surface font-medium mb-1"
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
                    className="w-full pl-space-md pr-11 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest text-body-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-[20px] select-none">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-label-sm text-error">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-space-md rounded-xl bg-primary text-on-primary font-headline-sm text-body-md font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">
                      {mode === "register" ? "person_add" : "login"}
                    </span>
                    <span>
                      {mode === "register"
                        ? "Register & Send OTP"
                        : "Sign In"}
                    </span>
                  </>
                )}
              </button>

              <div className="pt-space-sm border-t border-surface-container text-center">
                {mode === "login" ? (
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("register");
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                      className="text-primary hover:underline font-semibold"
                    >
                      Sign Up
                    </button>
                  </p>
                ) : (
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                      className="text-primary hover:underline font-semibold"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
