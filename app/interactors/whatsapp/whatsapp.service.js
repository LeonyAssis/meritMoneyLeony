class WhatsappService {


  constructor(params) {
    this.config = params.config;
    this.rp = params.requestPromise;
  }

  async getAlternativeAccount(phone) {
    let ddi_phone = '+55' + phone;

    const uri = `${this.config.whatsapp.url}/commands`;
    const options = {
      method: 'POST',
      uri: uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.config.whatsapp.key
      },
      body: {
        id: this.config.whatsapp.alternative_account.id,
        to: this.config.whatsapp.alternative_account.to,
        method: this.config.whatsapp.alternative_account.method,
        uri: `${this.config.whatsapp.alternative_account.uri_request}/${ddi_phone}`
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

  async sendMessage(template, message_variables, alternative_account) {
    const uri = `${this.config.whatsapp.url}/messages`;
    var status = null;

    let localizable_params = [];
    for (let variable of message_variables) {
      let local_variable = {
        default: variable
      };
      localizable_params.push(local_variable);
    }

    const options = {
      method: 'POST',
      uri: uri,
      resolveWithFullResponse: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.config.whatsapp.key
      },
      body: {
        id: this.config.whatsapp.messages.id,
        to: alternative_account,
        type: 'application/json',
        content: {
          type: 'hsm',
          hsm: {
            namespace: template.namespace,
            element_name: template.element_name,
            language: this.config.whatsapp.messages.hsm.language,
            localizable_params: localizable_params
          }
        }
      },
      json: true
    };
    try {
      await this.rp(options).then(function (response) {
        status = response.statusCode;
      });
      return status;

    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = WhatsappService;
