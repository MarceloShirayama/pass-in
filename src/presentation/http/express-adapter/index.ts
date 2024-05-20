import express, { Express } from "express";

import { Repositories } from "@application/repositories";
import {
  handleErrorsMiddleware, routeNotFoundMiddleware
} from "@presentation/http/express-adapter/middlewares";
import {
  attendeesRouter, eventsRouter, usersRouter
} from "@presentation/http/express-adapter/routes";
import { HttpServer } from "../http-server";

export class ExpressAdapter implements HttpServer {
  #application: Express

  constructor(
    private readonly repositories: Repositories
  ) {
    this.#application = express()
    this.#setupServerHeaders()
    this.#setupRoutes()
    this.#setupErrorHandler()
  }

  #setupServerHeaders() {
    this.#application.use(express.json())
    this.#application.disable('x-powered-by')
  }

  #setupErrorHandler() {
    routeNotFoundMiddleware(this.#application)
    handleErrorsMiddleware(this.#application)
  }

  #setupRoutes() {
    for (const route in eventsRouter) {
      this.#application.use(
        '/events',
        eventsRouter[route as keyof typeof eventsRouter](this.repositories)
      )
    }
    for (const route in attendeesRouter) {
      this.#application.use(
        '/attendees',
        attendeesRouter[route as keyof typeof attendeesRouter](this.repositories)
      )
    }
    for (const route in usersRouter) {
      this.#application.use(
        '/users',
        usersRouter[route as keyof typeof usersRouter](this.repositories)
      )
    }
  }

  listen(port: number, callback: () => void): void {
    this.#application.listen(port, callback)
  }

  get application(): Express {
    return this.#application
  }
}
