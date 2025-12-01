import { User } from "../lib/prisma/client";
import { MongoAbility } from "@casl/ability";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      ability?: MongoAbility;
    }
  }
}

export { };
