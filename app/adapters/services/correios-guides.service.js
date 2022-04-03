'use strict';

const PAC = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 236.000000 236.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,236.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"><path d="M1025 2350 c-494 -65 -894 -441 -1001 -942 -24 -110 -24 -351 0 -458 55 -250 166 -451 343 -621 453 -434 1165 -438 1618 -8 378 360 478 908 250 1375 -222 456 -709 719 -1210 654z"/></g></svg>';
const SEDEX = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 236.000000 236.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,236.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"><path d="M1030 2350 c-152 -18 -318 -70 -450 -141 -222 -120 -419 -334 -504 -549 -66 -165 -69 -193 -73 -585 l-4 -360 37 45 c578 700 1702 702 2282 5 l42 -50 0 305 c0 168 -5 343 -10 389 -19 146 -78 302 -165 436 -54 83 -225 251 -315 310 -239 156 -552 229 -840 195z"/><path d="M1082 640 c-270 -37 -503 -218 -576 -450 -13 -41 -26 -100 -28 -130 l-3 -55 705 0 705 0 -3 55 c-4 74 -50 203 -96 273 -86 130 -253 247 -408 286 -91 23 -214 32 -296 21z"/></g></svg>';
const SEDEX_HOJE_10_12 = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 236.000000 236.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,236.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"><path d="M300 2357 c0 -1 264 -267 588 -590 l587 -587 -590 -590 -590 -590 440 0 440 0 593 588 594 587 -594 592 -593 593 -437 0 c-241 0 -438 -1 -438 -3z"/><path d="M0 1182 c0 -320 3 -582 8 -582 10 0 588 578 581 582 -3 2 -136 133 -297 293 l-292 290 0 -583z"/></g></svg>';

class CorreiosGuidesService {

  constructor(params) {
    this.bwipjs = params.bwipjs;
    this.path = params.path;
    this.fs = params.fs;
    this.moment = params.moment;
  }

  async generatePlp(obj) {
    const label = this.prepareFields(obj.label);

    let html = this.fs.readFileSync(this.getPlpTemplate(), 'utf8');

    const barcode = await this.generateBarCode(`${label.plpNumber}`, 170, 45);

    html = html.replace(/{{TITLE}}/g, 'Gerencianet - PLP');

    html = html.replace(/{{CONTRACT}}/g, obj.label.contract);

    html = html.replace(/{{PLPID}}/g, label.plpNumber);

    html = html.replace(/{{SENDERPHONE}}/g, obj.label.sender.phone);

    html = html.replace(/{{SENDEREMAIL}}/g, obj.label.sender.email ? obj.label.sender.email : '');

    html = html.replace(/{{SERVICECODE}}/g, obj.label.serviceCode);

    html = html.replace(/{{SERVICENAME}}/g, obj.label.serviceNameComplete);

    html = html.replace(/{{PLPCLOSEDAT}}/g, this.moment(label.plpClosedAt).format('DD/MM/YYYY'));

    html = html.replace(/{{BARCODE}}/g, `<img style="width:170px;" src="${this.base64Image(barcode)}" />`);

    return html;
  }

  async generateAr(obj) {
    const label = this.prepareFields(obj.label);

    let html = this.fs.readFileSync(this.getArTemplate(), 'utf8');

    html = html.replace('{{TITLE}}', 'Gerencianet - AR');

    html = html.replace('{{CONTRACT}}', obj.label.contract);

    html = html.replace('{{TRACKNUMBER}}', label.trackNumber);

    const barcode = await this.generateBarCode(label.trackNumber, 200, 38);

    html = html.replace('{{BARCODE}}', `<img style="width:200px;" src="${this.base64Image(barcode)}" />`);

    html = html.replace('{{RECIPIENTNAME}}', obj.label.recipient.name);

    html = html.replace('{{RECIPIENTADDRESS}}', `${obj.label.recipient.address}, ${obj.label.recipient.addressNumber}`);

    var recipientComplementAndNeighborhood = '';

    if (obj.label.recipient.complement) {
      recipientComplementAndNeighborhood += `${obj.label.recipient.complement}&nbsp;&nbsp;`;
    }

    recipientComplementAndNeighborhood += obj.label.recipient.neighborhood;

    html = html.replace('{{RECIPIENTCOMPLEMENTANDNEIGHBORHOOD}}', recipientComplementAndNeighborhood);

    html = html.replace('{{RECIPIENTZIPCODE}}', obj.label.recipient.zipCode);

    html = html.replace('{{RECIPIENTCITYANDSTATE}}', `${obj.label.recipient.city}-${obj.label.recipient.state}`);

    // html = html.replace('', '');

    html = html.replace('{{SENDERNAME}}', obj.label.sender.name);

    html = html.replace('{{SENDERADDRESS}}', `${obj.label.sender.address}, ${obj.label.sender.addressNumber}`);

    var senderComplementAndNeighborhood = '';

    if (obj.label.sender.complement) {
      senderComplementAndNeighborhood += `${obj.label.sender.complement}&nbsp;&nbsp;`;
    }

    senderComplementAndNeighborhood += obj.label.sender.neighborhood;

    html = html.replace('{{SENDERCOMPLEMENTANDNEIGHBORHOOD}}', senderComplementAndNeighborhood);

    html = html.replace('{{SENDERZIPCODE}}', obj.label.sender.zipCode);

    html = html.replace('{{SENDERCITYANDSTATE}}', `${obj.label.sender.city}-${obj.label.sender.state}`);


    return html;
  }

  async generateLabel(obj) {
    const label = this.prepareFields(obj.label);

    let html = this.fs.readFileSync(this.getLabelTemplate(), 'utf8');

    html = html.replace('{{TITLE}}', `Gerencianet - Etiqueta ${obj.label.trackNumber}`);

    const dataMatrix = await this.generateDataMatrix(label);

    html = html.replace('{{DATAMATRIX}}', `<img style="width:25mm;height:25mm;" src="${this.base64Image(dataMatrix)}" />`);

    let serviceLogo = null;

    if (['SEDEX HOJE', 'SEDEX 10', 'SEDEX 12'].includes(obj.label.serviceName.toUpperCase())) {
      serviceLogo = SEDEX_HOJE_10_12;
    } else if (label.serviceName.toUpperCase() == 'SEDEX') {
      serviceLogo = SEDEX;
    } else if (label.serviceName.toUpperCase() == 'PAC') {
      serviceLogo = PAC;
    }

    if (serviceLogo) {
      html = html.replace('{{SERVICELOGO}}', serviceLogo);
    }

    html = html.replace('{{INVOICE}}', obj.label.invoice);

    html = html.replace('{{ORDERID}}', obj.label.orderId);

    html = html.replace('{{CONTRACT}}', obj.label.contract);

    html = html.replace('{{SERVICENAME}}', obj.label.serviceName);

    html = html.replace('{{WEIGHT}}', obj.label.weight);

    html = html.replace('{{HUMANTRACKNUMBER}}', label.humanTrackNumber);

    const barcode = await this.generateBarCode(label.trackNumber, 80, 18);

    html = html.replace('{{BARCODE}}', `<img style="width:80mm;" src="${this.base64Image(barcode)}" />`);

    var aditionalServives = '';

    if (obj.label.services.inHands) {
      aditionalServives += '<div class="las">MP</div>';
    }

    if (obj.label.services.receiptNotice) {
      aditionalServives += '<div class="las">AR</div>';
    }

    if (obj.label.services.declaredValue) {
      aditionalServives += '<div class="las">VD</div>';
    }

    html = html.replace('{{ADITIONALSERVICES}}', aditionalServives);

    const zipCodeBarcode = await this.generateBarCode(label.sender.zipCodeOnlyNumbers, 40, 18);

    html = html.replace('{{ZIPCODEBARCODE}}', `<img style="width:40mm;" src="${this.base64Image(zipCodeBarcode)}" />`);

    html = html.replace('{{RECIPIENTNAME}}', obj.label.recipient.name);

    html = html.replace('{{RECIPIENTADDRESS}}', `${obj.label.recipient.address}, ${obj.label.recipient.addressNumber}`);

    var recipientComplementAndNeighborhood = '';

    if (obj.label.recipient.complement) {
      recipientComplementAndNeighborhood += `${obj.label.recipient.complement}&nbsp;&nbsp;`;
    }

    recipientComplementAndNeighborhood += obj.label.recipient.neighborhood;

    html = html.replace('{{RECIPIENTCOMPLEMENTANDNEIGHBORHOOD}}', recipientComplementAndNeighborhood);

    html = html.replace('{{RECIPIENTZIPCODE}}', obj.label.recipient.zipCode);

    html = html.replace('{{RECIPIENTCITYANDSTATE}}', `${obj.label.recipient.city}/${obj.label.recipient.state}`);

    // html = html.replace('', '');

    html = html.replace('{{SENDERNAME}}', obj.label.sender.name);

    html = html.replace('{{SENDERADDRESS}}', `${obj.label.sender.address}, ${obj.label.sender.addressNumber}`);

    var senderComplementAndNeighborhood = '';

    if (obj.label.sender.complement) {
      senderComplementAndNeighborhood += `${obj.label.sender.complement}&nbsp;&nbsp;`;
    }

    senderComplementAndNeighborhood += obj.label.sender.neighborhood;

    html = html.replace('{{SENDERCOMPLEMENTANDNEIGHBORHOOD}}', senderComplementAndNeighborhood);

    html = html.replace('{{SENDERZIPCODE}}', obj.label.sender.zipCode);

    html = html.replace('{{SENDERCITYANDSTATE}}', `${obj.label.sender.city}/${obj.label.sender.state}`);

    return html;
  }

  getPlpTemplate() {
    return this.getTemplatePath('correios-plp-default');
  }

  getLabelTemplate() {
    return this.getTemplatePath('correios-label-default');
  }

  getArTemplate() {
    return this.getTemplatePath('correios-ar-default');
  }

  getTemplatePath(name) {
    return this.path.resolve(this.path.dirname(require.main.filename), `infra/tools/correios/templates/${name}.html`);
  }

  makeDataMatrixString(label) {
    label.recipient.phone = label.recipient.phone.padStart(12, '0');

    return (
        label.recipient.zipCodeOnlyNumbers +
        label.recipient.zipCodeComplement +
        label.sender.zipCodeOnlyNumbers +
        label.sender.zipCodeComplement +
        label.recipient.zipCodeValidator +
        label.idv +
        label.trackNumber +
        label.extraServices +
        label.postCard +
        label.serviceCode +
        label.group +
        label.recipient.zipCodeComplement +
        label.recipient.complement +
        label.invoiceValue +
        label.recipient.phone +
        label.latitude +
        label.longitude +
        '|'
    );
  }

  async generateDataMatrix(label, backgroundColor = 'FFFFFF') {
    const text = this.makeDataMatrixString(label);
    const png = await this.bwipjs.toBuffer({
        bcid: 'datamatrix',
        text: text,
        backgroundcolor: backgroundColor,
        width: 25,
        height: 25,
        padding: 1
    });
    return png.toString('base64');
  }

  async generateBarCode(text, width, heigth, backgroundColor = 'FFFFFF') {
    const png = await this.bwipjs.toBuffer({
        bcid: 'code128',
        text: text,
        backgroundcolor: backgroundColor,
        width: width,
        height: heigth
    });
    return png.toString('base64');
  }

  base64Image(base64) {
    return  `data:image/png;base64,${base64}`;
  }

  prepareFields(label) {
    if (!label) {
      throw new Error(
        'Nenhuma informação repassada para a geração da etiqueta.'
      );
    } else if (!label.recipient) {
      throw new Error('Os dados do destinatário não foram informados.');
    } else if (!label.sender) {
      throw new Error('Os dados do remetente não foram informados.');
    } else {
      // Prepara os campos de acordo com o padrão dos correios
      label.recipient.careOf = label.recipient.careOf
        ? label.recipient.careOf
        : '';
      label.sender.name = label.sender.name ? label.sender.name : '';
      label.sender.address = label.sender.address ? label.sender.address : '';
      label.sender.addressNumber = label.sender.addressNumber
        ? label.sender.addressNumber
        : '';
      label.sender.complement = label.sender.complement
        ? label.sender.complement
        : '';
      label.sender.neighborhood = label.sender.neighborhood
        ? label.sender.neighborhood
        : '';
      label.sender.city = label.sender.city ? label.sender.city : '';
      label.sender.state = label.sender.state ? label.sender.state : '';
      label.sender.zipCode = label.sender.zipCode
        ? label.sender.zipCode
        : '00000000';
      label.sender.zipCodeComplement = (!label.sender.addressNumber
        ? ''
        : typeof label.sender.addressNumber == 'number'
        ? label.sender.addressNumber.toString()
        : label.sender.addressNumber
      ).padStart(5, '0');
      label.recipient.address = label.recipient.address
        ? label.recipient.address
        : '';
      label.recipient.addressNumber = label.recipient.addressNumber
        ? label.recipient.addressNumber
        : '';
      label.recipient.complement = label.recipient.complement
        ? label.recipient.complement.trim()
        : '';
      label.recipient.neighborhood = label.recipient.neighborhood
        ? label.recipient.neighborhood
        : '';
      label.recipient.city = label.recipient.city ? label.recipient.city : '';
      label.recipient.state = label.recipient.state
        ? label.recipient.state
        : '';
      label.recipient.zipCode = !label.recipient.zipCode
        ? '00000000'
        : label.recipient.zipCode;
      label.recipient.zipCodeComplement = (!label.recipient.addressNumber
        ? ''
        : typeof label.recipient.addressNumber == 'number'
        ? label.recipient.addressNumber.toString()
        : label.recipient.addressNumber
      ).padStart(5, '0');
      label.recipient.phone = label.recipient.phone
        ? label.recipient.phone
        : '';
      label.serviceCode = label.serviceCode ? label.serviceCode : '';
      label.serviceName = label.serviceName ? label.serviceName : '';
      label.invoice = label.invoice ? label.invoice : '';
      label.weight = label.weight ? label.weight : 0;
      label.invoiceValue = label.invoiceValue ? label.invoiceValue : 0;
      label.remarks = label.remarks ? label.remarks : '';

      if (label.recipient.address.length > 50) {
        label.recipient.address = label.recipient.Address.substring(0, 50);
      }

      if (label.recipient.complement.length > 20) {
        label.recipient.complement = label.recipient.complement.substring(
          0,
          20
        );
      }

      if (label.recipient.neighborhood.length > 50) {
        label.recipient.neighborhood = label.recipient.neighborhood.substring(
          0,
          50
        );
      }

      if (label.recipient.city.length > 50) {
        label.recipient.city = label.recipient.city.substring(0, 50);
      }

      if (!label.sender.zipCode.includes('-')) {
        label.sender.zipCode =
          label.sender.zipCode.substring(0, 5) +
          '-' +
          label.sender.zipCode.substring(5, 8);
      }

      label.sender.zipCodeOnlyNumbers = label.sender.zipCode.replace('-', '');

      if (!label.recipient.zipCode.includes('-')) {
        label.recipient.zipCode =
          label.recipient.zipCode.substring(0, 5) +
          '-' +
          label.recipient.zipCode.substring(5, 8);
      }

      label.recipient.zipCodeOnlyNumbers = label.recipient.zipCode.replace('-', '');

      if (typeof label.invoiceValue == 'number') {
        label.invoiceValue = Number(
          label.invoiceValue.toFixed(0).toString().padStart(5, '0')
        );
      } else {
        if (label.invoiceValue.includes('.')) {
          label.invoiceValue = label.invoiceValue.substring(
            0,
            label.invoiceValue.indexOf('.')
          );
        }
        label.invoiceValue = label.invoiceValue.padStart(5, '0');
      }

      label.humanTrackNumber =
        label.trackNumber.substring(0, 2) +
        ' ' +
        label.trackNumber.substring(2, 5) +
        ' ' +
        label.trackNumber.substring(5, 8) +
        ' ' +
        label.trackNumber.substring(8, 11) +
        ' ' +
        label.trackNumber.substring(11, 13);

      label.recipient.zipCodeValidator = this.zipCodeVD(
        label.recipient.zipCode
      );

      label.idv = '51';
      label.group = '00';
      // label.extraServices =
      //   '25' +
      //   (label.services.receiptNotice ? '01' : '00') +
      //   (label.services.inHands ? '02' : '00') +
      //   (label.services.declaredValue ? '64' : '00') +
      //   (label.services.neighborDelivery ? '11' : '00') +
      //   (label.services.largeFormats ? '57' : '00');

      label.extraServices =
        (label.services.receiptNotice ? 'AR' : '') +
        (label.services.inHands ? 'MP' : '') +
        (label.services.declaredValue ? 'VD' : '');

      label.extraServices = label.extraServices.padEnd(8, '0');

      label.latitude = '-00.000000';
      label.longitude = '-00.000000';

      return label;
    }
  }

  zipCodeVD(zipCode) {
    let sum = 0;

    for (let i = 0; i < zipCode.length; i++) {
      if (zipCode.substring(i, i + 1) != '-') {
        sum = sum + parseInt(zipCode.substring(i, i + 1));
      }
    }

    if (sum % 10 != 0) {
      let sumd = sum;
      while (sumd % 10 != 0) {
        sumd++;
      }

      return (sumd - sum).toString();
    } else {
      return '0';
    }
  }
}

module.exports = CorreiosGuidesService;
