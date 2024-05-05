import { RegisterEventUseCase } from "@/application/use-cases";
import { inMemoryEventRepository } from "@/infra/repositories";
import { Router } from "express";

export const register = Router();

const eventRepository = inMemoryEventRepository;

register.post("/register", async (req, res, next) => {
  try {
    const registerEvent = new RegisterEventUseCase(eventRepository);
    const output = await registerEvent.execute(req.body);
    res.status(201).send(output);
  } catch (error) {
    next(error)
  }
});