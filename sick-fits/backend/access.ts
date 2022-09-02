// At its simplest, the access control returns a 'yes' or a 'no' depending on the user's session data.

import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs) {
    // return !!session?.data; // Is this preferable?
    return !!session;
}

const generatedPermissions = Object.fromEntries(
    permissionsList.map((permission) => [
        permission,
        function ({ session }: ListAccessArgs) {
            return !!session?.data?.role?.[permission];
        },
    ])
);

// Permissions check if someone meets a criteria -- yes or no.
export const permissions = {
    ...generatedPermissions,
    // Can add more custom permissions here as well. For example, could set a super admin role up here,
    // to grant a particular user (or users) access to everything via a custom access control function that checks
    // the user's id against a list of super admin ids. This would be a good way to grant super admin access to a
    // user without having the setting be editable in the admin UI.
    isSuperAdmin({ session }: ListAccessArgs) {
        const superAdmins = process.env.SICKFITS_SUPER_ADMINS?.split(',');
        return superAdmins.includes(session?.data?.id);
    },
};

// TODO: Add rule-based functions
