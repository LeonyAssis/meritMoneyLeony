'use strict';
class MachineClientRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  get(id) {
    return this.db.main
      .machine_clients
      .findOne({
        where: {
          id
        },
        raw: true
      });
  }

  getByProfileAndAccount(profile_id, account_id) {
    return this.db.main
      .machine_clients
      .findOne({
        where: {
          profile_id,
          account_id
        },
        raw: true
      });
  }

  create(payload, transaction = null) {
    return this.db.main
      .machine_clients
      .create(payload, {
        transaction,
        raw: true
      });
  }

  getAccounts(id) {
    return this.db.core
      .account
      .findAll({
        attributes: ['id', 'number', 'check_digit', 'nickname', 'email'],
        where: {
          id: id
        },
        // raw: true,
        nest: true,
        include: [{
          model: this.db.core.document,
          attributes: ['id'],
          required: true,
          include: [{
            model: this.db.core.profile,
            attributes: ['id', 'cpf', 'cellphone', 'email', 'name', 'birth'],
            required: true
          }, {
            model: this.db.core.corporation,
            attributes: ['cnpj', 'name'],
            required: false
          }]
        }]
      });
  }
}

module.exports = MachineClientRepository;
