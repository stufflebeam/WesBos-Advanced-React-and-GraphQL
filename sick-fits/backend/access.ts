// At its simplest, the access control returns a 'yes' or a 'no' depending on the user's session data.

import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs) {
    // return !!session?.data; // Is this preferable?
    return !!session;
}
