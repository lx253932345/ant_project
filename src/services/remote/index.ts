import request from '@/services/request';

/** 获取项目列表 POST */
export async function getProjectData(body: RemoteAPI.RemoteParams) {
  return request('/api/query/realTime', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: body,
  });
}
/** 获取项目列表 POST */
export async function warningProcessCode(body: RemoteAPI.RemoteParams) {
  return request('/api/warningProcessCode', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
/** 获取告警列表 POST */
export async function processParameters(body: RemoteAPI.RemoteParams) {
  return request('/api/query/processParameters', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: body,
  });
}
/** 保存告警列表 POST */
export async function saveProcessParameters(body: RemoteAPI.RemoteParams) {
  return request('/api/iot/property/processParameters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
/** 电表参数列表 POST */
export async function meterParameter(body: RemoteAPI.RemoteParams) {
  return request('/api/query/meterParameter', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: body,
  });
}
/** 电表参数列表 POST */
export async function saveMeterParameter(body: RemoteAPI.RemoteParams) {
  return request('/api/iot/property/metersNumber', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
/** 告警电表参数列表 */
export async function warningSetting(body: RemoteAPI.RemoteParams) {
  return request('/api/query/warningSetting', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: body,
  });
}
/** 保存告警电表参数列表 */
export async function saveWarningSetting(body: RemoteAPI.RemoteParams) {
  return request('/api/iot/property/warningSetting', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
/** 自清洁列表 */
export async function selfCleaning(body: RemoteAPI.RemoteParams) {
  return request('/api/query/selfCleaning', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: body,
  });
}
/** 保存自清洁列表 */
export async function saveSelfCleaning(body: RemoteAPI.RemoteParams) {
  return request('/api/iot/property/selfCleaning', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
/** 轮替列表 */
export async function alternativeParameters(body: RemoteAPI.RemoteParams) {
  return request('/api/query/alternativeParameters', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: body,
  });
}
/** 保存自清洁列表 */
export async function saveAlternativeParameters(body: RemoteAPI.RemoteParams) {
  return request('/api/iot/property/alternativeParameters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
/** 新风模式列表 */
export async function fanParameters(body: RemoteAPI.RemoteParams) {
  return request('/api/query/fanParameters', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: body,
  });
}
/** 保存新风列表 */
export async function saveFanParameters(body: RemoteAPI.RemoteParams) {
  return request('/api/iot/property/fanParameters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
/** 自动模式列表 */
export async function autoParameters(body: RemoteAPI.RemoteParams) {
  return request('/api/query/autoParameters', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: body,
  });
}
/** 保存自动列表 */
export async function saveAutoParameters(body: RemoteAPI.RemoteParams) {
  return request('/api/iot/property/autoParameters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
/** 自动模式code列表 */
export async function runningCodeList(body: RemoteAPI.RemoteParams) {
  return request('/api/runningModeCode', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: body,
  });
}
/** 运行列表 */
export async function runningModeData(body: RemoteAPI.RemoteParams) {
  return request('/api/query/runningMode', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: body,
  });
}
/** 保存运行列表 */
export async function saveRunningModeData(body: RemoteAPI.RemoteParams) {
  return request('/api/iot/property/runningMode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
/** 继电器模式查询 */
export async function relayModeData(body: RemoteAPI.RemoteParams) {
  return request('/api/query/getLatestDebugRelay', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: body,
  });
}
/** 继电器模式保存列表 */
export async function saveRelayModeData(body: RemoteAPI.RemoteParams) {
  return request('/api/iot/property/setDebugRelay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
/** 空调模式参数查询 */
export async function setAirParameter(body: RemoteAPI.RemoteParams) {
  return request('/api/iot/property/setAirParameter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
/** 空调模式参数查询 */
export async function getAirParameter(body: RemoteAPI.RemoteParams) {
  return request('/api/query/getLatestAirParamters', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: body,
  });
}