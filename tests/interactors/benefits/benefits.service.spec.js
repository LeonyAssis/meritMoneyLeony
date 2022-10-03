'use strict';

const sinon = require('sinon');
const BenefitsService = require(
  '../../../app/interactors/benefits/benefits.service'
);

describe('benefitsService', () => {
  let benefitsService;

  const Op = {
    ne: '$ne',
    gt: '$gt',
    lt: '$lt',
    lte: '$gte',
  };
  const params = {
    sequelize: {
      Sequelize: {
        Op: Op
      }
    }
  };

  beforeEach(() => {
    sinon.reset();
    benefitsService = new BenefitsService(params);
  });

  describe('mountOpts()', () => {

    it('format benefits params without any change', async () => {
      await benefitsService.mountOpts({});
    });

    it('format benefits order desc, branc and name', async () => {
      await benefitsService.mountOpts({ column: 'created_at', order: 'desc', name: 'Test text', brand:'Cocadas Sinfronio', active: false  } );
    });

    it('format benefits order asc, branc and name', async () => {
      await benefitsService.mountOpts({ column: 'created_at', order: 'asc', name: 'Test text', brand:'Cocadas Sinfronio', active: true  } );
    });
   
  });
});
