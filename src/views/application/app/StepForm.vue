<template>
  <a-card :bordered="false">
    <a-steps class="steps" :current="currentTab">
      <a-step title="镜像选择" />
      <a-step title="基本设置" />
      <a-step title="网络设置" />
      <a-step title="高级设置" />
    </a-steps>
    <div class="content">
      <step1 v-if="currentTab === 0" @nextStep="nextStep"/>
      <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep"/>
      <step3 v-if="currentTab === 2" @prevStep="prevStep" @nextStep="nextStep"/>
      <step4 v-if="currentTab === 3" @prevStep="prevStep" @finish="finish"/>
    </div>
  </a-card>
</template>

<script>
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'

export default {
  name: 'StepForm',
  components: {
    Step1,
    Step2,
    Step3,
    Step4
  },
  data () {
    return {
      description: '按照DevOps流程发布应用，或向应用中添加新的服务。',
      currentTab: 0,

      // form
      form: null,

      imageDataInfo: {}
    }
  },
  methods: {

    // handler
    nextStep (val) {
      var self = this
      if (self.currentTab === 0) {
        self.currentTab += 1
        self.imageDataInfo = val
        console.log(self.imageDataInfo)
      } else if (self.currentTab === 1) {
        self.currentTab += 1
      } else if (self.currentTab === 2) {
        self.currentTab += 1
      }
    },
    prevStep () {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    },
    finish () {
      this.currentTab = 0
    }
  }
}
</script>

<style lang="less" scoped>
  .steps {
    // max-width: 750px;
    margin: 16px auto;
  }
</style>
