class DocumentBlockRepository {
  constructor(params) {
    this.db = params.sequelize;
  }

  async createDocumentBlockLog(payload) {
    return this.db.main.document_block_logs
      .create(payload);
  }

}

module.exports = DocumentBlockRepository;
