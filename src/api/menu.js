import request from '@/utils/request'

/*
 * 菜单管理模块
 */

// 保存
export const saveMenu = (data) => {
  return request({
    url: '/menu/add',
    method: 'post',
    data: data
  })
}
// 删除
export function deleteMenu (id) {
  return request({
    url: '/menu/delete/' + id,
    method: 'post'
  })
}
// 查找导航菜单树
export function getMenuTreeList (parms) {
  return request({
    url: '/menu/list',
    method: 'get',
    params: parms
  })
}


// 更新菜单
export function updateMenu(data) {
  return request({
    url: '/menu/update',
    method: 'post',
    data: data
  })
}

// 获取路由
export const getRouters = () => {
  return request({
    url: '/menu/getRouters',
    method: 'get'
  })
}
// 获取菜单列表
export const getMenus = () => {
  return request({
    url: '/menu/getMenus',
    method: 'get'
  })
}
