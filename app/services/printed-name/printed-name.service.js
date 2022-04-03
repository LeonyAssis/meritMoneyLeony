'use strict';

class PrintedNameService {
  constructor() { }

  formatCardNaturalOwnerName(name) {
    let newName = name.toUpperCase();
    newName = newName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]|_/g, '');
    if (newName.length <= 21) return newName;

    const prepositions = [' A ', ' E ', ' DA ', ' DAS ', ' DE ', ' DO ', ' DOS '];

    for (let i = 0; i < prepositions.length; i++) {
      newName = newName.split(prepositions[i]).join(' ');
    }

    if (newName.length <= 21) {
      return newName;
    }

    const names = newName.split(' ');
    if (names.length > 2) {
      for (let i = 1; i < names.length - 1; i++) {
        names[i] = names[i].charAt(0);
      }
      newName = names.join(' ');

      if (newName.length <= 21) {
        return newName;
      }
    }

    newName = names[0] + ' ' + names[names.length - 1];
    while (newName.length > 21) {
      newName = newName.slice(0, -1);
    }

    return newName;
  }

  formatCardLegalOwnerName(name) {
    let newName = name.toUpperCase();
    newName = newName.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]|_/g, '')
      .replace(/[\d]{11}$/g, '');

    newName = newName.replace(/\s+/g, ' ');

    if (newName.charAt(0) === ' ')
      newName = newName.slice(1);

    if (newName.charAt(newName.length - 1) === ' ')
      newName = newName.slice(0, newName.length - 1);

    const removeAcronymsFromStringEnd = (string) => {
      const acronyms = [' S.A.', ' S/A.', ' ME', ' EIRELI', ' EPP', ' MEI', ' LTDA'];

      for (let i = 0; i < acronyms.length; i++) {
        const substring = acronyms[i];
        const fromIndex = string.length - substring.length;
        const ocurrencyIndex = string.indexOf(substring, fromIndex);
        if (ocurrencyIndex !== -1) {
          return string.slice(0, ocurrencyIndex);
        }
      }
      return string;
    };

    newName = removeAcronymsFromStringEnd(newName);

    const prepositions = [' DE ', ' DOS ', ' DA ', ' DAS ', ' DO '];

    for (let i = 0; i < prepositions.length; i++) {
      newName = newName.replace(new RegExp(prepositions[i], 'g'), ' ');
    }

    if (newName.length <= 21) return newName;

    while (newName.length > 21) {
      newName = newName.slice(0, -1);
    }

    return newName;
  }
}

module.exports = PrintedNameService;
