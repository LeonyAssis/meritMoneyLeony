'use strict';

module.exports = () => {
  return {

    generate: async (req, res) => {
      const commercialWalletReportPerformanceTrackingBs = req.scope
        .resolve('commercialWalletReportPerformanceTrackingBs');

      try {
        await commercialWalletReportPerformanceTrackingBs
          .generatePerformanceTracking(req);

        res.status(200)
          .end('200');
      } catch (err) {
        res.status(400)
          .end('400:360');
      }
    },

    send: async (req, res) => {
      const commercialWalletReportPerformanceTrackingBs = req.scope
        .resolve('commercialWalletReportPerformanceTrackingBs');

      try {
        await commercialWalletReportPerformanceTrackingBs
          .sendPerformanceTracking(req);

        res.status(200)
          .end('200');
      } catch (err) {
        res.status(400)
          .end('400:3600');
      }
    },
    list: async (req, res, next) => {
      const commercialWalletReportPerformanceTrackingBs = req.scope
        .resolve('commercialWalletReportPerformanceTrackingBs');

      try {
        let resp = await commercialWalletReportPerformanceTrackingBs
          .list(req);

        res.status(200)
          .send(resp);
      } catch (err) {
        next(err);
      }
    },
    resume: async (req, res, next) => {
      const commercialWalletReportPerformanceTrackingBs = req.scope
        .resolve('commercialWalletReportPerformanceTrackingBs');

      try {
        let resp = await commercialWalletReportPerformanceTrackingBs
          .resume(req);

        res.status(200)
          .send(resp);
      } catch (err) {
        next(err);
      }
    }
  };
};
