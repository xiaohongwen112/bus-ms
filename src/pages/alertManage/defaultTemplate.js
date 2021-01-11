export default {
  // "_id": "xxxxxxxxxxxx",  // 唯一标识这一条数据
  name: '',  // 告警模板名称
  // 告警三大指标（健康度告警、基线告警、自定义指标告警（原返回码告警））
  // "indicator": ["health", "threshold", "return_code"], // 该字段暂未使用，舍弃
  // classify: '初始化',  // 默认告警模板类型为"初始化"，自定义告警模板为"自定义"
  // modifier: 'admin',  // 修改人
  describe: '',  // 备注
  // 告警指标详情  //
  alarmrules: {
      // 健康度告警 //
    health: {
      duration: null,  // 响应时间正常值（只能用户手动设置，自动基线并无该值，V5.2 重构健康度时会废弃该字段）
      on: false,  // true 表示手动设置 false 表示使用自动基线
      baseOn: true,  // true 表示自动基线 false 表示手动设置
      health_set: null,  // 健康度低于该值产生告警（可能为自动基线值或用户手动设置值）
      upgrade_strategy: {  // 升级策略
        level1: 3,  // 级别 1：警告
        // level2: 3,  // 级别 2：严重
        // level3: 4,  // 级别 3：危急
        // level4: 10,  // 级别 4：致命
      },
      ts_hold: 1,  // 告警延迟/分
    },
      // 基线告警 //
    threshold: {
      trans_count: {  // 交易量
        down: {
          value: null,
          time: 1,  // 告警延迟时间
        },
        on: false,
        baseOn: true,
        up: {
          value: null,
          time: 1,
        },
        upgrade_strategy: {
          level1: 3,
          // level2: 3,
          // level3: 5,
          // level4: 10,
        },
      },
      succ_rate: {  // 成功率
        down: {
          value: null,
          time: 1,
        },
        on: false,
        baseOn: true,
        upgrade_strategy: {
          level1: 3,
          // level2: 3,
          // level3: 5,
          // level4: 10,
        },
      },
      duration: {  // 响应时间
        on: false,
        baseOn: true,
        up: {
          value: null,
          time: 1,
        },
        upgrade_strategy: {
          level1: 3,
          // level2: 3,
          // level3: 5,
          // level4: 10,
        },
      },
      rr_rate: {  // 响应率
        down: {
          value: null,
          time: 1,
        },
        on: false,
        baseOn: true,
        upgrade_strategy: {
          level1: 3,
          // level2: 3,
          // level3: 5,
          // level4: 10,
        },
      },
    },
      // 返回码告警 //
    return_code: {
      on: false,  // true 表示开启，false 表示停用（返回码没有自动基线）
      val: '',  // 告警码返回值 以英文 , 分割
      level: 1,  // 默认告警级别：1、2、3、4
          // "ts_hold": 5
    },
      // 自定义指标告警 //
    custom: [
          // {
          //     "_id": "_id_str",  // 自定义指标 id 字符串格式 用于前端点击指标时可以获取到对应的数据
          //     "up": {
          //         "on": false,  // true 表明启用
          //         "value": 300,
          //         "time": 1
          //     },
          //     "down": {
          //         "on": false,  // true 表明启用
          //         "value": 20,
          //         "time": 2
          //     },
          //     "on": false,
          //     "baseOn": true,
          //     "upgrade_strategy": {
          //         "level1": 3,
          //         "level2": 5,
          //         "level3": 8,
          //         "level4": 10
          //     },
          // }, ...  // 可能有很多自定义指标告警
    ],
  },
};
