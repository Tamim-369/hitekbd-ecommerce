export type IResponse<T> = {
  statusCode: number;
  message: string;
  success: boolean;
  data: T;
};

export type ResponseErrorType = {
  statusCode: number;
  message: string;
  stack: string;
};
