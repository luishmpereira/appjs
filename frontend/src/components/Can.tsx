import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { getCurrentAbility } from '@/lib/ability';

export const AbilityContext = createContext(getCurrentAbility());
export const Can = createContextualCan(AbilityContext.Consumer);

// Hook to update ability when user changes
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

export const useAbility = () => {
    const user = useAuthStore((state) => state.user);
    const ability = getCurrentAbility();
    
    useEffect(() => {
        const role = user?.role;
        const permissions = (typeof role === 'object' && role !== null) ? role.permissions || [] : [];
        ability.update(permissions);
    }, [user, ability]);
    
    return ability;
}
