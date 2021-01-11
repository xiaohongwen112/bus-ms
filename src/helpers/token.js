import jsCookie from 'js-cookie';
import devServerConfig from '@/../config/devServer';

// eslint-disable-next-line import/no-mutable-exports
let token = '';
if (process.env.NODE_ENV === 'development') {
  jsCookie.set('csrftoken', devServerConfig.csrftoken);
  token = devServerConfig.csrftoken;
} else {
  token = jsCookie.get('csrftoken');
}

export default token;
