<template>
  <div class="storage-div">
    <ScrollBar class="scroll-area">
      <div class="main-div">
      <div class="main-div-dis" v-if="!session$.newpermissions.backup_conf_edit"></div>
        <div class="left-div">
          <p class="title-ip">cbms-{{ ip }}</p>
          <StorageBackup />
          <StorageConfig @change-ip="changeIP"/>
        </div>
        <StoragePath class="right-div" />     
      </div>
    </ScrollBar>
  </div>
</template>
<script>
import ScrollBar from '@/components/common/ScrollBar';
import StoragePath from '../components/StoragePath';
import StorageConfig from '../components/StorageConfig';
import StorageBackup from '../components/StorageBackup';

export default {
  name: 'storage',
  components: {
    ScrollBar,
    StoragePath,
    StorageConfig,
    StorageBackup,
  },
  data() {
    return {
      ip: '',
    };
  },
  methods: {
    changeIP(val) {
      this.ip = val;
    },
  },
  mounted() {
  },
};
</script>
<style lang="scss">
  .storage-div{
    ul{
      margin-bottom: 0;
      margin-top: -20px;
    }
  }
</style>
<style lang="scss" scoped>
  .storage-div{
    position: absolute;
    top: 0;
    bottom: 40px;
    left: 15px;
    right: 15px;
    border: 1px solid #255c5a;
    p, ul{
      margin-bottom: 0;
    }
    .title-ip{
      width: 100%;
      color: #4ab2a5;
      text-align: center;
      font-weight: bold;
      font-size: 20px;
      margin-bottom: -10px;
      margin-top: 10px;
    }
    .scroll-area{
      width: 100%;
      height: 100%;
      .main-div{
        position: relative;
        width: 100%;
        min-height: 800px;
        height: 100%;
        .left-div, .segment-line, .right-div{
          float: left;
          height: 100%;
        }        
        .segment-line{
          width: 1px;
          line-height: 100%;
        }  
        .left-div{
          width: calc(65% - 1px);
          >div{
            padding: 0 20px;
            &.backup_wrap{
              border-bottom: 1px solid #35847c;
            }
          }
        }      
        .right-div{
          width: 35%;
          border-left: 1px solid #35847c;
        }
        .main-div-dis{
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 200;
        }
      }
    }
  }

</style>

