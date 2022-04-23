class automaticBalanceConfigRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async getConfig() {
    return this.db.main
      .automatic_balance_config
      .findAll({ raw: true });
  }

  async getExecutionStatus() {
    const options = {
      where: this.db.Sequelize.literal('DATE(choose_date) = CURRENT_DATE'),
      logging: true,
      raw: true,
    };

    return this.db.main
      .automatic_balance_execution_status
      .findOne(options);
  }

  async createExecution(data) {
    return this.db.main
      .automatic_balance_execution_status
      .create(data, {
        raw: true,
        nest: true,
      });
  }

  async updateExecution(id, data) {
    const options = {
      where: { id },
      raw: true,
    };

    return this.db.main
      .automatic_balance_execution_status
      .update(data, options);
  }

  async createExecutionUserHistory(data) {
    const options = {
      logging: true,
      raw: true,
    };

    return this.db.main
      .automatic_balance_execution_user_history
      .create(data, options);
  }
}

module.exports = automaticBalanceConfigRepository;