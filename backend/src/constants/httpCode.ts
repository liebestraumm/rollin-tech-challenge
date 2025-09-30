enum HttpCode {
	OK = 200,
	CREATED = 201,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500,
	UNPROCESSABLE_ENTITY = 422,
}

// Error code strings for API responses
enum ErrorCode {
	BAD_REQUEST = 'BAD_REQUEST',
	UNAUTHORIZED = 'UNAUTHORIZED',
	FORBIDDEN = 'FORBIDDEN',
	NOT_FOUND = 'NOT_FOUND',
	UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
	INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
	UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Helper function to get error code string from status code
export const getErrorCode = (statusCode: number): string => {
	switch (statusCode) {
		case HttpCode.BAD_REQUEST:
			return ErrorCode.BAD_REQUEST;
		case HttpCode.UNAUTHORIZED:
			return ErrorCode.UNAUTHORIZED;
		case HttpCode.FORBIDDEN:
			return ErrorCode.FORBIDDEN;
		case HttpCode.NOT_FOUND:
			return ErrorCode.NOT_FOUND;
		case HttpCode.UNPROCESSABLE_ENTITY:
			return ErrorCode.UNPROCESSABLE_ENTITY;
		case HttpCode.INTERNAL_SERVER_ERROR:
			return ErrorCode.INTERNAL_SERVER_ERROR;
		default:
			return ErrorCode.UNKNOWN_ERROR;
	}
};

export default HttpCode;
