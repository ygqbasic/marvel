
import { axios } from '@/utils/request'

export default {
  getConfigures () {
    return axios({
      url: `/configures`,
      method: 'get'
    })
  },
  getConfigItems (configId) {
    return axios({
      url: `/configures/data/${configId}`,
      method: 'get'
    })
  }
}
