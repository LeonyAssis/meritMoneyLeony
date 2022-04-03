'use strict';

const Interactor = require('../interactor.bs');

class CommercialWalletReportPerformanceTrackingBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.moment = params.moment;
    this.tempfile = params.tempfile;
    this.exceljs = params.exceljs;
    this.fs = params.fs;
    this.s3 = params.s3;
    this.config = params.config;
    this.constants = params.constants;
    this.stylesheetsExcel = params.stylesheetsExcel;
    this.gn = params.gnBase;
    this.emailService = params.emailService;
    this.dateService = params.dateService;
    this.commercialWalletNotesRepository = params.commercialWalletNotesRepository;

    this.commercialWalletReportPerformanceTrackingService = params.commercialWalletReportPerformanceTrackingService;
    this.commercialWalletReportPerformanceTrackingRepository = params.commercialWalletReportPerformanceTrackingRepository;
  }

  async generatePerformanceTracking(req) {
    let first_business_day = await this.dateService.is_first_business_day(new Date());
    let is_interval_hour = await this.dateService.is_interval_hour(new Date(), [0, 0, 0], [23, 59, 59]);

    if (req.query.manual == undefined) {
      if (!first_business_day || !is_interval_hour) {
        throw this.errorService
          .get('not_first_business_day');
      }
    }

    let limit = parseInt(req.query.limit) || 20;

    let type = req.query.type;

    if (!type)
      throw this.errorService
        .get('commercial_type_required');

    let date_end = new Date();
    date_end = new Date(date_end.getFullYear(), date_end.getMonth() - 1, 1);

    if (req.query.reference_date != undefined) {
      let month = await this.commercialWalletReportPerformanceTrackingService
        .get_month(req.query.reference_date);
      let year = await this.commercialWalletReportPerformanceTrackingService
        .get_year(req.query.reference_date);

      if (month == null || year == null)
        throw this.errorService
          .get('invalid_date');

      date_end = new Date(year, month - 1);
    }
    let this_month = new Date(date_end);
    this_month.setMonth(date_end.getMonth() + 1);

    let commercial_wallets = await this.commercialWalletReportPerformanceTrackingRepository
      .getCommercialWalletToProcess(this_month, date_end, limit, type);

    if (commercial_wallets.length > 0) {
      for (let commercial_wallet of commercial_wallets) {

        commercial_wallet.performance_trackings = [];
        for (let i = 0; i < 6; i++) {
          let reference_date = new Date(date_end);
          reference_date.setMonth(date_end.getMonth() - i);

          commercial_wallet.performance_trackings.push({
            reference_date: reference_date
          });
        }
      }

      await this.createPerformanceTrackings(commercial_wallets);

      await this.generateVariationsAndImpactFactor(commercial_wallets);
    } else {
      throw this.errorService
        .get('commercial_wallet_not_found_to_generate_performance_tracking');
    }
  }

  async generateVariationsAndImpactFactor(commercial_wallets) {
    for (let commercial_wallet of commercial_wallets) {
      let variation_sum = 0;
      for (let i = 0; i < 5; i++) {
        if (!commercial_wallet.performance_trackings[i].variation) {
          let value = Math.round((commercial_wallet.performance_trackings[i].total_amount / commercial_wallet.performance_trackings[i + 1].total_amount - 1) * 100);
          if (isNaN(value) || !isFinite(value))
            value = commercial_wallet.performance_trackings[i].total_amount;
          commercial_wallet.performance_trackings[i].variation = value;
          this.commercialWalletReportPerformanceTrackingRepository
            .updatePerformanceTrackingVariation(commercial_wallet.performance_trackings[i]);
        }
        variation_sum += commercial_wallet.performance_trackings[i].variation;
      }

      await this.commercialWalletReportPerformanceTrackingService
        .get_total_amount_receipt_number(commercial_wallet);
      commercial_wallet.impact_factor = (variation_sum * commercial_wallet.total_amount / 1000).toFixed(2);
      await this.commercialWalletReportPerformanceTrackingRepository
        .updateCommercialWalletImpactFactor(commercial_wallet);
    }
  }

  async sendPerformanceTracking(req) {

    if (req.query.resend == undefined) {
      let first_business_day = await this.dateService.is_first_business_day(new Date());
      let is_interval_hour = await this.dateService.is_interval_hour(new Date(), [7, 0, 0], [18, 30, 0]);

      if (!first_business_day || !is_interval_hour)
        throw this.errorService
          .get('not_first_business_day');
    }

    let commercial_analysts = [];
    if (req.query.analyst == undefined) {
      await this.commercialWalletReportPerformanceTrackingRepository
        .getCommercialAnalysts().then(res => {
          res.forEach(doc => {
            let analyst = {};
            analyst.email = doc['user.email'];
            analyst.name = '';
            commercial_analysts.push(analyst);
          });
        });

    } else {
      commercial_analysts.push({
        email: req.query.analyst,
        name: ''
      });
    }

    for (let analyst of commercial_analysts) {
      analyst.name = await this.commercialWalletReportPerformanceTrackingService
        .capitalize(analyst.email.substring(0, analyst.email.lastIndexOf('@')).replace('.', ' '));

      let date_end = new Date();
      date_end = new Date(date_end.getFullYear(), date_end.getMonth() - 1);

      if (req.query.reference_date != undefined) {
        let month = await this.commercialWalletReportPerformanceTrackingService
          .get_month(req.query.reference_date);
        let year = await this.commercialWalletReportPerformanceTrackingService
          .get_year(req.query.reference_date);

        if (month == null || year == null)
          throw this.errorService
            .get('invalid_date');

        date_end = new Date(year, month - 1);
      }

      let commercial_wallets = await this.commercialWalletReportPerformanceTrackingRepository
        .getCommercialWalletFromAnalyst(analyst.email, date_end);

      if (commercial_wallets.length > 0) {
        for (let commercial_wallet of commercial_wallets) {
          let profile = await this.commercialWalletReportPerformanceTrackingRepository
            .getProfileFromProfileId(commercial_wallet.profile_id);

          if (profile != null) {
            commercial_wallet.name = profile.name;
            commercial_wallet.cpf = profile.cpf;
            commercial_wallet.performance_trackings = [];
            for (let i = 0; i < 6; i++) {
              let reference_date = new Date(date_end);
              reference_date.setMonth(date_end.getMonth() - i);

              commercial_wallet.performance_trackings.push({
                reference_date: reference_date
              });
            }
          }
        }

        await this.getPerformanceTrackings(commercial_wallets);

        var workbook = new this.exceljs.Workbook();

        workbook.creator = 'Gerencianet';
        workbook.created = new Date(this.moment().format('YYYY-MM-DD HH:mm:ss'));
        var namesheet = 'Carteira Comercial';
        var worksheet = workbook.addWorksheet(namesheet);
        await this.generateCommercialWalletPerformanceTrackingExceljs(worksheet, commercial_wallets);

        var tempFilePath = this.tempfile('.xls');
        await workbook.xlsx.writeFile(tempFilePath).then(async () => {
          var filePath = 'gis/reports/commercial_wallets/performance_tracking/' + analyst.email.substring(0, analyst.email.lastIndexOf('@')) + '/';
          var fileName = await this.moment(commercial_wallets[0].performance_trackings[5].reference_date).format('MM-YYYY') +
            '-' +
            analyst.email.substring(0, analyst.email.lastIndexOf('@')) + '-' +
            await this.moment().format('DD-MM-YYYY-HH-mm-ss') +
            '.xlsx';
          var fileRead = this.fs.readFileSync(tempFilePath);
          let url = await this.createExcelFile(filePath, fileRead, fileName);

          if (url) {
            await this.sendMessage(url, analyst, date_end, analyst);
            await this.config.reports.commercial_wallet_report_tracking.forEach(sendTo => {
              this.sendMessage(url, analyst, date_end, sendTo);
            });
          }
        });
      }
    }
  }

  async createPerformanceTrackings(commercial_wallets) {
    for (let commercial_wallet of commercial_wallets) {
      for (let performance_tracking of commercial_wallet.performance_trackings) {
        let commercial_wallet_performance_tracking = await this.commercialWalletReportPerformanceTrackingRepository
          .getPerformanceTrackingMonth(commercial_wallet.id, performance_tracking.reference_date);

        if (commercial_wallet_performance_tracking != null) {
          performance_tracking.total_amount = commercial_wallet_performance_tracking.total_amount;
          performance_tracking.receipt_number = commercial_wallet_performance_tracking.receipt_number;
          performance_tracking.variation = commercial_wallet_performance_tracking.variation;
          performance_tracking.id = commercial_wallet_performance_tracking.id;
        } else {
          let start_date = await this.moment(new Date(performance_tracking.reference_date)).format('YYYY-MM-DD');
          let end_date = new Date(performance_tracking.reference_date);
          end_date = await this.moment(end_date.setMonth(performance_tracking.reference_date.getMonth() + 1)).format('YYYY-MM-DD');

          let transactionsInPeriod = await this.commercialWalletReportPerformanceTrackingRepository
            .getTransactionsFromDocument(commercial_wallet.document, start_date, end_date);
          if (transactionsInPeriod == null) {
            performance_tracking.total_amount = 0;
            performance_tracking.receipt_number = 0;
          } else {
            performance_tracking.total_amount = transactionsInPeriod[0].valor_total;
            performance_tracking.receipt_number = transactionsInPeriod[0].quantidade;
          }
          if (this.commercialWalletReportPerformanceTrackingService.DateIsCurrentMonth(performance_tracking.reference_date)) {
            let commercial_wallet_performance_tracking = await this.commercialWalletReportPerformanceTrackingRepository
              .getPerformanceTrackingMonth(commercial_wallet.id, performance_tracking.reference_date);
            if (commercial_wallet_performance_tracking == null)
              performance_tracking.id = await this.commercialWalletReportPerformanceTrackingRepository
                .createPerformanceTracking(commercial_wallet.id, performance_tracking)
                .then(res => {
                  return res.id;
                });

          }
        }
      }
    }
  }

  async getPerformanceTrackings(commercial_wallets) {
    for (let commercial_wallet of commercial_wallets) {
      for (let performance_tracking of commercial_wallet.performance_trackings) {
        let commercial_wallet_performance_tracking = await this.commercialWalletReportPerformanceTrackingRepository
          .getPerformanceTrackingMonth(commercial_wallet.id, performance_tracking.reference_date);

        performance_tracking.total_amount = 0;
        performance_tracking.receipt_number = 0;
        performance_tracking.variation = 0;

        if (commercial_wallet_performance_tracking != null) {
          performance_tracking.total_amount = commercial_wallet_performance_tracking.total_amount;
          performance_tracking.receipt_number = commercial_wallet_performance_tracking.receipt_number;
          performance_tracking.variation = commercial_wallet_performance_tracking.variation;
        }
      }
    }
  }

  async generateCommercialWalletPerformanceTrackingExceljs(worksheet, commercial_wallets) {
    worksheet.getCell('E1').value = 'SOMA DE TARIFAS E QUANTIDADES POR MÊS';
    worksheet.mergeCells('E1:P1');
    worksheet.getCell('Q1').value = 'ANÁLISE DE VARIAÇÃO EM RELAÇÃO AO MÊS ANTERIOR';
    worksheet.mergeCells('Q1:U1');

    worksheet.views = [{
      state: 'frozen',
      xSplit: 4,
      ySplit: 2,
    }];

    worksheet.getCell('E1').fill = this.stylesheetsExcel.yellowCell;
    worksheet.getCell('E1').font = this.stylesheetsExcel.orangeFont;
    worksheet.getCell('Q1').fill = this.stylesheetsExcel.blueCell;
    worksheet.getCell('Q1').font = this.stylesheetsExcel.blackFont;

    this.moment.locale('pt-BR');
    let intraneturl = this.config.intranet.url + '/profiles/';

    let rows = [];
    for (let commercial_wallet of commercial_wallets) {
      let row = [];
      row.push(intraneturl + commercial_wallet.profile_id + '/' +
        commercial_wallet.document_id);
      row.push(commercial_wallet.name);
      row.push(commercial_wallet.type);
      row.push(commercial_wallet.document);


      commercial_wallet.performance_trackings = commercial_wallet.performance_trackings.reverse();
      for (let performance_tracking of commercial_wallet.performance_trackings) {
        row.push(performance_tracking.total_amount / 100);
        row.push(performance_tracking.receipt_number);
      }
      rows.push(row);
    }
    worksheet.addTable({
      name: 'MyTable',
      ref: 'A2',
      headerRow: true,
      totalsRow: false,
      style: {
        theme: 'TableStyleMedium2',
        showRowStripes: true,
      },
      columns: [{
        name: 'Intranet',
        filterButton: true,
      },
      {
        name: 'Nome',
        filterButton: true
      },
      {
        name: 'Tipo',
        filterButton: true
      },
      {
        name: 'Documento',
        filterButton: true
      },
      {
        name: await this.moment(commercial_wallets[0].performance_trackings[0].reference_date).format('MMM/YY') + ' VT',
        filterButton: true
      },
      {
        name: await this.moment(commercial_wallets[0].performance_trackings[0].reference_date).format('MMM/YY') + ' Q',
        filterButton: true
      },
      {
        name: await this.moment(commercial_wallets[0].performance_trackings[1].reference_date).format('MMM/YY') + ' VT',
        filterButton: true
      },
      {
        name: await this.moment(commercial_wallets[0].performance_trackings[1].reference_date).format('MMM/YY') + ' Q',
        filterButton: true
      },
      {
        name: await this.moment(commercial_wallets[0].performance_trackings[2].reference_date).format('MMM/YY') + ' VT',
        filterButton: true
      },
      {
        name: await this.moment(commercial_wallets[0].performance_trackings[2].reference_date).format('MMM/YY') + ' Q',
        filterButton: true
      },
      {
        name: await this.moment(commercial_wallets[0].performance_trackings[3].reference_date).format('MMM/YY') + ' VT',
        filterButton: true
      },
      {
        name: await this.moment(commercial_wallets[0].performance_trackings[3].reference_date).format('MMM/YY') + ' Q',
        filterButton: true
      },
      {
        name: await this.moment(commercial_wallets[0].performance_trackings[4].reference_date).format('MMM/YY') + ' VT',
        filterButton: true
      },
      {
        name: await this.moment(commercial_wallets[0].performance_trackings[4].reference_date).format('MMM/YY') + ' Q',
        filterButton: true
      },
      {
        name: await this.moment(commercial_wallets[0].performance_trackings[5].reference_date).format('MMM/YY') + ' VT',
        filterButton: true
      },
      {
        name: await this.moment(commercial_wallets[0].performance_trackings[5].reference_date).format('MMM/YY') + ' Q',
        filterButton: true
      },
      {
        name: await this.moment(commercial_wallets[0].performance_trackings[1].reference_date).format('MMM/YY'),
        filterButton: true
      },
      {
        name: await this.moment(commercial_wallets[0].performance_trackings[2].reference_date).format('MMM/YY'),
        filterButton: true
      },
      {
        name: await this.moment(commercial_wallets[0].performance_trackings[3].reference_date).format('MMM/YY'),
        filterButton: true
      },
      {
        name: await this.moment(commercial_wallets[0].performance_trackings[4].reference_date).format('MMM/YY'),
        filterButton: true
      },
      {
        name: await this.moment(commercial_wallets[0].performance_trackings[5].reference_date).format('MMM/YY'),
        filterButton: true
      },
      {
        name: 'SOMA DA VARIAÇÃO',
        filterButton: true
      },
      {
        name: 'MAIOR TARIFA',
        filterButton: true
      },
      {
        name: 'MAIOR QUANTIDADE',
        filterButton: true
      },
      {
        name: 'FATOR DE IMPACTO',
        filterButton: true
      },
      ],
      rows: rows,
    });

    for (let i = 0; i < (rows.length + commercial_wallets.length); i++) {
      for (let j = 0; j < 26; j++) {
        worksheet.getCell('' + String.fromCharCode(65 + j) + '' + (i + 1)).alignment = this.stylesheetsExcel.alignment;
      }
    }

    for (let i = 0; i < (commercial_wallets.length); i++) {
      for (let j = 0; j < 12; j++) {
        if (j % 2 != 0) {
          worksheet.getCell('' + String.fromCharCode(69 + j) + (i + 3)).border = {
            right: {
              style: 'medium'
            }
          };
        }
      }
    }

    for (let i = 0; i < 12; i++) {
      worksheet.getCell('' + String.fromCharCode(69 + i) + '2').fill = this.stylesheetsExcel.yellowCell;
      worksheet.getCell('' + String.fromCharCode(69 + i) + '2').font = this.stylesheetsExcel.orangeFont;
      if (i % 2 != 0) {
        worksheet.getCell('' + String.fromCharCode(69 + i) + '2').border = {
          right: {
            style: 'medium'
          }
        };
      }
    }

    for (let i = 0; i < 5; i++) {
      worksheet.getCell('' + String.fromCharCode(81 + i) + '2').fill = this.stylesheetsExcel.blueCell;
      worksheet.getCell('' + String.fromCharCode(81 + i) + '2').font = this.stylesheetsExcel.blackFont;
    }


    let columnDescription = 12;
    let columnValues = 12;

    worksheet.getColumn('A').width = columnDescription;
    worksheet.getColumn('B').width = columnDescription;
    worksheet.getColumn('C').width = columnDescription;
    worksheet.getColumn('D').width = columnDescription;
    worksheet.getColumn('E').width = columnValues;
    worksheet.getColumn('F').width = columnValues;
    worksheet.getColumn('G').width = columnValues;
    worksheet.getColumn('H').width = columnValues;
    worksheet.getColumn('I').width = columnValues;
    worksheet.getColumn('J').width = columnValues;
    worksheet.getColumn('K').width = columnValues;
    worksheet.getColumn('L').width = columnValues;
    worksheet.getColumn('M').width = columnValues;
    worksheet.getColumn('N').width = columnValues;
    worksheet.getColumn('O').width = columnValues;
    worksheet.getColumn('P').width = columnValues;
    worksheet.getColumn('Q').width = columnDescription;
    worksheet.getColumn('R').width = columnDescription;
    worksheet.getColumn('S').width = columnDescription;
    worksheet.getColumn('T').width = columnDescription;
    worksheet.getColumn('U').width = columnDescription;
    worksheet.getColumn('V').width = 15;
    worksheet.getColumn('W').width = 15;
    worksheet.getColumn('X').width = 15;
    worksheet.getColumn('Y').width = 20;

    let i = 3;
    for (let commercial_wallet of commercial_wallets) {
      worksheet.getCell('A' + i).value = {
        text: intraneturl + commercial_wallet.profile_id + '/' +
          commercial_wallet.document_id,
        hyperlink: intraneturl + commercial_wallet.profile_id + '/' +
          commercial_wallet.document_id,
        tooltip: 'Link para o documento do intranet'
      };

      worksheet.getCell('E' + i).numFmt = 'R$#,##0.00; ($#,##0.00); -';
      worksheet.getCell('G' + i).numFmt = 'R$#,##0.00; ($#,##0.00); -';
      worksheet.getCell('I' + i).numFmt = 'R$#,##0.00; ($#,##0.00); -';
      worksheet.getCell('K' + i).numFmt = 'R$#,##0.00; ($#,##0.00); -';
      worksheet.getCell('M' + i).numFmt = 'R$#,##0.00; ($#,##0.00); -';
      worksheet.getCell('O' + i).numFmt = 'R$#,##0.00; ($#,##0.00); -';
      worksheet.getCell('W' + i).numFmt = 'R$#,##0.00; ($#,##0.00); -';

      worksheet.getCell('Q' + i).numFmt = '0.0%';
      worksheet.getCell('R' + i).numFmt = '0.0%';
      worksheet.getCell('S' + i).numFmt = '0.0%';
      worksheet.getCell('T' + i).numFmt = '0.0%';
      worksheet.getCell('U' + i).numFmt = '0.0%';
      worksheet.getCell('V' + i).numFmt = '0.0%';



      worksheet.getCell('Y' + i).numFmt = '0.0000';

      worksheet.getCell('Q' + i).font = this.stylesheetsExcel.orangeFont;
      worksheet.getCell('R' + i).font = this.stylesheetsExcel.orangeFont;
      worksheet.getCell('S' + i).font = this.stylesheetsExcel.orangeFont;
      worksheet.getCell('T' + i).font = this.stylesheetsExcel.orangeFont;
      worksheet.getCell('U' + i).font = this.stylesheetsExcel.orangeFont;

      worksheet.getCell('Q' + i).value = {
        formula: 'IF(E' + i + '>0,((G' + i + '-E' + i + ')/E' + i + '),0)',
        result: 10,
      };
      worksheet.getCell('R' + i).value = {
        formula: 'IF(G' + i + '>0,((I' + i + '-G' + i + ')/G' + i + '),0)',
        result: 10,
      };
      worksheet.getCell('S' + i).value = {
        formula: 'IF(I' + i + '>0,((K' + i + '-I' + i + ')/I' + i + '),0)',
        result: 10,
      };
      worksheet.getCell('T' + i).value = {
        formula: 'IF(K' + i + '>0,((M' + i + '-K' + i + ')/K' + i + '),0)',
        result: 10,
      };
      worksheet.getCell('U' + i).value = {
        formula: 'IF(M' + i + '>0,((O' + i + '-M' + i + ')/M' + i + '),0)',
        result: 10,
      };
      worksheet.getCell('V' + i).value = {
        formula: 'SUM(Q' + i + ':U' + i + ')',
        result: 10,
      };
      worksheet.getCell('W' + i).value = {
        formula: 'MAX(E' + i + ',G' + i + ',I' + i + ',K' + i + ',M' + i + ',O' + i + ')',
        result: 10,
      };
      worksheet.getCell('X' + i).value = {
        formula: 'MAX(F' + i + ',H' + i + ',J' + i + ',L' + i + ',N' + i + ',P' + i + ')',
        result: 10,
      };
      worksheet.getCell('Y' + i).value = {
        formula: 'V' + i + '*W' + i + '/1000',
        result: 10,
      };
      i++;
    }

    worksheet.addConditionalFormatting({
      ref: 'Y3:Y' + (3 + commercial_wallets.length),
      rules: [{
        type: 'colorScale',
        cfvo: [{
          type: 'min'
        },
        {
          type: 'percent',
          value: 50
        },
        {
          type: 'num',
          value: 0.99
        },
        ],
        color: [{
          argb: 'ff766d'
        }, {
          argb: 'FFFFFF'
        }, {
          argb: '61b27c'
        }],
        style: {
          fill: {
            type: 'pattern',
            pattern: 'solid'
          }
        }
      }]
    });
  }

  async createExcelFile(filePath, fileRead, fileName) {
    const params = {
      Bucket: this.config.s3.bucket,
      Key: filePath + fileName,
      Body: fileRead,
      Expires: 432000
    };

    try {
      await this._putObject(params);
    } catch (err) {
      this.errorService.get('could_not_create_file_in_s3');
    }

    let url = await this.s3.getSignedUrl('getObject', {
      Bucket: this.config.s3.bucket,
      Key: filePath + fileName,
      Expires: 432000
    });

    return url ? url : null;
  }

  async sendMessage(url, analyst, reference_date, sendTo) {
    let date = this.moment(reference_date).format('MMMM/YYYY');
    const subject = 'Acompanhamento da Carteira Comercial - ' + analyst.name + ' referente a ' + date;

    const accountData = {
      number: this.constants.CONTA_ENVIO_EMAIL,
      nickname: sendTo.name,
      email: sendTo.email,
    };

    const templateData = {
      name: analyst.name,
      profile_name: sendTo.name,
      date: date,
      url: url
    };

    try {
      await this.emailService
        .sendEmail(accountData, 'commercial-wallet-report-performance-tracking', templateData, subject);
    } catch (err) {
      return 400;
    }
  }

  async _putObject(params) {
    return new Promise((reject, resolve) => {
      return this.s3.putObject(params, function (err, resp) {
        if (err) reject(err);
        resolve(resp);
      });
    });
  }

  async list(req) {
    let analyst = req.query.analyst;
    let type = req.query.type;
    let status = req.query.status;
    this.moment.locale('pt-BR');
    let limit = parseInt(req.query.limit) || 15;
    let offset = ((parseInt(req.query.page_number) || 1) - 1) * (limit * 6);
    let order = req.query.order || 'asc';
    let column = req.query.column || 'impact_factor';
    let term = req.query.term || null;
    let status_analyses = req.query.status_analyses || 'need_attention';

    let pagination = {
      limit: limit,
      offset: offset,
      order: order,
      column: column
    };

    if (!type)
      throw this.errorService
        .get('commercial_type_required');
    if (!analyst)
      throw this.errorService
        .get('analyst_required');

    let date_end = new Date();
    date_end = new Date(date_end.getFullYear(), date_end.getMonth() - 1);
    let six_months = new Date(date_end.getFullYear(), date_end.getMonth() - 5);
    let commercial_wallets = await this.commercialWalletReportPerformanceTrackingRepository
      .getPaginatedCommercialWalletFromAnalyst(analyst, new Date(), type, status, term, pagination, six_months, status_analyses);

    let rObj = [];
    if (commercial_wallets.length > 0) {
      let i = 0;
      commercial_wallets.forEach(obj => {
        const existWallet = rObj.filter(function (value) {
          return value.id === obj.id;
        });

        if (existWallet.length > 0) {
          if (obj.reference_date) {
            rObj[i].performance_trackings.push({
              reference_date: new Date(obj.reference_date),
              string_date: this.moment(obj.reference_date).format('MMMM/YYYY'),
              total_amount: obj.total_amount,
              receipt_number: obj.receipt_number,
            });
            if (parseInt(this.moment(obj.reference_date).format('DD')) - date_end.getMonth() < 5) {
              rObj[i].variations.push({
                reference_date: this.moment(obj.reference_date).format('MMM/YYYY'),
                value: obj.variation || 0,
              });
            }
          }
        }

        if (existWallet.length == 0) {
          i = rObj.length == 0 ? 0 : i + 1;
          rObj.push({
            'id': obj.id,
            'profile_id': obj.profile_id,
            'document_id': obj.document_id,
            'document': obj.document,
            'type': obj.type,
            'reference_value': obj.reference_value,
            'commercial_size': obj.commercial_size,
            'is_special': obj.is_special,
            'responsible_analyst': obj.responsible_analyst,
            'start_date': obj.start_date,
            'end_date': obj.end_date,
            'created_at': obj.created_at,
            'updated_at': obj.updated_at,
            'status_id': obj.status_id,
            'status': obj.status,
            'performance_trackings': [],
            'name': obj.name,
            'impact_factor': obj.impact_factor,
            'variations': [],
            'notes': []
          });

          rObj[i].performance_trackings.push({
            reference_date: new Date(obj.reference_date),
            string_date: this.moment(obj.reference_date).format('MMMM/YYYY'),
            total_amount: obj.total_amount,
            receipt_number: obj.receipt_number,
          });
        }
      });

      let data_commercial_wallets = Object.values(rObj);
      // else impossivel de alcançar(edit: if foi comentado, caso seja necessário descomentar a linha - adequação de testes)
      // if (data_commercial_wallets) {
      for (let commercial_wallet of data_commercial_wallets) {
        await this.commercialWalletReportPerformanceTrackingService
          .get_variations(commercial_wallet);
        await this.commercialWalletReportPerformanceTrackingService
          .get_total_amount_receipt_number(commercial_wallet);
        // }
      }
      //
      let getCountWallet = await this.commercialWalletReportPerformanceTrackingRepository
        .getCountCommercialWalletFromAnalyst(analyst, new Date(), type, status, term, status_analyses);

      let last_update = await this.commercialWalletReportPerformanceTrackingRepository
        .getMaxCreatedAt().then(res => {
          return res.created_at;
        });

      let size = {
        size: getCountWallet[0].count_wallet || 0,
        last_update: last_update,
        reference_date: this.moment(date_end).format('MM/YYYY')
      };
      data_commercial_wallets.push(size);
      return data_commercial_wallets;
    } else {
      throw this.errorService
        .get('no_commercial_wallets_were_found');
    }
  }

  async resume(req) {
    let analyst = req.query.analyst;

    if (!analyst)
      throw this.errorService
        .get('analyst_required');

    let resume = {
      commercial_wallet: {},
      status: {},
      performance_tracking: {}
    };

    await this.commercialWalletReportPerformanceTrackingRepository
      .countCommercialWalletsFromAnalyst(analyst, new Date())
      .then(res => resume.commercial_wallet.total = res.total);

    await this.commercialWalletReportPerformanceTrackingRepository
      .getMaxReferenceValueFromAnalyst(analyst, new Date())
      .then(res => resume.commercial_wallet.reference_value = res.reference_value);

    let types = await this.commercialWalletReportPerformanceTrackingRepository
      .getCommercialWalletTypes();

    for (let type of types) {
      await this.commercialWalletReportPerformanceTrackingRepository
        .countCommercialWalletsFromAnalystAndType(analyst, new Date(), type.name)
        .then(res => resume.commercial_wallet[type.name] = res.total);

      await this.commercialWalletReportPerformanceTrackingRepository
        .getTotalStatusInsertedFromType(analyst, new Date(), type.name)
        .then(res => resume.status[type.name] = res.length);
    }

    await this.commercialWalletReportPerformanceTrackingRepository
      .getMaxValueInPerformanceTracking(analyst, new Date(), 'total_amount')
      .then(res => resume.performance_tracking.total_amount = res.total_amount);

    await this.commercialWalletReportPerformanceTrackingRepository
      .getMaxValueInPerformanceTracking(analyst, new Date(), 'receipt_number')
      .then(res => resume.performance_tracking.receipt_number = res.receipt_number);

    await this.commercialWalletReportPerformanceTrackingRepository
      .getTotalStatusInserted(analyst, new Date())
      .then(res => resume.status.total = res.length);

    return resume;
  }
}

module.exports = CommercialWalletReportPerformanceTrackingBs;
