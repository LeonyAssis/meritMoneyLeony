class CommercialWalletAccountsActivateService {

  async formatObjectByProperty(objectList, objectProperty) {
    let list = [];

    objectList.forEach(doc => {
      if (doc[objectProperty] != undefined)
        list.push(doc[objectProperty]);
    });

    return list;
  }
}

module.exports = CommercialWalletAccountsActivateService;
