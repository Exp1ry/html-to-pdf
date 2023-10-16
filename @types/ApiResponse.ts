export default class ApiResponse<T> {
  public readonly data: T;
  public readonly message: string;
  public readonly isError: boolean;
  public readonly errorMessage: string;
  public readonly statusCode: number;
  constructor(
    data: T,
    message: string,
    isError: boolean,
    errorMessage: string,
    statusCode: number
  ) {
    this.data = data;
    this.message = message;
    this.isError = isError;
    this.errorMessage = errorMessage;
    this.statusCode = statusCode;
  }
}
