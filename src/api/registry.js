
import { axios } from '@/utils/request'

export default {
  getDeployImages (envType, clusterType, cloudimgname) {
    var param = {
      'envType': envType,
      'clusterType': clusterType,
      'cloudimgname': cloudimgname
    }
    return axios({
      url: '/registry/deploy/images',
      method: 'get',
      data: param
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
