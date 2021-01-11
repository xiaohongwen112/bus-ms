import {
  about,
  checkUpdate,
  sureUpdate,
} from '../service';

import {
  ABOUT,
  CHECK_UPDATE,
  SURE_UPDATE,
} from './mutation-types';

export default {
  async about({
    commit,
  }) {
    const res = await about();
    commit(ABOUT, res);
  },
  async checkUpdate({
    commit,
  }) {
    const res = await checkUpdate();
    commit(CHECK_UPDATE, res);
  },
  async sureUpdate({
    commit,
  }) {
    const res = await sureUpdate();
    commit(SURE_UPDATE, res);
  },
};
