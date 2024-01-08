export const createError = (status: number, message: string): Error & { status?: number } => {
  const err: Error & { status?: number } = new Error();
  err.status = status;
  err.message = message;
  return err;
};
