import type { ReactNode } from "react";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface FieldError {
  field: "email" | "password";
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: FieldError[];
}

export interface ProviderConfig {
  id: string;
  label: string;
  href: string;
  color: string;
  icon: ReactNode;
}
