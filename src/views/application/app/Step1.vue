<template>
  <div>
    <a-form style="margin: 40px auto 0;">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="环境选择"
            :labelCol="{span: 12}"
            :wrapperCol="{span: 12}">
            <a-select
              v-decorator="['env', {
                rules: [{ required: true, message: '请选择所属环境' }]
              }]"
              placeholder="请选择所属环境"
              :defaultValue="selectEnt"
              @change="handleEntChange"
            >
              <a-select-option v-for="item in ents" :key="item.Entname" :value="item.Entname">{{ item.Entname }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="所属集群"
            :labelCol="{span: 12}"
            :wrapperCol="{span: 12}">
            <a-select
              v-decorator="['cluster', {
                rules: [{ required: true, message: '请选择部署群集' }]
              }]"
              placeholder="请选择群集类型"
            >
              <a-select-option v-for="item in clusters" :key="item" :value="item">{{ item }}</a-select-option>
              <!-- <a-select-option value="mao">Maomao Zhou</a-select-option> -->
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-alert
        :closable="false"
        message="已选择镜像reg.testcloud.com/test/admin-project 该镜像可选版本有1   个"
        style="margin-bottom: 24px;"
      />
      <a-form-item>
        <a-card
          :bordered="false"
          title="镜像列表">

          <div slot="extra">
            <!-- <a-radio-group>
              <a-radio-button>全部</a-radio-button>
              <a-radio-button>进行中</a-radio-button>
              <a-radio-button>等待中</a-radio-button>
            </a-radio-group> -->
            <a-input-search style="margin-left: 16px; width: 272px;" />
          </div>

          <!-- <div class="operate">
            <a-button type="dashed" style="width: 100%" icon="plus">添加</a-button>
          </div> -->

          <a-list size="large" :pagination="{showSizeChanger: true, showQuickJumper: true, pageSize: 10, total: 4}">
            <a-list-item :key="index" v-for="(item, index) in data">
              <a-list-item-meta :description="item.description">
                <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar"/>
                <a slot="title">{{ item.title }}</a>
              </a-list-item-meta>
              <div slot="actions">
                <a>使用该镜像部署</a>
              </div>
              <div class="list-content">
                <div class="list-content-item">
                  <p>{{ item.owner }}</p>
                </div>
              </div>
            </a-list-item>
          </a-list>

        </a-card>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>

  </div>
</template>

<script>
import { getEnts } from '@/api/cluster'

const data = []
data.push({
  title: '测试镜像1',
  avatar: '/imagelogo.png',
  description: '测试镜像',
  owner: 'reg.testcloud.com/test/admin-project'
})
data.push({
  title: '测试镜像2',
  avatar: '/imagelogo.png',
  description: '测试镜像',
  owner: 'reg.testcloud.com/test/admin-project'
})
data.push({
  title: '测试镜像3',
  avatar: '/imagelogo.png',
  description: '测试镜像',
  owner: 'reg.testcloud.com/test/admin-project'
})

export default {
  name: 'Step1',
  data () {
    return {
      ents: [],
      clustersData: {},
      clusters: [],
      selectEnt: '',
      selectedcluster: '',
      data
    }
  },
  created () {
    this.getEnts()
  },
  methods: {
    nextStep () {
      this.$emit('nextStep')
    },
    getEnts () {
      var that = this
      getEnts()
        .then(res => {
          var info = res.result.data
          console.log('ents')
          console.log(info)
          info.forEach((item) => {
            that.clustersData[item.Entname] = item.Clusters.split(',')
          })
          console.log(that.clustersData)
          that.ents = info
          that.selectEnt = info.Entname
        })
    },
    handleEntChange (value) {
      console.log('change')
      console.log(this.clustersData)
      if (this.clustersData[value] !== '') {
        this.clusters = this.clustersData[value]
      } else {
        this.clusters = []
      }
      this.selectedcluster = this.clustersData[value][0]
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-avatar-lg {
      width: 48px;
      height: 48px;
      line-height: 48px;
  }

  .list-content-item {
      color: rgba(0, 0, 0, .45);
      display: inline-block;
      vertical-align: middle;
      font-size: 14px;
      margin-left: 10px;
      span {
          line-height: 20px;
      }
      p {
          margin-top: 4px;
          margin-bottom: 0;
          line-height: 22px;
      }
  }
</style>
