"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AIRPORTS } from "@/lib/constants/airports";
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

function SearchButton({
  compact,
  className,
}: {
  compact: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-1", className)}>
      {/* Spacer aligns button with inputs when fields have labels above them */}
      <span
        className="hidden h-5 text-sm font-medium lg:block"
        aria-hidden="true"
      />
      <Button
        type="submit"
        size="md"
        className="h-[38px] w-full whitespace-nowrap lg:min-w-[128px]"
      >
        {compact ? "Search" : "Search flights"}
      </Button>
    </div>
  );
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
        const field = issue.path[0] as keyof SearchFormValues;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSearchParams(result.data);
    const params = new URLSearchParams({
      origin: result.data.origin,
      destination: result.data.destination,
      date: result.data.date,
      passengers: String(result.data.passengers),
    });
    router.push(`/search?${params.toString()}`);
  }

  const isCompact = variant === "compact";

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        isCompact ? "p-4" : "p-5",
        className,
      )}
    >
      <div
        className={cn(
          "grid items-end gap-3",
          "grid-cols-1 sm:grid-cols-2",
          "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.15fr)_minmax(0,0.95fr)_88px_auto]",
        )}
      >
        <Select
          label="From"
          value={values.origin}
          onChange={(e) => handleChange("origin", e.target.value)}
          options={airportOptions}
          error={errors.origin}
        />
        <Select
          label="To"
          value={values.destination}
          onChange={(e) => handleChange("destination", e.target.value)}
          options={airportOptions}
          error={errors.destination}
        />
        <Input
          label="Date"
          type="date"
          value={values.date}
          min={defaultDate}
          onChange={(e) => handleChange("date", e.target.value)}
          error={errors.date}
        />
        <Input
          label="Passengers"
          type="number"
          min={1}
          max={9}
          value={values.passengers}
          onChange={(e) => handleChange("passengers", Number(e.target.value))}
          error={errors.passengers}
        />
        <SearchButton
          compact={isCompact}
          className="col-span-full sm:col-span-2 lg:col-span-1 lg:justify-self-end"
        />
      </div>
    </form>
  );
}
