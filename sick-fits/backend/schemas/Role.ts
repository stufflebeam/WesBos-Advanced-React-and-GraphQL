import { relationship, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { permissions } from '../access';
import { permissionFields } from './fields';

export const Role = list({
    access: {
        create: permissions.canManageRoles,
        // Do we need to add this, so that the user can view their own account info?  || rules.canManageUsers,
        // Updated to return tru for now, as having it set to permissions.canManageRoles was breaking a user's
        // ability to view their own account info.
        // TODO: Figure out if this is a reasonable access control or if we need to lock things down more.
        read: () => true, // permissions.canManageRoles,
        update: permissions.canManageRoles,
        delete: permissions.canManageRoles,
    },
    ui: {
        listView: {
            initialColumns: ['name', 'assignedTo'],
        },
        hideCreate: (args) => !permissions.canManageRoles(args),
        hideDelete: (args) => !permissions.canManageRoles(args),
        isHidden: (args) => !permissions.canManageRoles(args),
    },
    fields: {
        name: text({ isRequired: true }),
        ...permissionFields,
        assignedTo: relationship({
            ref: 'User.role',
            many: true,
            ui: {
                itemView: { fieldMode: 'read' },
            },
        }),
    },
    // access: {
    //     read: true,
    //     update: true,
    //     create: true,
    //     delete: true,
    // },
});
