import { httpCodes } from "./httpCodes";

export class ApiError extends Error {
  public readonly error: unknown;
  public readonly message: string;
  public readonly isError: boolean;
  public readonly errorMessage: string;
  public readonly statusCode: number;
  constructor(
    error: unknown,
    message: string,
    isError: boolean,
    errorMessage: string,
    statusCode: number
  ) {
    super();
    this.error = error;
    this.message = message;
    this.isError = isError;
    this.errorMessage = errorMessage;
    this.statusCode = statusCode;
  }
}
export interface IApiError extends Error {
  error: Error;
  message: string;
  isError: boolean;
  statusCode: number;
}

export class HTTP404Error extends ApiError {
  constructor(errorMessage = "Not found") {
    super({}, "", true, errorMessage, httpCodes.BAD_REQUEST);
  }
}
