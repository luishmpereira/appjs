import { users as User } from "../lib/prisma";
import { MongoAbility } from "@casl/ability";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      ability?: MongoAbility;
    }
  }
}

export {};
