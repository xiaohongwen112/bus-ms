<template>
  <div class="log-monitoring">
    <div class="data-table">
      <StTable class="logs-table" :cols="colsOfLogs" :rows="data" :selectList="selectList">
        <template slot="operation" slot-scope="slotData">
          <span v-if="!slotData.data.more">{{slotData.data.content}}</span>
          <span v-else class="operation">
            <a @click="detail(slotData.data._id, slotData.data.time, slotData.data.username)">详细信息</a>
          </span>
        </template>
      </StTable>
      <footer class="footer">
        共计 <span class="record-number">{{ total }}</span> 条记录
        <Pagination v-show="total !== 0" :total="Math.ceil(total / pageSize)" :current="current" @to-page="goTo"></Pagination>
      </footer>
      <ConfigBox v-if="detailFlag" 
        :tabs="tabs"
        :width="80"
        :height="550"
        :hideStore="false"
        :custom="true"
        @closeConfig="detailFlag = false">
          <div class="content-main" slot="default">
            <div class="modal-title"><span class="proImg">修改内容</span><span class="icon-bms-tridown"></span></div>
            <div class="modal-detail">
              <div class="id-content"><span>ID：</span>{{detailId}}</div>
              <div>{{detailUser}}用户在{{detailTime}}执行以下操作：</div>
              <div class="content-detail" v-if="(content instanceof Array) || content.delete">
                <span v-if="(content instanceof Array)" v-for="(x, i) in content">{{i+1}}、{{x}}</span>
                <span v-else>{{content.delete}}</span>
              </div>
              <Compare v-else :before="before" :after="after"></Compare>
            </div>
          </div>
      </ConfigBox>
    </div>
  </div>
</template>

<script>
import { StTable, Pagination, ScrollBar } from '@/components/basic';
import { ConfigBox } from '@/components/common';
import * as api from '../service';
import Compare from '../components/Compare';

export default {
  name: 'Log',
  components: { StTable, Pagination, ScrollBar, ConfigBox, Compare },
  data() {
    return {
      tableWidth: '100%',
      current: 1,
      total: 0,
      pageSize: 10,
      data: [],
      detailFlag: false,
      tabs: [{ id: 'default', text: '' }],
      loading: true,
      detailId: '',
      detailUser: '',
      detailTime: '',
      content: '',
      before: '',
      after: '',
      colsOfLogs: [
        { key: '_id', name: 'ID' },
        { key: 'time', name: '时间' },
        { key: 'username', name: '修改人' },
        { key: 'type', name: '操作类型' },
        { key: 'detail', name: '具体操作' },
        { type: 'operation', name: '内容' },
      ],
      selectList: [],
    };
  },
  methods: {
    async initLog() {
      try {
        const param = {
          page: this.current,
          num: this.pageSize,
        };
        const res = await api.getLogList(param);
        this.loading = false;
        if (res.data.code === 0) {
          const data = res.data.data;
          this.data = data.detail;
          this.total = data.total;
        } else {
          this.data = [];
          this.total = 0;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async gettDetail(id) {
      try {
        const res = await api.getLogDetail(id);
        if (res.data.code === 0) {
          this.content = res.data.data.content;
          if (!(this.content instanceof Array) && !this.content.delete) {
            this.before = this.content.before;
            this.after = this.content.after;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    detail(id, time, name) {
      this.detailFlag = true;
      this.detailId = id;
      this.detailUser = name;
      this.detailTime = time;
      this.$nextTick(() => {
        this.tabs[0].text = id;
        this.content = '';
        this.gettDetail(id);
      });
    },
    goTo(page) {
      this.current = page;
      this.initLog();
    },
  },
  created() {
    this.initLog();
  },
};
</script>

<style lang="scss">
.log-monitoring{
  .scroll-area{
    width: 100%;
    height: 100%;
  }
  .data-table{
    .config-container {
      .content{
        .nav-content{
          padding: 0 24px 30px;
          height: 100%;
          font-size: 16px;
          .content-main{
            width: 100%;
            height: 100%;
            color: #e0e9f1;
            .modal-title{
              height: 57px;
              line-height:57px;
              padding-left: 27px;
              .proImg {
                position: relative;
                font-size: 18px;
                &:after {
                  content: '';
                  background: url("../../../assets/manageApp/beautyL.svg") 0 0 no-repeat;
                  position: absolute;
                  left: -27px;
                  top: 6px;
                  width: 10px;
                  height: 12px;
                  margin-right: 10px;
                }
              }
              .icon-bms-tridown{
                display: inline-block;
                width: 12px;
                height: 12px;
                font-size: 12px;
                -webkit-transform: scale(0.1, 1);
                transform: scale(0.5, 1);
                margin-left: 5px;
                color: #3ab9b3;
              }
            }
            .modal-detail{
              width: 100%;
              height: calc(100% - 60px);
              border: 1px solid #0c3755;
              padding: 15px 5%;
              background: #061521;
              .id-content{
                margin: 30px 0 20px;
              }
              .content-detail{
                height: 345px;
                overflow: auto;
                span{
                  display: block;
                  margin: 10px 0;
                }
              }
            }
          }
        }
      }
    }
    .footer{
      .pagination{
        margin: 0;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.log-monitoring{
  height: 100%;
  .data-table{
    height: calc(100% - 20px);
    position: relative;
    .logs-table{
      position: absolute;
      top: 0;
      left: 15px;
      bottom: 50px;
      width: calc(100% - 30px);
      .operation {
        a{
          color: #4ab2a5;
        }
      }
    }
    .footer {
      bottom: 0;
      height: 50px;
      width: calc(100% - 30px);
      left: 15px;
      line-height: 50px;
      position: absolute;
      .record-number {
        color: #4ab2a5;
      }
    }
    .CodeMirror,
    .mergely-margin,
    .mergely-column {
      height: 400px;
    }
  }
}
</style>

