import express from "express";

import { SERVER } from "@/_config/settings";
import { eventsRouter } from "@presentation/http/routes";

export const app = express();
const PORT = SERVER.PORT;
app.use(express.json());
app.use('/events', eventsRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
