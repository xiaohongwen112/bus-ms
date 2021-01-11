<template>
  <ConfigBox
    :tabs="tabs"
    :active="active"
    @saveConfig="saveConfig"
    @closeConfig="closeConfig"
    :width="720"
    :height="400"
  >
    <div slot="default" class="container">
      <ScrollBar class="scroll-area">
        <div class="setting-content">
          <div
            class="app-row"
            v-for="(appInfo, k) in selectedServers"
            :key="k"
          >
            <label>
              <span>业务名称</span>
              <sup>*</sup>
              <select
                @change="updateApp(k)"
                v-model="selectedServers[k].app"
              >
                <option
                  v-for="(app, k) in apps"
                  :key="k"
                  :value="app.name"
                >{{ app.disp_name }}</option>
              </select>
            </label>
            <label>
              <span>业务名称</span>
              <sup>*</sup>
              <select
                @change="errIndex = -1" v-model="selectedServers[k].node"
                :class="[errIndex === k ? 'red' : '']"
              >
                <option
                  v-for="(server, k) in getAvailables(k)"
                  :key="k"
                  :value="server.name"
                >{{ server.disp_name }}</option>
              </select>
            </label>
            <a v-if="k === selectedServers.length - 1 && selectedServers.length < maxRowNum" class="add" @click="addRow">+</a>
            <a v-if="k !== 0" class="remove" @click="removeRow(k)">-</a>
          </div>
        </div>
      </ScrollBar>
    </div>
  </ConfigBox>
  
</template>
<script>

import _ from 'lodash';
import ConfigBox from '@/components/common/ConfigBox';
import ScrollBar from '@/components/common/ScrollBar';

const props = {
  appList: {
    type: Array,
    default: () => ([]),
  },
  rule: {
    type: Object,
    default: () => ({}),
  },
};

export default {
  name: 'rule-distribute',
  props,
  components: {
    ConfigBox,
    ScrollBar,
  },
  data() {
    return {
      tabs: [{ id: 'default', text: '模板分配' }],
      active: 0,
      apps: _.cloneDeep(this.appList),
      errIndex: -1,
      selectedServers: [{
        app: '',
        node: '',
      }],
    };
  },
  watch: {
    appList(newV) {
      this.apps = _.clone(newV);
      this.initSelected();
    },
  },
  computed: {
    allRow() {
      const appList = _.map(this.apps, (s) => { // eslint-disable-line
        return _.map(s.servers, server => ({ app: s.name, node: server.name }));
      });
      return _.flatten(appList);
    },
    maxRowNum() {
      return this.allRow.length;
    },
    selectedApps() {
      return this.selectedServers.map(s => s.app);
    },
  },
  methods: {
    initSelected() {
      this.selectedServers = this.apps.length > 0 ? [{ app: this.apps[0].name, node: this.apps[0].servers[0].name }] : [];
    },
    getAvailables(index) {
      const appName = this.selectedServers[index].app;
      const options = (_.find(this.apps, a => a.name === appName) || {}).servers;
      const result = [];
      _.forEach(options, (o) => {
        const selected = _.find(this.selectedServers, s => s.app === appName && s.node === o.name);
        if (!selected || this.selectedServers[index].node === o.name) result.push(o);
      });
      return result;
    },
    addRow() {
      const selectedNodes = this.selectedServers.map(s => s.node);

      const nextAvailable = _.find(this.allRow, r => this.selectedApps.indexOf(r.app) < 0 || selectedNodes.indexOf(r.node) < 0);
      console.log(nextAvailable);
      if (!nextAvailable) return;
      this.selectedServers.push(_.cloneDeep(nextAvailable));
    },
    removeRow(k) {
      this.selectedServers.splice(k, 1);
    },
    updateApp(k) {
      this.errIndex = -1;
      const servers = this.getAvailables(k);
      this.selectedServers[k].node = servers.length > 0 ? servers[0].name : undefined;
    },
    saveConfig() {
      const validFn = sn => !!_.find(this.allRow, r => r.app === sn.app && r.node === sn.node);
      let errIndex = -1;
      const isAllValid = this.selectedServers.every((sn, i) => {
        errIndex = i;
        return validFn(sn);
      });
      console.log('valid', isAllValid, errIndex);
      if (!isAllValid) {
        this.errIndex = errIndex;
        return;
      }
      this.$emit('save', this.selectedServers, this.rule);
      this.closeConfig();
    },
    closeConfig() {
      this.$emit('close');
    },
  },
  mounted() {
    this.initSelected();
  },
};
</script>
<style lang="scss" scoped>

.container {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.setting-content {

  .app-row{
    width: 100%;
    display: flex;
    justify-content: flex-start;
    color: #ddeaee;
    margin: 20px 0;

    label {
      flex: 0 0 44%;
      font-weight: normal;
      font-size: 16px;
      padding-right: 3px;

      sup {
        color: red;
      }

      select {
        min-width: 100px;
        color: #ddeaee;
        width: 160px;
        height: 27px;
        background: #0A1F30;
        border: 1px solid #39b9b1;
        font-size: 16px;
        margin-left: 10px;

        &.red {
          border: 1px solid red;
        }
      }
    }

    a {
      display: inline-block;
      border-radius: 5px;
      background: #49b1ab;
      border: 1px solid #49b1ab;
      height: 26px;
      width: 26px;
      text-align: center;
      font-size: 22px;
      line-height: 26px;
      color: #102929;
      margin-right: 10px;
      position: relative;
    }
  }
}

.scroll-area{
  width: 100%;
  height: 100%;
}

</style>


