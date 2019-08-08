import request from '@/utils/request'

// 新增用户
export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data: data
  })
}

// 获取用户列表
export function getUserList(parms) {
  return request({
    url: '/user/list',
    method: 'get',
    params: parms
  })
}
// 编辑用户
export function editUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data: data
  })
}
// 重置密码
export function restPass(id) {
  return request({
    url: '/user/restPass/' + id,
    method: 'post'
  })
}
// 删除用户
export function deleteUser(id) {
  return request({
    url: '/user/delete/' + id,
    method: 'post'
  })
}

// 获取用户个人信息
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// 修改密码
export function updatePass(parms) {
  return request({
    url: '/user/updatePass',
    method: 'put',
    params: parms
  })
}
// 修改邮箱
export function updateEmail(parms) {
  return request({
    url: '/user/updateEmail',
    method: 'put',
    params: parms
  })
}

// 发送邮箱验证码
export function resetEmail(parms) {
  return request({
    url: '/user/sendMailCode',
    method: 'post',
    params: parms
  })
}
