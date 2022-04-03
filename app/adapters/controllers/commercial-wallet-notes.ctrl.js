'use strict';

module.exports = () => {
  return {

    create: async (req, res, next) => {
      const commercialWalletNotesBs = req.scope
        .resolve('commercialWalletNotesBs');

      try {
        await commercialWalletNotesBs
          .create(req.body);

        res.status(200)
          .end('200');
      } catch (err) {
        next(err);
      }
    },

    list: async (req, res, next) => {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const commercialWalletNotesBs = req.scope
        .resolve('commercialWalletNotesBs');

      try {
        let notes = await commercialWalletNotesBs
          .list(req);

        res.status(200)
          .send({
            notes: notes,
            currentPage: page,
            pages: Math.ceil(notes.length / limit),
            numOfResults: notes.length,
            limit: limit
          });
      } catch (err) {
        next(err);
      }
    },

    listbydocument: async (req, res, next) => {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const commercialWalletNotesBs = req.scope
        .resolve('commercialWalletNotesBs');

      try {
        let notes = await commercialWalletNotesBs
          .list_by_document(req);

        res.status(200)
          .send({
            notes: notes,
            currentPage: page,
            pages: Math.ceil(notes.length / limit),
            numOfResults: notes.length,
            limit: limit
          });
      } catch (err) {
        next(err);
      }
    }
  };
};
