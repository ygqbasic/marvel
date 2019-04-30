<template>
  <div>
    <a-form style="margin: 40px auto 0;">
      <a-form-item
        label="容器暴露端口"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <div>
          <template v-for="(port, index) in ports">
            <a-tooltip v-if="port.length > 20" :key="port" :title="port">
              <a-tag :key="port" :closable="index !== -1" :afterClose="() => handleClose(port)" color="blue">
                {{ `${port.slice(0, 20)}...` }}
              </a-tag>
            </a-tooltip>
            <a-tag v-else :key="port" :closable="index !== -1" :afterClose="() => handleClose(port)" color="blue">
              {{ port }}
            </a-tag>
          </template>
          <a-input
            v-if="inputVisible"
            ref="input"
            type="text"
            size="small"
            :style="{ width: '78px' }"
            :value="inputValue"
            @change="handleInputChange"
            @blur="handleInputConfirm"
            @keyup.enter="handleInputConfirm"
          />
          <a-tag v-else @click="showInput" style="background: #fff; borderStyle: dashed;">
            <a-icon type="plus" /> New Port
          </a-tag>
        </div>
      </a-form-item>
      <a-form-item
        label="域名后缀"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-input v-model="domain" />
      </a-form-item>
      <a-form-item
        label="健康检查"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-row>
          <a-col :span="2">类型</a-col>
          <a-col :span="2">端口</a-col>
          <a-col :span="4">路径或命令</a-col>
          <a-col :span="2">启动预估</a-col>
          <a-col :span="2">间隔</a-col>
          <a-col :span="3">不健康阈值</a-col>
          <a-col :span="2">超时</a-col>
          <a-col :span="5">操作</a-col>
        </a-row>
        <a-row>
          <a-col :span="2"></a-col>
          <a-col :span="2"></a-col>
          <a-col :span="4"></a-col>
          <a-col :span="2"></a-col>
          <a-col :span="2"></a-col>
          <a-col :span="3"></a-col>
          <a-col :span="2"></a-col>
          <a-col :span="5"><a-button class="editable-add-btn" @click="showDrawer">添加</a-button></a-col>
        </a-row>
      </a-form-item>

      <a-form-item :wrapperCol="{span: 19, offset: 4}">
        <a-row>
          <a-col :span="18"><a-button style="margin-left: 8px" @click="prevStep">上一步</a-button></a-col>
          <a-col :span="6"><a-button :loading="loading" type="primary" @click="nextStep">下一步</a-button></a-col>
        </a-row>
      </a-form-item>
    </a-form>
    <a-drawer
      title="创建健康检测"
      :width="720"
      @close="onClose"
      :visible="visible"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <a-form :form="form" layout="vertical" hideRequiredMark>
        <a-form-item
          label="检查类型"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-radio-group buttonStyle="solid" v-model="healthType">
            <a-radio-button value="HTTP">HTTP</a-radio-button>
            <a-radio-button value="TCP">TCP</a-radio-button>
            <a-radio-button value="CMD">CMD</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="端口"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
          v-if="healthType==='HTTP' || healthType==='TCP'"
        >
          <a-input v-model="healthPort"/>
        </a-form-item>
        <a-form-item
          label="健康检查命令"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
          v-else
        >
          <a-input v-model="healthCmd"/>
        </a-form-item>
        <a-form-item
          label="页面路径"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
          v-if="healthType==='HTTP'"
        >
          <a-input v-model="healthPath"/>
        </a-form-item>
        <a-form-item
          label="首次检查延时"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }">
          <a-input
            addonAfter="秒"
            v-model="healthInitialDelay"
          />
        </a-form-item>
        <a-form-item
          label="间隔"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }">
          <a-input
            addonAfter="秒"
            v-model="healthInterval"
          />
        </a-form-item>
        <a-form-item
          label="失败次数阈值"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }">
          <a-input
            addonAfter="次"
            v-model="healthFaliureThreshold"
          />
        </a-form-item>
        <a-form-item
          label="超时"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }">
          <a-input
            addonAfter="秒"
            v-model="healthTimeout"
          />
        </a-form-item>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
      >
        <a-button
          :style="{marginRight: '8px'}"
          @click="onClose"
        >
          取消
        </a-button>
        <a-button @click="onClose" type="primary">创建</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
export default {
  name: 'Step3',
  props: {
    basicDataInfo: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      loading: false,
      ports: ['80'],
      domain: '',
      inputVisible: false,
      inputValue: '',
      serviceLabelTemp: { key: 'project', value: 'techsun', isReject: true },
      visible: false,
      form: this.$form.createForm(this),
      healthType: 'HTTP',
      healthPort: '80',
      healthPath: '/healthz',
      healthCmd: 'ls /tmp/',
      healthInitialDelay: '100',
      healthInterval: '60',
      healthFaliureThreshold: '0',
      healthTimeout: '20'
    }
  },
  created () {
    // var self = this
  },
  methods: {
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
    },
    handleClose (removedTag) {
      const ports = this.ports.filter(port => port !== removedTag)
      this.ports = ports
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(function () {
        this.$refs.input.focus()
      })
    },
    handleInputChange (e) {
      this.inputValue = e.target.value
    },
    handleInputConfirm () {
      const inputValue = this.inputValue
      let ports = this.ports
      if (inputValue && ports.indexOf(inputValue) === -1) {
        ports = [...ports, inputValue]
      }
      Object.assign(this, {
        ports,
        inputVisible: false,
        inputValue: ''
      })
    },
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
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
