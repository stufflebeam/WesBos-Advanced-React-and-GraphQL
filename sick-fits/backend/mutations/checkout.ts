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

    console.log('[checkout] charge: ', charge);
    // 5. Convert the CartItems to OrderItems

    const orderItems = cartItems.map(cartItem => {
        const orderItem = {
            name: cartItem.product.name,
            description: cartItem.product.description,
            price: cartItem.product.price,
            quantity: cartItem.quantity,
            // TODO: Determine whether this is sufficient. What if the product photo is deleted? What if it changes?
            photo: { connect: { id: cartItem.product.photo.id } },
        }
        return orderItem;
    });

    // 6. Create the order and return it

    // TODO: I noticed that in the backend Keystone UI, order items are able to be deleted from an oder.
    //       I am not sure that that should be possible (in an ideal setup). It seems like an admin should
    //       be able to delete items from a user's cart, but not from an order. The order list should be
    //       immutable, as it is a historical record of what was purchased. I am not sure how to prevent
    //       orders from being edited or deleted in the backend Keystone UI though. So, I need to research
    //       that and try to come up with a plan.
    const order = await context.lists.Order.createOne({
        data: {
            // Pulling the amount off of the charge object to ensure that the amount lines up with what was
            // actually charged to the user's credit card. This is a good practice to follow, as the amount
            // should, in theory, be the same as the amount variable, but, just in case something screwy 
            // happens, it's better to be safe than sorry and make sure that our data matches Stripe's
            // records (and the user's credit card statement) exactly.
            total: charge.amount,
            charge: charge.id,
            items: { create: orderItems },
            user: { connect: { id: userId } },
        },
        resolveFields: false,
    });

    // 7. Clean up any old cart items
    const cartItemIds = cartItems.map(cartItem => cartItem.id);
    await context.lists.CartItem.deleteMany({
        ids: cartItemIds,
    });

    return order;
}
