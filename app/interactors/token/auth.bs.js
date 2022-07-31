'use strict';

class TokenBs {
  constructor(params) {
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.userRepository = params.userRepository;
    this.bcrypt = params.bcrypt;
    this.jwt = params.jwt;
  }


  async generateToken(req) {
    const auth = req.headers.authorization.split(' ')[1];
    const buff = Buffer.from(auth, 'base64');
    const loginAndPass = buff.toString('utf-8').split(':');
    let tokenJWT;

    if (loginAndPass[0] == '' || loginAndPass[1] == '')
      throw this.errorService
        .get('login_and_password_required');

    let user = await this.userRepository.
      getUserAndPassword({ email: loginAndPass[0] });

    if (!user)
      throw this.errorService
        .get('login_or_password_incorrect');

    const checkSenha = this.bcrypt
      .compareSync(loginAndPass[1], user.password);

    if (checkSenha) {
      tokenJWT = this.jwt.sign({ id: user.id },
        process.env.SECRET_KEY, {
        expiresIn: parseInt(process.env.EXPIRES_IN)
      });

      user.expiresIn = parseInt(process.env.EXPIRES_IN);
      user.token = tokenJWT;
      delete user.password;

      return user;
    } else {
      throw this.errorService
        .get('login_or_password_incorrect');
    }
  }
}

module.exports = TokenBs;