import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

export default async function addToCart(
    root: any,
    { productId }: { productId: string },
    context: KeystoneContext
): Promise<CartItemCreateInput> {
    // console.log('[addToCart] Adding to cart... productId:', productId);
    // 1. Query the current user to see if they are signed in
    const sesh = context.session as Session;
    // console.log('[addToCart] sesh:', sesh);
    if (!sesh.itemId) {
        throw new Error('You must be signed in to add items to your cart.');
    }
    // 2. Query the current user's cart
    const allCartItems = await context.lists.CartItem.findMany({
        where: { user: { id: sesh.itemId }, product: { id: productId } },
        resolveFields: 'id, quantity',
    });

    // 3. Determine if the item being added is already in the user's cart
    const [existingCartItem] = allCartItems;
    // console.log('[addToCart] existingCartItem:', existingCartItem);
    if (existingCartItem) {
        // console.log(
        //     `[addToCart] There are already ${existingCartItem.quantity} of this item in the user's cart... Increment by 1...`,
        //     existingCartItem
        // );
        // 4. If it is, update the quantity
        await context.lists.CartItem.updateOne({
            // where: { id: existingCartItem.id },
            id: existingCartItem.id,
            data: { quantity: existingCartItem.quantity + 1 },
        });
        return existingCartItem;
    }
    // console.log(
    //     "[addToCart] This item is not in the user's cart... Create a new cart item...",
    //     productId
    // );
    // 5. If it is not, create a new cart item
    return await context.lists.CartItem.createOne({
        data: {
            product: { connect: { id: productId } },
            user: { connect: { id: sesh.itemId } },
            quantity: 1,
        },
    });
}
