class CommercialWalletReportPerformanceTrackingService {
  async get_month(reference_date) {
    return (RegExp('([12]\\d{3}-(0[1-9]|1[0-2]))').exec(reference_date) == null) ? null : parseInt(reference_date.substring(5, 7));
  }

  async get_year(reference_date) {
    return (RegExp('([12]\\d{3}-(0[1-9]|1[0-2]))').exec(reference_date) == null) ? null : parseInt(reference_date.substring(0, 4));
  }

  async DateIsCurrentMonth(date) {
    return (date.getMonth != new Date().getMonth) ? false : true;
  }

  async capitalize(string) {
    return string.toLowerCase().replace(/\b./g, function (a) {
      return a.toUpperCase();
    });
  }

  async get_variations(commercial_wallet) {
    if (commercial_wallet.variations.length > 0) {
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      let variations = [];
      commercial_wallet.variations.forEach(variation => {
        variations.push(variation.value);
      });
      commercial_wallet.variation_sum = variations.reduce(reducer).toFixed(2);
    }
  }

  async get_total_amount_receipt_number(commercial_wallet) {
    let total_amount = [];
    let receipt_number = [];
    if (commercial_wallet.performance_trackings.length > 0) {
      commercial_wallet.performance_trackings.forEach(performance_tracking => {
        total_amount.push(performance_tracking.total_amount);
        receipt_number.push(performance_tracking.receipt_number);
      });
      commercial_wallet.total_amount = Math.max.apply(null, total_amount);
      commercial_wallet.receipt_number = Math.max.apply(null, receipt_number);
    }
  }
}

module.exports = CommercialWalletReportPerformanceTrackingService;
