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

  const signUp = useAuthStore((state) => state.signUp);
  const isSigningUp = useAuthStore((state) => state.isSigningUp);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUp(fullName, email, password, confirmPassword, navigate);
  };
  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-lg bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black/20">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to ChatsApp
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Create an account to start chatting
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="fullname">Full name</Label>
          <Input
            id="fullname"
            placeholder="Tyler Durden"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="text"
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
        <LabelInputContainer className="mb-8">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            placeholder="••••••••"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </LabelInputContainer>

        <Button
          type="submit"
          className="mt-8 flex w-full cursor-pointer items-center justify-center"
          disabled={isSigningUp}
        >
          <h3>{isSigningUp ? "Signing up..." : "Sign up"}</h3>
          {!isSigningUp && <h4 className="text-xl">&rarr;</h4>}
        </Button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex items-center justify-center">
          <p>
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-primary hover:text-primary/90 underline"
            >
              Sign in
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
