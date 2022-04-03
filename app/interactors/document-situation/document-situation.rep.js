'use strict';
class DocumentSituationRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async create(message_id, type, document, situation, updated_situation_at, received_at) {
    let data = {
      message_id: message_id,
      type: type,
      document: document,
      situation: situation,
      updated_situation_at: updated_situation_at,
      received_at: received_at
    };

    return this.db.main
      .document_situations
      .create(data);
  }

  async getDocument(status) {
    const options = {
      where: {
        status: status,
      },
      raw: true,
      order: [
        ['id', 'ASC']
      ],
    };

    return this.db.main
      .document_situations
      .findOne(options);
  }


  async get_by_message_id(message_id) {
    const options = {
      attributes: ['id'],
      where: {
        message_id: message_id,
      },
      raw: true
    };

    return this.db.main
      .document_situations
      .findAll(options);
  }

  async create_participants(document_situations_id, name, ispb, code) {
    let data = {
      document_situations_id: document_situations_id,
      name: name,
      ispb: ispb,
      code: code
    };

    return this.db.main
      .document_situation_participants
      .create(data);
  }

  async getProfileFromDocument(document) {
    const options = {
      where: {
        cpf: document
      },
      order: [
        ['id', 'ASC']
      ],
      raw: true
    };

    return this.db.core
      .profile
      .findOne(options);
  }

  async getCorporationFromDocument(document) {
    const options = {
      where: {
        cnpj: document
      },
      order: [
        ['id', 'ASC']
      ],
      raw: true
    };

    return this.db.core
      .corporation
      .findOne(options);
  }

  async updateDocumentSituation(document_situation, status, output, date_block) {
    const executed_id = {
      where: {
        id: document_situation.id,
      },
      raw: true
    };
    const all_documents = {
      where: {
        document: document_situation.document,
      },
      raw: true
    };

    const update = {
      status: status,
      output: output,
    };

    this.db.main
      .document_situations
      .update(update, all_documents);

    if (status == 'emissions_block') {
      update.blocked_emission_at = date_block;

    } else if (status == 'document_block') {
      update.blocked_document_at = date_block;
    }

    this.db.main
      .document_situations
      .update(update, executed_id);
  }
}
module.exports = DocumentSituationRepository;
