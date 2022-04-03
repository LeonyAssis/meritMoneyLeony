'use-strict';

module.exports = () => {
  return {
    get_analyst_queue_ticket_info: async (req, res, next) => {
      const reportsLestaBs = req.scope
        .resolve('reportsLestaBs');

      try {
        let report = await reportsLestaBs
          .get_analyst_queue_ticket_info();

        res.status(200)
          .send(report);
      } catch (err) {
        next(err);
      }
    }
  };
};
