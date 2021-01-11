import {
  getCenter,
  postQuery,
  getData,
  fetchQuery,
  getOverview,
} from '../service';

import {
  GET_CENTER,
  POST_QUERY,
  GET_DATA,
  FETCH_QUERY,
  GET_OVER_VIEW,
} from './mutation-types';

export default {
  async getCenter({
    commit,
  }) {
    const res = await getCenter();
    commit(GET_CENTER, res);
  },
  async postQuery({
    // state,
    commit,
  }, data) {
    const res = await postQuery(data);
    commit(POST_QUERY, res, data);
    // console.log('post_query', res, state);
  },
  async getData({
    commit,
  }) {
    const res = await getData();
    commit(GET_DATA, res);
  },
  async fetchQuery({
    commit,
  }, data) {
    const res = await fetchQuery(data);
    commit(FETCH_QUERY, res, data);
  },
  async getOverview({
    commit,
    state,
  }, appName) {
    const res = await getOverview(appName);
    commit(GET_OVER_VIEW, res);
  },
};
