/**
 * @typedef {object} Dependencies
 * @property {*} gnBase
 * @property {*} sequelize
 * @property {*} momentTz
 * @property {*} asyncQ
 * @property {*} requestPromise
 * @property {*} re2
 * @property {*} config
 * @property {*} sqs
 * @property {import('../app/adapters/services/validator.service')} validatorService
 * @property {import('../app/adapters/services/regex.service')} regexService
 * @property {import('../infra/tools/log/gn-logger')} gnLogger
 * @property {import('../app/adapters/services/error.service')} errorService
 * @property {import('./services/email-register/email-register.service')} emailRegisterService
 * @property {import('./adapters/services/date.service')} dateService
 * @property {import('./services/aws-sqs/aws-sqs.service')} awsSqsService
 *
 * @property {import('../app/constants')} constants
 * */

/**
 * @typedef {object} UserInput
 * @property {number} account_id
 * @property {number} profile_id
 * @property {number} organization_id
 * @property {number} user_id
 */

module.exports = null;
