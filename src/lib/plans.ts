export type PlanId = "STARTER" | "PRO" | "STUDIO";

export interface PlanDetails {
  id: PlanId;
  name: string;
  tagline: string;
  priceUsd: number;
  durationLabel: string;
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
    priceUsd: 9,
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
    priceUsd: 19,
    durationLabel: "3 months",
    durationDays: 90,
    maxDevices: 1,
    popular: true,
    features: [
      "Everything in Starter",
      "3 months of updates",
      "Priority email support",
      "Preset library access",
      "Save ~30% vs Starter",
    ],
  },
  {
    id: "STUDIO",
    name: "Studio",
    tagline: "For studios and teams.",
    priceUsd: 59,
    durationLabel: "1 year",
    durationDays: 365,
    maxDevices: 2,
    features: [
      "Everything in Pro",
      "2 device activations",
      "12 months of updates",
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
