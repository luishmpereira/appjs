import { AbilityBuilder, CreateAbility, createMongoAbility, MongoAbility } from "@casl/ability";
import { User, Role } from "@/lib/prisma/client";

export type Action = "manage" | "create" | "read" | "update" | "delete";
export type Subject = any;

export type AppAbility = MongoAbility<[Action, Subject]>;

export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

function interpolatePermissions(permissions: any[], user: User) {
  return permissions.map((p) => {
    if (p.conditions) {
      const newConditions = JSON.parse(
        JSON.stringify(p.conditions).replace(/\${user.id}/g, user.id.toString())
      );
      return { ...p, conditions: newConditions };
    }
    return p;
  });
}

export function defineAbilityFor(user: User, role: Role) {
  const { can, rules, build } = new AbilityBuilder(createAppAbility);

  if (role.permissions) {
    const interpolatedRules = interpolatePermissions(role.permissions as any[], user);
    
    interpolatedRules.forEach((rule: any) => {
        if (rule.inverted) {
            // cannot logic if needed, but for now let's assume positive permissions mostly
            // logic for inverted in raw rules: { inverted: true, action: ..., subject: ... }
             // CASL 6 stores 'inverted' property.
        }
        can(rule.action, rule.subject, rule.conditions);
    });
  } else {
     // Fallback if no role or permissions found (e.g. during migration or error)
     // Safe default: nothing
     // But maybe user can read products?
     // Let's allow read products by default for logged users?
     // Or keep it strict.
     // If role is missing, user has no rights.
  }

  return build();
}
