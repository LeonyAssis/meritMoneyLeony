class BankSecrecyRequestService {


  constructor(params) {
    this.config = params.config;
    this.rp = params.requestPromise;
  }

  async createStatmentRequest(statment) {
    delete statment.user_id;
    delete statment.origin;

    const uri = `${this.config.ccs.url}/statement-requests/creator`;
    const options = {
      method: 'POST',
      uri: uri,
      auth: {
        'user': this.config.ccs.credentials.client_id,
        'pass': this.config.ccs.credentials.client_secret
      },
      headers: {
        'Content-Type': 'application/json',
      },
      body: statment,
      json: true
    };
    try {
      let resp = await this.rp(options);
      console.log('resp :', resp);
      return resp;
    } catch (err) {
      console.log(err);
    }
  }
  async shipping_receipt(statment) {

    const uri = `${this.config.ccs.url}/shipping-receipt`;
    const options = {
      method: 'POST',
      uri: uri,
      auth: {
        'user': this.config.ccs.credentials.client_id,
        'pass': this.config.ccs.credentials.client_secret
      },
      headers: {
        'Content-Type': 'application/json',
      },
      body: statment,
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

module.exports = BankSecrecyRequestService;
