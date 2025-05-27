import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
    
    // Calculate totals
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const price = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setTotalItems(itemCount);
    setTotalPrice(price);
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        i => i.id === item.id && i.tenant_id === item.tenant_id
      );

      if (existingItemIndex >= 0) {
        // Item exists, increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // Item doesn't exist, add new item with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId, tenantId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => !(item.id === itemId && item.tenant_id === tenantId))
    );
    
    // If cart is empty after removal, clear localStorage
    if (cartItems.length === 1) {
      localStorage.removeItem('cart');
    }
  };

  // Update item quantity
  const updateQuantity = (itemId, tenantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId, tenantId);
      return;
    }

    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId && item.tenant_id === tenantId) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  // Group items by tenant
  const getItemsByTenant = () => {
    const groupedItems = {};
    
    cartItems.forEach(item => {
      if (!groupedItems[item.tenant_id]) {
        groupedItems[item.tenant_id] = {
          tenant_name: item.tenant_name,
          items: []
        };
      }
      
      groupedItems[item.tenant_id].items.push(item);
    });
    
    return groupedItems;
  };

  const value = {
    cartItems,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    getItemsByTenant
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext; 