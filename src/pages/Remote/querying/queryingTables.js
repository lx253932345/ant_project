export const queryingRunningStatusColsConfig = {
  created: {
      title: "时间",
      width: 140
  },
  time: {
      title: "运行时间 (min)",
      children: {
          fanTime: {
              title: "风机",
              width: 100
          },
          airTime: {
              title: "空调",
              width: 100
          },
      }
  },
  temp: {
      title: "温度 (°C)",
      children: {
          outTemp: {
              title: "室外温度",
              width: 100,
          },
          inTemp1: {
              title: "室内温度",
              width: 100
          },
      }
  },
  meterVolume: {
      title: "电表读数 (kw.h)",
      children: {
          meter1: {
              title: "总路",
              width: 120,
          },
          meter2: {
              title: "分路",
              width: 120,
          },
      }
  }

};

export const queryingRealtimeCols = {
  airStatus: "空调状态",
  airTime: "空调累计运行",

  fanStatus: "风机状态",
  fanTime: "风机累计运行",
  valveStatus: "混风阀状态",

  mode: "运行模式",

  inHu: "室内湿度",
  inTemp1: "室内温度",

  outHu: "室外湿度",
  outTemp: "室外温度",

  meter1: "总表读数",
  meter2: "分表读数",

  inTemp2: "室内温度2",
  inTemp3: "室内温度3",
  inTemp4: "室内温度4",
  clean1: "自清洁运行时间",

  frequency: "上传频率",
  altDate: "轮替日期",

};

export const queryingRealtimeStatusCols = {
  device: {
      title: "局站名称",
      width: 120,
  },
  created: {
      title: "更新时间",
      width: 180,
  },
  altDate: {
      title: "轮替时间",
      width: 180
  },
  mode: {
      title: "运行模式",
      width: 100,
  },
  out: {
      title: "室外",
      children: {
          outTemp: {
              title: "温度（°C）",
              width: 80,
          },
          outHu: {
              title: "湿度（%）",
              width: 80,
          },
      }
  },
  in: {
      title: "室内",
      children: {
          inTemp1: {
              title: "温度（°C）",
              width: 80,
          },
          inHu: {
              title: "湿度（%）",
              width: 80,
          },
      }
  },
  status: {
      title: "局站状态",
      children: {
          fanStatus: {
              title: "风机",
              width: 80,
          },
          airStatus: {
              title: "空调",
              width: 80,
          },
          valveStatus: {
              title: "混风阀",
              width: 80,
          },
      }
  },
  time: {
      title: "当日运行时长",
      children: {
          fanTime: {
              title: "风机",
              width: 80,
          },
          airTime: {
              title: "空调",
              width: 80,
          },
          // clean1: {
          //     title: "自清洁",
          //     width: 100,
          // },
      }
  },
  meter: {
      title: "电表读数",
      children: {
          meter1: {
              title: "总表",
              width: 120,
          },
          meter2: {
              title: "分表",
              width: 120,
          },
      }
  },
  inTempOther: {
      title: "室内温度（°C）",
      children: {
          inTemp2: {
              title: "2",
              width: 80,
          },
          inTemp3: {
              title: "3",
              width: 80,
          },
          inTemp4: {
              title: "4",
              width: 80,
          },
      }
  }

};

export const queryingHistoryStatusCols = {
  device: {
      title: "局站名称",
      width: 100,
  },
  created: {
      title: "日期",
      width: 140,
  },
  outTempAll: {
      title: "室外温度（°C）",
      children: {
          outTempLow: {
              title: "最低",
              width: 80,
          },
          outTempHigh: {
              title: "最高",
              width: 80,
          },
          outTemp: {
              title: "平均",
              width: 80,
          },
      }
  },
  inTempAll: {
      title: "室内温度（°C）",
      children: {
          inTempLow: {
              title: "最低",
              width: 80,
          },
          inTempHigh: {
              title: "最高",
              width: 80,
          },
          inTemp: {
              title: "平均",
              width: 80,
          },
      }
  },
  outHu: {
      title: "室外湿度（%）",
      width: 90,
  },
  inHu: {
      title: "室内湿度（%）",
      width: 90,
  },
  fanTime: {
      title: "风机运行时长",
      width: 80,
  },
  airTime: {
      title: "空调运行时长",
      width: 80,
  },
  clean1: {
      title: "自清洁时间",
      width: 80,
  },
  volume: {
      title: "电量",
      children: {
          meter1Volume: {
              title: "总表",
              width: 120,
          },
          meter2Volume: {
              title: "分表",
              width: 120,
          },
      }
  },
  meter: {
      title: "电表度数",
      meter1: {
          title: "总表",
          width: 120,
      },
      meter2: {
          title: "分表",
          width: 120,
      },
  }
};

export const powerQueryingCols = {
  device: {
      title: "局站名称",
      //width: "20%",
      width: "3%",
  },
  created: {
      title: "日期",
      width: "10%",
  },
  meter1Volume: {
      title: "总表电量",
      width: "20%",
  },
  meter2Volume: {
      title: "分表电量",
      width: "20%",
  },
  outTemp: {
      title: "室外温度",
      width: "15%",
  },
  inTemp: {
      title: "室内温度",
      width: "15%"
  },
};
