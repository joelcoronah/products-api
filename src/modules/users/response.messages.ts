/**
 * ERROS MESSAGES
 */
export const TYPE_NOT_AVAILABLE = {
  message: {
    statusCode: 'TYPE_NOT_AVAILABLE',
    message: 'User type not available',
  },
  status: 400,
};

export const USER_ALREADY_EXIST = {
  message: {
    statusCode: 'USER_ALREADY_EXIST',
    message: 'User already exist',
  },
  status: 400,
};

export const INTERNAL_SERVER_ERROR = (errorMessage: string) => ({
  message: {
    statusCode: 'INTERNAL_SERVER_ERROR',
    message: errorMessage,
  },
  status: 500,
});

export const NOT_FOUND = {
  message: {
    statusCode: 'NOT_FOUND',
    message: 'User not found',
  },
  status: 400,
};
