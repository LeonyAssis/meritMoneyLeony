'use strict';

const FormatService = require('../../../app/adapters/services/format.service');

const params = {};
const obj = [{ id: 1 }, { id: 2 }];

describe('format service', () => {
  let service;

  beforeEach(() => {
    service = new FormatService(params);
  });

  describe('formatObjectByProperty', () => {
    it('should format obj property', async () => {
      await service.formatObjectByProperty(obj, 'id');
    });

    it('should return the same object if property does not exist', async () => {
      await service.formatObjectByProperty(obj, 'test');
    });
  });
});
