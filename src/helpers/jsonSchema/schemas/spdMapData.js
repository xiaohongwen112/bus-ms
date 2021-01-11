// /zh-cn/spd/:MAPNAME/overview/mapdata/
export default {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "msg": {
      "type": "string"
    },
    "code": {
      "type": "number"
    },
    "data": {
      "type": "object",
      "properties": {
        "map_name": {
          "type": "string",
          "description": "map名称"
        },
        "topov_map": {
          "type": "object",
          "properties": {
            "nodes": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "visible": {
                    "type": "boolean"
                  },
                  "clients": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "name": {
                    "type": "string",
                    "description": "组件名"
                  },
                  "weight": {
                    "type": "number",
                    "description": "权重"
                  },
                  "raw": {
                    "type": "boolean",
                    "description": "原始节点"
                  },
                  "servers": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "group": {
                          "type": "string"
                        },
                        "ipports": {
                          "type": "object",
                          "properties": {
                            "ips": {
                              "type": "array",
                              "items": {
                                "type": "string"
                              }
                            },
                            "ports": {
                              "type": "array",
                              "items": {
                                "type": "string"
                              }
                            }
                          },
                          "required": [
                            "ips",
                            "ports"
                          ]
                        }
                      },
                      "required": [
                        "group",
                        "ipports"
                      ]
                    }
                  },
                  "id": {
                    "type": "number"
                  },
                  "ip_ports": {
                    "type": "array",
                    "items": {
                      "type": "array",
                      "items": {
                        "type": ["string", "array", "number"]
                      }
                    }
                  },
                  "pos": {
                    "type": [
                      "object",
                      "null"
                    ],
                    "properties": {
                      "y": {
                        "type": "number"
                      },
                      "x": {
                        "type": "number"
                      }
                    }
                  }
                },
                "required": [
                  "visible",
                  "clients",
                  "name",
                  "weight",
                  "raw",
                  "servers",
                  "id",
                  "ip_ports",
                ]
              },
              "description": "节点信息"
            },
            "hidebox": {
              "type": "object",
              "properties": {
                "other_raw_ips": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              },
              "description": "未知",
              "required": [
                "other_raw_ips"
              ]
            },
            "links": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "direction": {
                    "type": "array",
                    "items": {
                      "type": "boolean"
                    }
                  },
                  "weight": {
                    "type": "number"
                  },
                  "nodeA": {
                    "type": "number",
                    "description": ""
                  },
                  "nodeB": {
                    "type": "number"
                  },
                  "node_nameA": {
                    "type": "string",
                    "description": "A端名称"
                  },
                  "node_nameB": {
                    "type": "string",
                    "description": "B端名称"
                  }
                },
                "required": [
                  "direction",
                  "weight",
                  "nodeA",
                  "nodeB",
                  "node_nameA",
                  "node_nameB"
                ]
              },
              "description": "边信息"
            }
          },
          "description": "map数据",
          "required": [
            "nodes",
            "hidebox",
            "links"
          ]
        },
        "spd_settings": {
          "type": "object",
          "properties": {
            "include_ips": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "device": {
                    "type": "string",
                    "description": "设备名",
                    "default": ""
                  },
                  "ip": {
                    "type": "string",
                    "description": "",
                    "default": ""
                  },
                  "kind": {
                    "type": "string",
                    "description": "",
                    "default": ""
                  }
                },
                "required": [
                  "device",
                  "ip",
                  "kind"
                ]
              }
            },
            "normal_ips": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "exclude_ips": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "description": "设备名映射表",
          "required": [
            "include_ips",
            "normal_ips",
            "exclude_ips"
          ]
        },
        "flows": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "prot_stack": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "bytes_a2b": {
                "type": "number",
                "description": "A到B流量"
              },
              "port_b": {
                "type": "string"
              },
              "port_a": {
                "type": "string"
              },
              "ip_b": {
                "type": "string",
                "description": "B端ip"
              },
              "availability": {
                "type": "string"
              },
              "ip_a": {
                "type": "string",
                "description": "A端ip"
              },
              "bytes_b2a": {
                "type": "number",
                "description": "B到A流量"
              },
              "device_b": {
                "type": "string"
              },
              "device_a": {
                "type": "string"
              },
              "bytes": {
                "type": "number",
                "description": "总流量大小"
              },
              "conn_type": {
                "type": "string"
              },
              "tcp_tag": {
                "type": "string"
              }
            },
            "required": [
              "prot_stack",
              "bytes_a2b",
              "port_b",
              "port_a",
              "ip_b",
              "availability",
              "ip_a",
              "bytes_b2a",
              "device_b",
              "device_a",
              "bytes",
              "conn_type",
              "tcp_tag"
            ]
          },
          "description": "会话数据"
        }
      },
      "required": [
        "map_name",
        "topov_map",
        "spd_settings",
        "flows"
      ]
    }
  },
  "required": [
    "msg",
    "code",
    "data"
  ]
}