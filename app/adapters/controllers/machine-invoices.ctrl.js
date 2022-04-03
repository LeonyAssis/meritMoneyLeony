'use strict';

module.exports = () => {
  return {
    get_invoices: async (req, res, next) => {
      const machineInvoicesBs = req.scope
        .resolve('machineInvoicesBs');

      try {
        const invoices = await machineInvoicesBs.
          getInvoices(req);
        res.status(200).
          send(invoices);
      } catch (err) {
        next(err);
      }
    },

    create_invoice: async (req, res, next) => {
      const machineInvoiceBs = req.scope
        .resolve('machineInvoicesBs');

      try {
        await machineInvoiceBs
          .createInvoice(req);
        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    }
  };
};
