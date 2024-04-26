import express from "express";

import { SERVER } from "@/_config/settings";
import { RegisterEventUseCase } from "@application/use-cases";
import { inMemoryEventRepository } from "@infra/repositories";
import {
  InternalServerError, InvalidParamError, NotFoundError
} from "@/shared/error";

const app = express();
const PORT = SERVER.PORT;
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const eventRepository = inMemoryEventRepository;
    const registerEvent = new RegisterEventUseCase(eventRepository);
    const output = await registerEvent.execute(req.body);
    res.status(201).send(output);
  } catch (error) {
    if (
      error instanceof InvalidParamError ||
      error instanceof NotFoundError
    ) {
      res.status(error.statusCode).send({ error: error.message })
      return
    }
    console.log(error);
    const errorServer = new InternalServerError()
    res.status(errorServer.statusCode).send({ error: errorServer.message })
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
