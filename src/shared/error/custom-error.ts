export abstract class CustomError extends Error {
  abstract statusCode: number
}