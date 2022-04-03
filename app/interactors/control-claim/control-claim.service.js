class ControlClaimService {

  constructor(params) {
    this.config = params;
    this.db = params.sequelize;
    this.moment = params.moment;
    this.rp = params.requestPromise;
    this.config = params.config;
  }

  async getComment(body, id) {
    let comment = {};
    comment.user_id = body.user_id;
    comment.control_claims_id = id;
    comment.comment = body.comment;

    return comment;
  }

  async getProfessionals(body, id) {
    let prof = body.professionals.map((p) => {
      p.user_id = body.user_id;
      p.control_claims_id = id;
      return p;
    });
    return prof;
  }

  async getProfessionalsUpdate(professionalsRequest, professionalsBd) {
    let arrayUpdate = professionalsBd.map(obj => {
      let prof = professionalsRequest.find((el) => {
        if (el.control_claim_professional_types_id == obj.control_claim_professional_types_id) {
          el.id = obj.id;
          return el;
        }
      });
      return prof;
    });

    arrayUpdate = arrayUpdate.filter(function (element) {
      return element !== undefined;
    });

    return arrayUpdate;
  }

  async getProfessionalsInsert(professionalsRequest, professionalsBd) {
    let arrayProfBd = professionalsBd.map(obj => {
      return obj.control_claim_professional_types_id;
    });

    let arrayProfReq = professionalsRequest.map(obj => {
      return obj.control_claim_professional_types_id;
    });

    let resultAmbos = arrayProfReq.filter((element) => {
      if (arrayProfBd.indexOf(element) == -1)
        return element;
    });

    let professionalInsert = resultAmbos.map(obj => {
      let prof = professionalsRequest.find((el) => el.control_claim_professional_types_id == obj);
      return prof;
    });

    return professionalInsert;
  }


  async getParametersList(req) {
    let limit = parseInt(req.query.limit) || 10;
    let offset = ((parseInt(req.query.page) || 1) - 1) * limit;
    let order = req.query.order || 'desc';
    let column = req.query.column || 'id';
    let active = req.query.active || false;
    let search = req.query.search || null;
    let createdAt = req.query.createdAt || null;
    let finalizedAt = req.query.finalizedAt || null;

    const Op = this.db.Sequelize.Op;
    let finalized = null;
    let searchParam;

    if (active === 'true') {
      finalized = {
        [Op.eq]: null
      };
    } else {
      finalized = {
        [Op.ne]: null
      };
    }

    if (search) {
      searchParam = [{
        id: {
          [Op.eq]: parseInt(search)
        }
      }, {
        title: {
          [Op.substring]: search
        }
      }];

      if (!Number.isInteger(parseInt(search)))
        searchParam.shift();

    } else {
      searchParam = [{
        id: {
          [Op.ne]: null
        }
      }];
    }

    if (createdAt) {
      let min = this.moment(createdAt).startOf('day').format();
      let max = this.moment(createdAt).endOf('day').format();

      createdAt = {
        [Op.between]: [min, max]
      };
    }

    if (finalizedAt) {
      let min = this.moment(finalizedAt).startOf('day').format();
      let max = this.moment(finalizedAt).endOf('day').format();
      finalized = {
        [Op.between]: [min, max]
      };
    }

    let parameters = {
      limit: limit,
      offset: offset,
      order: order,
      column: column,
      search: searchParam,
      createdAt: createdAt,
      finalizedAt: finalized
    };

    return parameters;

  }

  async sendWarning(id) {

    const uri = `${this.config.intranet.url}/ws/control_claim/send_warning`;
    const options = {
      method: 'POST',
      uri: uri,
      body: {
        claim: {
          id: id
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

module.exports = ControlClaimService;
