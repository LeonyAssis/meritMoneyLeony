'use strict';

class CorreiosRequestService {
  constructor(params) {
    this.config = params.config;
    this.soap = params.soap;
    this.config = params.config;
    this.errorService = params.errorService;
    this.constants = params.constants;
    this.request = params.requestPromise;
    this.path = params.path;
    this.errorService = params.errorService;
    this.correiosRepository = params.correiosRepository;
  }

  async calculateTimeAndCosts(args, gis_log_id) {
    // const SOAP_WSDL = this.path.resolve(this.path.dirname(require.main.filename), this.config.correios.CalcPrecoPrazo.local_path);
    const SOAP_WSDL = this.config.correios.CalcPrecoPrazo.url;
    let response = await this.executeAsyncSoap(
      SOAP_WSDL,
      this.constants.CORREIOS.CALCPRECOPRAZO.FUNCTION,
      args,
      {
        gis_error: 'correios_soap_function_calc_preco_prazo_failed',
        gis_log_id: gis_log_id
      }
    );

    const data = response['Servicos']['cServico'][0];
    if (data['Erro'] != '0') {
      // throw data['MsgErro'];
      throw this.errorService
        .get('correios_calc_preco_prazo_returned_an_error');
    }
    return {
      price: this.calcPriceCents(data['Valor']),
      price_self_hand: this.calcPriceCents(data['ValorMaoPropria']),
      price_delivery_advicemment: this.calcPriceCents(data['ValorAvisoRecebimento']),
      price_price_declared: this.calcPriceCents(data['ValorValorDeclarado']),
      delivery_time: parseInt(data['PrazoEntrega'])
    };
  }

  async searchCEP(args, gis_log_id) {
    // const SOAP_WSDL = this.path.resolve(this.path.dirname(require.main.filename), this.config.correios.AtendeCliente.local_path);
    const SOAP_WSDL = this.config.correios.AtendeCliente.url;
    let response = await this.executeAsyncSoap(
      SOAP_WSDL,
      this.constants.CORREIOS.ATENDECLIENTE.CONSULTACEP.FUNCTION,
      args,
      {
        gis_error: 'correios_soap_function_consulta_cep_failed',
        gis_log_id: gis_log_id
      }
    );
    return response['return'];
  }

  async getClient(args, gis_log_id) {
    const SOAP_WSDL = this.config.correios.AtendeCliente.url;
    let response = await this.executeAsyncSoap(
      SOAP_WSDL,
      this.constants.CORREIOS.ATENDECLIENTE.BUSCACLIENTE.FUNCTION,
      args,
      {
        gis_error: 'correios_soap_function_busca_cliente_failed',
        gis_log_id: gis_log_id
      }
    );
    return response['return'];
  }

  async checkServiceAvailability(args, gis_log_id) {
    const SOAP_WSDL = this.config.correios.AtendeCliente.url;
    let response = await this.executeAsyncSoap(
      SOAP_WSDL,
      this.constants.CORREIOS.ATENDECLIENTE.VERIFICADISPONIBILIDADESERVICO.FUNCTION,
      args,
      {
        gis_error: 'correios_soap_function_verifica_disponibilidade_servico_failed',
        gis_log_id: gis_log_id
      }
    );
    return response['return'] == '0#';
  }

  async checksStatusPostCard(args, gis_log_id) {
    const SOAP_WSDL = this.config.correios.AtendeCliente.url;
    let response = await this.executeAsyncSoap(
      SOAP_WSDL,
      this.constants.CORREIOS.ATENDECLIENTE.GETSTATUSCARTAOPOSTAGEM.FUNCTION,
      args,
      {
        gis_error: 'correios_soap_function_get_status_cartao_postagem_failed',
        gis_log_id: gis_log_id
      }
    );
    return response['return'].toLowerCase().trim() == 'normal';
  }

  async requestLabels(args, gis_log_id) {
    const SOAP_WSDL = this.config.correios.AtendeCliente.url;
    let response = await this.executeAsyncSoap(
      SOAP_WSDL,
      this.constants.CORREIOS.ATENDECLIENTE.SOLICITAETIQUETAS.FUNCTION,
      args,
      {
        gis_error: 'correios_soap_function_solicita_etiquetas_failed',
        gis_log_id: gis_log_id
      }
    );
    return [...new Set(response['return'].split(',').map(l => l.trim()))];
  }

  async generateCheckDigitLabels(args, gis_log_id) {
    const SOAP_WSDL = this.config.correios.AtendeCliente.url;
    let response = await this.executeAsyncSoap(
      SOAP_WSDL,
      this.constants.CORREIOS.ATENDECLIENTE.GERADIGITOVERIFICADORETIQUETAS.FUNCTION,
      args,
      {
        gis_error: 'correios_soap_function_gera_digito_verificador_etiquetas_failed',
        gis_log_id: gis_log_id
      }
    );
    return response['return'];
  }

  async closePlpManyServices(args, gis_log_id) {
    const SOAP_WSDL = this.config.correios.AtendeCliente.url;
    let response = await this.executeAsyncSoap(
      SOAP_WSDL,
      this.constants.CORREIOS.ATENDECLIENTE.FECHAPLPVARIOSSERVICOS.FUNCTION,
      args,
      {
        gis_error: 'correios_soap_function_fecha_plp_varios_servicos_failed',
        gis_log_id: gis_log_id
      }
    );
    return response['return'];
  }

  async requestPlp(args, gis_log_id) {
    const SOAP_WSDL = this.config.correios.AtendeCliente.url;
    let response = await this.executeAsyncSoap(
      SOAP_WSDL,
      this.constants.CORREIOS.ATENDECLIENTE.SOLICITAXMLPLP.FUNCTION,
      args,
      {
        gis_error: 'correios_soap_function_solicita_xml_plp_failed',
        gis_log_id: gis_log_id
      }
    );
    return response;
  }

  async executeAsyncSoap(url, funcName, params, options) {
    const { gis_error, gis_log_id } = options;

    if (!Number.isInteger(gis_log_id)) {
      throw this.errorService
        .get('correios_request_service_requires_gis_log_id');
    }

    let specialRequest = this.request.defaults({
      strictSSL: false
    });

    return new Promise((resolve, reject) => {
      this.soap.createClient(url, {
        request: specialRequest
      }, async (err, client) => {
        if (err) {
          await this.log({
            gis_log_id: gis_log_id,
            url: url,
            func_name: funcName,
            success: false,
            req: params,
            res: null,
            err: err
          });
          return reject(this.errorService.get('failed_to_create_soap_client'));
        }
        client[funcName](params, async (err, result) => {
          if (err) {
            await this.log({
              gis_log_id: gis_log_id,
              url: url,
              func_name: funcName,
              success: false,
              req: params,
              res: result,
              err: err
            });
            if (gis_error) {
              return reject(this.errorService.get(gis_error));
            }
            return reject(err);
          }

          await this.log({
            gis_log_id: gis_log_id,
            url: url,
            func_name: funcName,
            success: true,
            req: params,
            res: result,
            err: err
          });

          if (result[funcName + 'Result'])
            resolve(result[funcName + 'Result']);
          else
            resolve(result);
        }, { timeout: 30000 });
      });
    });
  }

  async log(payload) {
    payload.req = this.logJsonField(payload.req);
    payload.res = this.logJsonField(payload.res);
    payload.err = this.logJsonField(payload.err);

    return this.correiosRepository
      .createCorreiosRequestLog(payload);
  }

  logJsonField(data) {
    if (!data) {
      return null;
    }

    if (typeof data === 'object' || Array.isArray(data)) {
      return data;
    }

    try {
      return JSON.parse(data);
    } catch (err) {
      return {
        data: data
      };
    }
  }

  calcPriceCents(price) {
    return Math.floor(parseFloat(price.replace(',', '.')) * 100);
  }
}



module.exports = CorreiosRequestService;
