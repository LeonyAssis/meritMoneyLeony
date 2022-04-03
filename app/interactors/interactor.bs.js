'use strict';

class Interactor {

  async run(...args) {
    return this
      // @ts-ignore
      .execute(...args);
  }

  execute() {
    throw new Error(
      'method "execute" must be implemented'
    );
  }
}

module.exports = Interactor;
