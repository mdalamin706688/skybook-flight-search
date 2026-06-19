"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AIRPORTS } from "@/lib/constants/airports";
import { panel } from "@/lib/utils/design-tokens";
import { cn } from "@/lib/utils/cn";
import { searchFormSchema, type SearchFormValues } from "@/lib/validation/schemas";
import { useBookingStore } from "@/store/booking-store";

const airportOptions = AIRPORTS.map((a) => ({
  value: a.code,
  label: `${a.city} (${a.code})`,
}));

const defaultDate = "2026-07-15";

interface SearchFormProps {
  variant?: "hero" | "compact";
  className?: string;
}

export function SearchForm({ variant = "hero", className }: SearchFormProps) {
  const router = useRouter();
  const setSearchParams = useBookingStore((s) => s.setSearchParams);

  const [values, setValues] = useState<SearchFormValues>({
    origin: "JFK",
    destination: "LAX",
    date: defaultDate,
    passengers: 1,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SearchFormValues, string>>>({});

  function handleChange(field: keyof SearchFormValues, value: string | number) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = searchFormSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SearchFormValues, string>> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as keyof SearchFormValues] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setSearchParams(result.data);
    router.push(
      `/search?origin=${result.data.origin}&destination=${result.data.destination}&date=${result.data.date}&passengers=${result.data.passengers}`,
    );
  }

  const isCompact = variant === "compact";

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        panel,
        isCompact ? "p-4 shadow-[var(--shadow-xs)]" : "p-6 shadow-[var(--shadow-float)]",
        className,
      )}
    >
      {!isCompact && (
        <p className="mb-5 text-xs font-medium text-[var(--color-ink-faint)]">
          Round-trip search · 8 US airports
        </p>
      )}

      <div
        className={cn(
          "grid items-end gap-4",
          "grid-cols-1 sm:grid-cols-2",
          "lg:grid-cols-[1fr_1fr_0.85fr_72px_auto]",
        )}
      >
        <Select label="From" value={values.origin} onChange={(e) => handleChange("origin", e.target.value)} options={airportOptions} error={errors.origin} />
        <Select label="To" value={values.destination} onChange={(e) => handleChange("destination", e.target.value)} options={airportOptions} error={errors.destination} />
        <Input label="Depart" type="date" value={values.date} min={defaultDate} onChange={(e) => handleChange("date", e.target.value)} error={errors.date} />
        <Input label="Travelers" type="number" min={1} max={9} value={values.passengers} onChange={(e) => handleChange("passengers", Number(e.target.value))} error={errors.passengers} />
        <div className="col-span-full lg:col-span-1 lg:justify-self-end">
          <span className="hidden h-[22px] lg:block" aria-hidden="true" />
          <Button type="submit" className="w-full lg:min-w-[120px]">
            {isCompact ? "Update" : "Search"}
          </Button>
        </div>
      </div>
    </form>
  );
}
