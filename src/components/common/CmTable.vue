<template>
  <ScrollBar class="scroll-area" :options="{useBothWheelAxes: true}">
    <div class="common-table" ref="commonTable" :style="{width: width}">
      <div class="common-table-thead">
        <table cellspacing="0">
          <thead class="table-title">
          <tr class="cmtable-row" v-if="!haveThSlot">
            <td v-for="(th, i) in column" :key="i" :style="{width: th.width}">
              {{th.title}}
            </td>
          </tr>
          <tr class="cmtable-row" v-else> <!--有表头注入信息-->
            <td v-for="(th, i) in column" :key="i" v-if="th.haveThSlot" :style="computeStyle(th)">
              {{th.title}}
              <slot :name="th.slotThName"></slot>
            </td>
            <td v-else :style="{width: th.width}">
              {{th.title}}
            </td>
          </tr>
          </thead>
        </table>
      </div>
      <div class="common-table-tbody" ref="commonTableTbody">
        <table cellspacing="0">
          <tbody class="table-body" v-if="data.length !== 0">
            <tr v-for="(item,k) in data" :key="k" class="table-tr" @click="onClickRow(k,item)" :class="[isPointer, isActive(k)]">
              <td v-for="(td,j) in column" :key="j" :style="computeStyle(td)">
                <label v-if="JSON.stringify(item)!=='{}'">{{td.title === '序号' ? k + 1 : item[td.key]}}</label>
                <span v-if="td.haveTdSlot && JSON.stringify(item)!=='{}'" class="table-slot-icon" ref="slot">
                  <slot :name="td.slotTdName" :item="item" :index="k"></slot>
                </span>
              </td>
            </tr>
          </tbody>
          <tbody class="table-body" v-else>
            <tr class="table-tr">
              <td collapse="5">{{noSettingFlag ? '暂无交易路径配置信息' : '暂无数据'}}</td>
            </tr>
          </tbody>
        </table>
        <ShowNameBox 
          :showTips = "showNameFlag"
          :showName = "showTipsName"
          :lefts = "tipsLeft"
          :top = "tipsTop"
        ></ShowNameBox>
      </div>
    </div>
  </ScrollBar>

</template>

<script>
  import ShowNameBox from '@/components/manageApp/main/ShowNameBox';
  import ScrollBar from './ScrollBar';

  export default {
    props: {
      width: { type: String, default: '' },
      haveThSlot: { type: Boolean, default: false },
      column: {
        type: Array,
        default() {
          return [];
        },
      },
      data: {
        type: Array,
        default() {
          return [];
        },
      },
      clickEvent: { type: Boolean, default: false },
      noSettingFlag: { type: Boolean, default: false },
    },
    components: { ScrollBar, ShowNameBox },
    computed: {
      isPointer() {
        return this.clickEvent ? 'pointer' : '';
      },
    },
    data() {
      return {
        activeIndex: 0,
        showNameFlag: false, // 提示框
        showTipsName: 'tishi111',
        tipsLeft: 10,
        tipsTop: 0,
      };
    },
    methods: {
      showWhole(i) {
        this.showNameFlag = true;
        this.showTipsName = this.data[i].trade_type;
        this.tipsLeft = 235;
        this.tipsTop = i * 28 + 2;
      },
      hideTip() {
        this.showNameFlag = false;
      },
      computeStyle(td) {
        if (td.width || td.align) {
          return {
            width: td.width,
            textAlign: td.align,
          };
        }
        return {};
      },
      isActive(i) {
        return this.activeIndex === i ? 'active' : '';
      },
      onClickRow(i, item) {
        this.activeIndex = i;
        if (this.clickEvent) {
          const param = {
            i,
            item,
          };
          this.$emit('click-row', param);
        }
      },
    },
  };
</script>

<style lang="scss">
  .scroll-area {
    position: relative;
    width: 100%;
    height: 100%;
    .common-table {
      width: 100%;
      height: 100%;
      font-size: 14px;
      & > div:last-child {
        font-size: 14px;
      }
      .table-sort {
        display: inline-block;
        width: 12px;
        height: 16px;
        vertical-align: middle;
        overflow: hidden;
        cursor: pointer;
        position: relative;

        .icon_active {
          color: #f0f0f0;
        }

        i {
          display: block;
          height: 6px;
          line-height: 6px;
          overflow: hidden;
          position: absolute;
          color: #adcac9;
          transition: color 0.2s ease-in-out;

          &:hover {
            color: inherit;
          }

          &:first-child {
            top: 0;
          }
          &:last-child {
            bottom: 0;
          }
        }
      }
      .table-title {
        color: #ffffff;
        background-color: #0c212f;

        tr {
          height: 30px;
          td{
            border-right: 1px solid #143044;
          }
        }

        .table-sort {
          display: inline-block;
          width: 15px;
          height: 22px;
          vertical-align: middle;
          overflow: hidden;
          cursor: pointer;
          position: relative;

          .icon_active {
            color: #f0f0f0;
          }

          i {
            display: block;
            height: 12px;
            line-height: 12px;
            overflow: hidden;
            position: absolute;
            color: #adcac9;
            transform: scale(.5,.6);
            transition: color 0.2s ease-in-out;

            &:hover {
              color: inherit;
            }

            &:first-child {
              top: 0;
            }
            &:last-child {
              bottom: 0;
            }
          }
        }
      }
      .common-table-thead {
        table {
          width: 100%;
          table-layout: fixed;
          border-collapse: collapse;
          border-spacing: 0;
        }
      }
      .common-table-tbody {
        height: calc(100% - 40px);
        .nodata {
          height: 200px;
        }
        table {
          width: 100%;
          table-layout: fixed;
        }
        .table-body {
          .active {
            background-color: #26506c !important;
          }
          tr {
            background-color: #16354a;
            td{
              height: 27px;
              line-height: 27px;
              border-right:1px solid #0c212f;
              border-bottom:1px solid #0c212f;
            }
          }
          .pointer {
            cursor: pointer;
            // &:hover {
            //   text-decoration: underline;
            // }
          }
          .table-slot-icon {
            a {
              color: #000;
            }

            i {
              &:hover {
                color: #4f6889;
              }
            }

            & > i {
              cursor: pointer;
              font-size: 24px;
            }

            .start {
              color: #4f6889;
            }

            i:last-child {
              cursor: pointer;
              font-size: 22px;
            }
            .ivu-poptip-popper {
              i {
                position: absolute;
                left: 20px;
              }
            }
          }
        }
      }
      tr {
        width: inherit;
        td:nth-of-type(1){
          text-align:center;
        }
      }
      td {
        text-align: left;
        overflow: hidden;
        padding: 0 5px;
      }
    }
  }
</style>
