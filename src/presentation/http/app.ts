import express from "express";

import { eventsRouter } from "@presentation/http/routes";

export const app = express();

app.use(express.json());
app.use('/events', eventsRouter)
