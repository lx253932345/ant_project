export const alternativeColsOld = {
  "start_date_time": "开始时间",
  "stop_date_time": "结束时间",
  "air_alt_time": "空调运行切换时长",
  "auto_alt_time": "自动运行切换时长",
};

export const alternativeCols = {
  "alt_date": "空调运行日期",
  "alt_time": "轮替切换时间",
  "alt_day": "空调运行天数",
};


export const alternativeAltDateOptions = [{
  value: "type-1",
  label: "日期",
  children: [...Array(25)].map((item, idx) => {
      return {
          value: idx + 1,
          label: `${idx + 1}日`
      };
  })
}, {
  value: "type-2",
  label: "单双号",
  children: [{
      value: 32,
      label: "单号",
  }, {
      value: 33,
      label: "双号",
  }],
}, {
  value: "type-3",
  label: "星期",
  children: [{
      value: 49,
      label: "星期一",
  }, {
      value: 50,
      label: "星期二",
  }, {
      value: 51,
      label: "星期三",
  }, {
      value: 52,
      label: "星期四",
  }, {
      value: 53,
      label: "星期五",
  }, {
      value: 54,
      label: "星期六",
  }, {
      value: 48,
      label: "星期日",
  }],
}, {
  value: "type-4",
  label: "不轮替",
  children: [{
      value: 0,
      label: "不轮替"
  }]
}];

export const cleaningTimingCols = {
  "valve_close_time": "关阀时间（秒）",
  "clean_last": "自净化时间（秒）",
  "clean_humid": "自净化湿度（%）",
  "clean_warn_time": "自清洁时间上限（秒）",
};

export const cleaningWeekdayConfig = {
  0: "星期一",
  1: "星期二",
  2: "星期三",
  3: "星期四",
  4: "星期五",
  5: "星期六",
  6: "星期日",
};

export const warningHandleTableConfig = {
  warnName: "告警事件",
  processName: "处理方式"
};

export const warningSettingConfig = {
  "in_high": "室内温度上限（°C）",
  "in_low": "室内温度下限（°C）",
  "out_high": "室外温度上限（°C）",
  "out_low": "室外温度下限（°C）",
  "in_humid_high": "室内湿度上限（%）",
  "in_humid_low": "室内湿度下限（%）",
  "out_humid_high": "室外湿度上限（%）",
  "out_humid_low": "室外湿度下限（%）",
  "clean_time": "自清洁时间",
  "air_temperature": "空调出口温度（°C）"
};

export const autoModeFreshAirConfig = {
  "fan_start_temp": "新风开启温度（°C）",
  "fan_stop_temp": "新风关闭温度（°C）",
  "air_start_temp": "空调开启温度（°C）",
  "air_stop_temp": "空调关闭温度（°C）",


  "valve_start_temp": "混风阀关闭温度（°C）",
  "valve_stop_temp": "混风阀开启温度（°C）",
  "valve_start_humid": "混风阀开启湿度（%）",
  "valve_stop_humid": "混风阀关闭湿度（%）",
  "temperature_gap": "温差（°C）",
  "air_interval": "空调启停间隔（分钟）",
};

export const runningModeConfig = {
  runningMode: "运行模式",
  frequency: "上报频率"
};

export const relayModeConfig = {
  mode: "模式",
  jfanSwitch: "进风机开关",
  cleanerSwitch: '吸尘器开关',
  hvSwitch: '高压电源开关',
  hvalveSwitch: '混风阀开关',
  rotarySwitch: '旋转电机开关',
  valveSwitch: '风阀开关'
};
export const relayModeConfigData = {
  mode: { 0: '自动模式', 1: '空调模式', 3: '调试模式', 4: '新风模式' },
  jfanSwitch: { 0: '关', 1: '开' },
  cleanerSwitch: { 0: '关', 1: '开' },
  hvSwitch: { 0: '关', 1: '开' },
  hvalveSwitch: {
    0: '关',
    1: '开',
    2: '循环开'
  },
  rotarySwitch: {
    0: '关',
    1: '开',
    2: '循环开'
  },
  valveSwitch: {
    0: '关',
    1: '开',
    2: '循环开'
  }
};

export const airParameterConfig = {
  airBrand1: "红外空调品牌1",
  airBrand2: "红外空调品牌2",
  airBrand3: '红外空调品牌3',
  airBrand4: '红外空调品牌4',
  airTemp: '空调默认温度',
  baudRate: '波特率',
  controlStrategy: '控制策略',
  sendFrequency: '发送频率',
  startAdress: '485起始地址',
  stopAdress: '485终止地址',
  switch1Closetime: '面板1闭合时间',
  switch1Feedbacktime: '面板1反馈时间',
  switch2Closetime: '面板2闭合时间',
  switch2Feedbacktime: '面板2反馈时间'
};
