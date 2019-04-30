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
        v-if="activeTabKey === '1'"
        rowKey="ContainerId"
        :columns="operationColumns"
        :dataSource="appContainers"
        :pagination="false"
      >
        <template
          slot="status"
          slot-scope="status">
          <a-badge :status="status | statusTypeFilter" :text="status | statusFilter"/>
        </template>
        <template
          slot="containerId"
          slot-scope="text,record">
          <a><a-icon type="code" style="font-size:20px" @click="handleShowWebtty(record.ContainerId)"></a-icon></a>
        </template>
      </a-table>
      <div v-if="activeTabKey === '2'">
        <template>
          <a-textarea placeholder="伸缩" style="border: none;background-color: #333;width: 100%;color: #F0F0F0;overflow-y: scroll" :rows="20"/>
        </template>
      </div>
      <div v-if="activeTabKey === '3'">
        <template>
          <a-textarea placeholder="配置" style="border: none;background-color: #333;width: 100%;color: #F0F0F0;overflow-y: scroll" :rows="20"/>
        </template>
      </div>
      <div v-if="activeTabKey === '4'">
        <template>
          <a-textarea placeholder="升级" style="border: none;background-color: #333;width: 100%;color: #F0F0F0;overflow-y: scroll" :rows="20"/>
        </template>
      </div>
      <div v-if="activeTabKey === '5'">
        <template>
          <a-textarea placeholder="配置" style="border: none;background-color: #333;width: 100%;color: #F0F0F0;overflow-y: scroll" :rows="20"/>
        </template>
      </div>
      <div v-if="activeTabKey === '6'">
        <template>
          <a-textarea placeholder="健康检查" style="border: none;background-color: #333;width: 100%;color: #F0F0F0;overflow-y: scroll" :rows="20"/>
        </template>
      </div>
      <div v-if="activeTabKey === '7'">
        <template>
          <a-textarea placeholder="日志" style="border: none;background-color: #333;width: 100%;color: #F0F0F0;overflow-y: scroll" :rows="20"/>
        </template>
      </div>
    </a-card>

    <a-drawer
      title="容器终端"
      :width="720"
      @close="onWebttyPanelClose"
      :visible="showWebttyPanel"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px',}"
    >
      <template>
        <div style="background-color: #000;">
          <div style="border: none;color: #ffffff;background-color: #000;"> &nbsp; 容器名称:&nbsp;{{ webttyInfo.container }}&nbsp; &nbsp;  所属集群:&nbsp;{{ webttyInfo.cluster }}  &nbsp; &nbsp; 操作员:&nbsp;{{ webttyInfo.username }}&nbsp; &nbsp; 登录时间:&nbsp;{{ webttyInfo.time }}</div>
          <div id="terminal-container" style="border: none;background-color: #000;height: '100%',color: #ffffff;" ref="terminalDiv" ></div>
        </div>
      </template>
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
          @click="onWebttyPanelClose"
        >
          关闭
        </a-button>
      </div>
    </a-drawer>

  </page-layout>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import PageLayout from '@/components/page/PageLayout'
import DetailList from '@/components/tools/DetailList'
import Liquid from '@/components/chart/Liquid'
import { getServiceDetail, getAppContainers } from '@/api/application'
import { getWebttyInfo } from '@/api/service'
// import "xterm/dist/xterm.css"
// import { Terminal } from 'xterm'
import Terminal from '@/utils/Xterm'
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
      activeTabKey: '1',
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
        active: (key) => {
          console.log('激活tab')
          console.log(key)
          // switch (this.$route.path) {
          //   case '/application/service/servicedetail/22':
          //     return '1'
          //   case '/list/search/project':
          //     return '2'
          //   case '/list/search/application':
          //     return '3'
          //   default:
          //     return '1'
          // }
        },
        callback: (key) => {
          this.activeTabKey = key
          // switch (key) {
          //   case '1':
          //     this.activeTabKey = 1
          //     break
          //   case '2':
          //     this.activeTabKey = 2
          //     break
          //   case '3':
          //     this.activeTabKey = 3
          //   case '4':
          //     this.activeTabKey = 3
          //   case '5':
          //     this.activeTabKey = 3
          //   case '6':
          //     this.activeTabKey = 3
          //     break
          //   default:
          //     this.activeTabKey = 1
          // }
        }
      },
      clusterName: name,
      showWebttyPanel: false,
      showChart: false,
      serviceDetail: {},
      appContainers: [],
      webttyInfo: {},
      // form: this.$form.createForm(this),
      operationColumns: [
        {
          title: '容器名称',
          dataIndex: 'ContainerName',
          key: 'ContainerName'
        },
        {
          title: '运行状态',
          dataIndex: 'Status',
          key: 'Status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '镜像',
          dataIndex: 'Image',
          key: 'Image'
        },
        {
          title: '资源',
          dataIndex: 'ResourceName',
          key: 'ResourceName'
        },
        {
          title: 'IP地址',
          dataIndex: 'ContainerIp',
          key: 'ContainerIp'
        },
        {
          title: '创建时间/重启',
          dataIndex: 'CreateTime',
          key: 'CreateTime'
        },
        {
          title: '终端/事件/镜像/日志',
          dataIndex: 'ContainerId',
          key: 'ContainerId',
          scopedSlots: { customRender: 'containerId' }
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
    handleShowWebtty (id) {
      var that = this
      getWebttyInfo(id)
        .then(res => {
          var info = res.result
          console.log('1111')
          console.log(info)
          that.webttyInfo = info
          that.socket()
          // 显示终端界面
          that.showWebttyPanel = true
        })
    },
    onWebttyPanelClose () {
      this.showWebttyPanel = false
    },
    getServiceDetail () {
      var that = this
      getServiceDetail(this.$route.params.id)
        .then(res => {
          var info = res.result
          console.log('1111')
          console.log(info)
          that.serviceDetail = info
          that.getContainers(info.AppName, info.Entname, info.ServiceName)
        })
    },
    getContainers (appName, entName, serviceName) {
      var that = this
      getAppContainers(appName, entName, serviceName)
        .then(res => {
          var info = res.result.data
          console.log('1111')
          console.log(info)
          that.appContainers = info
        })
    },
    socket (linkpath) {
      var params = '?'// + $.param(this.offset || {})
      params = params + '&pod=' + this.webttyInfo.pod + '&container=' + this.webttyInfo.container + '&namespace=' + this.webttyInfo.namespace + '&username=' + this.webttyInfo.username + '&token=' + this.webttyInfo.token + '&timestamp=' + this.webttyInfo.timestamp + '&cluster=' + this.webttyInfo.cluster
      const ws = new WebSocket('ws:' + document.domain + ':8999/tty' + params)
      // var that = this
      var xterm = new Terminal({
        cols: 20,
        rows: 10,
        screenKeys: true,
        cursorBlink: false,
        convertEol: true,
        scrollback: 1000,
        tabStopWidth: 4
      })
      xterm.open(document.getElementById('terminal-container'))
      xterm.fit()
      ws.onerror = function () {
        xterm.write('Sorry! terminal connect error!please try again.\n')
        window.clearInterval(xterm._blink)
      }
      ws.onmessage = function (event) {
        console.log('on message:', event.data)
        // xterm.write(that.decodeBase64Content(event.data))
        xterm.write(event.data + '\n')
      }
      ws.onopen = function () {
        xterm._initialized = true
        console.log('ws onopen ')
      }

      console.log(xterm.element.classList)

      // Log the keyCode of every keyDown event
      // xterm.textarea.onkeydown = function (e) {
      //   console.log('User pressed key with keyCode: ', e.keyCode)
      //   // console.log('编码',)
      //   // ws.send(that.encodeBase64Content(e.keyCode.toString()));
      //   // ws.send('bHM=');
      // }

      xterm.attachCustomKeyEventHandler(function (e) {
        if (e.keyCode === 13) {
          console.log('enter')
          ws.send('ls')
          // return false
        }
      })
      // xterm.on('data', function (data) {
      //   console.log('data xterm=>', data)
      //   // xterm.write(data);
      //   ws.send(that.encodeBase64Content(data.toString()))
      // })

      xterm.on('output', arrayBuffer => {
        console.log('output===', arrayBuffer)
        xterm.write(arrayBuffer)
      })

      xterm.on('blur', arrayBuffer => {
        console.log('blur===', arrayBuffer)
        xterm.write(arrayBuffer)
      })

      xterm.on('focus', arrayBuffer => {
        console.log('focus===', arrayBuffer)
        xterm.write(arrayBuffer)
      })

      // xterm.on('keydown', arrayBuffer => {
      //   console.log('keydown===', arrayBuffer)
      //   xterm.write(arrayBuffer)
      // })

      xterm.on('lineFeed', arrayBuffer => {
        console.log('lineFeed===', arrayBuffer)
        xterm.write(arrayBuffer)
      })

      xterm.on('resize', size => {
        ws.send('resize', [size.cols, size.rows])
        console.log('resize', [size.cols, size.rows])
      })
    },
    decodeBase64Content (base64Content) {
      // base64 解码
      let commonContent = base64Content.replace(/\s/g, '+')
      commonContent = Buffer.from(commonContent, 'base64').toString()
      return commonContent
    },
    encodeBase64Content (commonContent) {
      // base64 编码
      const base64Content = Buffer.from(commonContent).toString('base64')
      return base64Content
    }
  }
}
</script>

<style lang="less" scoped>
  // .terminal {
  //   background-color: #000000;
  //   color: #ffffff;
  // }
  // .terminal:not(.xterm-cursor-style-underline):not(.xterm-cursor-style-bar) .terminal-cursor {
  //   color: #000000;
  //   background: #cccccc;
  // }
  // .terminal:not(.focus) .terminal-cursor {
  //   outline: 1px solid #000000;
  //   outline-offset: -1px;
  //   background-color: transparent;
  // }

  // ::-webkit-scrollbar {
  //     width: 0.11em;
  // }

  // ::-webkit-scrollbar:horizontal
  // {
  //     height: 0.11em;
  // }

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
