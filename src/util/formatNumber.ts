const formatNumber = (num: number, decimals: number = 2): string => {
  return parseFloat(num.toPrecision(decimals)).toString();
};

export default formatNumber;
