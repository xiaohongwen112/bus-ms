<template>
  <div id="data-wrap">
    <Cmtip :tipContent="cmtipMessage" v-if="showcmTips" :closeFn="() => showcmTips = false"
           :showFooter="false">
    </Cmtip>
    <div id="data-deal">
        <div class="header">
            <p>字段处理</p>
            <svg @click="close" width="10" height="10" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="0" x2="10" y2="10" style="stroke:rgb(255,255,255);stroke-width:2"/>
                <line x1="10" y1="0" x2="0" y2="10" style="stroke:rgb(255,255,255);stroke-width:2"/>
            </svg>
        </div>
        <div class="content">
            <div class="wrap">
                <div class="deal-title">
                  <p>定义字段名称</p>
                  <input type="text" v-model="normalOne['@name']"/>
                  <button @click="addCondition" v-if="isLookup === false">添加判断</button>
                </div>
                <ScrollBar class="box">
                    <div class="field-wrap" v-if="currentCondition==0">
                      <div class="wrap-header" style="display:flex;justify-content:space-between;">
                        <p style="margin-left:20px;margin-top:10px;">执行规则</p>
                        <div class="svg" @click="conditionFieldDel(0)" style="margin-top:10px;margin-right:20px;cursor:pointer;">
                          <svg v-if="normalOne['field'].length > 1" id="导航栏图标" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>删除最后一条</title><polyline points="6.64 10.28 17.41 10.38 19.16 8.59 19.69 8.59 29.26 8.59 30.91 10.38 41.36 10.28" style="fill:none;stroke:#bd4630;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px"/><path d="M37.87,15.93V39a2,2,0,0,1-2,2H12.54a2,2,0,0,1-2-2v-23" style="fill:none;stroke:#c74630;stroke-linejoin:round;stroke-width:3px"/><line x1="17.31" y1="17.17" x2="17.31" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="24.21" y1="17.17" x2="24.21" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="30.87" y1="17.17" x2="30.87" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/></svg>
                          <svg v-if="normalOne['field'].length === 1" id="导航栏图标" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><polyline points="6.64 10.28 17.41 10.38 19.16 8.59 19.69 8.59 29.26 8.59 30.91 10.38 41.36 10.28" style="fill:none;stroke:#808080;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px"/><path d="M37.87,15.93V39a2,2,0,0,1-2,2H12.54a2,2,0,0,1-2-2v-23" style="fill:none;stroke:#808080;stroke-linejoin:round;stroke-width:3px"/><line x1="17.31" y1="17.17" x2="17.31" y2="34.5" style="fill:none;stroke:#808080;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="24.21" y1="17.17" x2="24.21" y2="34.5" style="fill:none;stroke:#808080;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="30.87" y1="17.17" x2="30.87" y2="34.5" style="fill:none;stroke:#808080;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/></svg>
                        </div>
                      </div>
                      <div class="field" v-for="(item, index) in normalOne['field']" :key="index">
                        <Field :currentIndex='index' @opData="fieldData" :fieldData="item" @isLookup="(val) => {isLookup = val}"></Field>
                        <!-- <div class="svg" @click="conditionFieldDel(index, 0)" style="margin-top:5px;margin-left:5px;cursor:pointer;" v-if="index!=normalOne['field'].length-1">
                          <svg id="导航栏图标" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>删除</title><polyline points="6.64 10.28 17.41 10.38 19.16 8.59 19.69 8.59 29.26 8.59 30.91 10.38 41.36 10.28" style="fill:none;stroke:#bd4630;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px"/><path d="M37.87,15.93V39a2,2,0,0,1-2,2H12.54a2,2,0,0,1-2-2v-23" style="fill:none;stroke:#c74630;stroke-linejoin:round;stroke-width:3px"/><line x1="17.31" y1="17.17" x2="17.31" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="24.21" y1="17.17" x2="24.21" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="30.87" y1="17.17" x2="30.87" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/></svg>
                        </div> -->
                        <button v-if="index==normalOne['field'].length-1 && isLookup === false" @click="conditionFieldAdd(0)">+</button>
                        <!-- <div class="lookup" v-if="item['@op'] === 'lookup'"></div>
                        <div class="lookup-bc" v-if="item['@op'] === 'lookup'"></div> -->
                      </div>
                    </div>
                    <div class="condition-if" v-if="currentCondition>=1">
                      <div class="if-header">
                        <div class="if-svg">
                          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="15" height="15">
                            <circle cx="7" cy="7" r="3" fill="#14cef5" />
                          </svg> 
                        </div>
                        <p>if</p>
                        <p>设置条件</p>
                        <a @click="clearAll">删除条件</a>
                      </div>
                      <div class="if-content">
                        <div class="condition">
                            <Condition @opData="ifConditionData" :conditionData="normalOne['if'][0]"></Condition>
                          </div>
                        <div class="wrap-header" style="display:flex;justify-content:space-between;">
                          <p style="margin-left:20px;margin-top:10px;">执行规则</p>
                          <div class="svg" @click="conditionFieldDel(1)" style="margin-top:10px;margin-right:20px;cursor:pointer;">
                            <svg v-if="normalOne['if'][0]['field'].length > 1" id="导航栏图标" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>删除最后一条</title><polyline points="6.64 10.28 17.41 10.38 19.16 8.59 19.69 8.59 29.26 8.59 30.91 10.38 41.36 10.28" style="fill:none;stroke:#bd4630;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px"/><path d="M37.87,15.93V39a2,2,0,0,1-2,2H12.54a2,2,0,0,1-2-2v-23" style="fill:none;stroke:#c74630;stroke-linejoin:round;stroke-width:3px"/><line x1="17.31" y1="17.17" x2="17.31" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="24.21" y1="17.17" x2="24.21" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="30.87" y1="17.17" x2="30.87" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/></svg>
                            <svg v-if="normalOne['if'][0]['field'].length === 1" id="导航栏图标" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><polyline points="6.64 10.28 17.41 10.38 19.16 8.59 19.69 8.59 29.26 8.59 30.91 10.38 41.36 10.28" style="fill:none;stroke:#808080;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px"/><path d="M37.87,15.93V39a2,2,0,0,1-2,2H12.54a2,2,0,0,1-2-2v-23" style="fill:none;stroke:#808080;stroke-linejoin:round;stroke-width:3px"/><line x1="17.31" y1="17.17" x2="17.31" y2="34.5" style="fill:none;stroke:#808080;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="24.21" y1="17.17" x2="24.21" y2="34.5" style="fill:none;stroke:#808080;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="30.87" y1="17.17" x2="30.87" y2="34.5" style="fill:none;stroke:#808080;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/></svg>
                          </div>
                        </div>
                        <div class="field" v-for="(item, index) in normalOne['if'][0]['field']" :key="index">
                          <Field :currentIndex='index' @opData="iffieldData" :fieldData="item" @isLookup="(val) => {isLookup = val}"></Field>
                          <!-- <div class="svg" @click="conditionFieldDel(index, 1)" style="margin-top:5px;margin-left:5px;cursor:pointer;" v-if="index!=normalOne['field'].length-1">
                            <svg id="导航栏图标" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>删除</title><polyline points="6.64 10.28 17.41 10.38 19.16 8.59 19.69 8.59 29.26 8.59 30.91 10.38 41.36 10.28" style="fill:none;stroke:#bd4630;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px"/><path d="M37.87,15.93V39a2,2,0,0,1-2,2H12.54a2,2,0,0,1-2-2v-23" style="fill:none;stroke:#c74630;stroke-linejoin:round;stroke-width:3px"/><line x1="17.31" y1="17.17" x2="17.31" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="24.21" y1="17.17" x2="24.21" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="30.87" y1="17.17" x2="30.87" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/></svg>
                          </div> -->
                          <button v-if="index==normalOne['if'][0]['field'].length-1 && isLookup === false" @click="conditionFieldAdd(1)">+</button>
                        </div>
                      </div>
                    </div>
                    <div v-if="currentCondition>=3">
                    <div class="condition-else-if" v-for="(ifitem, ifindex) in normalOne.if.slice(1, normalOne.length)" :key="ifindex">
                        <div class="else-if-header">
                          <div class="else-if-svg">
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="15" height="15">
                              <circle cx="7" cy="7" r="3" fill="#14cef5" />
                            </svg> 
                          </div>
                          <p>else if</p>
                          <p>设置条件</p>
                          <a @click="clearOne(ifindex)">删除条件</a>
                        </div>
                        <div class="else-if-content">
                          <div class="condition">
                            <Condition @opData="elseifConditionData" :ifIndex="ifindex" :conditionData="ifitem"></Condition>
                          </div>
                          <div class="wrap-header" style="display:flex;justify-content:space-between;">
                            <p style="margin-left:20px;margin-top:10px;">执行规则</p>
                            <div class="svg" @click="conditionFieldDel(ifindex+3)" style="margin-top:10px;margin-right:20px;cursor:pointer;">
                              <svg v-if="normalOne.if[ifindex+1].field.length > 1" id="导航栏图标" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>删除最后一条</title><polyline points="6.64 10.28 17.41 10.38 19.16 8.59 19.69 8.59 29.26 8.59 30.91 10.38 41.36 10.28" style="fill:none;stroke:#bd4630;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px"/><path d="M37.87,15.93V39a2,2,0,0,1-2,2H12.54a2,2,0,0,1-2-2v-23" style="fill:none;stroke:#c74630;stroke-linejoin:round;stroke-width:3px"/><line x1="17.31" y1="17.17" x2="17.31" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="24.21" y1="17.17" x2="24.21" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="30.87" y1="17.17" x2="30.87" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/></svg>
                              <svg v-if="normalOne.if[ifindex+1].field.length === 1" id="导航栏图标" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><polyline points="6.64 10.28 17.41 10.38 19.16 8.59 19.69 8.59 29.26 8.59 30.91 10.38 41.36 10.28" style="fill:none;stroke:#808080;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px"/><path d="M37.87,15.93V39a2,2,0,0,1-2,2H12.54a2,2,0,0,1-2-2v-23" style="fill:none;stroke:#808080;stroke-linejoin:round;stroke-width:3px"/><line x1="17.31" y1="17.17" x2="17.31" y2="34.5" style="fill:none;stroke:#808080;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="24.21" y1="17.17" x2="24.21" y2="34.5" style="fill:none;stroke:#808080;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="30.87" y1="17.17" x2="30.87" y2="34.5" style="fill:none;stroke:#808080;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/></svg>
                            </div>
                          </div>
                          <div class="field" v-for="(item, index) in normalOne.if[ifindex+1].field" :key="index">
                            <Field :currentIndex='index' @opData="elseiffieldData" :ifIndex="ifindex" :fieldData="item" @isLookup="(val) => {isLookup = val}"></Field>
                            <!-- <div class="svg" @click="conditionFieldDel(index, ifindex+3)" style="margin-top:5px;margin-left:5px;cursor:pointer;" v-if="index!=normalOne.if[ifindex+1].field.length-1">
                              <svg id="删除" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>删除</title><polyline points="6.64 10.28 17.41 10.38 19.16 8.59 19.69 8.59 29.26 8.59 30.91 10.38 41.36 10.28" style="fill:none;stroke:#bd4630;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px"/><path d="M37.87,15.93V39a2,2,0,0,1-2,2H12.54a2,2,0,0,1-2-2v-23" style="fill:none;stroke:#c74630;stroke-linejoin:round;stroke-width:3px"/><line x1="17.31" y1="17.17" x2="17.31" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="24.21" y1="17.17" x2="24.21" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="30.87" y1="17.17" x2="30.87" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/></svg>
                            </div> -->
                            <button v-if="index==normalOne.if[ifindex+1].field.length-1  && isLookup === false" @click="conditionFieldAdd(ifindex+3)">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="condition-else" v-if="currentCondition>=2">
                        <div class="else-header">
                          <div class="else-svg">
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="15" height="15">
                              <circle cx="7" cy="7" r="3" fill="#14cef5" />
                            </svg> 
                          </div>
                          <p>else</p>
                          <p>设置条件</p>
                        </div>
                        <div class="else-content">
                          <div class="wrap-header" style="display:flex;justify-content:space-between;">
                            <p style="margin-left:20px;margin-top:10px;">执行规则</p>
                            <div class="svg" @click="conditionFieldDel(2)" style="margin-top:10px;margin-right:20px;cursor:pointer;">
                              <svg v-if="normalOne.else.field.length > 1" id="导航栏图标" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>删除最后一条</title><polyline points="6.64 10.28 17.41 10.38 19.16 8.59 19.69 8.59 29.26 8.59 30.91 10.38 41.36 10.28" style="fill:none;stroke:#bd4630;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px"/><path d="M37.87,15.93V39a2,2,0,0,1-2,2H12.54a2,2,0,0,1-2-2v-23" style="fill:none;stroke:#c74630;stroke-linejoin:round;stroke-width:3px"/><line x1="17.31" y1="17.17" x2="17.31" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="24.21" y1="17.17" x2="24.21" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="30.87" y1="17.17" x2="30.87" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/></svg>
                              <svg v-if="normalOne.else.field.length === 1" id="导航栏图标" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><polyline points="6.64 10.28 17.41 10.38 19.16 8.59 19.69 8.59 29.26 8.59 30.91 10.38 41.36 10.28" style="fill:none;stroke:#808080;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px"/><path d="M37.87,15.93V39a2,2,0,0,1-2,2H12.54a2,2,0,0,1-2-2v-23" style="fill:none;stroke:#808080;stroke-linejoin:round;stroke-width:3px"/><line x1="17.31" y1="17.17" x2="17.31" y2="34.5" style="fill:none;stroke:#808080;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="24.21" y1="17.17" x2="24.21" y2="34.5" style="fill:none;stroke:#808080;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="30.87" y1="17.17" x2="30.87" y2="34.5" style="fill:none;stroke:#808080;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/></svg>
                            </div>
                          </div>
                          <div class="field" v-for="(item, index) in normalOne.else.field" :key="index">
                            <Field :currentIndex='index' @opData="elsefieldData" :fieldData="item" @isLookup="(val) => {isLookup = val}"></Field>
                            <!-- <div class="svg" @click="conditionFieldDel(index, 2)" style="margin-top:5px;margin-left:5px;cursor:pointer;" v-if="index!=normalOne['else']['field'].length-1">
                              <svg id="删除" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>删除</title><polyline points="6.64 10.28 17.41 10.38 19.16 8.59 19.69 8.59 29.26 8.59 30.91 10.38 41.36 10.28" style="fill:none;stroke:#bd4630;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px"/><path d="M37.87,15.93V39a2,2,0,0,1-2,2H12.54a2,2,0,0,1-2-2v-23" style="fill:none;stroke:#c74630;stroke-linejoin:round;stroke-width:3px"/><line x1="17.31" y1="17.17" x2="17.31" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="24.21" y1="17.17" x2="24.21" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/><line x1="30.87" y1="17.17" x2="30.87" y2="34.5" style="fill:none;stroke:#bd4630;stroke-linecap:square;stroke-linejoin:round;stroke-width:3px"/></svg>
                            </div> -->
                            <button v-if="index==normalOne['else']['field'].length-1 && isLookup === false" @click="conditionFieldAdd(2)">+</button>
                          </div>
                        </div>
                      </div>
                </ScrollBar>
                <hr class="hr"/>
                <div class="save-or-cancel">
                    <button class="button-1" @click="save">保存</button>
                    <button class="button-2" @click="close">取消</button>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>
<script>

import ScrollBar from '@/components/common/ScrollBar';
import Field from './field/Index';
import Condition from './condition/Index';
import Cmtip from '../basic/CmTip/CmTip';

export default {
  components: { ScrollBar, Field, Condition, Cmtip },
  data() {
    return {
      isLookup: false, // 从field传出
      getData: {}, // 这是最终的数据
      currentCondition: 0, // 当前条件为0
      cmtipMessage: '请填写完整',
      showcmTips: false,
      normalOne: {
        '@name': '',
        if: [
          {
            '@op': 'isNone',
            '@item1': '',
            field: [],
          },
        ],
        else: {
          field: [],
        },
        field: [
          {
            '@op': 'str_trim',
            '@item1': '',
          },
        ],
      },
    };
  },
  watch: {
    isLookup() {
      if (this.isLookup === true) {
        // this.showcmTips = true;
        this.currentCondition = 0;
        this.$set(this.normalOne, 'field', [
          {
            '@op': 'lookup',
            '@item1': '',
            '@file': '',
          },
        ]);
        // this.normalOne.field.push({
        //   '@op': 'lookup',
        //   '@item1': '',
        //   '@file': '',
        // });
        // this.normalOne.field.splice(1, this.normalOne);
      } else {
        this.currentCondition = 0;
      }
    },
  },
  props: ['dataT', 'dataIndex'],
  updated() {
    this.getData = {};
    if (this.normalOne.if[0] && this.normalOne.if[0].field.length !== 0) {
      this.getData.if = this.normalOne.if;
      this.getData.else = this.normalOne.else;
      this.getData['@name'] = this.normalOne['@name'];
    } else {
      this.getData['@name'] = this.normalOne['@name'];
      this.getData.field = this.normalOne.field;
    }
  },
  created() {
    if (JSON.stringify(this.dataT) === '{}') return;
    console.log('-------++++dataT-----');
    console.log(this.dataT);
    this.normalOne['@name'] = this.dataT['@name'];
    if (this.dataT.if && !Array.isArray(this.dataT.if)) {
      this.normalOne.if = [];
      this.normalOne.if[0] = Object.assign({}, this.normalOne.if[0], this.dataT.if);
      this.normalOne.else = Object.assign({}, this.normalOne.else, this.dataT.else);
      this.currentCondition = 2;
      // 判断里面的field是不是对象
      if (this.dataT.if.field && !Array.isArray(this.dataT.if.field)) {
        this.normalOne.if[0].field = [];
        this.normalOne.if[0].field[0] = this.dataT.if.field;
      }
      if (this.dataT.else.field && !Array.isArray(this.dataT.else.field)) {
        if (this.dataT.else.field.length === 0) {
          return;
        }
        this.normalOne.else.field = [];
        this.normalOne.else.field[0] = this.dataT.else.field;
      }
    } else if (this.dataT.if && Array.isArray(this.dataT.if)) {
      if (this.dataT.if.length === 0) return;
      this.normalOne.if = [].concat(this.dataT.if);
      this.normalOne.else = Object.assign({}, this.normalOne.else, this.dataT.else);
      this.currentCondition = 3;
      for (let i = 0; i < this.dataT.if.length; i += 1) {
        if (this.dataT.if[i].field && !Array.isArray(this.dataT.if[i].field)) {
          this.normalOne.if[i].field = [];
          this.normalOne.if[i].field[0] = this.dataT.if[i].field;
        }
      }
      if (this.dataT.else.field && !Array.isArray(this.dataT.else.field)) {
        this.normalOne.else.field = [];
        this.normalOne.else.field[0] = this.dataT.else.field;
      }
    }
    if (this.dataT.field && !Array.isArray(this.dataT.field)) {
      this.normalOne.field = [];
      this.normalOne.field[0] = Object.assign({}, this.dataT.field);
      this.currentCondition = 0;
    } else if (this.dataT.field && Array.isArray(this.dataT.field)) {
      if (this.dataT.field.length === 0) {
        return;
      }
      this.normalOne.field = [].concat(this.dataT.field);
      this.currentCondition = 0;
    }
  },
  methods: {
    save() {
      // 判断是否为空
      // 如果有field
      if (this.getData.field) {
        for (let i = 0; i < this.getData.field.length; i += 1) {
          for (const key in this.getData.field[i]) {
            if (this.getData.field[i][key] === '') {
              this.showcmTips = true;
              return;
            }
          }
        }
      } else {
        // 这里是没有field的情况，包括if和field
        // 先看看if
        for (let k = 0; k < this.getData.if.length; k += 1) {
          // 先判断if中的key
          for (const key in this.getData.if[k]) {
            if (this.getData.if[k][key] === '') {
              this.showcmTips = true;
              return;
            }
          }
          // 然后判断其中的field
          for (let j = 0; j < this.getData.if[k].field.length; j += 1) {
            for (const key2 in this.getData.if[k].field[j]) {
              if (this.getData.if[k].field[j][key2] === '') {
                this.showcmTips = true;
                return;
              }
            }
          }
        }
        // 再判断else
        for (let i = 0; i < this.getData.else.field.length; i += 1) {
          for (const key in this.getData.else.field[i]) {
            if (this.getData.else.field[i][key] === '') {
              this.showcmTips = true;
              return;
            }
          }
        }
      }
      // 如果没标题
      if (this.getData['@name'] === '') {
        this.showcmTips = true;
        return;
      }
      if (JSON.stringify(this.dataT) !== '{}') { // gai
        this.$store.dispatch('dealData', { normal: this.getData, index: this.dataIndex });
      } else {
        this.$store.dispatch('dealData', { normal: this.getData, index: 0 - 1 - this.dataIndex });
      }
      this.$emit('showValueTherr');
    },
    ifConditionData(data) {
      const fieldobj = this.normalOne.if[0].field;
      this.normalOne.if[0] = data.reData;
      this.normalOne.if[0].field = fieldobj;
    },
    elseifConditionData(data) {
      const fieldobj = this.normalOne.if[data.ifIndex + 1].field;
      this.normalOne.if[data.ifIndex + 1] = data.reData;
      this.normalOne.if[data.ifIndex + 1].field = fieldobj;
    },
    fieldData(data) {
      this.normalOne.field.splice(data.index, 1, data.reData);
    },
    iffieldData(data) {
      this.normalOne.if[0].field.splice(data.index, 1, data.reData);
    },
    elsefieldData(data) {
      this.normalOne.else.field.splice(data.index, 1, data.reData);
    },
    elseiffieldData(data) {
      this.normalOne.if[data.ifIndex + 1].field.splice(data.index, 1, data.reData);
    },
    close() {
      this.$store.dispatch('csvCancel');
      this.$emit('showValueTherr');
    },
    clearOne(index) {
      this.normalOne.if.splice(index + 1, 1);
    },
    clearAll() {
      this.currentCondition = 0;
      this.normalOne.if = [];
    },
    conditionFieldAdd(num) {
      if (num === 0) {
        this.normalOne.field.push({ '@op': 'str_trim', '@item1': '' });
      }
      if (num === 1) {
        this.normalOne.if[0].field.push({ '@op': 'str_trim', '@item1': '' });
      }
      if (num === 2) {
        this.normalOne.else.field.push({ '@op': 'str_trim', '@item1': '' });
      }
      if (num >= 3) {
        this.normalOne.if[num - 2].field.push({ '@op': 'str_trim', '@item1': '' });
      }
    },
    conditionFieldDel(num) {
      if (num === 0 && this.normalOne.field.length > 1) {
        this.normalOne.field.pop();
      } else if (num === 1 && this.normalOne.if[0].field.length > 1) {
        this.normalOne.if[0].field.pop();
      } else if (num === 2 && this.normalOne.else.field.length > 1) {
        this.normalOne.else.field.pop();
      } else if (num >= 3 && this.normalOne.if[num - 2].field.length > 1) {
        this.normalOne.if[num - 2].field.pop();
      }
    },
    addCondition() {
      this.currentCondition += 1;
      if (this.currentCondition === 1) {
        // this.normalOne.if[0].field.push({ '@op': 'str_trim' });
        this.normalOne.if = [{ '@op': 'isNone', '@item1': '', field: [] }];
        this.normalOne.if[0].field = this.normalOne.field;
        this.currentCondition += 1;
      }
      if (this.currentCondition === 2) {
        this.normalOne.else.field = [{ '@op': 'str_trim', '@item1': '' }];
      }
      if (this.currentCondition > 2) {
        // this.normalOne.if.push({ '@op': 'notNull' });
        this.normalOne.if.splice(this.currentCondition - 1);
        this.normalOne.if.splice(this.currentCondition - 2, 1, { '@op': 'notNull', '@item1': 'Stsld', field: [{ '@op': 'str_trim', '@item1': '' }] });
        // this.normalOne.if[this.currentCondition - 2].field = [];
        // this.normalOne.if[this.currentCondition - 2].field.push({ '@op': 'as' });
      }
    },
  },
};
</script>
<style scoped lang="scss">
  #data-wrap{
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 999;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background-color: rgba(0, 0, 0, 0.6);
  }
    .field{
      position: relative;
    }
    .lookup{
      width: 600px;
      height: 30px;
      position: absolute;
      left: -20px;
      top:35px;
      background-color: rgb(109, 52, 52);
    }
    .lookup-bc{
      width: 600px;
      height: 30px;
      margin-top: 10px;
    }
    .data-bc{
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #ffffff;
      opacity: 0.1;
    }
    #data-deal{
        p{
          font-size: 15px;
        }
        button{
          font-size: 15px;
        }
        position: absolute;
        width: 625px;
        height: 460px;
        background-color: #183149;
        z-index: 999;
        left:0;right:0;
        top:0;bottom:0;
        margin:auto;
        .header{
            height: 30px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            svg{
                margin-right: 15px;
                cursor: pointer;
            }
            p{
                margin: 0;
                padding: 0;
                margin-left: 20px;
                line-height: 30px;
            }
        }
        .content{
            width: 100%;
            height: 460px;
            border:1px solid #183149;
            background-color: #081a29;
            .deal-title{
              display:flex;
              margin-top: 35px;
              margin-left: 25px;
              align-items:center;
              width: 580px;
              button{
                height: 30px;
                width: 80px;
                border: 0;
                background-color: #1d73a8;
                border-radius:5px;
                margin-left: auto;
              }
              input{
                margin-left: 10px;
                width: 200px;
                height: 25px;
                border:1px solid #183149;
                background-color: #081a29;
                border-radius:3px;
                padding-left: 10px;
                padding-right: 10px;
              }
              p{
                margin:0;
                padding: 0;
              }
            }
            .box{
              // overflow-y: scroll;
              height: 300px;
              width: 585px;
              border:1px solid #183149;
              background-color: #081a29;
              margin-top:10px;
              margin-left: 20px;
              .condition{
                margin-left: 20px;
                margin-top: 10px;
              }
              .field-wrap{
                width: 100%;
                box-sizing: border-box;
                border-bottom:1px solid #183149;
                .field{
                  display: flex;
                  flex-wrap: wrap;
                  align-items: center;
                  margin-left: 20px;
                  margin-top: 10px;
                  margin-bottom: 10px;
                  button{
                    margin-left: 5px;
                    width: 40px;
                    height: 30px;
                    border-radius: 3px;
                    border: 0;
                    background-color: #139d8c;
                    font-size: 15px;
                  }
                }
              }
              .condition-if{
                
                .if-header{
                  padding-top: 5px;
                  padding-left: 20px;
                  width: 100%;
                  height: 30px;
                  border-bottom: 1px solid #183149;
                  display:flex;
                  p{
                    margin:0;
                    padding: 0;
                    margin-left: 10px;
                    font-size: 15px;
                  }
                  a{
                    color: red;
                    margin-left: auto;
                    margin-right: 10px;
                  }
                  .if-svg{
                    margin-top: 3px;
                  }
                }
                .if-content{
                  width: 100%;
                  border-bottom:1px solid #183149;
                  .field{
                    display: flex;
                    align-items: center;
                    margin-left: 20px;
                    margin-top: 10px;
                    margin-bottom: 10px;
                    button{
                      margin-left: 5px;
                      width: 40px;
                      height: 30px;
                      border-radius: 3px;
                      border: 0;
                      background-color: #139d8c;
                      font-size: 20px;
                    }
                  }
                }
              }
              .condition-else-if{
                
                .else-if-header{
                  padding-top: 5px;
                  padding-left: 20px;
                  width: 100%;
                  height: 30px;
                  border-bottom: 1px solid #183149;
                  display:flex;
                  p{
                    margin:0;
                    padding: 0;
                    margin-left: 10px;
                    font-size: 15px;
                  }
                  a{
                    color: red;
                    margin-left: auto;
                    margin-right: 10px;
                  }
                  .else-if-svg{
                    margin-top: 3px;
                  }
                }
                .else-if-content{
                  width: 100%;
                  border-bottom:1px solid #183149;
                  .field{
                    display: flex;
                    align-items: center;
                    margin-left: 20px;
                    margin-top: 10px;
                    margin-bottom: 10px;
                    button{
                      margin-left: 5px;
                      width: 40px;
                      height: 30px;
                      border-radius: 3px;
                      border: 0;
                      background-color: #139d8c;
                      font-size: 20px;
                    }
                  }
                }
              }
              .condition-else{
                
                .else-header{
                  padding-top: 5px;
                  padding-left: 20px;
                  width: 100%;
                  height: 30px;
                  border-bottom: 1px solid #183149;
                  display:flex;
                  p{
                    margin:0;
                    padding: 0;
                    margin-left: 10px;
                    font-size: 15px;
                  }
                  .else-svg{
                    margin-top: 3px;
                  }
                }
                .else-content{
                  width: 100%;
                  border-bottom:1px solid #183149;
                  .field{
                    display: flex;
                    align-items: center;
                    margin-left: 20px;
                    margin-top: 10px;
                    margin-bottom: 10px;
                    button{
                      margin-left: 5px;
                      width: 40px;
                      height: 30px;
                      border-radius: 3px;
                      border: 0;
                      background-color: #139d8c;
                      font-size: 20px;
                    }
                  }
                }
              }
            }
            .hr{
                margin-top: 20px;
                margin-bottom: 0;
                border-top: 1px solid #0e2437;
            }
            .save-or-cancel{
                width: 175px;
                margin: 15px auto;
                .button-1{
                    width: 60px;
                    height:30px;
                    border-radius: 3px;
                    background-color: #0ea4c3;
                    border: 0;
                }
                .button-2{
                    width: 60px;
                    height:30px;
                    border-radius: 3px;
                    background-color: #081a29;
                    border: 1px solid #0ea4c3;
                    margin-left: 20px;
                }
            }
        }
    }
</style>