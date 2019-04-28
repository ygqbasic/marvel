<template>
  <page-layout :title="serviceDetail.ServiceName" logo="/clusterlogo.png" :tabs="tabs">
    <!-- actions -->
    <template slot="action">
      <a-button-group style="margin-right: 4px;">
        <a-button>启动</a-button>
        <a-button>停止</a-button>
        <a-button>重启</a-button>
        <!-- <a-button><a-icon type="ellipsis"/></a-button> -->
      </a-button-group>
      <!-- <a-button type="primary" >主操作</a-button> -->
    </template>

    <!-- 操作 -->
    <a-card
      style="margin-top: 24px"
      :bordered="false"
    >
      <a-table
        rowKey="HostId"
        :columns="operationColumns"
        :dataSource="appContainers"
        :pagination="false"
      >
        <template
          slot="status"
          slot-scope="status">
          <a-badge :status="status | statusTypeFilter" :text="status | statusFilter"/>
        </template>
      </a-table>
      <a-table
        v-if="activeTabKey === '3'"
        rowKey="HostId"
        :columns="operationColumns"
        :dataSource="operation3"
        :pagination="false"
      >
        <template
          slot="status"
          slot-scope="status">
          <a-badge :status="status | statusTypeFilter" :text="status | statusFilter"/>
        </template>
      </a-table>
      <div v-if="activeTabKey === '4'">
        <template>
          <a-textarea placeholder="Basic usage" :value="appDetail.Yaml" style="border: none;background-color: #333;width: 100%;color: #F0F0F0;overflow-y: scroll" :rows="20"/>
        </template>
      </div>
    </a-card>

  </page-layout>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import PageLayout from '@/components/page/PageLayout'
import DetailList from '@/components/tools/DetailList'
import Liquid from '@/components/chart/Liquid'
import { getServiceDetail, getAppContainers } from '@/api/application'

const DetailListItem = DetailList.Item

export default {
  name: 'Advanced',
  components: {
    PageLayout,
    DetailList,
    DetailListItem,
    Liquid
  },
  mixins: [mixinDevice],
  data () {
    var name = this.$route.params.name
    console.log(name)
    return {
      tabs: {
        items: [
          {
            key: '1',
            title: '概览'
          },
          {
            key: '2',
            title: '伸缩'
          },
          {
            key: '3',
            title: '配置'
          },
          {
            key: '4',
            title: '升级'
          },
          {
            key: '5',
            title: '配置'
          },
          {
            key: '6',
            title: '健康检查'
          },
          {
            key: '7',
            title: '日志'
          }
        ],
        active: () => {
          switch (this.$route.path) {
            case '/application/service/servicedetail/22':
              return '1'
            case '/list/search/project':
              return '2'
            case '/list/search/application':
              return '3'
            default:
              return '1'
          }
        },
        callback: (key) => {
          switch (key) {
            case '1':
              this.activeTabKey = 1
              break
            case '2':
              this.$router.push('/list/search/project')
              break
            case '3':
              this.$router.push('/list/search/application')
              break
            default:
              this.$router.push('/workplace')
          }
        }
      },
      clusterName: name,
      showAddHostPanel: false,
      showChart: false,
      serviceDetail: {},
      appContainers: [],
      form: this.$form.createForm(this),
      scale: [{
        dataKey: 'value',
        min: 0,
        max: 100
      }],
      cpuAndMem: [],
      operationColumns: [
        {
          title: '容器名称',
          dataIndex: 'HostIp',
          key: 'HostIp'
        },
        {
          title: '运行状态',
          dataIndex: 'Status',
          key: 'Status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '镜像',
          dataIndex: 'HostLabel',
          key: 'HostLabel'
        },
        {
          title: '资源',
          dataIndex: 'CreateTime',
          key: 'CreateTime'
        },
        {
          title: 'IP地址',
          dataIndex: 'HostType',
          key: 'HostType'
        },
        {
          title: '创建事件/重启',
          dataIndex: 'HostType',
          key: 'HostType'
        },
        {
          title: '终端/事件/镜像/日志',
          dataIndex: 'ImageNum',
          key: 'ImageNum'
        }
      ]
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        '运行中': status,
        '不可调度': status
      }
      return statusMap[status]
    },
    statusTypeFilter (type) {
      const statusTypeMap = {
        '运行中': 'success',
        '不可调度': 'error'
      }
      return statusTypeMap[type]
    }
  },
  created () {
    console.log('222')
    this.getServiceDetail()
  },
  mounted () {
    console.log(this.$route.params.name)
    this.$nextTick(() => { this.showChart = true })
  },
  methods: {
    handleAddHost () {
      this.showAddHostPanel = true
    },
    onAddHostPanelClose () {
      this.showAddHostPanel = false
    },
    getServiceDetail () {
      var that = this
      getServiceDetail(this.$route.params.id)
        .then(res => {
          var info = res.result
          console.log('1111')
          console.log(info)
          that.serviceDetail = info
        })
    },
    getContainers () {
      var that = this
      getAppContainers(this.$route.params.id)
        .then(res => {
          var info = res.result
          console.log('1111')
          console.log(info)
          that.serviceDetail = info
        })
    }
  }
}
</script>

<style lang="less" scoped>
  .page-menu-tabs {
    margin-top: 16px;
  }
  .detail-layout {
    margin-left: 44px;
  }
  .text {
    text-align: center;
    color: #1a78c4;// rgba(0, 0, 0, .45);
  }

  .heading {
    text-align: center;
    color: #1a78c4;// rgba(0, 0, 0, .85);
    font-size: 20px;
  }

  .running {
    animation:rotating 1.2s linear infinite;
  }

  .no-data {
    color: rgba(0, 0, 0, .25);
    text-align: center;
    line-height: 64px;
    font-size: 16px;

    i {
      font-size: 24px;
      margin-right: 16px;
      position: relative;
      top: 3px;
    }
  }

  .mobile {
    .detail-layout {
      margin-left: unset;
    }
    .text {

    }
    .status-list {
      text-align: left;
    }
  }
</style>
