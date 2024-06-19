// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** deleteChartMessage POST /bi/chartMsg/delete */
export async function deleteChartMessageUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseboolean>('/bi/chartMsg/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getAllChartMsg GET /bi/chartMsg/get */
export async function getAllChartMsgUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllChartMsgUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListChartMessageQueryResponse>('/bi/chartMsg/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getUnreadMessages GET /bi/chartMsg/long-polling */
export async function getUnreadMessagesUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUnreadMessagesUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.DeferredResultBaseResponseint>('/bi/chartMsg/long-polling', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** tickleToRead GET /bi/chartMsg/tickleToRead */
export async function tickleToReadUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.tickleToReadUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseboolean>('/bi/chartMsg/tickleToRead', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** UnreadCount POST /bi/chartMsg/UnreadCount */
export async function unreadCountUsingPost(
  body: API.ChartMessageQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseint>('/bi/chartMsg/UnreadCount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
