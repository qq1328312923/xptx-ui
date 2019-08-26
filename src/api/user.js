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

// 修改密码
export function updatePass(parms) {
  return request({
    url: '/user/updatePass',
    method: 'post',
    params: parms
  })
}

// 编辑用户详情
export function editUserInfo(parms) {
  return request({
    url: '/user/updateUserInfo',
    method: 'post',
    //data发送的是json param
    data: parms
  })
}

// 修改邮箱
export function updateEmail(parms) {
  return request({
    url: '/user/updateEmail',
    method: 'post',
    params:parms
  })
}

// 发送邮箱验证码
export function sendMailCode(email) {
  //如果这种形式 都是走的默认
  return request({
    url: '/user/sendMailCode/'+email,
    method: 'post'
  })
}

//上传头像
export function uploadAvatar(parms){
  let config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };
  return request.post(
    '/user/uploadAvatar',
     parms,
     config
  )
}
