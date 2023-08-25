import Footer from '@/components/Footer';
import {
  BulbOutlined,
  FundViewOutlined,
  HistoryOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import type { MenuDataItem, Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { Button, Dropdown, Form, MenuProps, message, Modal, Spin, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import defaultSettings from '../config/defaultSettings';
import menuData from '../config/routes';
import styles from './global.less';
import ChangePassword from './pages/User/ChangePassword';
import { errorConfig } from './requestErrorConfig';
import { changePassword, validateToken as queryCurrentUser } from './services/login';
import Tools from './utils/tools';
// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
let currentPath = '/querying/realtime-status';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: LoginAPI.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<LoginAPI.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({ company: '', token: localStorage.getItem('token') });
      return msg;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  // console.log('如果不是登录页面，执行', location.pathname)
  currentPath = location.pathname === '/' ? '/querying/realtime-status' : location.pathname;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

const IconMap = {
  dashboard: <ShareAltOutlined />,
  history: <HistoryOutlined />,
  sync: <FundViewOutlined />,
  fund: <BulbOutlined />,
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  const [pathname, setPathname] = useState(currentPath);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    const dom = document.getElementsByClassName('ant-pro-table');
    if (dom.length) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 3000)
    }
  })

  useEffect(() => {
    return () => {
      setPathname('/querying/realtime-status');
      currentPath = '/querying/realtime-status';
      window.access = null;
    }
  }, [])

  const onCloseModal = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // 保存处理
  const savePassword = async (param: any) => {
    const res = await changePassword(param);
    if (res && res?.enabled) {
      message.success('密码修改成功');
      onCloseModal();
    } else {
      message.error(res?.message || '密码修改失败');
    }
  };

  const onSavePassword = () => {
    form
      .validateFields()
      .then((values) => {
        // console.log('values', values);
        const params = { ...values };
        delete params.confirmPassword;
        savePassword(params);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  // 远程设置
  const onClickRemote: MenuProps['onClick'] = ({ key }) => {
    setPathname(key);
    history.push(key);
  }

  const loopMenuItem = (menus: any[]): MenuDataItem[] => {
    return menus.map(({ icon, routes, ...item }) => ({
      ...item,
      icon: IconMap[icon],
      children: routes && loopMenuItem(routes),
    }));
  }

  const items: MenuProps['items'] = [
    { key: '/remote/querying', label: '远程设置' },
    { key: '/warning/list', label: '告警管理' },
    { key: '/userMange/list', label: '用户管理' }
  ]

  const userName = localStorage.getItem('userName');
  return {
    token: {
      header: {
        colorBgHeader: '#292f33',
        colorHeaderTitle: '#fff',
        colorTextMenu: '#dfdfdf',
        colorTextMenuSecondary: '#dfdfdf',
        colorTextMenuSelected: '#fff',
        colorBgMenuItemSelected: '#22272b',
        colorTextMenuActive: 'rgba(255,255,255,0.85)',
        colorTextRightActionsItem: '#dfdfdf',
      },
      colorTextAppListIconHover: '#fff',
      colorTextAppListIcon: '#dfdfdf',
      sider: {
        colorMenuBackground: '#fff',
        colorMenuItemDivider: '#dfdfdf',
        colorBgMenuItemHover: '#f6f6f6',
        colorTextMenu: '#595959',
        colorTextMenuSelected: '#242424',
        colorTextMenuActive: '#242424',
      },
    },
    location: {
      pathname,
    },
    avatarProps: {
      src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
      size: 'small',
      title: userName,
      render: (props, dom) => {
        return (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: '退出登录',
                  onClick: () => {
                    window.access = null;
                    history.push(loginPath);
                    localStorage.clear();
                  },
                },
                {
                  key: 'changePassword',
                  icon: <SettingOutlined />,
                  label: '修改密码',
                  onClick: () => {
                    setModalVisible(true);
                  },
                },
              ],
            }}
          >
            <span style={{ color: '#fff' }}>{dom}</span>
          </Dropdown>
        );
      },
    },
    actionsRender: (props: any) => {
      if (props.isMobile) return [];
      if (typeof window === 'undefined') return [];
      return window.access ? [
        <Dropdown menu={{ items, onClick: onClickRemote }} placement="bottom">
          <SettingOutlined />
        </Dropdown>
      ] : [];
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      // console.log('pageChange', initialState, pathname);
      const token = localStorage.getItem('token');
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && !token) {
        history.push(pathname);
      }
    },
    layoutBgImgList: [],
    links: [],
    menu: { request: async () => loopMenuItem(menuData) },
    menuItemRender: (item: any, dom: any) => {
      return (
        <div
          onClick={() => {
            let locationUrl = item.path;
            if (item.path.split('/').length <= 2) {
              if (item?.redirect) {
                locationUrl = item.redirect;
              } else {
                locationUrl = Tools.getSubMenu(item.path);
              }
            }
            console.log('menuItemRender', locationUrl)
            setPathname(locationUrl || '/');
            history.push(locationUrl);
          }}
        >
          {dom}
        </div>
      );
    },
    loading,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      return (
        <div className={styles.root_layout_content}>
          {children}
          <Modal
            title="修改密码"
            open={modalVisible}
            onCancel={onCloseModal}
            onOk={onSavePassword}
            width={600}
            destroyOnClose={true}
          >
            <ChangePassword form={form} />
          </Modal>
        </div>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
