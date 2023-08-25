// import { request } from '@umijs/max';
import request from '@/services/request';

/** 获取项目列表 POST */
export async function getProjectList(body: MonitorAPI.MonitorParams) {
  return request('/api/project', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: body,
  });
}

/** 获取局站列表 POST */
export async function getStationList(body: MonitorAPI.MonitorParams) {
  return request('/api/device', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: body,
  });
}

/** 获取实时列表 */
export async function getRealTimeList(body: MonitorAPI.MonitorParams) {
  return request('/api/query/latestStatus', {
    method: 'GET',
    params: body,
  });
}

/** 获取历史状态列表 */
export async function getHistoryStatusList(body: MonitorAPI.MonitorParams) {
  return request('/api/query/dailyStatus', {
    method: 'POST',
    params: { page: body.page, size: body.size },
    data: {
      deviceCode: body?.deviceCode,
      queryDateFrom: body?.queryDateFrom,
      queryDateTo: body?.queryDateTo,
    },
  });
}

/** 导出历史列表 */
export async function exportHistoryStatusList(body: MonitorAPI.MonitorParams) {
  return request('/api/query/exportStatus', {
    method: 'POST',
    data: body,
    responseType: 'blob',
  });
}

/** 获取交替运行状态列表 */
export async function getRunningStatusList(body: MonitorAPI.MonitorParams) {
  return request('/api/query/runningStatus', {
    method: 'POST',
    data: body,
  });
}

/** 获取电量查询列表 */
export async function getPowerList(body: MonitorAPI.MonitorParams) {
  return request('/api/query/powerStatus', {
    method: 'POST',
    data: body,
  });
}
