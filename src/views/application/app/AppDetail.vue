<template>
  <page-layout :title="appDetail.AppName" logo="/clusterlogo.png">

    <detail-list slot="headerContent" size="small" :col="2" class="detail-layout">
      <detail-list-item term="所属集群"><a>{{ appDetail.ClusterName }}</a></detail-list-item>
      <detail-list-item term="资源空间"><a>{{ appDetail.ResourceName }}</a></detail-list-item>
      <detail-list-item term="创建时间">{{ appDetail.CreateTime }}</detail-list-item>
      <detail-list-item term="创建人">{{ appDetail.CreateUser }}</detail-list-item>
      <!-- <detail-list-item term="备注">{{ appDetail.CreateTime }}</detail-list-item> -->
    </detail-list>
    <a-row slot="extra" class="status-list">
      <a-col :xs="12" :sm="12">
        <div class="text">运行中</div>
        <div class="heading">
          <a-icon type="sync" :style="{ fontSize: '28px' }" spin class="running primary"></a-icon>
        </div>
      </a-col>
    </a-row>

    <!-- actions -->
    <template slot="action">
      <a-button-group style="margin-right: 4px;">
        <a-button>编辑</a-button>
        <a-button>删除</a-button>
        <!-- <a-button><a-icon type="ellipsis"/></a-button> -->
      </a-button-group>
      <!-- <a-button type="primary" >主操作</a-button> -->
    </template>

    <!-- 操作 -->
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      :tabList="tabList"
      :activeTabKey="activeTabKey"
      @tabChange="(key) => {this.activeTabKey = key}"
    >
      <a-row>
        <a-col :xs="24" :sm="24" v-if="activeTabKey === '1'">
          <div>
            <a-button type="primary" icon="plus" @click="handleAddHost()">添加服务</a-button>
            <a-button type="dashed" icon="caret-right" @click="handleAddHost()">启动</a-button>
            <a-button type="dashed" icon="pause-circle" @click="handleAddHost()">停止</a-button>
            <a-button type="dashed" icon="thunderbolt" @click="handleAddHost()">重启</a-button>
            <a-button type="dashed" icon="share-alt" @click="handleAddHost()">伸缩</a-button>
            <a-button type="dashed" icon="setting" @click="handleAddHost()">配置</a-button>
            <a-button type="dashed" icon="rise" @click="handleAddHost()">升级</a-button>
            <a-button type="dashed" icon="plus" @click="handleAddHost()">修改端口</a-button>
            <a-button type="dashed" icon="medicine-box" @click="handleAddHost()">健康检查</a-button>
          </div>
          <a-drawer
            title="添加主机"
            :width="720"
            @close="onAddHostPanelClose"
            maskClosable="false"
            :visible="showAddHostPanel"
            :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
          >
            <a-form :form="form" layout="vertical" >
              <a-row :gutter="12">
                <a-col :span="24">
                  <a-form-item label="群集">
                    <a-input
                      disabled
                      v-decorator="['clusterName', {
                        rules: [{ required: true, message: '请输入群集名称' }],
                        initialValue: clusterName
                      }]"
                      placeholder="必须为全英文"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="12">
                <a-col :span="24">
                  <a-form-item label="主机IP">
                    <a-input
                      v-decorator="['hostip', {
                        rules: [{ required: true, message: '请输入主机名' }]
                      }]"
                      placeholder="主机IP"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="12">
                <a-col :span="24">
                  <a-form-item label="主机类型">
                    <a-select
                      v-decorator="['hosttype', {
                        rules: [{ required: true, message: '请选择主机类型' }]
                      }]"
                      placeholder="请选择群集类型"
                    >
                      <a-select-option key="master" value="master">master</a-select-option>
                      <a-select-option key="slave" value="slave">slave</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
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
                @click="onAddHostPanelClose"
              >
                Cancel
              </a-button>
              <a-button @click="onAddHostPanelClose" type="primary">Submit</a-button>
            </div>
          </a-drawer>
          <!-- 服务列表 -->
          <a-table
            rowKey="ServiceId"
            :columns="serviceColumns"
            :dataSource="serviceList"
            :pagination="false"
          >
            <template
              slot="status"
              slot-scope="status">
              <a-badge :status="status | statusTypeFilter" :text="status | statusFilter"/>
            </template>
            <template
              slot="serviceName"
              slot-scope="text,record">
              <a @click="goServiceDetail(record.ServiceId)">{{ record.ServiceName }}</a>
            </template>
          </a-table>
        </a-col>
      </a-row>

      <a-table
        v-if="activeTabKey === '2'"
        rowKey="HostId"
        :columns="operationColumns"
        :dataSource="operation2"
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
import { getAppDetail, getAppServices } from '@/api/application'
import { clearInterval } from 'timers'

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
      timer: null,
      clusterName: name,
      showAddHostPanel: false,
      showChart: false,
      appDetail: {},
      form: this.$form.createForm(this),
      scale: [{
        dataKey: 'value',
        min: 0,
        max: 100
      }],
      cpuAndMem: [],
      tabList: [
        {
          key: '1',
          tab: '服务'
        },
        {
          key: '2',
          tab: 'TOP'
        },
        {
          key: '3',
          tab: '事件'
        },
        {
          key: '4',
          tab: 'YAML'
        }
      ],
      activeTabKey: '1',
      serviceColumns: [
        {
          title: '服务名称',
          dataIndex: 'ServiceName',
          key: 'ServiceName',
          scopedSlots: { customRender: 'serviceName' }
        },
        {
          title: '运行状态',
          dataIndex: 'Status',
          key: 'Status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '资源空间',
          dataIndex: 'ResourceName',
          key: 'ResourceName'
        },
        {
          title: '创建时间',
          dataIndex: 'CreateTime',
          key: 'CreateTime'
        },
        {
          title: '服务地址',
          dataIndex: 'Access',
          key: 'Access'
        },
        {
          title: '删除/日志',
          dataIndex: 'ImageNum',
          key: 'ImageNum'
        }
      ],
      operationColumns: [
        {
          title: '服务名称',
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
          title: '资源空间',
          dataIndex: 'ResourceName',
          key: 'ResourceName'
        },
        {
          title: '创建时间',
          dataIndex: 'CreateTime',
          key: 'CreateTime'
        },
        {
          title: '服务地址',
          dataIndex: 'Access',
          key: 'Access'
        },
        {
          title: '删除/日志',
          dataIndex: 'ImageNum',
          key: 'ImageNum'
        }
      ],
      serviceList: [],
      operation2: [],
      operation3: [],
      operation4: []
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        'True': 'Success',
        '': 'Error'
      }
      return statusMap[status]
    },
    statusTypeFilter (type) {
      const statusTypeMap = {
        'True': 'success',
        'False': 'error'
      }
      return statusTypeMap[type]
    }
  },
  created () {
    console.log('222')
    this.getAppDetail()
  },
  mounted () {
    console.log(this.$route.params.name)
    this.$nextTick(() => { this.showChart = true })
    if (this.timer) {
      clearInterval(this.timer)
    } else {
      this.timer = setInterval(() => {
        this.getAppDetail()
      }, 30000)
    }
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    goServiceDetail (sid) {
      this.$router.push(`/application/servicedetail/${sid}`)
    },
    handleAddHost () {
      this.showAddHostPanel = true
    },
    onAddHostPanelClose () {
      this.showAddHostPanel = false
    },
    getAppDetail () {
      var that = this
      getAppDetail(this.$route.params.id)
        .then(res => {
          var info = res.result
          console.log('获取应用详情')
          console.log(info)
          if (info) {
            that.appDetail = info
            this.getAppServices()
          }
        })
    },
    getAppServices () {
      var that = this
      getAppServices(that.appDetail.AppName, 'AKS')
        .then(res => {
          var info = res.result.data
          console.log(`serviceList:${info}`)
          that.serviceList = info
        })
    }

  }
}
</script>

<style lang="less" scoped>

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
