"use client";
import React from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type Props = {
  label?: string;
  className?: string;
};

const SubmitButton = ({ label = "Submit", className }: Props) => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} className={className}>
      {pending ? <Loader2 className="animate-spin" /> : label}
    </Button>
  );
};

export default SubmitButton;
