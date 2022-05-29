class automaticBalanceRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async getConfig() {
    return this.db.main
      .automatic_balance_config
      .findOne({ raw: true });
  }

  async getAutomaticBalanceExecutionStatus(firstDayOfMonth, lastDayOfMonth) {
    const Op = this.db.Sequelize.Op;
    const options = {
      where: {
        created_at: {
          [Op.between]: [firstDayOfMonth, lastDayOfMonth]
        }
      },
      raw: true,       
    };

    return this.db.main
      .automatic_balance_execution_status
      .findOne(options);
  }
}

module.exports = automaticBalanceRepository;