// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** deleteChartMessage POST /api/chartMsg/delete */
export async function deleteChartMessageUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseboolean>('/api/chartMsg/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getAllChartMsg GET /api/chartMsg/get */
export async function getAllChartMsgUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllChartMsgUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListChartMessageQueryResponse>('/api/chartMsg/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getUnreadMessages GET /api/chartMsg/long-polling */
export async function getUnreadMessagesUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUnreadMessagesUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.DeferredResultBaseResponseint>('/api/chartMsg/long-polling', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** tickleToRead GET /api/chartMsg/tickleToRead */
export async function tickleToReadUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.tickleToReadUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseboolean>('/api/chartMsg/tickleToRead', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** UnreadCount POST /api/chartMsg/UnreadCount */
export async function unreadCountUsingPost(
  body: API.ChartMessageQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseint>('/api/chartMsg/UnreadCount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
