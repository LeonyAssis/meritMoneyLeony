'use strict';

/** @typedef {import('../../types').Dependencies} Dependencies */

/**
 * Regular expressions of the entire application should be
 * be validated against this class which uses Google Re2 algorithm
 * to avoid ReDoS attacks.
 *
 * See: https://rules.sonarsource.com/javascript/RSPEC-4784
 */
class RegexService {

  /** @param {Dependencies} params */
  constructor(params) {
    this.re2 = params.re2;
  }

  /**
   * @param {string} pattern
   * @param {string=} flags
   * @returns {RegExp}
   */
  build(pattern, flags) {
    return new this.re2(pattern, flags);
  }

}

module.exports = RegexService;
