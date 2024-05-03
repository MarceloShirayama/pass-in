export type HttpServer = {
  listen(port: number, callback?: () => void): void
}