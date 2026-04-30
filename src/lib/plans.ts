export type PlanId = "STARTER" | "PRO" | "STUDIO";

export type Currency = "PKR" | "USDT";

/**
 * Durations the user can pick at checkout, in months.
 * Each plan keeps its own *default* below — the default is what the pricing
 * page advertises and what gets pre-selected on the checkout page. The user
 * can still pick any of these values at checkout; the total scales linearly.
 */
export const MONTHLY_OPTIONS = [1, 3, 6, 12] as const;
export type DurationMonths = (typeof MONTHLY_OPTIONS)[number];

export interface PlanDetails {
  id: PlanId;
  name: string;
  tagline: string;
  /** Display-only USD figure used on legacy marketing copy. Real charge amounts live in {@link planPriceFor}. */
  priceUsd: number;
  /** Base PKR price *per month* before any duration discount. */
  pricePkr: number;
  /** Base USDT price *per month* before any duration discount. */
  priceUsdt: number;
  /** Default duration in months that the pricing page advertises. */
  defaultMonths: DurationMonths;
  /** Display label for the default duration ("1 month", "3 months", "1 year"). */
  durationLabel: string;
  /** @deprecated Use {@link planDurationDaysFor} (months × 30) instead. */
  durationDays: number;
  maxDevices: number;
  popular?: boolean;
  features: string[];
}

export const PLANS: PlanDetails[] = [
  {
    id: "STARTER",
    name: "Starter",
    tagline: "For trying things out.",
    priceUsd: 4,
    pricePkr: 1000,
    priceUsdt: 4,
    defaultMonths: 1,
    durationLabel: "1 month",
    durationDays: 30,
    maxDevices: 1,
    features: [
      "Unlimited videos",
      "All quality templates (up to 4K)",
      "Text & image watermarks with bounce",
      "1 device activation",
      "ZIP export",
      "Email support",
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    tagline: "For regular creators.",
    priceUsd: 7,
    pricePkr: 1800,
    priceUsdt: 7,
    defaultMonths: 3,
    durationLabel: "3 months",
    durationDays: 90,
    maxDevices: 1,
    popular: true,
    features: [
      "Everything in Starter",
      "Choose 1 / 3 / 6 / 12 month duration at checkout",
      "Priority email support",
      "Preset library access",
      "Save vs renewing Starter",
    ],
  },
  {
    id: "STUDIO",
    name: "Studio",
    tagline: "For studios and teams.",
    priceUsd: 11,
    pricePkr: 3000,
    priceUsdt: 11,
    defaultMonths: 12,
    durationLabel: "1 year",
    durationDays: 365,
    maxDevices: 2,
    features: [
      "Everything in Pro",
      "2 device activations",
      "Choose 1 / 3 / 6 / 12 month duration at checkout",
      "Priority support with SLA",
      "Best value per month",
    ],
  },
];

/**
 * Multi-month duration discount.
 *  1 month  → 0%   off
 *  3 months → 10%  off
 *  6 months → 20%  off
 * 12 months → 30%  off
 */
export function durationDiscount(months: DurationMonths): number {
  switch (months) {
    case 1:
      return 0;
    case 3:
      return 0.1;
    case 6:
      return 0.2;
    case 12:
      return 0.3;
  }
}

export function durationDiscountPercent(months: DurationMonths): number {
  return Math.round(durationDiscount(months) * 100);
}

export function getPlan(id: PlanId): PlanDetails {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan: ${id}`);
  return plan;
}

/** Base price for one month of the plan, before any discount. */
export function planPrice(id: PlanId, currency: Currency): number {
  const plan = getPlan(id);
  return currency === "PKR" ? plan.pricePkr : plan.priceUsdt;
}

/**
 * Pre-discount total for a given duration: `base × months`.
 */
export function planSubtotal(
  id: PlanId,
  currency: Currency,
  months: DurationMonths,
): number {
  return planPrice(id, currency) * months;
}

/**
 * Final charge for a given duration with the multi-month discount applied:
 *   total = base_per_month × months × (1 − discount)
 *
 * Discount ladder: 1mo 0%, 3mo 10%, 6mo 20%, 12mo 30%.
 *
 * Rounded to the nearest 10 PKR / whole dollar (USDT). The minimum is one
 * rounding unit so a misconfigured plan never produces a free entitlement.
 */
export function planPriceFor(
  id: PlanId,
  currency: Currency,
  months: DurationMonths,
): number {
  const subtotal = planSubtotal(id, currency, months);
  const raw = subtotal * (1 - durationDiscount(months));
  if (currency === "PKR") {
    return Math.max(10, Math.round(raw / 10) * 10);
  }
  return Math.max(1, Math.round(raw));
}

/** Amount the user saves vs. paying for the same duration at the 1-month rate. */
export function planSavingsFor(
  id: PlanId,
  currency: Currency,
  months: DurationMonths,
): number {
  return Math.max(0, planSubtotal(id, currency, months) - planPriceFor(id, currency, months));
}

export function planDurationDaysFor(months: DurationMonths): number {
  return months * 30;
}

export function isValidMonths(value: unknown): value is DurationMonths {
  return (
    typeof value === "number" &&
    (MONTHLY_OPTIONS as readonly number[]).includes(value)
  );
}

export function formatPrice(amount: number, currency: Currency): string {
  return currency === "PKR" ? `Rs. ${amount.toLocaleString("en-PK")}` : `$${amount}`;
}

export function formatDurationMonths(months: DurationMonths): string {
  if (months === 12) return "1 year";
  if (months === 1) return "1 month";
  return `${months} months`;
}
