export const ruleInstance = () => ({
  threshold: {
    duration: {
      on: false,
      up: {
        value: null,
        time: 1,
      },
    },
    trans_count: {
      down: {
        value: null,
        time: 1,
      },
      on: false,
      up: {
        value: null,
        time: 1,
      },
    },
    succ_rate: {
      down: {
        value: null,
        time: 1,
      },
      on: false,
    },
    rr_rate: {
      down: {
        value: null,
        time: 1,
      },
      on: false,
    },
    no_req: {
      on: false,
      time: 1,
    },
  },
  return_code: {
    on: false,
    val: null,
  },
  health: {
    duration: null,
    health_set: null,
    ts_hold: 1,
    on: false,
  },
  id: '',
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
});

export default undefined;
