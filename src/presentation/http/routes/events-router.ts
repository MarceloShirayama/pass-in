import { RegisterEventUseCase } from "@/application/use-cases";
import { inMemoryEventRepository } from "@/infra/repositories";
import {
  InternalServerError, InvalidParamError, NotFoundError
} from "@/shared/error";
import { Router } from "express";

export const eventsRouter = Router();

const eventRepository = inMemoryEventRepository;

eventsRouter.post("/register", async (req, res) => {
  try {
    const registerEvent = new RegisterEventUseCase(eventRepository);
    const output = await registerEvent.execute(req.body);
    res.status(201).send(output);
  } catch (error) {
    if (
      error instanceof InvalidParamError
    ) {
      res.status(error.statusCode).send({ error: error.message })
      return
    }
    console.log(error);
    const errorServer = new InternalServerError()
    res.status(errorServer.statusCode).send({ error: errorServer.message })
  }
});