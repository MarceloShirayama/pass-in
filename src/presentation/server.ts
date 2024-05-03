import { ExpressAdapter } from "@/presentation/http/express-adapter";
import { SERVER } from "@/_config/settings";
import { logMessage } from "@/shared/utils";

const app = new ExpressAdapter();

app.listen(SERVER.PORT, () => {
  logMessage(`Server running on port ${SERVER.PORT}`, "INFO")
})