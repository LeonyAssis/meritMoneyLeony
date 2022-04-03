'use strict';

module.exports = () => {
  return {
    linkTicket: async (req, res, next) => {
      const controlClaimTicketBs = req.scope
        .resolve('controlClaimTicketBs');

      try {
        await controlClaimTicketBs
          .linkTicket(req);
        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },

    unlinkTicket: async (req, res, next) => {
      const controlClaimTicketBs = req.scope
        .resolve('controlClaimTicketBs');

      try {
        await controlClaimTicketBs
          .unlinkTicket(req);
        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },

    listTicketByClaim: async (req, res, next) => {
      const controlClaimTicketBs = req.scope
        .resolve('controlClaimTicketBs');

      try {
        let tickets = await controlClaimTicketBs
          .listTicketByClaim(req.params.id);
        res.status(200)
          .send(tickets);
      } catch (err) {
        next(err);
      }
    },

    listClaimByTicket: async (req, res, next) => {
      const controlClaimTicketBs = req.scope.resolve('controlClaimTicketBs');

      try {
        let claims = await controlClaimTicketBs
          .listClaimByTicket(req.params.ticket_id);
        res.status(200)
          .send(claims);
      } catch (err) {
        next(err);
      }
    }

  };
};
