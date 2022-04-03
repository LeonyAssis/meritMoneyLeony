'use strict';

module.exports = () => {
  return {
    get_time_and_costs: async (req, res, next) => {
      const shippingBs = req.scope
        .resolve('shippingBs');
      try {
        let response = await shippingBs
          .getTimeAndCosts(req);
        res.status(200)
          .send(response);
      } catch (err) {
        next(err);
      }
    }
  };
};
