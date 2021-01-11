####  校验相关

由于对于 Vue props，传空对象也会导致 props default 不生效并且报错，因此，校验后端返回的数据并将所有字段设置为必填显得十分必要。

使用方法： 将yapi上相应接口的 jsonschema 保存在schemas文件夹下，通过 ajv 校验并补充缺少的字段。

因此须在 yapi 对字段填上默认的值，建议：

- 所有字段均标为必填(required)
- 对于Number类型，默认值写为-1
- 等等

##### 列子:

- schema: http://192.168.1.140:3000/project/24/interface/api/856 复制到 \bms_topo\src\helpers\jsonSchema\schemas\spdMapData.js

- 调用： \bms_topo\src\pages\dataPack\service\index.js