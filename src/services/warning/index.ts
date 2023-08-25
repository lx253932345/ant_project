import request from '@/services/request';

/** 事件类型 */
export async function warningCodeList() {
  return request<WarningAPI.WarningCodeResults | WarningAPI.ErrorResponse>('/api/warningCode', {
    method: 'GET',
  });
}
/** 处理状态  */
export async function handleStatusList() {
  return request<WarningAPI.WarningCodeResults | WarningAPI.ErrorResponse>(
    '/api/eventProcessCode',
    {
      method: 'GET',
    },
  );
}
/** 告警列表  */
export async function warningList(body: WarningAPI.WarningParams | any) {
  return request<WarningAPI.WarningCodeResults | WarningAPI.ErrorResponse>('/api/event', {
    method: 'POST',
    data: {
      fromDate: body?.fromDate,
      toDate: body?.toDate,
      deviceCode: body?.deviceCode,
      processingCode: body?.processingCode,
      warningCode: body?.warningCode,
    },
    params: { page: body?.page, size: body?.size },
  });
}
/** 当前事件处理列表  */
export async function handleWarningList(body: WarningAPI.WarningParams) {
  return request<WarningAPI.WarningCodeResults | WarningAPI.ErrorResponse>('/api/eventProcess', {
    method: 'GET',
    params: body,
  });
}
/** 执行事件处理  */
export async function saveEventStatus(body: WarningAPI.EventProcessParams) {
  return request<WarningAPI.WarningCodeResults | WarningAPI.ErrorResponse>('/api/eventProcess', {
    method: 'POST',
    data: body,
  });
}
