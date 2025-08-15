import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const navigate = useNavigate();

  const signIn = useAuthStore((state) => state.signIn);
  const isSigningIn = useAuthStore((state) => state.isSigningIn);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn(email, password, navigate);
  };
  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-lg bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black/20">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome back!
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Sign in to your account to continue
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </LabelInputContainer>

        <Button
          type="submit"
          className="mt-8 flex w-full cursor-pointer items-center justify-center"
          disabled={isSigningIn}
        >
          <h3>{isSigningIn ? "Signing in..." : "Sign in"}</h3>
          {!isSigningIn && <h4 className="text-xl">&rarr;</h4>}
        </Button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex items-center justify-center">
          <p>
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:text-primary/90 underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
