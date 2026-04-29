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
  /** Headline PKR price for the plan's default duration. */
  pricePkr: number;
  /** Headline USDT price for the plan's default duration. */
  priceUsdt: number;
  /** Default duration in months that the headline price corresponds to. */
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
    priceUsd: 7,
    pricePkr: 1000,
    priceUsdt: 7,
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
    priceUsd: 12,
    pricePkr: 1600,
    priceUsdt: 12,
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
    priceUsd: 18,
    pricePkr: 2200,
    priceUsdt: 18,
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

export function getPlan(id: PlanId): PlanDetails {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan: ${id}`);
  return plan;
}

/** Headline price (matches default duration). */
export function planPrice(id: PlanId, currency: Currency): number {
  const plan = getPlan(id);
  return currency === "PKR" ? plan.pricePkr : plan.priceUsdt;
}

/**
 * Total charge for a given duration. Prices scale linearly from the plan's
 * default-duration headline price: `total = headline × (months / defaultMonths)`.
 *
 * Rounded to the nearest 50 PKR / 1 USDT so the user never sees ugly figures
 * like Rs. 533 or $4.66. The rounding is currency-aware: PKR ⇒ nearest 50
 * (because cash payments round to the nearest 50 in Pakistan), USDT ⇒ whole
 * dollars.
 */
export function planPriceFor(
  id: PlanId,
  currency: Currency,
  months: DurationMonths,
): number {
  const plan = getPlan(id);
  const base = currency === "PKR" ? plan.pricePkr : plan.priceUsdt;
  const raw = (base * months) / plan.defaultMonths;
  if (currency === "PKR") {
    return Math.max(50, Math.round(raw / 50) * 50);
  }
  return Math.max(1, Math.round(raw));
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
