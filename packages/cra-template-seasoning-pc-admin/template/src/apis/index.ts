import { get, post, put, del, upload, baseURL } from 'common/request';

/**
 * 鉴权
 */
export const auth = {
  login: (data: any) => post('/auth/admin', data, '登录'),
  getInfo: (Authorization: string) => get('/auth', {}, '获取帐号信息', { noMessage: true, headers: { Authorization } }),
};

/**
 * 文件
 */
export const uploadFile = {
  upload: (file: File) => upload('/upload', { file }, '上传文件'),
  install: (data: any) => post('/upload/install', data, '插入文件'),
  getList: (data: any) => get('/upload', data, '获取文件列表'),
  del: (ids: string[]) => del('/upload', { ids }, '删除文件'),
  getUploadUrl: (type = '') => `${baseURL}/upload/${type}`,
};

/**
 * 帐号
 */
export const account = {
  getList: (data: any) => get('/account', data, '获取账号列表'),
  add: (data: any) => post('/account', data, '添加账号'),
  edit: ({ id, ...data }: any) => put(`/account/${id}`, data, '编辑账号'),
  del: (ids: string[]) => del('/account', { ids }, '删除账号'),
};

/**
 * 菜单分类
 */
export const menu = {
  getList: (data?: any) => get('/menu', data, '获取菜单分类列表'),
  add: (data: any) => post('/menu', data, '添加菜单分类'),
  edit: ({ id, ...data }: any) => put(`/menu/${id}`, data, '编辑菜单分类'),
  del: (ids: string[]) => del('/menu', { ids }, '删除菜单分类'),
};

/**
 * 信息列表
 */
export const info = {
  getList: (data: any) => get('/info', data, '获取信息列表'),
  details: (id: string) => get(`/info/${id}`, {}, '获取信息详情'),
  add: (data: any) => post('/info', data, '添加信息'),
  edit: ({ id, ...data }: any) => put(`/info/${id}`, data, '编辑信息'),
  del: (ids: string[]) => del('/info', { ids }, '删除信息'),
};
