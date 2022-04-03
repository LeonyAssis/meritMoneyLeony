class ControlClaimTicketService {
  async getTicketsId(tickets) {
    return tickets.map((ticket) => {
      return ticket['ticket_id'];
    });
  }

  async getClaimsId(claims) {
    return claims.map((claim) => {
      return claim['control_claims_id'];
    });
  }

}

module.exports = ControlClaimTicketService;
