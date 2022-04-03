'use strict';

module.exports = () => {
  return {
    create: async (req, res, next) => {
      const controlClaimProfessionalBs = req.scope
        .resolve('controlClaimProfessionalBs');

      try {
        await controlClaimProfessionalBs
          .create(req);
        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },
    
    update_professional: async (req, res, next) => {
      const controlClaimProfessionalBs = req.scope
        .resolve('controlClaimProfessionalBs');

      try {
        await controlClaimProfessionalBs
          .update_professional(req);

        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    }, 
    
    delete_professional: async (req, res, next) => {
      const controlClaimProfessionalBs = req.scope
        .resolve('controlClaimProfessionalBs');

      try {
        await controlClaimProfessionalBs
          .delete_professional(req);

        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },


    list: async (req, res, next) => {
      const controlClaimProfessionalBs = req.scope
        .resolve('controlClaimProfessionalBs');

      try {
        let professional = await controlClaimProfessionalBs
          .list(req);

        res.status(200)
          .send(professional);
      } catch (err) {
        next(err);
      }
    },
  };
};
