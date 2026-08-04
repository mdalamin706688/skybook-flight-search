"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { panel } from "@/lib/utils/design-tokens";
import { cn } from "@/lib/utils/cn";
import { bookingFormSchema, type BookingFormValues } from "@/lib/validation/schemas";

/** Pre-filled traveler details for one-click demo walkthroughs. */
const DEMO_TRAVELER: BookingFormValues = {
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 010-2048",
};

interface BookingFormProps {
  onSubmit: (values: BookingFormValues) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function BookingForm({ onSubmit, isLoading, error }: BookingFormProps) {
  const [values, setValues] = useState<BookingFormValues>(DEMO_TRAVELER);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormValues, string>>>({});

  function handleChange(field: keyof BookingFormValues, value: string) {
    setValues((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = bookingFormSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof BookingFormValues, string>> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as keyof BookingFormValues] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    onSubmit(result.data);
  }

  return (
    <form onSubmit={handleSubmit} className={cn(panel, "flex h-full flex-col overflow-hidden")} noValidate>
      <div className="border-b border-[var(--color-line)] bg-[var(--color-paper)] px-5 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
          Traveler details
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-[var(--color-ink-muted)]">Primary passenger on this reservation.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input label="First name" value={values.firstName} onChange={(e) => handleChange("firstName", e.target.value)} error={errors.firstName} autoComplete="given-name" />
          <Input label="Last name" value={values.lastName} onChange={(e) => handleChange("lastName", e.target.value)} error={errors.lastName} autoComplete="family-name" />
          <Input label="Email" type="email" value={values.email} onChange={(e) => handleChange("email", e.target.value)} error={errors.email} autoComplete="email" className="sm:col-span-2" />
          <Input label="Phone" type="tel" value={values.phone} onChange={(e) => handleChange("phone", e.target.value)} error={errors.phone} autoComplete="tel" className="sm:col-span-2" />
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
            {error}
          </p>
        )}

        <div className="mt-auto pt-6">
          <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
            Confirm booking
          </Button>
        </div>
      </div>
    </form>
  );
}
