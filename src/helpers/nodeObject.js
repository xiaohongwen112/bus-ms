export const serverNode = {
  ref: [],
  alarmrules: {
    template: {
      on: false,
      _id: '',
    },
    weight: 1,
    threshold: {
      duration: {
        upgrade_strategy: {
          level1: 3,
        },
        baseOn: true,
        on: false,
        up: {
          value: null,
          time: 1,
        },
      },
      trans_count: {
        upgrade_strategy: {
          level1: 3,
        },
        baseOn: true,
        on: false,
        down: {
          value: null,
          time: 1,
        },
        up: {
          value: null,
          time: 1,
        },
      },
      rr_rate: {
        upgrade_strategy: {
          level1: 3,
        },
        baseOn: true,
        on: false,
        down: {
          value: null,
          time: 1,
        },
      },
      succ_rate: {
        upgrade_strategy: {
          level1: 3,
        },
        baseOn: true,
        on: false,
        down: {
          value: null,
          time: 1,
        },
      },
      no_req: {
        on: false,
        time: 1,
      },
    },
    health: {
      duration: null,
      upgrade_strategy: {
        level1: 3,
      },
      baseOn: true,
      on: false,
      ts_hold: 1,
      health_set: null,
    },
    baseline: {
      duration: {
        down: null,
        on: false,
        up: null,
        time: 1,
      },
      trans_count: {
        down: null,
        on: false,
        up: null,
        time: 1,
      },
      succ_rate: {
        down: null,
        on: false,
        up: null,
        time: 1,
      },
    },
    return_code: {
      on: false,
      val: null,
      level: 1,
    },
    whereabouts: [
      {
        level: 1,
        contact_person: [],
        contact_group: [],
        inform: [],
      },
    ],
  },
  collector: [{
    server_id: '',
    nic_addr: '',
    name: '',
    target_prot: '',
    disp_name: '',
  }],
  settings: {
    captype: 'sp',
    correlated_group_name: '',
    correlated_trade_group_name: '',
    disp_name: '',
    filter: {
      dst_ports: [],
      dst_ip_device: [],
      dst_ip_addr: [],
      dst_ip_list: [],
    },
    imgname: '',
    is_double_live: false,
    is_master: true,
    is_slave: false,
    is_twoway_trade: false,
    link: '',
    name: '',
    pos: {},
    type: '',
    childId: '',
    groupId: '',
    id: '',
  },

};
export const clientNode = {
  ref: [],
  settings: {
    disp_name: '',
    filter: {
      dst_ip_list: [],
      dst_ip_addr: [],
      dst_ip_device: [],
      dst_ports: [],
    },
    name: '',
    imgname: '',
    pos: {},
    type: '',
    childId: '',
    groupId: '',
    id: '',
  },
};

