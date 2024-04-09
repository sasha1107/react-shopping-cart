interface PageDto {
  total: number;
  page: number;
  limit: number;
}

export interface ResponseDto<T> {
  data: T;
  page?: PageDto;
}

export type MutateResponseDto<T> = SuccessResponse<T> | ErrorResponse;

interface SuccessResponse<T> {
  ok: true;
  data: T;
  page?: PageDto;
}

interface ErrorResponse {
  ok: false;
  data: {
    code: string;
    message: string;
  };
}
