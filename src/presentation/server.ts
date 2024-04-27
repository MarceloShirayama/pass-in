import { app } from "@presentation/http/app";
import { SERVER } from "@/_config/settings";

app.listen(SERVER.PORT, () => {
  console.log(`Server is running on port ${SERVER.PORT}`);
});