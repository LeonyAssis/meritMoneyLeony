class MachineClientService {

  constructor(params) {
    this.config = params;
    this.errorService = params.errorService;
    this.db = params.sequelize;
    this.machineClientRepository = params.machineClientRepository;
  }

  async getOrCreate(profile_id, account_id, t = null) {
    let machine_client = await this.machineClientRepository
      .getByProfileAndAccount(profile_id, account_id);

    if (!machine_client) {
      machine_client = await this.machineClientRepository
        .create({ profile_id, account_id }, t);
    }

    return machine_client;
  }

  async getOrCreateClientId(profile_id, account_id, t = null) {
    const machine_client = await this.getOrCreate(profile_id, account_id, t);
    return machine_client.id;
  }

  async _loadClientInfo(data) {
    let accounts_id = data
      .map(d => d.machine_client ? d.machine_client.account_id : null)
      .filter(id => id !== null);

    accounts_id = [...new Set(accounts_id)];
    if (accounts_id.length > 0) {
      const accounts = await this.machineClientRepository
        .getAccounts(accounts_id);

      return data
        .map(row => {
          if (row.machine_client) {
            row.machine_client.account = accounts
              .find(a => a.id == row.machine_client.account_id);
          }
          return row;
        });
    }
    return data;
  }

  async getClientInfo(data) {
    if (data.rows) {
      data.rows = await this._loadClientInfo(data.rows);
    } else if (Array.isArray(data)) {
      data = await this._loadClientInfo(data);
    } else {
      data = await this._loadClientInfo([data]);
      data = data[0];
    }
    return data;
  }
}

module.exports = MachineClientService;
