const ANNUAL_RETURN = 0.12;

export function calculateOneTime(amount: number, years: number) {
  const estimated = amount * Math.pow(1 + ANNUAL_RETURN, years);
  return {
    invested: amount,
    estimated,
    gainPercent: ((estimated - amount) / amount) * 100
  };
}

export function calculateSip(monthlyAmount: number, years: number) {
  const months = years * 12;
  const monthlyRate = ANNUAL_RETURN / 12;
  const estimated =
    monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  const invested = monthlyAmount * months;
  return {
    invested,
    estimated,
    gainPercent: ((estimated - invested) / invested) * 100
  };
}
