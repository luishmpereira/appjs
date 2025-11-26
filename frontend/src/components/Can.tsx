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
    
    // We might need a way to force re-render or update the context if using it directly,
    // but creating a fresh ability object usually works if components re-render.
    // Ideally, the Ability instance itself should update its rules.
    
    return ability;
}
