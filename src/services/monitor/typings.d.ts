declare namespace MonitorAPI {
  type MonitorParams = {
    page?: number;
    size?: number;
    projectCode?: number;
    deviceCode?: string;
    queryDateFrom?: null | string;
    queryDateTo?: null | string;
  };

  type ErrorResponse = {
    error?: string;
    message?: string;
    path?: string;
    status?: number;
    timestamp?: string;
  };
}
