'use strict';
class DocumentAnalysesClassificationRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async create(document_id, analyst_id, newLevel, status, document) {
    let analyses = {
      document_id: document_id,
      document: document,
      status: status,
      level: newLevel,
      analyst_id: analyst_id
    };

    return this.db.intranet
      .compliance_analyses_documents
      .create(analyses);
  }

  async getAccountAnalysts(email) {
    const options = {
      attributes: ['id'],
      include: [{
        model: this.db.intranet.user,
        attributes: ['email'],
        required: true,
        where: {
          email: email
        }
      }],
      order: [
        ['id', 'DESC']
      ],
      raw: true,
      logging: true
    };

    return this.db.intranet
      .account_analysts
      .findOne(options);
  }

  async getComplianceAnalyses(document_id) {
    const options = {
      attributes: ['level', 'id'],
      where: {
        document_id: document_id
      },

      order: [
        ['updated_at', 'DESC']
      ],
      raw: true
    };

    return this.db.intranet
      .compliance_analyses_documents
      .findOne(options);
  }

  async getDocument(document_id) {
    const options = {
      attributes: ['corporation_id', 'profile_id'],
      where: {
        id: document_id
      },
      order: [
        ['updated_at', 'DESC']
      ],
      raw: true
    };
    return this.db.core
      .document
      .findOne(options);
  }

  async getCpfByDocumentId(document_id) {
    const options = {
      attributes: ['profile_id'],
      where: {
        id: document_id
      },
      include: [{
        attributes: ['cpf'],
        model: this.db.core.profile,
        required: true,
      }],
      raw: true,
    };
    return this.db.core
      .document
      .findOne(options);
  }

  async getCnpjByDocumentId(document_id) {
    const options = {
      attributes: ['corporation_id'],
      where: {
        id: document_id
      },
      include: [{
        attributes: ['cnpj'],
        model: this.db.core.corporation,
        required: true,
      }],
      raw: true,
    };
    return this.db.core
      .document
      .findOne(options);
  }

  getComplianceByDocument(document) {
    const options = {
      attributes: ['level'],
      where: {
        document: document,
        status: 'finished'
      },
      order: [
        ['updated_at', 'DESC']
      ],
      raw: true,
      logging: true
    };
    return this.db.intranet
      .compliance_analyses_documents
      .findOne(options);
  }

  async updateLevel(compliance_analyses_id, newLevel, analyst_id) {
    const updateData = {
      level: newLevel,
      status: 'finished',
      analyst_id: analyst_id
    };

    const options = {
      where: {
        id: compliance_analyses_id,
      },
      order: [
        ['updated_at', 'DESC']
      ],
      raw: true
    };

    return this.db.intranet
      .compliance_analyses_documents
      .update(updateData, options);
  }
}
module.exports = DocumentAnalysesClassificationRepository;
