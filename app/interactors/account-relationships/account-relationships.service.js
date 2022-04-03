class AccountRelationshipsService {
  constructor(params) {
    this.config = params.config;
    this.rp = params.requestPromise;
    this.moment = params.momentTz;
    this.accountRelationshipsRepository = params.accountRelationshipsRepository;
  }

  async checkUpdate(updated_at, period) {
    let dateCheck = this.moment().subtract(period, 'days');
    let update = this.moment(updated_at);
    return this.moment(update).isSameOrBefore(dateCheck);
  }
}



module.exports = AccountRelationshipsService;
