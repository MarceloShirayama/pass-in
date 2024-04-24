import express from "express";

import { SERVER } from "@/_config/settings";

const app = express();
const PORT = SERVER.PORT;

app.get("/", (_, res) => {
  res.send({
    "message": "app is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
