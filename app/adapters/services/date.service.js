'use strict';

class DateService {
  constructor(params) {
    this.config = params.config;
    this.moment = params.momentTz;
    this.holidays = params.holidays;
    this.easter = params.easter;
  }

  getNewDate() {
    return this.moment
      .tz(this.config.timezone)
      .format('YYYY-MM-DD');
  }

  toBrFormat(date) {
    return this.moment
      .tz(date, this.config.timezone)
      .format('DD/MM/YYYY');
  }

  toDateTimeFormat(datetime) {
    return this.moment
      .tz(datetime, this.config.timezone)
      .format('YYYY-MM-DD HH:mm:ss');
  }

  isSameOrAfterToday(date, granularity = 'day') {
    return this.moment
      .tz(date, this.config.timezone)
      .isSameOrAfter(
        this.moment.tz(this.config.timezone),
        granularity
      );
  }

  /**
   * @param {string} str
   * @param {string} format
   * @returns {Date}
   */
  parseDate(str, format) {
    let moment = this.moment
      .tz(str, format, this.config.timezone);

    return moment.isValid() ? moment.toDate() : null;
  }

  /**
   * @param {Date} date
   * @param {number} amount
   * @param {('year'|'month'|'day'|'hour'|'minute'|'second')} unit
   * @returns {Date}
   */
  subtract(date, amount, unit = 'day') {
    return this.moment
      .tz(date, this.config.timezone)
      .subtract(amount, unit)
      .toDate();
  }

  async add_easter_holidays(holidays, year) {
    let easter = this.easter.easter(year);

    let easter_day = {
      name: 'Páscoa',
      date: new Date(easter.year, easter.month - 1, easter.day),
      start: new Date(easter.year, easter.month - 1, easter.day, 0, 0, 0, 0),
      end: new Date(easter.year, easter.month - 1, easter.day + 1, 0, 0, 0, 0),
      type: 'public'
    };

    let carnival_day = {
      name: 'Carnaval',
      date: new Date(easter.year, easter.month - 1, easter.day - 47),
      start: new Date(easter.year, easter.month - 1, easter.day - 47, 0, 0, 0, 0),
      end: new Date(easter.year, easter.month - 1, easter.day - 46, 0, 0, 0, 0),
      type: 'public'
    };

    let holy_friday_day = {
      name: 'Sexta-Feira Santa',
      date: new Date(easter.year, easter.month - 1, easter.day - 2),
      start: new Date(easter.year, easter.month - 1, easter.day - 2, 0, 0, 0, 0),
      end: new Date(easter.year, easter.month - 1, easter.day - 1, 0, 0, 0, 0),
      type: 'public'
    };

    let corpus_christ_day = {
      name: 'Corpus Christ',
      date: new Date(easter.year, easter.month - 1, easter.day + 60),
      start: new Date(easter.year, easter.month - 1, easter.day + 60, 0, 0, 0, 0),
      end: new Date(easter.year, easter.month - 1, easter.day + 61, 0, 0, 0, 0),
      type: 'public'
    };

    await holidays.push(easter_day);
    await holidays.push(carnival_day);
    await holidays.push(holy_friday_day);
    await holidays.push(corpus_christ_day);
    return holidays;
  }

  async add_municipal_holidays(holidays, year) {
    let city_birthday = {
      name: 'Aniversário de Ouro Preto',
      date: new Date(year, 6, 8),
      start: new Date(year, 6, 8, 0, 0, 0, 0),
      end: new Date(year, 6, 9, 0, 0, 0, 0),
      type: 'public'
    };

    let city_patron_day = {
      name: 'Nossa Senhora da Conceição',
      date: new Date(year, 11, 8),
      start: new Date(year, 11, 8, 0, 0, 0, 0),
      end: new Date(year, 11, 9, 0, 0, 0, 0),
      type: 'public'
    };

    await holidays.push(city_birthday);
    await holidays.push(city_patron_day);
    return holidays;
  }

  async initialize_holidays(year) {
    var holidays = new this.holidays('BR', 'MG');

    holidays = await holidays.getHolidays(year).filter(function (holiday) {
      return holiday.type == 'public' && holiday.name != 'Dia dos Namorados' && holiday.name != 'Sexta-Feira Santa';
    });

    holidays = await this.add_easter_holidays(holidays, year);
    holidays = await this.add_municipal_holidays(holidays, year);

    return holidays;
  }

  async is_business_day(date) {

    let week_day = date.getDay();
    if (week_day == 0 || week_day == 6)
      return false;

    let holidays = await this.initialize_holidays(date.getFullYear());

    for (let holiday of holidays) {
      if (date >= holiday.start && date < holiday.end)
        return false;
    }

    return true;
  }

  async is_first_business_day(date) {
    let first_day = new Date(date);

    first_day.setDate(1);

    while (await this.is_business_day(first_day) == false) {
      await first_day.setDate(first_day.getDate() + 1);
    }
    if (first_day.getDate() == date.getDate() && first_day.getMonth() == date.getMonth())
      return true;

    return false;
  }

  async is_interval_hour(date = new Date(), startHour = [0, 0, 0], endHour = [23, 59, 59]) {
    let getTimeActual = new Date().getTime();
    let getTimeStartCondition = startHour ? date.setHours(startHour[0], startHour[1], startHour[2]) : false;
    let getTimeEndCondition = endHour ? date.setHours(endHour[0], endHour[1], endHour[2]) : false;

    if ((getTimeActual >= getTimeStartCondition) && (getTimeActual <= getTimeEndCondition))
      return true;

    return false;
  }
}



module.exports = DateService;
