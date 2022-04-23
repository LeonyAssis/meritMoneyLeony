require('should');
const sinon = require('sinon');
const InteractorBs = require('../../app/interactors/interactor.bs');

let interactorBs = null;

describe('interactor business', () => {
  beforeEach(() => {
    interactorBs = new InteractorBs();
  });

  describe('run', () => {
    it('should call execute with args', () => {
      const name = 'My Name';
      const args1 = [1, 2];
      const args2 = {
        myVar: 1
      };

      interactorBs.execute = sinon.stub();
      interactorBs.run(name, args1, args2);

      interactorBs.execute
        .calledWith(name, args1, args2)
        .should.be.true();
    });
  });

  describe('execute', () => {
    it('should throw exception', () => {
      try {
        interactorBs.execute();
      } catch (err) {
        err.message.should.be
          .eql('method "execute" must be implemented');
      }
    });
  });
});
