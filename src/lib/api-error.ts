export class ApiError extends Error {
  status: number;
  code?: string;
  payload?: unknown;

  constructor(message: string, options: { status: number; code?: string; payload?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
    this.payload = options.payload;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
