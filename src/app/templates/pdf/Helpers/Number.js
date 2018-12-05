export const amountFormat = (amount) => {
  if (!amount) return 0.00;
  amount = `${parseFloat(amount).toFixed(2)}`;
  return amount.replace(/./g, (c, i, a) => {
    return i && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c;
  });
};

export const toInt = (value) => {
  return parseInt(value.replace(/\,/g,""));
};