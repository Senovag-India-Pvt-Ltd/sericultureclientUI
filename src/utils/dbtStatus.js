export const isPaymentSuccessInDbt = (status) =>
  status?.trim().toUpperCase() === "PAYMENT SUCCESS IN DBT";
