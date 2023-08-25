declare namespace LoginAPI {
  type CurrentUser = {
    company: string;
    token?: string;
  };

  type ValidateToken = {
    company: string;
    token?: string;
  };

  type LoginResult = {
    token?: string;
    company?: string;
    admin?: boolean;
  };

  type LoginParams = {
    username?: string;
    password?: string;
  };

  type ErrorResponse = {
    error?: string;
    message?: string;
    path?: string;
    status?: number;
    timestamp?: string;
  };

}
