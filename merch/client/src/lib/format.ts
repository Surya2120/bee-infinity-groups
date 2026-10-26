export function formatINR(amount: number) {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
      amount
    );
  } catch {
    return `INR ${Math.round(amount)}`;
  }
}

