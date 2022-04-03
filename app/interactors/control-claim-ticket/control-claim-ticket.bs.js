'use strict';

const Interactor = require('../interactor.bs');

class ControlClaimTicketBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.controlClaimTicketRepository = params.controlClaimTicketRepository;
    this.controlClaimCommentRepository = params.controlClaimCommentRepository;
    this.controlClaimTicketService = params.controlClaimTicketService;
  }

  async linkTicket(req) {
    this.validator.execute('control-claim-ticket.json', req.body);

    let ticket = req.body;
    ticket.ticket_id = req.params.ticket_id;

    let claim = await this.controlClaimCommentRepository
      .getClaim(ticket.control_claims_id);

    if (!claim)
      throw this.errorService
        .get('control_claims_not_found');

    await this.controlClaimTicketRepository
      .linkTicket(ticket);

  }

  async unlinkTicket(req) {
    this.validator.execute('control-claim-ticket.json', req.body);

    let ticket = await this.controlClaimTicketRepository
      .unlinkTicket(req);

    if (ticket == 0)
      throw this.errorService
        .get('control_claim_found_no_ticket');
  }

  async listTicketByClaim(id) {
    let tickets = await this.controlClaimTicketRepository
      .listTicketByClaim(id);

    tickets = await this.controlClaimTicketService.getTicketsId(tickets);

    return tickets;
  }

  async listClaimByTicket(ticket_id) {
    let claims = await this.controlClaimTicketRepository
      .listClaimByTicket(ticket_id);

    claims = await this.controlClaimTicketService.getClaimsId(claims);

    return claims;
  }


}

module.exports = ControlClaimTicketBs;
