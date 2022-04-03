'use strict';

module.exports = () => {
  return {
    run: async (req, res) => {
      res.status(200).end();
    }
  };
};
