class automaticBalanceConfigRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async getConfig() {
    return this.db.main
      .automatic_balance_config
      .findOne({ raw: true });
  }

  async updateConfig(id, data) {
    const options = {
      where: { id }    
    };

    return this.db.main
      .automatic_balance_config
      .update(data, options);
  }

  async getExecutionStatus() {
    const options = {
      where: this.db.Sequelize.literal('DATE(choose_date) = CURRENT_DATE'),    
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
      raw: true,
    };

    return this.db.main
      .automatic_balance_execution_user_history
      .create(data, options);
  }
}

module.exports = automaticBalanceConfigRepository;