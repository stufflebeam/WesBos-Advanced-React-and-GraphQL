import { createContext, useContext, useState } from 'react';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // This is our own custom provider
  // We will store data (state) and functionality (updaters) here
  // and anyone can access this data and the updaters via the consumer
  //   const cartOpen = true;
  const [cartOpen, setCartOpen] = useState(true);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function openCart() {
    setCartOpen(true);
  }

  function closeCart() {
    setCartOpen(false);
  }

  return (
    <LocalStateProvider
      value={{ cartOpen, setCartOpen, toggleCart, openCart, closeCart }}
    >
      {children}
    </LocalStateProvider>
  );
}

// This is a custom hook for accessing the data in our provider (the cart local state)
function useCart() {
  // we use a consumer here, to access the local state
  const all = useContext(LocalStateContext);
  return all;
}

export { CartStateProvider, LocalStateContext, useCart };
