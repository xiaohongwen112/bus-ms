<template>
  <div>
    <NavBar :title="'规则模板'" />
    <Breadcrumb :title="'规则模板'" :crumbList="crumbList">
      <div slot="btnGroup" class="btn-group">
        <input type="button" value="规则列表"  @click="$router.push({name:'main'})" />
        <input type="button" class="current" value="规则模板" />
      </div>
    </Breadcrumb>
    <div class="main-content">
      <ScrollBar class="scroll-area">
        <CreateTemplateCard @create="showEdit = true" />
        <TemplateCard
          v-for="(rule,k) in ruleList"
          :key="k"
          :rule="rule"
          @edit="showEdting"
          @setting="showDistributing"
          @remove="showRemoving"
          @editName="saveEdting"
        />
      </ScrollBar>
    </div>
    <RuleConfigModal
      v-if="showEdit"
      @close="closeModal"
      @save="saveEdting"
      :rule="currentRule"
    />
    <CmTip
      v-if="showRemove"
      :tipContent="'是否删除该模板?'"
      :autoClose="true"
      :closeFn="closeModal"
      :showFooter="true"
      @on-confirm="confirmRemove"
    />
    <RuleDistribute
      v-if="showDistribute"
      @close="showDistribute = false"
      @save="saveDistribue"
      :appList="appInfoList"
      :rule="currentRule"
    />
    <CmTip
      v-if="showDisResult"
      :tipContent="disResContent"
      :autoClose="true"
      :closeFn="cleanDisContent"
    />
  </div>
</template>
<script>

/* eslint-disable no-param-reassign */

import _ from 'lodash';
import NavBar from '@/components/common/NavBar';
import Breadcrumb from '@/components/common/Breadcrumb';
import ScrollBar from '@/components/common/ScrollBar';
import CmTip from '@/components/common/CmTip';
import TemplateCard from '@/components/ruleList/TemplateCard';
import CreateTemplateCard from '@/components/ruleList/CreateTemplateCard';
import RuleConfigModal from '@/components/ruleList/RuleConfigModal';
import RuleDistribute from '@/components/ruleList/RuleDistribute';

import * as api from '../service/';

// shitty stuff.
const formatLevelData = (apps) => {
  const result = {};
  _.forEach(apps, (appArr) => {
    _.forOwn(appArr, (appIntfs, appKey) => {
      result[appKey] = [];
      _.forEach(appIntfs, (intf) => {
        if (intf.alarmrules && intf.alarmrules.threshold) {
          const { level } = intf;
          result[appKey].push(level);
        }
      });
    });
  });
  return result;
};

export default {
  components: {
    NavBar,
    Breadcrumb,
    TemplateCard,
    CreateTemplateCard,
    ScrollBar,
    RuleConfigModal,
    CmTip,
    RuleDistribute,
  },
  data() {
    return {
      crumbList: ['index', 'manageapp', 'rulelist', '规则模板'],
      ruleList: [],
      currentRule: null,
      showEdit: false,
      showRemove: false,
      showDistribute: false,
      appInfoList: [],
      showDisResult: false,
      distributeResult: {
        success: [],
        failure: [],
      },
      disResContent: '',
    };
  },
  computed: {},
  methods: {
    showEdting(rule) {
      this.currentRule = rule;
      this.showEdit = true;
    },
    showDistributing(rule) {
      this.currentRule = rule;
      this.showDistribute = true;
    },
    showRemoving(rule) {
      this.currentRule = rule;
      this.showRemove = true;
    },
    saveDistribue(appInfo, rule) {
      const appObj = appInfo.reduce((p, c) => {
        const app = p[c.app];
        if (!app) p[c.app] = [c.node];
        else p[c.app].push(c.node);
        return p;
      }, {});
      if (process.env.NODE_ENV === 'development') console.log('save', appObj, rule);

      Promise.all(Object.keys(appObj).map(k => this.getDatapathAndSaveRule(k, appObj[k], rule))).then(() => {
        this.updateDisResContent(true, true);
      });
    },
    cleanDisContent() {
      this.showDisResult = false;
      this.disResContent = '';
      this.distributeResult.success = [];
      this.distributeResult.failure = [];
    },
    updateDisResContent(showModal, isDone, start) {
      this.showDisResult = showModal;
      if (start) {
        this.disResContent = '保存中...';
        return;
      }
      const { success, failure } = this.distributeResult;
      const join = ra => ra.map(t => `[${t.name}]`).join(',');
      const str = (success.length ? `${join(success)} 保存成功` : '') + (failure.length ? `${join(failure)} 保存失败` : '');
      if (!isDone) {
        this.disResContent = `${str}, 其他保存中……`;
      } else {
        this.disResContent = `${str}, 操作完成`;
      }
      if (process.env.NODE_ENV === 'development') console.log('content', this.disResContent);
    },
    closeModal() {
      this.currentRule = null;
      this.showEdit = false;
      this.showDistribute = false;
      this.showRemove = false;
    },
    saveEdting(rule) {
      console.log('save', rule);
      api.saveRulesData(rule).then((res) => {
        console.log('res', res);
        this.getRulesData();
      });
    },
    getRulesData() {
      api.getRulesData().then((res) => {
        this.ruleList = res.data.reverse();
      });
    },
    confirmRemove() {
      console.log('remove', this.currentRule);
      api.removeRule(this.currentRule.id).then((res) => {
        console.log('res', res);
        this.getRulesData();
      });
    },
    async getAllApps() {
      try {
        const res = await api.getAllApps();
        const appObj = _.reduce(res.data, (p, app) => {
          const { name, disp_name, areas } = app;
          const levels = areas.length < 1 ? [] : areas[0].levels.map(l => ({ name: l.name, disp_name: l.disp_name }));
          p[name] = { disp_name, levels };
          return p;
        }, {});
        return appObj;
      } catch (e) {
        console.error('e', e);
        return {};
      }
    },
    async getRelated() {
      try {
        const res = await api.getRelated();
        const levelData = formatLevelData(res.data);
        return levelData;
      } catch (e) {
        console.error('e', e);
        return {};
      }
    },
    async getAppInfo() {
      const appServers = await this.getRelated();
      const appObj = await this.getAllApps();
      console.log(appServers, appObj);
      const result = [];
      _.forOwn(appServers, (servers, appName) => {
        const appInAppObj = appObj[appName];
        const app = { name: appName, servers: [], disp_name: appInAppObj.disp_name };
        _.forEach(servers, (server) => {
          const serverObj = _.find(appInAppObj.levels, l => l.name === server);
          app.servers.push(serverObj);
        });
        result.push(app);
      });
      this.appInfoList = result;
    },
    async getDatapathAndSaveRule(appName, levelNames, ruleData) {
      const { data } = await api.getDataPath(appName);
      const { datapath } = data;
      _.forEach(datapath.trade, (trade) => {
        if (levelNames.indexOf(trade.settings.name) > -1) trade.alarmrules = ruleData;
      });
      console.log(datapath);
      const saveApp = { appName, name: datapath.disp_name };

      try {
        const { data: saveRes } = await api.saveDataPath(appName, datapath);
        console.log({ saveRes });
        if (!saveRes.state || saveRes.state !== 'success') throw new Error(saveRes);
        this.distributeResult.success.push(saveApp);
      } catch (e) {
        console.error(e);
        this.distributeResult.failure.push(saveApp);
      }
      this.updateDisResContent(true, false);
    },
  },
  watch: {},
  mounted() {
    this.getRulesData();
    this.getAppInfo();
  },
};
</script>

<style lang="scss" scoped>
.btn-group {
  padding-right: 37px;

  input[type="button"] {
    padding: 0 15px;
    margin: 6px 20px 6px 0;
    border-radius: 15px;
    border: 1px solid #3dd9c4 !important;
    color: #3dd9c4;
    height: 30px;
    display: inline-block;
    line-height: 28px;
    font-size: 16px;
    background: transparent;
    outline: none;

    &.current,
    &:hover {
      background: rgba(61, 217, 196, 0.8);
      color: #eee;
    }
  }
}

.main-content {
  padding: 0 0 0 80px;
  margin-top: 40px;
  margin-bottom: 20px;
  overflow: hidden;
  height: calc(100% - 138px);
  width: calc(100% - 80px);
  position: absolute;
}

.scroll-area{
  width: 100%;
  height: 100%;
}
</style>

