class EmailService {

  constructor(params) {
    this.fs = params.fs;
    this.pug = params.pug;
    this.path = params.path;
    this.config = params.config;
    this.gnBase = params.gnBase;

    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;

    this.baseDir = this.path.join(__dirname, '/../../../infra/tools/emails');
  }

  _subject(template) {
    const filePath = this.path.join(this.baseDir, '/subjects.json');
    const subjects = JSON.parse(this.fs.readFileSync(filePath, 'utf8'));
    return subjects[template];
  }

  async _compile(template, templateData) {
    const filePath = this.path.join(this.baseDir, `/templates/${template}.pug`);
    return this.pug.renderFile(filePath, templateData);
  }

  _toBase64(value) {
    return Buffer.from(value)
      .toString('base64');
  }

  async sendEmail(accountData, template, templateData, subject) {
    if (!subject)
      subject = this._subject(template);

    const content = await this._compile(template, templateData);

    const emailData = {
      'ContaGerencianet': accountData.number,
      'NomeRemetente': this._toBase64(this.config.email.sender.name),
      'EmailRemetente': this.config.email.sender.email,
      'NomeDestinatario': this._toBase64(accountData.nickname),
      'EmailDestinatario': accountData.email,
      'Assunto': this._toBase64(subject),
      'Conteudo': this._toBase64(content),
      'TipoMensagem': this.config.email.message_type
    };

    try {
      return await this.gnBase
        .emailComumEnviar(emailData, {
          target: 'infra'
        });
    } catch (err) {
      this.gnLogger.error(err, 'Failed to send e-mail');

      throw this.errorService
        .get('infra_unreachable');
    }
  }

}

module.exports = EmailService;
