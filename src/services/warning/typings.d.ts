declare namespace WarningAPI {
  type WarningParams = {
    page?: number;
    size?: number;
    fromDate?: string;
    processingCode?: string;
    toDate?: string;
    warningCode?: string;
    eventId?: string;
  };

  type EventProcessParams = {
    desc: string;
    eventProcessingMessage: WarningCode;
    person: string;
    warningEventId: number;
  };

  type WarningCode = {
    code: string;
  };

  type WarningCodeResults = {
    code?: string;
    name?: string;
  };

  type ErrorResponse = {
    error?: string;
    message?: string;
    path?: string;
    status?: number;
    timestamp?: string;
  };
}
