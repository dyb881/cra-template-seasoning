import { get, post, put, del, upload } from 'common/request';

/**
 * 缓存区域
 */
const cache: any = {};

/**
 * 鉴权
 */
export const auth = {
  login: (data: any) => post('/auth', data, '登录'),
  getInfo: (Authorization: string) => get('/auth', {}, '获取帐号信息', { noMessage: true, headers: { Authorization } }),
};

/**
 * 帐号
 */
export const account = {
  getList: (data: any) => get('/account', data, '获取账号列表'),
  add: (data: any) => post('/account', data, '添加账号'),
  edit: ({ id, ...data }: any) => put(`/account/${id}`, data, '编辑账号'),
  del: (ids: string[]) => del('/account', { ids }, '删除账号'),

  admin: {
    getList: (data: any) => get('/account-admin', data, '获取管理员列表'),
    add: (data: any) => post('/account-admin', data, '添加管理员'),
    edit: ({ id, ...data }: any) => put(`/account-admin/${id}`, data, '编辑管理员'),
    del: (ids: string[]) => del('/account-admin', { ids }, '删除管理员'),

    role: {
      getConfig: async () => {
        const res = cache.adminRoleConfig || (await get('/role-admin/default-config', {}, '获取角色管理权限配置'));
        if (res.ok) cache.adminRoleConfig = res;
        return res;
      },
      getList: async () => {
        const res = cache['role-admin'] || (await get('/role-admin', {}, '获取管理员角色列表'));
        if (res.ok) cache['role-admin'] = res;
        return res;
      },
      add: async (data: any) => {
        const res = await post('/role-admin', data, '添加管理员角色');
        if (res.ok) delete cache['role-admin'];
        return res;
      },
      edit: async ({ id, ...data }: any) => {
        const res = await put(`/role-admin/${id}`, data, '编辑管理员角色');
        if (res.ok) delete cache['role-admin'];
        return res;
      },
      del: async (ids: string[]) => {
        const res = await del('/role-admin', { ids }, '删除管理员角色');
        if (res.ok) delete cache['role-admin'];
        return res;
      },
    },
  },

  user: {
    getList: (data: any) => get('/account-user', data, '获取用户列表'),
    add: (data: any) => post('/account-user', data, '添加用户'),
    edit: ({ id, ...data }: any) => put(`/account-user/${id}`, data, '编辑用户'),
    del: (ids: string[]) => del('/account-user', { ids }, '删除用户'),
  },
};

/**
 * 文件
 */
export const files = {
  getList: (data: any) => get('/files', data, '获取文件列表'),
  add: (data: any) => post('/files', data, '添加文件'),
  edit: ({ id, ...data }: any) => put(`/files/${id}`, data, '编辑文件'),
  del: (ids: string[]) => del('/files', { ids }, '删除文件'),

  config: {
    get: () => get('/files-config', {}, '获取文件配置'),
    save: (data: any) => post('/files-config', data, '保存文件配置'),
  },

  upload: {
    server: ({ type, file }: any) => upload(`/upload/server/${type}`, { file }, '上传到服务器'),
    sts: () => get('/upload/sts', {}, '获取临时授权'),
    path: (data: any) => get('/upload/path', data, '获取上传路径'),
  },
};

/**
 * 信息
 */
export const infos = {
  category: {
    getList: async (data?: any) => {
      const res = (!data && cache.category) || (await get('/category', data, '获取分类列表'));
      if (res.ok) cache.category = res;
      return res;
    },
    details: (id: string) => get(`/category/${id}`, {}, '获取分类'),
    add: async (data: any) => {
      const res = await post('/category', data, '添加分类');
      if (res.ok) delete cache.category;
      return res;
    },
    edit: async ({ id, ...data }: any) => {
      const res = await put(`/category/${id}`, data, '编辑分类');
      if (res.ok) delete cache.category;
      return res;
    },
    del: async (ids: string[]) => {
      const res = await del('/category', { ids }, '删除分类');
      if (res.ok) delete cache.category;
      return res;
    },
  },

  information: {
    getList: (data: any) => get('/information', data, '获取信息列表'),
    details: (id: string) => get(`/information/${id}`, {}, '获取信息'),
    add: (data: any) => post('/information', data, '添加信息'),
    edit: ({ id, ...data }: any) => put(`/information/${id}`, data, '编辑信息'),
    del: (ids: string[]) => del('/information', { ids }, '删除信息'),
  },
};
