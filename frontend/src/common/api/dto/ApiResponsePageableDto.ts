export interface ApiResponsePageableDto {
  readonly data: any[];
  readonly totalPages: string;
  readonly currentPage: string;
  readonly totalItems: string;
  readonly size: string;
}
