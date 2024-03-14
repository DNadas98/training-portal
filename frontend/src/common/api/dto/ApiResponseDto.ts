export interface ApiResponseDto {
  readonly status: number;
  readonly message?: string;
  readonly data?: any;
  readonly error?: string;
}
