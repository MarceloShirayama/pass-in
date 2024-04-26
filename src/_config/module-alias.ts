import { join } from "path";
import { addAlias } from "module-alias";

addAlias("@", join(__dirname, ".."));
addAlias("@domain", join(__dirname, "..", "domain"));
addAlias("@application", join(__dirname, "..", "application"));
addAlias("@infra", join(__dirname, "..", "infra"));
addAlias("@presentation", join(__dirname, "..", "presentation"));
addAlias("@shared", join(__dirname, "..", "shared"))