import { ViewEventUseCase } from "@/application/use-cases";
import { inMemoryEventRepository } from "@/infra/repositories";
import {
  InvalidParamError, NotFoundError
} from "@/shared/error";
import { Router } from "express";

export const getById = Router();

const eventRepository = inMemoryEventRepository;

getById.get("/:id/search", async (req, res, next) => {
  try {
    const id = req.params.id
    if (!id) throw new InvalidParamError("id is required")
    const viewEvent = new ViewEventUseCase(eventRepository);
    const output = await viewEvent.execute({ id });
    if (!output) throw new NotFoundError("event not found")
    res.status(200).send(output);
  } catch (error) {
    next(error)
  }
})