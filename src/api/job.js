import request from '@/utils/request'

/**
 * 岗位信息模块
 * @param data
 */

// 新增岗位
export function addJob(data) {
  return request({
    url: '/job/add',
    method: 'post',
    data: data
  })
}

// 获取岗位列表
export function getJobList(parms) {
  return request({
    url: '/job/list',
    method: 'get',
    params: parms
  })
}
// 更新岗位
export function updateJob(data) {
  return request({
    url: '/job/update',
    method: 'post',
    data: data
  })
}

/**
 * 根据id删除岗位
 * @param id
 */
export function deleteJob(id) {
  return request({
    url: '/job/delete/' + id,
    method: 'post'
  })
}

// 通过部门id获取岗位列表
export function getJobListByDeptId(id) {
  return request({
    url: '/job/listByDeptId/' + id,
    method: 'get'
  })
}
