"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginUserApi } from "@/api/functions/user.api";
import { useAuthStore } from "@/zustand/auth.zustand";

interface LoginFormData {
  email: string;
  password: string;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard/my-profile";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await loginUserApi({
        email: data.email.trim(),
        password: data.password,
      });

      if (res.requireOtp) {
        // User needs to verify email with OTP first
        router.push(`/auth/otp?email=${encodeURIComponent(data.email.trim())}`);
        return;
      }

      if (res.status && res.user && res.token) {
        setSuccessMsg(res.message || "Logged in successfully!");
        setAuth(res.user, res.token);
        setTimeout(() => {
          router.push(returnUrl);
        }, 600);
      } else {
        setErrorMsg(res.message || "Sign in failed.");
      }
    } catch (err: unknown) {
      const apiErr = err as {
        response?: {
          status?: number;
          data?: { requireOtp?: boolean; email?: string; message?: string };
        };
        message?: string;
      };

      if (apiErr.response?.data?.requireOtp) {
        const targetEmail = apiErr.response.data.email || data.email.trim();
        router.push(`/auth/otp?email=${encodeURIComponent(targetEmail)}`);
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

        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mb-1">
          Candidate Sign In
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-lg">
          Welcome back! Access your profile, saved jobs, and applications.
        </p>

        {errorMsg && (
          <div className="mb-space-md p-space-sm rounded-lg bg-error-container text-on-error-container text-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-space-md p-space-sm rounded-lg bg-secondary-fixed text-on-secondary-fixed text-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              check_circle
            </span>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-space-md">
          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block font-label-md text-label-md text-on-surface font-medium mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="candidate@worksphere.com"
              {...register("email", {
                required: "Email address is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Please enter a valid email address",
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

          {/* Password field with Visibility Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block font-label-md text-label-md text-on-surface font-medium"
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-label-sm text-primary hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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
                aria-label={showPassword ? "Hide password" : "Show password"}
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
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">
                  login
                </span>
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-space-lg pt-space-md border-t border-surface-container text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/auth/register"
              className="text-primary hover:underline font-semibold"
            >
              Sign Up as Candidate
            </Link>
          </p>
        </div>

        <div className="mt-space-md text-center">
          <Link
            href="/"
            className="font-body-sm text-on-surface-variant hover:text-on-surface transition-colors inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">
              arrow_back
            </span>
            <span>Return to Job Board</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
