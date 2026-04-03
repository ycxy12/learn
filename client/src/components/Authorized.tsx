import React from 'react';
import { useAuthStore } from '../stores/useAuthStore';

interface AuthorizedProps {
  permission: string | string[];
  children: React.ReactNode;
}

/**
 * 权限拦截组件
 * @param permission 需要校验的权限，支持传入单个权限或权限数组（满足其一即可）
 * @param children 校验通过时渲染的内容
 */
export const Authorized: React.FC<AuthorizedProps> = ({ permission, children }) => {
  const { permissions } = useAuthStore((state) => ({ 
    permissions: state.user?.permissions || []
  }));

  const hasPermission = () => {
    // 如果没有要求权限，直接放行（取决于业务需求，目前设定必须匹配）
    if (!permission) return true;

    if (Array.isArray(permission)) {
      return permission.some((p) => permissions.includes(p));
    }

    return permissions.includes(permission);
  };

  return hasPermission() ? <>{children}</> : null;
};
