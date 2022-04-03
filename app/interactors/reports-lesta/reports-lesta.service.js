class MachineOrdersService {

  constructor(params) {
    this.config = params;
    this.errorService = params.errorService;
    this.db = params.sequelize;
    this.reportsLestaRepository = params.reportsLestaRepository;
    this.dateFormat = require('dateformat');
  }

  async formatTickets(userTickets) {
    let tickets = [];

    userTickets.forEach(l => {
      tickets.push({
        id: l.tickets.id,
        created_at: this.dateFormat(l.tickets.created_at, 'dd-mm-yyyy HH:MM:ss')
      });
    });
    return tickets;
  }

  async getDates() {
    let date = new Date();
    let dateToday = this.dateFormat(date.setDate(date.getDate()), 'yyyy-mm-dd');
    let dateTomorrow = this.dateFormat(date.setDate(date.getDate() + 1), 'yyyy-mm-dd');

    return { dateToday, dateTomorrow };
  }




}

module.exports = MachineOrdersService;
