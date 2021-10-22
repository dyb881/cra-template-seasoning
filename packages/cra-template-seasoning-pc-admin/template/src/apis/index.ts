import { get, post, put, del, upload as uploadRequest } from 'common/request';

/**
 * 鉴权
 */
export const auth = {
  login: (data: any) => post('/auth', data, '登录'),
  getInfo: (Authorization: string) => get('/auth', {}, '获取帐号信息', { noMessage: true, headers: { Authorization } }),
};

/**
 * 文件
 */
export const oss = {
  sts: () => get('/oss/sts', {}, '获取临时授权'),
  getPutObject: (data: any) => get('/oss/put/object', data, '获取OSS上传对象'),
};

/**
 * 服务器文件上传
 */
export const upload = (data: any) => uploadRequest('/upload', data, '上传文件');

/**
 * 帐号
 */
export const account = {
  getList: (data: any) => get('/account', data, '获取账号列表'),
  add: (data: any) => post('/account', data, '添加账号'),
  edit: ({ id, ...data }: any) => put(`/account/${id}`, data, '编辑账号'),
  del: (ids: string[]) => del('/account', { ids }, '删除账号'),

  admin: {
    getList: (data: any) => get('/account/admin', data, '获取管理员列表'),
    add: (data: any) => post('/account/admin', data, '添加管理员'),
    edit: ({ id, ...data }: any) => put(`/account/admin/${id}`, data, '编辑管理员'),
    del: (ids: string[]) => del('/account/admin', { ids }, '删除管理员'),

    role: {
      getConfig: () => get('/account/admin/role/config', {}, '获取角色管理权限配置', { cacheKey: 'role-config' }),
      getList: (data?: any) => get('/account/admin/role/all', data, '获取管理员角色列表'),
      add: (data: any) => post('/account/admin/role', data, '添加管理员角色'),
      edit: ({ id, ...data }: any) => put(`/account/admin/role/${id}`, data, '编辑管理员角色'),
      del: (ids: string[]) => del('/account/admin/role', { ids }, '删除管理员角色'),
    },
  },

  user: {
    getList: (data: any) => get('/account/user', data, '获取用户列表'),
    add: (data: any) => post('/account/user', data, '添加用户'),
    edit: ({ id, ...data }: any) => put(`/account/user/${id}`, data, '编辑用户'),
    del: (ids: string[]) => del('/account/user', { ids }, '删除用户'),
  },
};

/**
 * 信息
 */
export const infos = {
  category: {
    getList: (data?: any) => get('/infos/category/all', data, '获取分类列表'),
    details: (id: string) => get(`/infos/category/${id}`, {}, '获取分类'),
    add: (data: any) => post('/infos/category', data, '添加分类'),
    edit: ({ id, ...data }: any) => put(`/infos/category/${id}`, data, '编辑分类'),
    del: (ids: string[]) => del('/infos/category', { ids }, '删除分类'),
  },

  article: {
    getList: (data: any) => get('/infos/article', data, '获取文章列表'),
    details: (id: string) => get(`/infos/article/${id}`, {}, '获取文章'),
    add: (data: any) => post('/infos/article', data, '添加文章'),
    edit: ({ id, ...data }: any) => put(`/infos/article/${id}`, data, '编辑文章'),
    del: (ids: string[]) => del('/infos/article', { ids }, '删除文章'),
  },
};
