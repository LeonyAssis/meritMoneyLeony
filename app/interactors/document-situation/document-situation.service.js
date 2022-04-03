class DocumentSituationService {


  constructor(params) {
    this.config = params.config;
    this.rp = params.requestPromise;
  }

  async intranetBlockDocument(document, action) {

    const uri = `${this.config.intranet.url}/ws/document/block`;
    const options = {
      method: 'POST',
      uri: uri,
      body: {
        resource: {
          document: document,
          action: action
        }
      },
      json: true
    };
    try {
      let resp = await this.rp(options);
      return resp;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = DocumentSituationService;
