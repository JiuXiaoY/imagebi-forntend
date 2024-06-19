// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** doThumb POST /bi/post_thumb/ */
export async function doThumbUsingPost(
  body: API.PostThumbAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseint>('/bi/post_thumb/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
