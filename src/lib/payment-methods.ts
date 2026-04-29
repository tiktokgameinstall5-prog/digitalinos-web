import type { Currency } from "./plans";

export type PaymentMethodId = "EASYPAISA" | "NAYAPAY" | "JAZZCASH" | "BINANCE";

export interface PaymentMethodDetails {
  id: PaymentMethodId;
  label: string;
  currency: Currency;
  /** Account number, phone, or wallet ID the user should send funds to. */
  account: string;
  accountLabel: string;
  /** Account holder / wallet username. */
  holder: string;
  holderLabel: string;
  /** Optional secondary line, e.g. Binance username vs ID. */
  secondary?: { label: string; value: string };
  /** Short instructions to display below the method. */
  instructions: string;
}

export const PAYMENT_METHODS: PaymentMethodDetails[] = [
  {
    id: "EASYPAISA",
    label: "EasyPaisa",
    currency: "PKR",
    account: "03435076055",
    accountLabel: "Account number",
    holder: "Ahmad Hassan",
    holderLabel: "Account title",
    instructions:
      "Send the exact amount via the EasyPaisa app or any agent. Save the transaction ID (TID) shown after payment.",
  },
  {
    id: "NAYAPAY",
    label: "NayaPay",
    currency: "PKR",
    account: "03085076055",
    accountLabel: "Account number",
    holder: "Ahmad Hassan",
    holderLabel: "Account title",
    instructions:
      "Send the exact amount from your NayaPay app. Copy the transaction ID from the receipt.",
  },
  {
    id: "JAZZCASH",
    label: "JazzCash",
    currency: "PKR",
    account: "03085076055",
    accountLabel: "Account number",
    holder: "Ahmad Hassan",
    holderLabel: "Account title",
    instructions:
      "Send the exact amount via JazzCash. Save the transaction reference number from the receipt.",
  },
  {
    id: "BINANCE",
    label: "Binance Pay",
    currency: "USDT",
    account: "370870535",
    accountLabel: "Pay ID",
    holder: "Ahmad1108",
    holderLabel: "Username",
    secondary: { label: "Network", value: "Binance Pay (internal)" },
    instructions:
      "Send the exact USDT amount via Binance Pay using the Pay ID or username above. Copy the transaction ID from your Binance Pay history.",
  },
];

export function getMethodsForCurrency(currency: Currency): PaymentMethodDetails[] {
  return PAYMENT_METHODS.filter((m) => m.currency === currency);
}

export function getMethod(id: PaymentMethodId): PaymentMethodDetails | undefined {
  return PAYMENT_METHODS.find((m) => m.id === id);
}
