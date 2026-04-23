export const formatDateTime = (value, options = {}) => {
  if (!value) return "";

  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      ...options,
    }).format(date);
  } catch {
    return "";
  }
};

export const formatDate = (value) =>
  formatDateTime(value, { hour: undefined, minute: undefined });

export const formatCurrency = (amount = 0, currency = "INR") => {
  const num = Number(amount);
  if (isNaN(num)) return `${currency} 0.00`;

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
    }).format(num);
  } catch {
    return `${currency} ${num.toFixed(2)}`;
  }
};
