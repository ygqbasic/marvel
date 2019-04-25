<template>
  <div>
    <a-form style="margin: 40px auto 0;">
      <a-form-item
        label="应用名称"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-input v-model="appName" @blur="checkName" />
      </a-form-item>
      <a-form-item
        label="服务名称"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-input v-model="serviceName"/>
      </a-form-item>
      <a-form-item
        label="资源空间"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-select v-model="resourceName">
          <a-select-option :value="item" v-for="item in resourceNameArra" :key="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="镜像名称"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-input v-model="imageName" disabled />
      </a-form-item>
      <a-form-item
        label="版本号"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-select v-model="imageTag">
          <a-select-option v-for="item in imageTagArra" :key="item" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="部署类型"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-radio-group defaultValue="a" buttonStyle="solid" v-model="deployType">
          <a-radio-button value="a">Deployment</a-radio-button>
          <a-radio-button value="b">DaemonSet</a-radio-button>
          <a-radio-button value="c">StatefulSet</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="实例配置"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-radio-group defaultValue="a" buttonStyle="solid">
          <a-radio-button value="a">XS-0.5Core/1G</a-radio-button>
          <a-radio-button value="b">S-1Core/2G</a-radio-button>
          <a-radio-button value="c">M-2Core/4G</a-radio-button>
          <a-radio-button value="d">L-2Core/8G</a-radio-button>
          <a-radio-button value="e">XL-4Core/8G</a-radio-button>
          <a-radio-button value="f">XXL-4Core/16G</a-radio-button>
          <a-radio-button value="g">自定义</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="服务标签"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-row>
          <a-col :span="6">键</a-col>
          <a-col :span="6">值</a-col>
          <a-col :span="6">Kubernetes</a-col>
          <a-col :span="5">操作</a-col>
        </a-row>
        <a-row>
          <a-col :span="6"><a-input v-model="serviceLabelTemp.key" /></a-col>
          <a-col :span="6"><a-input v-model="serviceLabelTemp.value" /></a-col>
          <a-col :span="6"><a-checkbox :checked="serviceLabelTemp.isReject">注入</a-checkbox></a-col>
          <a-col :span="5"><a-button class="editable-add-btn" @click="handleAddLabel">添加</a-button></a-col>
        </a-row>
        <a-row :key="index" v-for="(lbl, index) in serviceLabels" >
          <a-col :span="6">{{ lbl.key }}</a-col>
          <a-col :span="6">{{ lbl.value }}</a-col>
          <a-col :span="6">{{ lbl.isReject }}</a-col>
          <a-col :span="5"><a-button class="editable-add-btn" @click="handleRemoveLabel(lbl.key)">移除</a-button></a-col>
        </a-row>
      </a-form-item>

      <a-form-item :wrapperCol="{span: 19, offset: 4}">
        <a-row>
          <a-col :span="18"><a-button style="margin-left: 8px" @click="prevStep">上一步</a-button></a-col>
          <a-col :span="6"><a-button :loading="loading" type="primary" @click="nextStep">下一步</a-button></a-col>
        </a-row>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { getResourceName } from '@/api/application'
import serviceFetch from '@/api/service'
export default {
  name: 'Step2',
  props: {
    imageDataInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      loading: false,
      instanceConfig: [{ title: 'S', cpu: 0.5, mem: 1 }],
      serviceLabelTemp: { key: 'project', value: 'techsun', isReject: true },
      serviceLabels: [{
        key: 'p1',
        value: 'Edward King 0',
        isReject: false
      }, {
        key: 'p2',
        value: 'Edward King 1',
        isReject: false
      }],

      appName: '',
      serviceName: '',
      resourceName: '',
      resourceNameArra: [],
      imageName: '',
      imageTag: '',
      imageTagArra: [],
      deployType: ''

    }
  },
  created () {
    var self = this
    self.initResourceNameArra()

    if (self.imageDataInfo != null && self.imageDataInfo !== {}) {
      self.imageName = self.imageDataInfo.Access + '/' + self.imageDataInfo.Name
      var tempTags = self.imageDataInfo.Tags
      self.imageTagArra = tempTags.split(',')
      if (self.imageTagArra.length > 0) {
        self.imageTag = self.imageTagArra[0]
      }
    }
  },
  methods: {
    initResourceNameArra () {
      var self = this
      getResourceName('admin')
        .then(res => {
          self.resourceNameArra = res.result
          if (res.result.length > 0) {
            self.resourceName = res.result[0]
          }
        })
    },
    checkName () {
      // var self = this
      serviceFetch.QueryServiceByName('', 'DevCluster', 'demo17')
        .then(res => {
          console.log(res)
        })
    },
    nextStep () {
      const that = this
      that.$emit('nextStep')
    },
    prevStep () {
      this.$emit('prevStep')
    },
    handleAddLabel () {
      var l = this.serviceLabels.find(c => c.key === this.serviceLabelTemp.key)
      if (l) {
        console.log('不能添加重复标签')
        this.$error({
          title: '标签重复',
          content: `不能输入重复的标签，标签：[${l.key}]`
        })
      } else {
        this.serviceLabels.push({ key: this.serviceLabelTemp.key, value: this.serviceLabelTemp.value, isReject: this.serviceLabelTemp.isReject })
      }
    },
    handleRemoveLabel (k) {
      console.log(k)
      this.serviceLabels = this.serviceLabels.filter(t => t.key !== k)
    }
  }
}
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;

    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }

</style>
