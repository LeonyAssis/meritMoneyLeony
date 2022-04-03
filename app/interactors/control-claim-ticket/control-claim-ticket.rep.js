'use strict';

class ControlClaimTicketRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async linkTicket(ticket) {
    return this.db.main
      .control_claim_tickets
      .create(ticket);
  }

  async unlinkTicket(req) {
    let options = {
      where: {
        ticket_id: req.params.ticket_id,
        control_claims_id: req.body.control_claims_id
      }
    };

    return this.db.main
      .control_claim_tickets
      .destroy(options);
  }

  async listTicketByClaim(id) {
    let options = {
      where: {
        control_claims_id: id
      },
      attributes: ['ticket_id']
    };

    return this.db.main
      .control_claim_tickets
      .findAll(options);
  }

  async listClaimByTicket(ticket_id) {
    let options = {
      where: {
        ticket_id: ticket_id
      },
      attributes: ['control_claims_id']
    };

    return this.db.main
      .control_claim_tickets
      .findAll(options);
  }

}

module.exports = ControlClaimTicketRepository;
