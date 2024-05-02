import express from "express";

import { handleErrorsMiddleware, routeNotFoundMiddleware } from "@presentation/http/middlewares";
import { eventsRouter } from "@presentation/http/routes";

export const app = express();

app.use(express.json());
app.disable('x-powered-by')
app.use('/events', eventsRouter)
routeNotFoundMiddleware(app)
handleErrorsMiddleware(app)

