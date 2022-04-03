const StylesheetsExcel = {
  blueHeader: {
    font: {
      font: 'calibri',
      color: '#FFFFFF',
      size: 11,
      bold: true
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      bgColor: '#4473c4',
      fgColor: '#4473c4',
    },
    border: {
      bottom: {
        style: 'thin',
        color: '#8ea9db',
      }
    }
  },

  yellowHeader: {
    font: {
      font: 'calibri',
      color: '#000000',
      size: 11
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      bgColor: '#ffd966',
      fgColor: '#ffd966',
    },
    alignment: {
      wrapText: true,
      horizontal: 'center',
    },
    border: {
      bottom: {
        style: 'thin',
        color: '#8ea9db',
      }
    }
  },

  lightBlueHeader: {
    font: {
      font: 'calibri',
      color: '#000000',
      size: 11
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      bgColor: '#ddebf7',
      fgColor: '#ddebf7',
    },
    alignment: {
      wrapText: true,
      horizontal: 'center',
    },
    border: {
      bottom: {
        style: 'thin',
        color: '#8ea9db',
      }
    }
  },

  blank: {
    font: {
      font: 'calibri',
      color: '#000000',
      size: 11
    },
    alignment: {
      horizontal: 'center',
      vertical: 'center',
      wrapText: true,
    },
    border: {
      bottom: {
        style: 'thin',
        color: '#8ea9db',
      }
    }
  },

  money: {
    font: {
      font: 'calibri',
      color: '#000000',
      size: 11
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      bgColor: '#d9e1f2',
      fgColor: '#d9e1f2',
    },
    alignment: {
      horizontal: 'center',
      vertical: 'center'
    },
    numberFormat: 'R$#,##0.00; ($#,##0.00); -',
    border: {
      bottom: {
        style: 'thin',
        color: '#8ea9db',
      }
    }
  },

  blankmoney: {
    font: {
      font: 'calibri',
      color: '#000000',
      size: 11
    },
    alignment: {
      horizontal: 'center',
      vertical: 'center'
    },
    numberFormat: 'R$#,##0.00; ($#,##0.00); -',
    border: {
      bottom: {
        style: 'thin',
        color: '#8ea9db',
      }
    }
  },

  blankpercent: {
    font: {
      font: 'calibri',
      color: '#000000',
      size: 11
    },
    alignment: {
      horizontal: 'center',
      vertical: 'center'
    },
    numberFormat: '0%',
    border: {
      bottom: {
        style: 'thin',
        color: '#8ea9db',
      }
    }
  },

  percent: {
    font: {
      font: 'calibri',
      color: '#000000',
      size: 11
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      bgColor: '#d9e1f2',
      fgColor: '#d9e1f2',
    },
    alignment: {
      horizontal: 'center',
      vertical: 'center'
    },
    numberFormat: '0.0%',
    border: {
      bottom: {
        style: 'thin',
        color: '#8ea9db',
      }
    }
  },

  orangePercent: {
    font: {
      font: 'calibri',
      color: '#c65911',
      size: 11
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      bgColor: '#d9e1f2',
      fgColor: '#d9e1f2',
    },
    alignment: {
      horizontal: 'center',
      vertical: 'center'
    },
    numberFormat: '0.0%',
    border: {
      bottom: {
        style: 'thin',
        color: '#8ea9db',
      }
    }
  },

  lightBlueCell: {
    font: {
      font: 'calibri',
      color: '#000000',
      size: 11
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      bgColor: '#d9e1f2',
      fgColor: '#d9e1f2',
    },
    alignment: {
      horizontal: 'center',
      vertical: 'center'
    },
    border: {
      bottom: {
        style: 'thin',
        color: '#8ea9db',
      }
    }
  },
  greenCell: {
    font: {
      font: 'calibri',
      color: '#000000',
      size: 11
    },
    fill: {
      type: 'pattern',
      patternType: 'solid',
      bgColor: '#64a358',
      fgColor: '#64a358',
    },
    numberFormat: '0.0000',
    border: {
      bottom: {
        style: 'thin',
        color: '#8ea9db',
      }
    }
  },

  orangeFont: {
    name: 'Calibri',
    family: 4,
    size: 11,
    bold: false,
    color: {
      argb: 'C65911'
    },
  },
  blackFont: {
    name: 'Calibri',
    family: 4,
    size: 11,
    bold: false,
    color: {
      argb: '0'
    },
  },
  alignment: {
    wrapText: true,
    vertical: 'middle',
    horizontal: 'center'
  },
  yellowCell: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: {
      argb: 'FFD966'
    }
  },
  blueCell: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: {
      argb: 'ddebf7'
    }
  }
};

module.exports = StylesheetsExcel;
