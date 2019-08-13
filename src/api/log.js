import request from '@/utils/request'

export function getLogList(parms) {
  return request({
    url: '/log/list',
    method: 'get',
    params: parms
  })
}

export function deleteLog(data) {
  return request({
    url: '/log/delete',
    method: 'post',
    data
  })
}
