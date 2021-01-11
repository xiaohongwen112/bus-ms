/* eslint-disable no-empty-pattern, no-param-reassign */
import {
  ABOUT,
  CHECK_UPDATE,
  SURE_UPDATE,
} from './mutation-types';


export default {
  [ABOUT](state, res) {
    state.aboutMain = res.data.data;
  },
  [CHECK_UPDATE](state, res) {
    state.checkVersion = res.data;
  },
  [SURE_UPDATE](state, res) {
    state.updatedVersion = res.data;
    state.checkVersion.msg = '更新完成';
  },
};
