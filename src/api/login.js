import request from '@/utils/request'

export function loginByUsername(username, password, captcha,captchauuid) {
  const data = {
    username,
    password,
    captcha,
    captchauuid
  }
  // 登录
  return request({
    url: '/login',
    method: 'post',
    params: data
  })
}

export function captcha(){
  return request({
      url:  '/captcha.jpg?t=' + new Date().getTime(),
      method: 'get'
      //如果data 则是json，如果改成params则是表单提交
    })
}

// 登出
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/info',
    method: 'get'
  })
}

