"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setSuccess(false);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    let hasError = false;

    // Name
    if (!trimmedName) {
      setErrors((prev) => ({
        ...prev,
        name: "Name is required",
      }));
      hasError = true;
    } else if (trimmedName.length < 2) {
      setErrors((prev) => ({
        ...prev,
        name: "Name must be at least 2 characters long",
      }));
      hasError = true;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      setErrors((prev) => ({
        ...prev,
        email: "Email is required",
      }));
      hasError = true;
    } else if (!emailRegex.test(trimmedEmail)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      hasError = true;
    }

    // Password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (!password) {
      setErrors((prev) => ({
        ...prev,
        password: "Password is required",
      }));
      hasError = true;
    } else if (!passwordRegex.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must be at least 8 characters and contain one uppercase, one lowercase, one number, and one special character",
      }));
      hasError = true;
    }

    // Confirm password
    if (!confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Please confirm your password",
      }));
      hasError = true;
    } else if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Create account
    const { error } = await authClient.signUp.email({
      name: trimmedName,
      email: trimmedEmail,
      password,
    });

    if (error) {
      setErrors((prev) => ({
        ...prev,
        email: error.message ?? "Unable to create account",
      }));
      return;
    }

    // Account successfully created
    setSuccess(true);

    // Clear form
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            AML Monitoring Platform
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Create your analyst account
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              Account created successfully.
            </p>

            <p className="mt-1 text-sm text-green-700/80 dark:text-green-400/80">
              Your account is currently inactive. Please contact an
              administrator to activate your account before signing in.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 ${
                errors.name ? "border-destructive" : ""
              }`}
              required
            />

            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 ${
                errors.email ? "border-destructive" : ""
              }`}
              required
            />

            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 ${
                errors.password ? "border-destructive" : ""
              }`}
              required
            />

            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 ${
                errors.confirmPassword ? "border-destructive" : ""
              }`}
              required
            />

            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="h-10 w-full rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
