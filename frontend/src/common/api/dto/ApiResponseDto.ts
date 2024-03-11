export interface ApiResponseDto {
  readonly status: number;
  readonly message?: string;
  readonly data?: object | unknown[];
  readonly error?: string;
}
