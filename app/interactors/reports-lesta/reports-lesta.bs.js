'use strict';

const Interactor = require('../interactor.bs');

class ReportsLestaBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.transactionService = params.transactionService;
    this.reportsLestaRepository = params.reportsLestaRepository;
    this.config = params.config;
    this.reportsLestaService = params.reportsLestaService;
  }

  async get_analyst_queue_ticket_info() {
    let tempGn = 0;
    let tempCliente = 0;
    let report = [];
    let objTotal = {};

    const lestaQueues = ['Suporte', 'Cartao_logistica', 'Erro_abertura_conta', 'Acesso_bloqueado', 'Demandas_cadastrais', 'Retencao_clientes'];

    const ratings = await this.reportsLestaRepository
      .getRatings(['Resolvido', 'Sem solução', 'Sendo resolvido']);

    const gnUser = await this.reportsLestaRepository
      .findUser(['usuario_gerencianet'], 'in');

    const lestaQueuesId = await this.reportsLestaRepository
      .findUser(lestaQueues, 'in');

    const lestaUsers = await this.reportsLestaRepository
      .findUser('@lesta.com.br', 'like');

    const users = [...new Set([...lestaQueuesId, ...lestaUsers])];

    const countTicketsByUser = await this.reportsLestaRepository
      .countTicketsByUser(ratings, users);

    const dates = await this.reportsLestaService
      .getDates();

    for (let user of countTicketsByUser) {
      let messageCount = await this.reportsLestaRepository
        .userMessageCount(gnUser, user.id);

      let ticketsUser = await this.reportsLestaRepository
        .getAllTickets(user.id);

      ticketsUser = await this.reportsLestaService
        .formatTickets(ticketsUser);

      let interactedTickets = await this.reportsLestaRepository
        .interactedTickets(user.id, dates);

      if (messageCount.length == 0) {
        objTotal = {
          owner: user.id,
          name: user.name,
          inbox: 0,
          tickets: null,
          resolved: user.resolved,
          without_solution: user.without_solution,
          being_resolved: user.being_resolved,
          archived: user.archived,
          gn: 0,
          cliente: 0,
          email: user.email,
          interected_tickets: interactedTickets
        };
      }
      else {
        messageCount.forEach(message => {
          tempGn += message.gn == null || message.gn == 0 ? 0 : 1;
          tempGn += message.gn_transfer == null || message.gn_transfer == 0 ? 0 : 1;
          tempCliente += message.cliente == null || message.cliente == 0 ? 0 : 1;

          objTotal = {
            owner: user.id,
            name: user.name,
            tickets: ticketsUser,
            inbox: user.INBOX,
            resolved: user.resolved,
            without_solution: user.without_solution,
            being_resolved: user.being_resolved,
            archived: user.archived,
            gn: tempGn,
            cliente: tempCliente,
            email: user.email,
            interected_tickets: interactedTickets
          };
        });
      }

      report.push(objTotal);
      tempGn = 0;
      tempCliente = 0;
    }
    return report;
  }
}

module.exports = ReportsLestaBs;
