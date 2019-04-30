import { axios } from '@/utils/request'

export default {
  QueryServiceByName (serviceName, clusterName, appName) {
    return axios({
      url: `/service/name?AppName=${appName}&ClusterName=${clusterName}&ServiceName=${serviceName}`,
      method: 'get'
    })
  },
  addService (param) {
    return axios({
      url: '/service',
      method: 'post',
      data: param
    })
  }
}

export function getWebttyInfo (id) {
  return axios({
    url: `/webtty/${id}`,
    method: 'get',
    data: id
  })
}
