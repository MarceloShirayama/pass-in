import { ViewEventUseCase } from "@/application/use-cases";
import { inMemoryEventRepository } from "@/infra/repositories";
import {
  InvalidParamError, NotFoundError
} from "@/shared/error";
import { Router } from "express";

export const getByTitle = Router();

const eventRepository = inMemoryEventRepository;

getByTitle.get("/search", async (req, res, next) => {
  try {
    const title = req.query.title
    if (!title) throw new InvalidParamError("title is required")
    const viewEvent = new ViewEventUseCase(eventRepository);
    const output = await viewEvent.execute({ title });
    if (!output) throw new NotFoundError("event not found")
    res.status(200).send(output);
  } catch (error) {
    next(error)
  }
})