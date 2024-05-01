import { app } from "@presentation/http/app";
import { SERVER } from "@/_config/settings";
import { logMessage } from "@/shared/utils";

app.listen(SERVER.PORT, () => {
  logMessage(`Server is running on port ${SERVER.PORT}`, "INFO")
});