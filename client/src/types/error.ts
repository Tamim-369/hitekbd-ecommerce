export interface IErrorMessage {
  path: string;
  message: string;
}

export interface IErrorResponse {
  statusCode: number;
  message: string;
  errorMessages: IErrorMessage[];
  stack?: string;
  success: false;
}
