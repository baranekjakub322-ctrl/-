export const RATES = { busOneDay: 300, busMultiDay: 250, kmPerDay: 350, overKm: 0.4, wertykulator: 110, aerator: 230 };

export const busRate = (days) => (days <= 1 ? RATES.busOneDay : RATES.busMultiDay);

export function busQuote(days, km = 0) {
  const d = Math.max(1, Number(days) || 1);
  const limit = d * RATES.kmPerDay;
  const over = Math.max(0, (Number(km) || 0) - limit);
  return { days: d, rate: busRate(d), total: d * busRate(d), limit, over, overCost: Math.round(over * RATES.overKm) };
}

export const zl = (n) => `${new Intl.NumberFormat("pl-PL").format(n)} zł`;
