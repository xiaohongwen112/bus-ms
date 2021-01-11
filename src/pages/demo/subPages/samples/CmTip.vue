<template>
  <div>
    <div class="cm-tip" @click="showTip=true">点击显示公共提示</div>
    <div class="cm-tip" @click="showConfirm">点击显示公共提示实例调用</div>
    <CmTip v-show="showTip" :tipTitle="tipTitle" :tipContent="tipContent" :closeFn="() => showTip = false"></CmTip>
  </div>
</template>

<script>
  import CmTip from '@/components/common/CmTip';

  export default {
    name: 'cm-tip-example',
    components: { CmTip },
    data() {
      return {
        showTip: false,
        tipTitle: '测试提示',
        tipContent: '可自定义显示内容，不局限于文字提示，也可修改配置控制底部按钮的显示与隐藏',
      };
    },
    methods: {
      showConfirm() {
        CmTip.confirm({
          tipTitle: '提示',
          tipContent: '保存中......',
        });

        setTimeout(() => {
          CmTip.confirm({
            tipTitle: '提示',
            tipContent: '保存成功',
            onClose: () => {
              console.log('Instance cmTip closed');
            },
          });
        }, 1000);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .cm-tip{
    margin: 20px;
    cursor:pointer;
  }
</style>