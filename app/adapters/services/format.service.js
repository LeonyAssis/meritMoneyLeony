'use strict';

class TransactionService {
  constructor(params) {
    this.config = params.config;
    this.db = params.sequelize;
  }
  async formatObjectByProperty(objectList, objectProperty) {
    let list = [];

    objectList.forEach(doc => {
      if (doc[objectProperty] != undefined)
        list.push(doc[objectProperty]);
    });

    return list;
  }
}



module.exports = TransactionService;
