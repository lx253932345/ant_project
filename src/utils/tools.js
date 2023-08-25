import menuData from '../../config/routes';

const altDateMap = {
  0: "不轮替",
  32: "单号",
  33: "双号",
  48: "星期日",
  49: "星期一",
  50: "星期二",
  51: "星期三",
  52: "星期四",
  53: "星期五",
  54: "星期六",
};

const Tools = {
  getSubMenu: (pathName) => {
    const path = pathName.split('/')[1];
    let subUrl = '';
    menuData.map((item) => {
      if (item.path === `/${path}` && item?.routes && item?.routes?.length >= 1) {
        subUrl = item?.routes[0].path;
      }
      return false;
    });
    return subUrl;
  },
  // 获取token
  getToken: () => {
    let token = `Bearer ${localStorage.getItem('token')}`;
    if (localStorage.getItem('token') && localStorage.getItem('token')?.includes('Bearer')) {
      token = localStorage.getItem('token');
    }
    return token;
  },

  getAltDateDesc: code => {
    if (code <= 25 && code > 0) {
        return `${code}日`;
    }
    return altDateMap[code];
  },

  findKeyByValue: (value, obj) => {
    for (let i in obj) {
        if (obj.hasOwnProperty(i) && value === obj[i]) {
            return i;
        }
    }
  },

  filterUnUseField: (obj) => {
    const currObj = {};
    for (let i in obj) {
      if (obj[i] || obj[i] == 0) {
        currObj[i] = +obj[i];
      }
    }
    return currObj;
  }

};

export default Tools;
