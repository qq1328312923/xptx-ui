import request from '@/utils/request'

export function getRoleList(parms) {
  return request({
    url: '/role/list',
    method: 'get',
    params: parms
  })
}

// 根据主键删除角色
export function deleteRole(id) {
  return request({
    url: '/role/delete/' + id,
    method: 'post'
  })
}

// 添加角色
export function addRole(data) {
  return request({
    url: '/role/add',
    method: 'post',
    data: data
  })
}

/**
 * 更新角色
 * @param data
 */
export function updateRole(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data: data
  })
}

/**
 * 根据角色id查找菜单
 * @param id
 */
export function findRoleMenus(id) {
  return request({
    url: '/role/findRoleMenus/' + id,
    method: 'get'
  })
}

/**
 * 
 * 根据部门id得到可以选择的数据类型分类
 */
export function getDsTypes(deptId){
  return request({
    url: '/role/getDsTypes/' + deptId,
    method: 'post'
  })
}
