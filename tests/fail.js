'use strict';

module.exports = (err) => {
  return Promise.reject(
    new Error(err || 'test failed!')
  );
};
