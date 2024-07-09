// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** work GET /api/add */
export async function workUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.workUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/add', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** threadPoolMsg GET /api/get */
export async function threadPoolMsgUsingGet(options?: { [key: string]: any }) {
  return request<string>('/api/get', {
    method: 'GET',
    ...(options || {}),
  });
}

/** hello GET /api/hello */
export async function helloUsingGet(options?: { [key: string]: any }) {
  return request<string>('/api/hello', {
    method: 'GET',
    ...(options || {}),
  });
}

/** hi GET /api/hi */
export async function hiUsingGet(options?: { [key: string]: any }) {
  return request<string>('/api/hi', {
    method: 'GET',
    ...(options || {}),
  });
}
