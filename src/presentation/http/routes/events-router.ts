import { RegisterEventUseCase, ViewEventUseCase } from "@/application/use-cases";
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
      return res.status(error.statusCode).send({ error: error.message })
    }
    console.log(error);
    const errorServer = new InternalServerError()
    res.status(errorServer.statusCode).send({ error: errorServer.message })
  }
});

eventsRouter.get("/:id/search", async (req, res) => {
  try {
    const id = req.params.id
    if (!id) throw new InvalidParamError("id is required")
    const viewEvent = new ViewEventUseCase(eventRepository);
    const output = await viewEvent.execute({ id });
    if (!output) throw new NotFoundError("event not found")
    res.status(200).send(output);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof InvalidParamError) {
      return res.status(error.statusCode).send({ error: error.message })
    }
    console.log(error);
    const errorServer = new InternalServerError()
    res.status(errorServer.statusCode).send({ error: errorServer.message })
  }
})

eventsRouter.get("/search", async (req, res) => {
  try {
    const title = req.query.title
    if (!title) throw new InvalidParamError("title is required")
    const viewEvent = new ViewEventUseCase(eventRepository);
    const output = await viewEvent.execute({ title });
    if (!output) throw new NotFoundError("event not found")
    res.status(200).send(output);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof InvalidParamError) {
      return res.status(error.statusCode).send({ error: error.message })
    }
    console.log(error);
    const errorServer = new InternalServerError()
    res.status(errorServer.statusCode).send({ error: errorServer.message })
  }
})