export default function calcTotalPrice(cart) {
  //   console.log('[calcTotalPrice] cart', cart);
  if (!cart) return 0;
  return cart.reduce((tally, cartItem) => {
    // We run the following check because it is possible for an item to
    // be deleted while it is still in a user's cart.
    if (!cartItem.product) return tally;
    return tally + cartItem.product.price * cartItem.quantity;
  }, 0);
}
