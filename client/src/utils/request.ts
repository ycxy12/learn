import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';
import { useAuthStore } from '../stores/useAuthStore';

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 store 动态获取最新的 token
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 如果后端返回了标准格式 { code, data, message }
    const res = response.data;
    
    // 假设非 200 系列的状态码或 code 字段表示业务错误，我们直接通过 axios 返回 data 即可，
    // 具体如果项目有规范的 code，可以在这里拦截
    
    // NestJS 默认返回的并非包裹式的 { code, data } 而是直接的数据，除非你配了全局响应拦截。
    // 根据之前的沟通 (Conversation ae6b4e15)，后端配置了 TransformInterceptor `{ code: 0, data, message: 'success' }`。
    // 这里我们假设存在 { code } 格式并进行展开，如果不存在包装则直接返回 res。
    if (res && res.code !== undefined) {
      if (res.code === 0 || res.code === 200) {
        return res.data; // 脱壳：直接返回业务数据
      } else {
        message.error(res.message || '请求失败');
        return Promise.reject(new Error(res.message || 'Error'));
      }
    }

    return res;
  },
  (error: AxiosError | any) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        message.warning('登录已过期，请重新登录');
        useAuthStore.getState().logout();
      } else if (status === 403) {
        message.error('没有权限访问该资源');
      } else if (status >= 500) {
        message.error('服务器遇到了异常，请稍后再试');
      } else {
        // 请求参数错误，如 400
        message.error(data?.message || '请求失败');
      }
    } else {
      message.error('网络异常，请检查网络连接');
    }
    return Promise.reject(error);
  }
);

export default request;
