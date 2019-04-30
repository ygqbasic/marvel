<template>
  <div>
    <a-form style="margin: 40px auto 0;">
      <a-form-item
        label="服务类型"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-radio-group defaultValue="a" buttonStyle="solid">
          <a-radio-button value="a">无状态</a-radio-button>
          <a-radio-button value="b">有状态</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="调节模式"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-radio-group defaultValue="a" buttonStyle="solid">
          <a-radio-button value="a">手动</a-radio-button>
          <a-radio-button value="b">自动</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="容器实例数量"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-input v-model="replicas"/>
      </a-form-item>
      <a-form-item
        label="实列最小值"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-input v-model="replicasMin" />
      </a-form-item>
      <a-form-item
        label="实列最大值"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-input v-model="replicasMax" />
      </a-form-item>
      <a-form-item
        label="配置文件"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-row>
          <a-col :span="6">容器路径</a-col>
          <a-col :span="6">配置项目</a-col>
          <a-col :span="5">操作</a-col>
        </a-row>
        <a-row>
          <a-col :span="6"></a-col>
          <a-col :span="6"></a-col>
          <a-col :span="5"><a-button class="editable-add-btn" @click="handleAddLabel">添加</a-button></a-col>
        </a-row>
      </a-form-item>
      <a-form-item
        label="环境变量"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <template>
          <a-textarea
            placeholder="变量名=变量值
evn=prod"
            v-model="envs"
            :rows="5"/>
        </template>
      </a-form-item>
      <a-form-item
        label="日志路径"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <template>
          <a-textarea
            placeholder="/usr/local/tomcat/logs/
/var/log/yum.log
/var/log/messages
/tmp/gc.log
多个日志按换行填入,目录以/结尾,路径可以使用$item变量,$item为服务名称配置时需要先配置kfak地址信息,filebeat将日志输出到kafka中"
            v-model="logPath"
            :rows="8"/>
        </template>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 4}">
        <a-row>
          <a-col :span="18"><a-button style="margin-left: 8px" @click="prevStep">上一步</a-button></a-col>
          <a-col :span="6"><a-button :loading="loading" type="primary" @click="finish">提交</a-button></a-col>
        </a-row>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { Result } from '@/components'

export default {
  name: 'Step4',
  props: {
    healthDataInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  components: {
    Result
  },
  data () {
    return {
      loading: false,
      serviceLabelTemp: { key: 'project', value: 'techsun', isReject: true },
      serviceLabels: [],
      replicas: '1',
      replicasMin: '1',
      replicasMax: '1',
      envs: '',
      logPath: '',
      configData: [],
      finishDataInfo: {}
    }
  },
  methods: {
    finish () {
      var self = this
      self.finishDataInfo = {
        'Replicas': self.replicas,
        'ReplicasMin': self.replicasMin,
        'ReplicasMax': self.replicasMax,
        'Envs': self.envs,
        'LogPath': self.logPath,
        'ConfigData': self.configData
      }
      var tempObj = {
        'step1': self.healthDataInfo.step1,
        'step2': self.healthDataInfo.step2,
        'step3': self.healthDataInfo.step3,
        'step4': self.finishDataInfo
      }
      self.$emit('finish', tempObj)
    },
    toOrderList () {
      this.$router.push('/list/query-list')
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
  .information {
    line-height: 22px;

    .ant-row:not(:last-child) {
      margin-bottom: 24px;
    }
  }
  .money {
    font-family: "Helvetica Neue",sans-serif;
    font-weight: 500;
    font-size: 20px;
    line-height: 14px;
  }
</style>
