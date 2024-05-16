import { ExpressAdapter } from "@/presentation/http/express-adapter";
import { SERVER } from "@/_config/settings";
import { logMessage } from "@/shared/utils";
import { RepositoriesFactory } from "@infra/factories";

const repositories = RepositoriesFactory.database
const app = new ExpressAdapter(repositories);

app.listen(SERVER.PORT, () => {
  logMessage(`Server running on port ${SERVER.PORT}`, "INFO")
})