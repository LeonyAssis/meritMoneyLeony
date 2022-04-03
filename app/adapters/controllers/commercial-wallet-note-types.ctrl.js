'use strict';

module.exports = () => {
  return {
    list: async (req, res, next) => {
      const commercialWalletNoteTypesBs = req.scope
        .resolve('commercialWalletNoteTypesBs');

      try {
        let note_types = await commercialWalletNoteTypesBs
          .list();

        res.status(200)
          .send(note_types);
      } catch (err) {
        next(err);
      }
    }
  };
};
