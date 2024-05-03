import express, { Express } from "express";

import { handleErrorsMiddleware, routeNotFoundMiddleware } from "@presentation/http/express-adapter/middlewares";
import { eventsRouter } from "@presentation/http/express-adapter/routes";
import { HttpServer } from "../http-server";

export class ExpressAdapter implements HttpServer {
  #application: Express

  constructor() {
    this.#application = express()
    this.#setupServerHeaders()
    this.#setupRoutes()
    this.#setupErrorHandlingMiddleware()
  }

  #setupServerHeaders() {
    this.#application.use(express.json())
    this.#application.disable('x-powered-by')
  }

  #setupErrorHandlingMiddleware() {
    routeNotFoundMiddleware(this.#application)
    handleErrorsMiddleware(this.#application)
  }

  #setupRoutes() {
    this.#application.use('/events', eventsRouter)
  }


  listen(port: number, callback: () => void): void {
    this.#application.listen(port, callback)
  }

  get application(): Express {
    return this.#application
  }
}
