'use strict';

class CommercialWalletNotesRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async create(note) {
    return this.db.main
      .commercial_wallet_notes
      .create(note);
  }

  async list(commercial_wallet_id, pagination) {
    const options = {
      where: {
        commercial_wallet_id: commercial_wallet_id
      },
      include: [{
        model: this.db.main.commercial_wallet_note_types,
        attributes: ['id', 'name'],
        required: true
      }],
      order: [
        ['updated_at', pagination.order]
      ],
      raw: true,
      offset: pagination.offset,
      limit: pagination.limit,

    };

    return this.db.main
      .commercial_wallet_notes
      .findAll(options);
  }

  async list_by_document(document, pagination, term, type, important) {
    const options = {
      where: {
        content: {
          [this.db.Sequelize.Op.like]: '%' + term + '%'
        }
      },
      include: [{
        model: this.db.main.commercial_wallets,
        atributes: ['id'],
        where: {
          document: document
        },
        required: true
      }, {
        model: this.db.main.commercial_wallet_note_types,
        attributes: ['id', 'name'],
        required: true
      }],
      order: [
        ['updated_at', pagination.order]
      ],
      raw: true,
      offset: pagination.offset,
      limit: pagination.limit,

    };

    if (type != 0)
      options.where.note_types_id = type;

    if (important != null)
      options.where.important = important;

    return this.db.main
      .commercial_wallet_notes
      .findAll(options);
  }
}

module.exports = CommercialWalletNotesRepository;
