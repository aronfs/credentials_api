export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export function successResponse<T>(message: string, data?: T): ApiResponse<T> {
  return { success: true, message, data };
}

export function errorResponse(message: string, errors?: any[]): ApiResponse {
  return { success: false, message, errors };
}
