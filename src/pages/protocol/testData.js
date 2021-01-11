export default {
  'dp.xml': [
    {
      '@id': 'http',
      '@baseProtocol': 'tcp',
      layerProperty: [],
      recordField: {
        '@allItem': 'false',
        '@template': 'xpath',
        field: [
        ],
      },
    },
  ],
  'proto.xml': {
    basic: {
      display_name: '',
      name: '',
      desc: '',
    },
    prepare: {
      field: [
        {
          '@op': 'as',
          '@value': '30',
          '#text': 'max_span',
        },
      ],
    },
    normalizes: {
      normalize: [
        {
          '@name': 'transaction_id',
          field: [],
        },
        {
          '@name': 'trans_type',
          field: [],
        },
        {
          '@name': 'sub_trans_type',
          field: [],
        },
        {
          '@name': 'ret_code',
          field: [],
        },
        {
          '@name': 'starts_with',
          field: [],
        },
        {
          '@name': 'ends_with',
          field: [],
        },
        {
          '@name': 'is_success',
          field: [],
        },
      ],
    },
    traces: {
      field: [
        {
          '@name': 'critical_keyword',
          field: {
            '@op': 'as',
            '@item1': 'transaction_id',
          },
        },
        {
          '@name': 'fields',
          field: [
            {
              '@op': 'as',
              '@item1': 'status',
            },
            {
              '@op': 'as',
              '@item1': 'TxId',
            },
          ],
        },
      ],
    },
    trace_disp: {
      field: [
      ],
    },
    dimensions: {
      dimension: [
        {
          '@name': 'trans_type',
          '@display_name': '交易类型',
          '@csv_file': 'trans_type.csv',
        },
        {
          '@name': 'sub_trans_type',
          '@display_name': '交易渠道',
          '@csv_file': 'sub_trans_type.csv',
        },
      ],
    },
  },
  csv: [
    {
      csvname: '222',
      data: [],
    },
    {
      csvname: '333',
      data: [],
    },
  ],
};
