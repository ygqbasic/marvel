
import { axios } from '@/utils/request'

export default {
  getDeployImages (envType, clusterType, cloudimgname) {
    return axios({
      url: `/registry/deploy/images?envType=${envType}&clusterType=${clusterType}&cloudimgname=${cloudimgname}`,
      method: 'get'
    })
  },
  getImageInfo (clusterUrl, clusterType) {
    var param = {
      'GroupName': clusterType
    }
    return axios({
      url: '/registry/group/images/' + clusterUrl + '?GroupName=' + clusterType,
      method: 'get',
      data: param
    })
  }
}
