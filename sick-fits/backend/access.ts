// At its simplest, the access control returns a 'yes' or a 'no' depending on the user's session data.
/* eslint-disable */
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
            // console.log('[access] checking permission', permission);
            // console.log('[access] session', session);
            // console.dir(session, { depth: null });
            // console.log('[access] session?.data.role', session?.data.role);
            // console.log('[access] session?.data.role?.[permission]', session?.data.role?.[permission]);
            // console.log('[access] !!session?.data.role?.[permission]', !!session?.data.role?.[permission]);
            // console.log('[access] !!session?.data.role[permission]', !!session?.data.role[permission]);
            // console.log('[access] !!session?.data.role?.canManageProducts', !!session?.data.role?.canManageProducts);
            // console.log('[access] !!session?.data.role?.[0].canManageProducts', !!session?.data.role?.[0].canManageProducts);
            // return !!session?.data.role?.[permission];
            return !!session?.data.role?.[0]?.[permission];
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

// Rule-based functions (Logical functions that control list access)
// Rules can return a boolean - yes or no - or a filter which limits which list items the user can CRUD.

export const rules = {
    canManageProducts({ session }: ListAccessArgs) {
        // Are they signed in?
        if (!isSignedIn({ session })) {
            return false;
        }
        // 1. Do they have the 'manage products' permission?
        // console.log(
        //     '[access] permissions.canManageProducts({ session }): ',
        //     permissions.canManageProducts({ session })
        // );
        if (permissions.canManageProducts({ session })) {
            return true;
        }
        // 2. If not, do they own this item?
        return { user: { id: session.itemId } };
    },
    canReadProducts({ session }: ListAccessArgs) {
        // Are they signed in?
        if (!isSignedIn({ session })) {
            return false;
        }
        // 1. Do they have the 'manage products' permission?
        if (permissions.canManageProducts({ session })) {
            return true; // They can read everything!
        }

        // 2. Otherwise, they should only see 'Available' products (based on the 'status' field)
        return { status: 'AVAILABLE' };
    },
};
