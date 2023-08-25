import { Menu } from "antd";
import { useEffect, useState } from "react";
import formateMenu from '@/locales/zh-CN';
import styles from './index.less';

// 左侧菜单
const SideBar = (props: any) => {
  const { menuData = [] } = props;
  const [childMenuList, setChildMenuList] = useState([]);

  const getChildMenu = (key: string) => {
    menuData.map((item: any) => {
      if (item.path === `/${key}` && item?.routes) {
        const list = item?.routes.map((ele: any) => {
          return { label: formateMenu[`menu.${item.name}.${ele.name}`], key: ele.alias }
        })
        setChildMenuList(list)
      }
    })
  }

  useEffect(() => {
    const pathName = window.location.pathname
    const pathList = pathName.split('/');
    getChildMenu(pathList[1])
  }, [])

  return <div className={styles.left_side}>
    <Menu
      // onClick={onClick}
      style={{ width: 256 }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={childMenuList}
    />
  </div>
}

export default SideBar;
