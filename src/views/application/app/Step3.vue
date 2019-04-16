<template>
  <div>
    <a-form style="margin: 40px auto 0;">
      <a-alert
        :closable="true"
        message="确认转账后，资金将直接打入对方账户，无法退回。"
        style="margin-bottom: 24px;"
      />
      <a-form-item
        label="应用名称"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <a-input value="SocialHub" />
      </a-form-item>
      <a-form-item
        label="容器暴露端口"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
      >
        <div>
          <template v-for="(tag, index) in tags">
            <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
              <a-tag :key="tag" :closable="index !== -1" :afterClose="() => handleClose(tag)" color="blue">
                {{ `${tag.slice(0, 20)}...` }}
              </a-tag>
            </a-tooltip>
            <a-tag v-else :key="tag" :closable="index !== -1" :afterClose="() => handleClose(tag)" color="blue">
              {{ tag }}
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
        <a-input value="test.com" />
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
export default {
  name: 'Step3',
  data () {
    return {
      loading: false,
      tags: ['80'],
      inputVisible: false,
      inputValue: '',
      serviceLabelTemp: { key: 'project', value: 'techsun', isReject: true },
      serviceLabels: [{
        key: 'p1',
        value: 'Edward King 0',
        isReject: false
      }, {
        key: 'p2',
        value: 'Edward King 1',
        address: false
      }]
    }
  },
  methods: {
    nextStep () {
      const that = this
      that.$emit('nextStep')
      // that.loading = true
      // setTimeout(function () {
      //   that.$emit('nextStep')
      // }, 500)
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
      const tags = this.tags.filter(tag => tag !== removedTag)
      console.log(tags)
      this.tags = tags
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
      let tags = this.tags
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue]
      }
      console.log(tags)
      Object.assign(this, {
        tags,
        inputVisible: false,
        inputValue: ''
      })
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
