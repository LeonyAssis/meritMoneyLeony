'use strict';

class IntranetService {

  constructor(opts) {
    this.rp = opts.requestPromise;
    this.config = opts.config;
    this.pug = opts.pug;
    this.documentBlockRepository = opts.documentBlockRepository;
  }

  async _compile(template, templateData) {
    const filePath = `./infra/tools/tickets/templates/${template}.pug`;
    return this.pug.renderFile(filePath, templateData);
  }

  async ticketCreate(passkey, templateName, templateData) {
    const uri = `${this.config.intranet.url}/ws/ticket/create`;
    let content = await this._compile(templateName, templateData);
    let rating_id = templateData.rating_id;
    let archive = templateData.archive;
    let create_note = templateData.create_note;

    const options = {
      method: 'POST',
      uri: uri,
      body: {
        resource: {
          ticket: {
            passkey: passkey,
            label: templateData.label,
            ticket_subject: templateData.title
          },
          message: {
            content: content
          },
          large_scale: {
            owner_id: templateData.owner_id,
            rating_id: rating_id,
            archive: archive,
            create_note: create_note
          },
          app: 'Sistema'
        }
      },
      json: true
    };

    return this.rp(options);
  }

  async messageTicketCreate(ticket_id, templateName, templateData) {
    const uri = `${this.config.intranet.url}/ws/ticket/messages/create`;
    const content = await this._compile(templateName, templateData);
    const options = {
      method: 'POST',
      uri: uri,
      body: {
        resource: {
          ticket_id: `${ticket_id}`,
          author_id: templateData.author_id,
          message: {
            content: content,
            note: templateData.create_note ? true : false
          }
        }
      },
      json: true
    };

    return await this.rp(options);
  }

  async documentsBlocks(payload) {
    const uri = `${this.config.intranet.url}/ws/documents/blocks`;
    const { document_id, blocks, note, compliance_analyses_document, user_id } = payload;

    const options = {
      method: 'POST',
      uri: uri,
      body: {
        resource: {
          document_id: document_id,
          blocks: blocks,
          note: note,
          compliance_analyses_document: compliance_analyses_document
        }
      },
      json: true
    };

    const response = await this.rp(options);

    if (response.status == 2) {
      this.documentBlockRepository
        .createDocumentBlockLog({
          route: uri,
          document_id: document_id.join(','),
          user_id: user_id,
          input: JSON.stringify(options.body),
          output: JSON.stringify(response.output)
        });
    }

    return response;
  }

  async documentsUnblocks(payload) {
    const uri = `${this.config.intranet.url}/ws/documents/unblocks`;
    const { document_id, blocks, note, compliance_analyses_document, user_id } = payload;

    const options = {
      method: 'POST',
      uri: uri,
      body: {
        resource: {
          document_id: document_id,
          blocks: blocks,
          note: note,
          compliance_analyses_document: compliance_analyses_document
        }
      },
      json: true
    };

    const response = await this.rp(options);

    if (response.status == 2) {
      this.documentBlockRepository
        .createDocumentBlockLog({
          route: uri,
          document_id: document_id.join(','),
          user_id: user_id,
          input: JSON.stringify(options.body),
          output: JSON.stringify(response.output)
        });
    }

    return response;
  }

}

module.exports = IntranetService;
