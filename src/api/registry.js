
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
  }
}
