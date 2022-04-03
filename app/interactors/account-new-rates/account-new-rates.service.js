class AccountNewRatesService {


  constructor(params) {
    this.config = params.config;
    this.rp = params.requestPromise;
  }

  async intranetAccountEditRate(account_rate) {

    const uri = `${this.config.intranet.url}/ws/account/billet/rate/edit`;
    const options = {
      method: 'POST',
      uri: uri,
      body: {
        resource: {
          account: account_rate.account,
          new_rate: account_rate.new_rate,
          old_rate: account_rate.old_rate
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

module.exports = AccountNewRatesService;
