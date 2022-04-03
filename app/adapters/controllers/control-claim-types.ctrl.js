'use strict';

module.exports = () => {
    return {
        list: async (req, res, next) => {
            const controlClaimTypesBs = req.scope
                .resolve('controlClaimTypesBs');

            try {
                let controlClaimTypes = await controlClaimTypesBs
                    .list(req);

                res.status(200)
                    .send(controlClaimTypes);
            } catch (err) {
                next(err);
            }
        },
    };
};
