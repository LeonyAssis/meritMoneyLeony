class CorreiosService {

  constructor(params) {
    this.config = params.config;
    this.correiosRequestService = params.correiosRequestService;
    this.correiosRepository = params.correiosRepository;
    this.minifyXML = params.minifyXML;
    this.errorService = params.errorService;
    this._ = params._;
  }

  async getTimeAndCost(post_card, params, gis_log_id) {
    const clientConfig = this.getClientConfig(post_card);

    const client = await this.correiosRepository.getClientByPostCard(post_card);

    if (!client) {
      throw this.errorService
        .get('no_correios_client_were_found');
    }

    const nCdEmpresa = clientConfig.usuario != 'sigep' ? client.administrative_code : '';
    const sDsSenha = clientConfig.usuario != 'sigep' ? clientConfig.senha : '';

    const data = Object.assign({
      nCdEmpresa: nCdEmpresa, // clientConfig.usuario,
      sDsSenha: sDsSenha
    }, params);

    return this.correiosRequestService.calculateTimeAndCosts(data, gis_log_id);
  }

  async getClient(post_card, gis_log_id) {
    const clientConfig = this.getClientConfig(post_card);
    return this.correiosRequestService.getClient({
      idContrato: clientConfig.contrato,
      idCartaoPostagem: post_card,
      usuario: clientConfig.usuario,
      senha: clientConfig.senha
    }, gis_log_id);
  }

  async checkServiceAvailability(post_card, params, gis_log_id) {
    const clientConfig = this.getClientConfig(post_card);

    const client = await this.correiosRepository.getClientByPostCard(post_card);

    if (!client) {
      throw this.errorService
        .get('no_correios_client_were_found');
    }

    return this.correiosRequestService.checkServiceAvailability({
      codAdministrativo: client.adminitrative_code,
      numeroServico: params.service_code,
      cepOrigem: params.zipcode_origin,
      cepDestino: params.zipcode_destiny,
      usuario: clientConfig.usuario,
      senha: clientConfig.senha
    }, gis_log_id);
  }

  async checksStatusPostCard(post_card, gis_log_id) {
    const clientConfig = this.getClientConfig(post_card);

    return this.correiosRequestService.checksStatusPostCard({
      numeroCartaoPostagem: post_card,
      usuario: clientConfig.usuario,
      senha: clientConfig.senha
    }, gis_log_id);
  }

  async requestLabels(post_card, params, gis_log_id) {
    const clientConfig = this.getClientConfig(post_card);

    const client = await this.correiosRepository.getClientByPostCard(post_card);

    if (!client) {
      throw this.errorService
        .get('no_correios_client_were_found');
    }

    const amount_labels = params.amount_labels ? params.amount_labels : 1;

    return this.correiosRequestService.requestLabels({
      tipoDestinatario: 'C',
      identificador: client.cnpj,
      idServico: params.service_id,
      qtdEtiquetas: amount_labels,
      usuario: clientConfig.usuario,
      senha: clientConfig.senha
    }, gis_log_id);
  }

  async generateCheckDigitLabels(post_card, labels, gis_log_id) {
    const clientConfig = this.getClientConfig(post_card);

    return this.correiosRequestService.generateCheckDigitLabels({
      etiquetas: labels,
      usuario: clientConfig.usuario,
      senha: clientConfig.senha
    }, gis_log_id);
  }

  async closePlpManyServices(post_card, params, gis_log_id) {
    const clientConfig = this.getClientConfig(post_card);

    const client = await this.correiosRepository.getClientByPostCard(post_card);

    if (!client) {
      throw this.errorService
        .get('no_correios_client_were_found');
    }

    const newParams = Object.assign({
      cartaoPostagem: post_card,
      usuario: clientConfig.usuario,
      senha: clientConfig.senha
    }, params);

    newParams.xml.post_card = post_card;
    newParams.xml.contract = client.contract;
    newParams.xml.administrative_code = client.administrative_code;

    newParams.xml = await this.plpXml(newParams.xml);

    return this.correiosRequestService.closePlpManyServices(newParams, gis_log_id);
  }

  async requestPlp(post_card, id_plp, gis_log_id) {
    const clientConfig = this.getClientConfig(post_card);

    return this.correiosRequestService.requestPlp({
      idPlpMaster: id_plp,
      usuario: clientConfig.usuario,
      senha: clientConfig.senha
    }, gis_log_id);
  }

  async plpXml(params) {
    const objetos_postais = params.packages
      .map(_package => {
        const servicos_adicionais = _package.aditional_services
          ? _package.aditional_services
            .map(code => `<codigo_servico_adicional>${code}</codigo_servico_adicional>`)
            .join('')
          : '';

        const rt1 = _package.comments ? _package.comments : '';

        const telefone_destinatario = _package.receiver.phone ? _package.receiver.phone : '';
        const celular_destinatario = _package.receiver.cellphone ? _package.receiver.cellphone : '';
        const email_destinatario = _package.receiver.email ? _package.receiver.email : '';
        const complemento_destinatario = _package.receiver.complement ? _package.receiver.complement : '';
        const cpf_cnpj_destinatario = _package.receiver.document ? _package.receiver.document : '';
        const descricao_objeto = _package.description ? _package.description : '';
        const invoice = _package.invoice ? _package.invoice : '';
        const valor_declarado = _package.value ? _package.value : '';
        const tipo_objeto = _package.format ? _package.format : '002';
        const dimensao_altura = _package.height ? _package.height : '';
        const dimensao_largura = _package.width ? _package.width : '';
        const dimensao_comprimento = _package.length ? _package.length : '';

        return `<objeto_postal>
          <numero_etiqueta>${_package.label}</numero_etiqueta>
          <codigo_objeto_cliente/>
          <codigo_servico_postagem>${_package.service_code}</codigo_servico_postagem>
          <cubagem>0,00</cubagem>
          <peso>${_package.weight}</peso>
          <rt1>${rt1}</rt1>
          <rt2/>
          <restricao_anac>S</restricao_anac>
          <destinatario>
            <nome_destinatario><![CDATA[${_package.receiver.name}]]]]>><![CDATA[</nome_destinatario>
            <telefone_destinatario>${telefone_destinatario}</telefone_destinatario>
            <celular_destinatario>${celular_destinatario}</celular_destinatario>
			      <email_destinatario><![CDATA[${email_destinatario}]]]]>><![CDATA[</email_destinatario>
            <logradouro_destinatario><![CDATA[${_package.receiver.street}]]]]>><![CDATA[</logradouro_destinatario>
            <complemento_destinatario><![CDATA[${complemento_destinatario}]]]]>><![CDATA[</complemento_destinatario>
            <numero_end_destinatario><![CDATA[${_package.receiver.number}]]]]>><![CDATA[</numero_end_destinatario>
            <cpf_cnpj_destinatario>${cpf_cnpj_destinatario}</cpf_cnpj_destinatario>
          </destinatario>
          <nacional>
            <bairro_destinatario><![CDATA[${_package.receiver.neighborhood}]]]]>><![CDATA[</bairro_destinatario>
            <cidade_destinatario><![CDATA[${_package.receiver.city}]]]]>><![CDATA[</cidade_destinatario>
            <uf_destinatario>${_package.receiver.state}</uf_destinatario>
            <cep_destinatario>${_package.receiver.zipcode}</cep_destinatario>
            <codigo_usuario_postal/>
			      <centro_custo_cliente/>
            <numero_nota_fiscal>${invoice}</numero_nota_fiscal>
            <serie_nota_fiscal/>
            <valor_nota_fiscal/>
            <natureza_nota_fiscal/>
            <descricao_objeto><![CDATA[${descricao_objeto}]]]]>><![CDATA[</descricao_objeto>
            <valor_a_cobrar>0,0</valor_a_cobrar>
          </nacional>
          <servico_adicional>
            <codigo_servico_adicional>025</codigo_servico_adicional>
            ${servicos_adicionais}
            <valor_declarado>${valor_declarado}</valor_declarado>
          </servico_adicional>
          <dimensao_objeto>
            <tipo_objeto>${tipo_objeto}</tipo_objeto>
            <dimensao_altura>${dimensao_altura}</dimensao_altura>
            <dimensao_largura>${dimensao_largura}</dimensao_largura>
            <dimensao_comprimento>${dimensao_comprimento}</dimensao_comprimento>
            <dimensao_diametro>0</dimensao_diametro>
          </dimensao_objeto>
          <data_postagem_sara/>
          <status_processamento>0</status_processamento>
          <numero_comprovante_postagem/>
          <valor_cobrado/>
        </objeto_postal>`;
      })
      .join('');

    const telefone_remetente = params.sender.phone ? params.sender.phone : '';
    const fax_remetente = params.sender.fax ? params.sender.fax : '';
    const email_remetente = params.sender.email ? params.sender.email : '';
    const celular_remetente = params.sender.cellphone ? params.sender.cellphone : '';
    const complemento_remetente = params.sender.complement ? params.sender.complement : '';
    const cpf_cnpj_remetente = params.sender.document ? params.sender.document : '';

    const forma_pagamento = params.sender.payment_method ? params.sender.payment_method : '';

    return `<![CDATA[<?xml version="1.0" encoding="ISO-8859-1" ?>${this.minifyXML(`<correioslog>
      <tipo_arquivo>Postagem</tipo_arquivo>
      <versao_arquivo>2.3</versao_arquivo>
      <plp>
        <id_plp/>
        <valor_global/>
        <mcu_unidade_postagem/>
        <nome_unidade_postagem/>
        <cartao_postagem>${params.post_card}</cartao_postagem>
      </plp>
      <remetente>
        <numero_contrato>${params.contract}</numero_contrato>
        <numero_diretoria>${params.directorship_number}</numero_diretoria>
        <codigo_administrativo>${params.administrative_code}</codigo_administrativo>
        <nome_remetente><![CDATA[${params.sender.name}]]]]>><![CDATA[</nome_remetente>
        <logradouro_remetente><![CDATA[${params.sender.street}]]]]>><![CDATA[</logradouro_remetente>
        <numero_remetente><![CDATA[${params.sender.number}]]]]>><![CDATA[</numero_remetente>
        <complemento_remetente><![CDATA[${complemento_remetente}]]]]>><![CDATA[</complemento_remetente>
        <bairro_remetente><![CDATA[${params.sender.neighborhood}]]]]>><![CDATA[</bairro_remetente>
        <cep_remetente>${params.sender.zipcode}</cep_remetente>
        <cidade_remetente><![CDATA[${params.sender.city}]]]]>><![CDATA[</cidade_remetente>
        <uf_remetente>${params.sender.state}</uf_remetente>
        <telefone_remetente>${telefone_remetente}</telefone_remetente>
        <fax_remetente>${fax_remetente}</fax_remetente>
        <email_remetente><![CDATA[${email_remetente}]]]]>><![CDATA[</email_remetente>
        <celular_remetente>${celular_remetente}</celular_remetente>
        <cpf_cnpj_remetente>${cpf_cnpj_remetente}</cpf_cnpj_remetente>
        <ciencia_conteudo_proibido>S</ciencia_conteudo_proibido>
      </remetente>
      <forma_pagamento>${forma_pagamento}</forma_pagamento>
      ${objetos_postais}
      </correioslog>`)}]]>`;
  }

  async hasChangesCorreiosClient(correiosClientData, correiosClient) {
    delete correiosClient.id;

    return !this._.isEqual(correiosClientData, correiosClient);

  }

  getClientConfig(post_card) {
    const clientConfig = this.config.correios.cartao_postagem[post_card];
    if (!clientConfig) {
      throw this.errorService
        .get('correios_config_post_card_not_found');
    }
    return clientConfig;
  }

  getServiceNameFormated(name) {
    const _name = name.toUpperCase();
    if (_name.includes('PAC')) {
      return 'PAC';
    } else if (_name.includes('SEDEX HOJE')) {
      return 'SEDEX HOJE';
    } else if (_name.includes('SEDEX 10')) {
      return 'SEDEX 10';
    } else if (_name.includes('SEDEX 12')) {
      return 'SEDEX 12';
    } else if (_name.includes('SEDEX')) {
      return 'SEDEX';
    }
  }

}

module.exports = CorreiosService;
