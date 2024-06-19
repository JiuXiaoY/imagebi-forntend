// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** work GET /bi/add */
export async function workUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.workUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<any>('/bi/add', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** threadPoolMsg GET /bi/get */
export async function threadPoolMsgUsingGet(options?: { [key: string]: any }) {
  return request<string>('/bi/get', {
    method: 'GET',
    ...(options || {}),
  });
}

/** hello GET /bi/hello */
export async function helloUsingGet(options?: { [key: string]: any }) {
  return request<string>('/bi/hello', {
    method: 'GET',
    ...(options || {}),
  });
}

/** hi GET /bi/hi */
export async function hiUsingGet(options?: { [key: string]: any }) {
  return request<string>('/bi/hi', {
    method: 'GET',
    ...(options || {}),
  });
}
