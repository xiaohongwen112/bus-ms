<template>
  <div>
    <ul class="config-form">
      <li>
        <p class="title">存储配置</p>
        <BmsBtn class="save-btn" :disabled="saveBtndisabled" @click="submitConfig">
          保存
        </BmsBtn>
      </li>
      <li>
        <span class="name">存储原始文件</span>
        <CmSwitch class="config-swtich"
                  :switchStatus="switchStatus"
                  :statusOne="`开`"
                  :statusOther="`关`"
                  @on-change="changeSwtich"
        />
      </li>
      <StorageConfigItem v-for="(item, index) in configList"
                         :key="index"
                         :data="item"
                         @change-config="changeConfig"
                         @change-disable="() => saveBtndisabled = true"
                         ref="storageConfigItem"
      />
    </ul>
    <CmTip v-show="showTip" :tipTitle="tipTitle" :tipContent="`${tipContent[0]}${tipContent[1]}`"
           :closeFn="() => showTip = false"></CmTip>
  </div>
</template>

<script>
import { getBodyfile, setBodyfile, getStorageForm, setStorageForm } from '@/pages/settings/service';

import CmSwitch from '@/components/common/CmSwitch';
import { BmsBtn } from '@/components/basic';
import CmTip from '@/components/common/CmTip';
import StorageConfigItem from './StorageConfigItem';

export default {
  name: 'StorageConfig',
  components: {
    CmSwitch,
    CmTip,
    BmsBtn,
    StorageConfigItem,
  },
  data() {
    return {
      // nameDatum: ['数据库', '告警记录', '数据包', '磁盘清理阈值', '可用空间预警'],
      // keyDatum: ['db_bar_expire', 'db_alert_expire', 'pcap_expire', 'cleaner_free_space', 'free_disk_space'],
      keyDatum: ['pcap_expire', 'cleaner_free_space', 'db_bar_expire', 'free_disk_space', 'db_alert_expire'],
      nameDatum: ['数据包', '磁盘清理阈值', '数据库', '可用空间预警', '告警记录'],
      detailDatum: ['PCAP原始数据包文件', '当磁盘可用空间低于该数值时，启动自动清理程序', '用于首页、服务路径图、业务墙、快照、多维统计', '当磁盘可用空间低于该数值时，将停止数据源', '用于警告中心'],
      testData: [
        { name: '', code: '', value: '', unit: '' },
      ],
      itemValue: { value: 21 },
      configList: [],
      switchStatus: false, // 一切开关组件默认为关
      saveBtndisabled: true,
      configData: {},
      showTip: false,
      tipTitle: '提示',
      tipContent: ['', ''],
    };
  },
  computed: {
  },
  methods: {
    changeSwtich(val) {
      this.saveBtndisabled = false;
      this.switchStatus = val;
    },
    getSwtich() {
      getBodyfile().then((res) => {
        const data = res.data.data;
        this.switchStatus = data.status === 'on';
      })
      .catch();
    },
    setSwtich() {
      setBodyfile({
        switch: (this.switchStatus ? 'on' : 'off'),
      })
      .then(() => {
        this.tipContent[1] = this.switchStatus ? '存储原始文件已开启' : '存储原始文件已关闭';
        this.openTip();
        this.saveBtndisabled = true; // 保存后置灰, 防止重复保存
      })
      .catch((error) => {
        this.tipContent[1] = error;
        this.openTip();
      });
    },
    getFormData() {
      getStorageForm()
      .then((response) => {
        const storeConfig1 = response.data.store_configs[0];
        this.$emit('change-ip', storeConfig1.host);
        this.configData = storeConfig1.form.data;
      })
      .catch((error) => {
        console.log(error);
      });
    },
    submitConfig() {
      let flag = true;
      const targetsList = document.querySelectorAll('.config-value');
      targetsList.forEach((item) => { // eslint-disable-line
        if (item.classList.contains('error-input')) {
          flag = false;
          return flag;
        }
      });
      if (flag) {
        this.tipContent = ['', ''];
        setStorageForm(this.configData)
        .then((response) => {
          this.tipContent[0] = response.data.code === 0 ? '存储配置保存成功;' : '存储配置保存失败!';
          this.setSwtich();
        })
        .catch((error) => {
          this.tipContent[0] = error;
          this.openTip();
        });
      }
    },
    openTip() {
      this.showTip = true;
    },
    changeConfig(val) {
      this.saveBtndisabled = false;
      this.configData[val.key] = val.value;
      if (this.configData.cleaner_free_space_unit === this.configData.free_disk_space_unit) {
        if (Number(this.configData.cleaner_free_space) <= Number(this.configData.free_disk_space)) {
          this.$refs.storageConfigItem[1].showErrorTip('cleaner_free_space');
        } else {
          this.clearClass();
        }
      } else {
        let cleaner = '';
        let space = '';
        if (this.configData.cleaner_free_space_unit === 'MB') {
          cleaner = Number(this.configData.cleaner_free_space) / 1024;
          space = Number(this.configData.free_disk_space);
        } else {
          cleaner = Number(this.configData.cleaner_free_space);
          space = Number(this.configData.free_disk_space) / 1024;
        }
        if (cleaner <= space) {
          this.$refs.storageConfigItem[1].showErrorTip('cleaner_free_space');
        } else {
          this.clearClass();
        }
      }
    },
    clearClass() {
      const target = this.$refs.storageConfigItem[1].$refs.cleaner_free_space;
      if (target !== undefined && target.className.includes('error-input')) target.classList.remove('error-input'); // eslint-disable-line
    },
  },
  watch: {
    configData() {
      if (this.configData !== {}) {
        this.keyDatum.forEach((d, i) => {
          this.configList[i].value = String(this.configData[d]);
          this.configList[i].unit = String(this.configData[`${d}_unit`]);
        });
      }
    },
  },
  mounted() {
    this.getSwtich();
    this.getFormData();
    this.configList = this.keyDatum.map((d, index) => ({
      key: d,
      name: this.nameDatum[index],
      detail: this.detailDatum[index],
      value: '',
      unit: null,
    }));
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../assets/css/col.css';

p{
    margin: 0;
}
.title{
    width: 100px;
    line-height: 33px;
    text-align: left;
    color: #4ab2a5;
    font-size: 16px;
    float: left;
}
.save-btn{
  float: right;
  margin-top: 6px;
}
.config-form{
  margin-top: 10px;
  li{
    height: 75px;
    line-height: 35px;
    color: #ddd;
    font-size: 14px;
    display: inline-block;
    width: 50%;
    &:first-child{
      width: 100%;
      height: 45px;
    }
    &:nth-of-type(2){
      float: left;
    }
    span.col-xss-4{
      text-align: right;
    }
  }
  .config-swtich{
    display: inline-block;
  }
  input[type="text"], select{
    width: calc(100% - 10px);
    margin: 0 5px;
    height: 25px;
    line-height: 25px;
    background: rgba(0,0,0,0);
    border: 1px solid #15ece4;
    color: #ffffff;
    padding-left: 10px;
  }
  select{
    position: relative;
    // margin-left: 4%;
    padding-right: 18px;
    background: url(../../../../assets/sys-icon/arrow-w.svg) no-repeat calc(100% - 5px) 0% rgb(10,31,48);
  }
  select, option{
    background: #0b3b50;
    color: #bbd6d6;
  }
  .detail{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .wrap-btn{
    text-align: right;
  }
}
@media (max-width: 1345px) {
  .config-form{
    li{
      width: 100%;
      height: 60px;
      line-height: 35px;
      &:nth-of-type(2){
        height: 50px;
        padding-left: 25px;
        margin-top: -12px;
      }
      .name{
        min-width: 90px;
        text-align: right;
      }
    }
  }
  .switch.config-swtich{
    margin-left: -8px;
  }
}
</style>
