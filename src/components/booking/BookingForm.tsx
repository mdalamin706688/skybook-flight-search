"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  bookingFormSchema,
  type BookingFormValues,
} from "@/lib/validation/schemas";

interface BookingFormProps {
  onSubmit: (values: BookingFormValues) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function BookingForm({ onSubmit, isLoading, error }: BookingFormProps) {
  const [values, setValues] = useState<BookingFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormValues, string>>>({});

  function handleChange(field: keyof BookingFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = bookingFormSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof BookingFormValues, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof BookingFormValues;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit(result.data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      noValidate
    >
      <h2 className="text-lg font-semibold text-slate-900">Passenger information</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="First name"
          value={values.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          error={errors.firstName}
          autoComplete="given-name"
        />
        <Input
          label="Last name"
          value={values.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          error={errors.lastName}
          autoComplete="family-name"
        />
        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <Input
          label="Phone"
          type="tel"
          value={values.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          error={errors.phone}
          autoComplete="tel"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
        Confirm booking
      </Button>
    </form>
  );
}
