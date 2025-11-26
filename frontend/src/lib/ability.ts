import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { useAuthStore } from "@/store/authStore";

export const defineAbilitiesFor = (user: any) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (!user) {
    return build();
  }

  const roles = Array.isArray(user.role) ? user.role : [user.role];
  
  // Flatten permissions from all roles (assuming backend sends expanded permissions)
  // Since the current User interface only has `role: string` (and possibly backend returns role object),
  // we need to adapt based on actual API response.
  // IF backend sends `user.role` as object with permissions:
  /*
    user.roles.forEach((role: any) => {
       if (role.name === 'admin') {
          can('manage', 'all');
       } else {
          role.permissions.forEach((permission: any) => {
            // interpolate conditions if needed
             const conditions = permission.conditions 
                ? JSON.parse(JSON.stringify(permission.conditions).replace('${user.id}', user.id)) 
                : undefined;
             can(permission.action, permission.subject, conditions);
          });
       }
    });
  */

  // Fallback for simple string role 'admin' until we fully integrate dynamic permissions
  if (roles.some((r: any) => r === "admin" || r?.name === "admin")) {
    can("manage", "all");
  } else {
    can("read", "User", { id: user.id });
    // Add more default rules or parse from user object
  }

  return build();
};

export const getCurrentAbility = () => {
  const user = useAuthStore.getState().user;
  return defineAbilitiesFor(user);
};
