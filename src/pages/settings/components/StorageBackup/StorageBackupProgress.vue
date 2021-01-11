<template>
  <div class="storage-backup-progress">
    <p>数据正在{{ compress.name }}中......</p>
    <div class="progress-item">
      <span class="name">文件名: </span>
      <span class="text">{{ compress.filename }}</span>
    </div>
    <div class="progress-item">
      <span class="name">总大小: </span>
      <span class="text">{{ compress.totalSize }}KB</span>
    </div>
    <div class="progress-item">
      <span class="name">进度: </span>
      <span class="text">
        <span class="progress-detail col-xss-12">
          <ProgressBar :width="275"
            :percent="compress.size / compress.totalSize"
            :startColor="'#39ca76'"
            :stopColor="'#55ede7'"
            :colorBg="'#424242'"
          />
          {{ Math.round(compress.size / compress.totalSize * 100) }}%</span>
        <span class="progress-detail col-xss-12">{{ path }}</span>
      </span>
    </div>
  </div>
</template>

<script>
import ProgressBar from '@/components/common/ProgressBar';

export default {
  name: 'StorageBackupProgress',
  components: {
    ProgressBar,
  },
  props: {
    path: {
      type: String,
      default: '',
      required: true,
    },
    compress: {
      type: Object,
      required: true,
      default() {
        return {
          name: '备份',
          totalSize: 100,
          filename: '',
          size: 0,
        };
      },
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../../../assets/css/col.css';

.storage-backup-progress{
  position: absolute;
  z-index: 9;
  width: 100%;
  padding: 5px 10px 21px;
  background: #0f3858;
  z-index: 3;
  text-align: left;
  border: 1px solid #254a67;
  height: 225px;
  .progress-item{
    line-height: 40px;
    &:nth-of-type(2){
      line-height: 17px;
    }
  }
  .progress-detail{
    height: 20px;
    line-height: 20px;
  }
  p{
    margin: 0 auto;
    line-height: 33px;
    text-align: center;
    color: #15ece4;
    font-size: 20px;
  }
  .name{
    display: inline-block;
    width: 60px;
    float: left;
    padding-right: 10px;
    text-align: right;
    color: #ddd;
  }
  .text{
    display: inline-block;
    width: calc(100% - 70px);
    line-height: 20px;
    vertical-align: text-top;
    word-break: break-all;
  }
}
</style>
