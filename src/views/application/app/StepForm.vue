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
      <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep" :flowDataInfo="flowDataInfo"/>
      <step3 v-if="currentTab === 2" @prevStep="prevStep" @nextStep="nextStep" :basicDataInfo="basicDataInfo"/>
      <step4 v-if="currentTab === 3" @prevStep="prevStep" @finish="finish" :healthDataInfo="healthDataInfo"/>
    </div>
  </a-card>
</template>

<script>
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import serviceFetch from '@/api/service'

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

      flowDataInfo: {},
      basicDataInfo: {},
      healthDataInfo: {}
    }
  },
  methods: {

    // handler
    nextStep (val) {
      var self = this
      if (self.currentTab === 0) {
        self.currentTab += 1
        self.flowDataInfo = val
      } else if (self.currentTab === 1) {
        self.currentTab += 1
        self.basicDataInfo = val
      } else if (self.currentTab === 2) {
        self.currentTab += 1
        self.healthDataInfo = val
      }
    },
    prevStep () {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    },
    finish (val) {
      var self = this
      var serviceObj = {
        'AppName': val.step2.AppName,
        'ServiceName': val.step2.ServiceName,
        'serviceType': val.step2.serviceType,
        'ImageRegistry': val.step2.ImageRegistry,
        'Cpu': val.step2.Cpu,
        'Memory': val.step2.Memory,
        'LabelsKey': val.step2.ServiceLablesData.length > 0 ? val.step2.ServiceLablesData['Key'] : '',
        'LabelsValue': val.step2.ServiceLablesData.length > 0 ? val.step2.ServiceLablesData['Value'] : '',
        'LabelsK8s': val.step2.ServiceLablesData.length > 0 ? val.step2.ServiceLablesData['K8s'] ? 'off' : 'on' : '',
        'NetworkMode': '1',
        'ContainerPort': val.step3.ContainerPort,
        'Domain': val.step3.Domain,
        'Replicas': Number(val.step4.Replicas),
        'ReplicasMin': Number(val.step4.ReplicasMin),
        'ReplicasMax': Number(val.step4.ReplicasMax),
        'Envs': val.step4.Envs,
        'LogPath': val.step4.LogPath,
        'ConfigureData': JSON.stringify(val.step4.ConfigData),
        'Entname': '测试环境',
        'ClusterName': 'AKS',
        'ResourceName': val.step2.ResourceName,
        'Version': val.step2.Version,
        'HealthData': val.step3.HealthData,
        'ImageTag': val.step2.ImageTag,
        'StorageData': '',
        'ServiceId': 0,
        'ServiceLablesData': JSON.stringify(val.step2.ServiceLablesData)
      }
      console.log(serviceObj)
      serviceFetch.addService(serviceObj)
        .then(res => {
          if (res.status) {
            self.$router.push('/application/app')
          }
        })
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
