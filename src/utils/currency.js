export const INR_TO_USD = 0.012;

export const toUsd = (amount) => Number(amount || 0) * INR_TO_USD;

export const formatMoney = (amount) => `$${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
