import Tools from '@/utils/tools';
import { request } from '@umijs/max';

/** 登录接口 POST */
export async function userLogin(body: LoginAPI.LoginParams) {
  return request<LoginAPI.LoginResult | LoginAPI.ErrorResponse>('/api/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
/** 校验登录 POST validateToken */
export async function validateToken(body: LoginAPI.LoginParams) {
  return request<boolean | LoginAPI.ErrorResponse>('/api/validateToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
/** 校验已经退出登录登录 POST validateToken */
export async function inValidateToken() {
  return request<boolean | LoginAPI.ErrorResponse>('/api/invalidateToken', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
/** getUserList */
export async function getUserList(body: any) {
  return request<boolean | LoginAPI.ErrorResponse>('/api/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Tools.getToken(),
    },
    params: body,
  });
}
/** getRoleList */
export async function getRoleList() {
  return request<boolean | LoginAPI.ErrorResponse>('/api/role', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Tools.getToken(),
    },
  });
}
/** changePassword */
export async function changePassword(body: any) {
  return request<boolean | LoginAPI.ErrorResponse>('/api/user/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Tools.getToken(),
    },
    data: body,
  });
}
