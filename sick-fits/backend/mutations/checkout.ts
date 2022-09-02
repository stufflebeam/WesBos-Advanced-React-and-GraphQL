/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import {
    CartItemCreateInput,
    OrderCreateInput,
} from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';

// This is a fake graphql tagged template literal
// Its purpose is to allow us to use the same syntax highlighting as using gql gives us
const graphql = String.raw;

// This is a different way to declare the function arguments
// instead of putting the following into the function signature:
// { token: string }
interface Arguments {
    token: string;
}

export default async function checkout(
    root: any,
    { token }: Arguments,
    context: KeystoneContext
): Promise<OrderCreateInput> {
    // 1. Query the current user and see if they are signed in
    const sesh = context.session as Session;
    const userId = sesh.itemId;
    if (!userId) {
        throw new Error('Sorry! You must be signed in to create an order!');
    }
    // 1.5 Query the current user
    const user = await context.lists.User.findOne({
        where: { id: userId },
        resolveFields: graphql`
            id
            name
            email
            cart {
                id
                quantity
                product {
                    name
                    price
                    description
                    id
                    photo {
                        id
                        altText
                        image {
                            id
                            publicUrlTransformed
                        }
                    }
                }
            }
        `,
    });
    // console.dir(user, { depth: null });

    // 2. Query the current user's cart
    // const allCartItems = await context.lists.CartItem.findMany({
    //     where: { user: { id: userId }, product: { id: productId } },
    //     resolveFields: 'id,quantity',
    // });
    // console.dir(allCartItems);
    // 3. Calculate the total price for their order
    // Filter to remove any cart items that have been deleted
    const cartItems = user.cart.filter((cartItem) => cartItem.product);
    // console.log('[checkout] cartItems: ', cartItems);
    const amount = cartItems.reduce(function (
        tally: number,
        cartItem: CartItemCreateInput
    ) {
        // console.log('[checkout] current tally: ', tally);
        return tally + cartItem.quantity * cartItem.product.price;
    },
        0);
    console.log('[checkout] order total: ', amount);

    // 4. Create the charge with the stripe library
    const charge = await stripeConfig.paymentIntents.create({
        amount,
        currency: 'USD',
        confirm: true,
        payment_method: token,
    }).catch((err) => {
        console.error(err);
        throw new Error(err.message);
    });

    // 5. Convert the CartItems to OrderItems
    // 6. Create the order and return it
}
