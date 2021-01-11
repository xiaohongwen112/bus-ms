
import Ajv from 'ajv';
import _ from 'lodash';
import schema4 from 'ajv/lib/refs/json-schema-draft-04.json';

const globalValidators = {};

const defaultMap = {
  number: -1,
  string: '',
  boolean: false,
  integer: -2,
};

function walk(prop, map = {}) {
  const property = _.cloneDeep(prop);
  Object.assign(map, defaultMap);
  if (property.required && property.required.length === 0) delete property.required;
  if (property.default) {
    return property;
  }
  if (map[property.type] !== undefined) {
    return {
      ...property,
      default: map[property.type],
    };
  } else if (property.type === 'array') {
    return {
      ...property,
      default: [],
      items: walk(property.items),
    };
  } else if (property.type === 'object') {
    property.default = {};
    const keys = Object.keys(property.properties);
    keys.forEach((k) => {
      // eslint-disable-next-line
      property.properties[k] = walk(property.properties[k]);
    });
    return property;
  }
  return property;
}

export default function jsonValidate(schemaName, schema, jsonData, propertyMap = {}) {
  let validator;
  if (globalValidators[schemaName]) validator = globalValidators[schemaName];
  else {
    const ajv = new Ajv({ schemaId: 'id', useDefaults: true });
    ajv.addMetaSchema(schema4);
    // eslint-disable-next-line
    schema = walk(schema, propertyMap);
    console.log('schema', schema);
    validator = ajv.compile(schema);
    globalValidators[schemaName] = validator;
  }
}