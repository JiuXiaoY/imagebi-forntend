import {message} from "antd";
interface WebSocketManager {
  lockReconnect: boolean;
  isReconnect: boolean;
  ws: WebSocket | null;
  wsUrl: string;
}

const websocketManager: WebSocketManager = {
  lockReconnect: false, // 避免重复连接
  isReconnect: true, // 是否重连
  ws: null, // WebSocket 实例
  wsUrl: '', // WebSocket 连接 URL
};

// 处理消息
let handleMsg = () => {};

export const setHandleMsg = (newFunction: () => void) => {
  handleMsg = newFunction;
};

// 数据发送
export const websocketSend = (agentData: string) => {
  if (websocketManager.ws?.readyState === WebSocket.OPEN) {
    websocketManager.ws.send(agentData);
  }
};

// 主动关闭连接
export const websocketClose = () => {
  websocketManager.isReconnect = false; // 关闭重连
  websocketManager.ws?.close(); // 关闭连接
  websocketManager.ws = null; // 清空连接
  websocketManager.lockReconnect = false; // 关闭锁
};

// 重连
const reconnect = (wsUrl: string) => {
  if (websocketManager.lockReconnect) return;
  websocketManager.lockReconnect = true;
  setTimeout(() => {
    // 没连接上会一直重连，设置延迟避免请求过多
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    createWebSocket(wsUrl);
    websocketManager.lockReconnect = false;
  }, 2000);
};

// 心跳检测
const heartCheck = {
  timeout: 10000, // 心跳检测间隔
  timeoutObj: null as unknown as ReturnType<typeof setTimeout>,
  serverTimeoutObj: null as unknown as ReturnType<typeof setTimeout>,
  reset() {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start() {
    this.timeoutObj = setTimeout(() => {
      // 在连接状态下才通信
      if (websocketManager.ws?.readyState === WebSocket.OPEN) {
        websocketManager.ws.send('check');
        this.serverTimeoutObj = setTimeout(() => {
          websocketManager.ws?.close();
        }, this.timeout);
      }
    }, this.timeout);
  },
};

// 初始化事件处理
const initEventHandle = () => {
  if (!websocketManager.ws) return;

  websocketManager.ws.onclose = () => {
    // 关闭连接
    if (websocketManager.isReconnect) {
      reconnect(websocketManager.wsUrl);
    }
  };

  websocketManager.ws.onerror = () => {
    websocketClose();
    if (websocketManager.isReconnect) {
      reconnect(websocketManager.wsUrl);
    }
  };

  websocketManager.ws.onopen = () => {
    // 连接成功后心跳检测开始
    heartCheck.reset().start(); // 心跳检测重置
  };

  websocketManager.ws.onmessage = (event: MessageEvent) => {
    // 拿到任何消息都说明当前连接是正常的
    heartCheck.reset().start();
    const eventData = event.data;
    if (eventData !== 'pong') {
      message.success(eventData);
      handleMsg();
    }
  };
};

// 创建 WebSocket 连接
export const createWebSocket = (wsUrlConnect: string) => {
  websocketManager.lockReconnect = false; // 避免 ws 重复连接
  websocketManager.isReconnect = false; // 是否重连
  websocketManager.wsUrl = wsUrlConnect;
  try {
    if ('WebSocket' in window) {
      websocketManager.ws = new WebSocket(wsUrlConnect);
      initEventHandle();
    }
  } catch (e) {
    if (websocketManager.isReconnect) {
      reconnect(wsUrlConnect);
    }
    console.error(e);
  }
};

// 监听窗口关闭事件，当窗口关闭时，主动去关闭 WebSocket 连接，防止连接还没断开就关闭窗口，server 端会抛异常。
window.onbeforeunload = () => {
  // 无论关闭窗口和刷新都要关闭连接
  websocketManager.isReconnect = false;
  websocketManager.lockReconnect = false;
  websocketManager.ws?.close();
};

// 浏览器特性 performance.navigation
if (performance.getEntriesByType) {
  const navigationEntries = performance.getEntriesByType('navigation');
  const isReload = navigationEntries.some(
    (entry) => (entry as PerformanceNavigationTiming).type === 'reload',
  );

  if (isReload) {
    // 刷新页面后需要重连
    const currentUrl = location.href;
    const pathname = new URL(currentUrl).pathname;
    if (websocketManager.isReconnect && pathname === '/myChart') {
      reconnect(websocketManager.wsUrl);
    }
  } else {
    // 关闭窗口
    localStorage.clear();
  }
}
