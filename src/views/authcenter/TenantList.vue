<template>
  <div>

    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="">

      <div slot="extra">
        <a-radio-group>
          <a-radio-button>全部</a-radio-button>
          <a-radio-button>待审核</a-radio-button>
          <a-radio-button>正常</a-radio-button>
        </a-radio-group>
        <a-input-search style="margin-left: 16px; width: 272px;" />
      </div>

      <div class="operate">
        <a-button type="dashed" style="width: 100%" icon="plus">添加</a-button>
      </div>

      <a-list size="large" :pagination="{showSizeChanger: true, showQuickJumper: true, pageSize: 5, total: 10}">
        <a-list-item :key="index" v-for="(item, index) in data">
          <a-list-item-meta :description="item.description">
            <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar"/>
            <a slot="title">{{ item.title }}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a>详情</a>
          </div>
          <div slot="actions">
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item><a>编辑</a></a-menu-item>
                <a-menu-item><a>删除</a></a-menu-item>
              </a-menu>
              <a>更多<a-icon type="down"/></a>
            </a-dropdown>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>{{ item.code }}</span>
              <p></p>
            </div>
            <div class="list-content-item">
              <span>{{ item.owner }}</span>
              <p>{{ item.telephone }}</p>
            </div>
            <div class="list-content-item">
              <span>{{ item.country }}</span>
              <p>{{ item.city }}</p>
            </div>
            <div class="list-content-item">
              <span>创建时间</span>
              <p>{{ item.startAt }}</p>
            </div>
            <!-- <div class="list-content-item">
              <a-progress :percent="item.progress.value" :status="!item.progress.status ? null : item.progress.status" style="width: 180px" />
            </div> -->
          </div>
        </a-list-item>
      </a-list>

    </a-card>
  </div>
</template>

<script>
import HeadInfo from '@/components/tools/HeadInfo'

const data = []
data.push({
  title: '广东天正计算机服务有限公司',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  description: '公司坐落在深圳',
  code: '6619178006683883',
  owner: '付晓晓',
  telephone: '021-6622887',
  country: '中国',
  city: '深圳',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 90
  }
})
data.push({
  title: '上海天徵商务服务有限公司',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  description: '上海百联创新中心',
  code: '6619178006683883',
  owner: '周星星',
  telephone: '021-6622887',
  country: '中国',
  city: '上海',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 54
  }
})

export default {
  name: 'TenantList',
  components: {
    HeadInfo
  },
  data () {
    return {
      data
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
        margin-left: 48px;
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
