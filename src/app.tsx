import { AvatarDropdown, AvatarName, Footer } from '@/components';
import { LinkOutlined } from '@ant-design/icons';
// import { SettingDrawer } from '@ant-design/pro-components';
import { unreadCountUsingPost } from '@/services/imagebi-backend/chartMessageController';
import { getLoginUserUsingGet } from '@/services/imagebi-backend/userController';
import type { RunTimeLayoutConfig } from '@umijs/max';
import {Link, history} from '@umijs/max';
import { Badge } from 'antd';
import defaultSettings from '../config/defaultSettings';
import { requestConfig } from './requestConfig';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<InitialState> {
  const state: InitialState = {
    loginUser: undefined,
    UN_READ_COUNT: 0,
    timer: false,
  };
  try {
    const res = await getLoginUserUsingGet();
    if (res.data) {
      state.loginUser = res.data;
    }
    const count = await unreadCountUsingPost({
      receiverId: state.loginUser?.id,
    });
    if (count.data) {
      state.UN_READ_COUNT = count.data;
    }
  } catch (error) {
    history.push(loginPath);
  }
  return state;
}

// 此处删除了 setInitialState 原本： ({ initialState, setInitialState })
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    avatarProps: {
      src: initialState?.loginUser?.userAvatar,
      title: (
        <Badge count={initialState?.UN_READ_COUNT} size="small">
          <AvatarName />
        </Badge>
      ),
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.loginUser?.userName,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.loginUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    ...defaultSettings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = requestConfig;
