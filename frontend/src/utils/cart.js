// export const getCart = () => {
//   return JSON.parse(localStorage.getItem("cart")) || [];
// };

// export const saveCart = (cart) => {
//   localStorage.setItem("cart", JSON.stringify(cart));
// };

// export const addToCart = (product) => {
//   let cart = getCart();

//   const existing = cart.find((item) => item.product.id === product.id);

//   if (existing) {
//     cart = cart.map((item) =>
//       item.product.id === product.id
//         ? { ...item, quantity: item.quantity + 1 }
//         : item
//     );
//   } else {
//     cart.push({ product, quantity: 1 });
//   }

//   saveCart(cart);
// };

// export const removeFromCart = (id) => {
//   let cart = getCart();
//   cart = cart.filter((item) => item.product.id !== id);
//   saveCart(cart);
// };

// export const updateQuantity = (id, type) => {
//   let cart = getCart();

//   cart = cart.map((item) => {
//     if (item.product.id === id) {
//       return {
//         ...item,
//         quantity:
//           type === "inc"
//             ? item.quantity + 1
//             : Math.max(item.quantity - 1, 1)
//       };
//     }
//     return item;
//   });

//   saveCart(cart);
// };




export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// ---------------- ADD TO CART ----------------
export const addToCart = (product) => {
  let cart = getCart();

  const productId = product._id || product.id;

  const existing = cart.find(
    (item) => (item.product._id || item.product.id) === productId
  );

  if (existing) {
    cart = cart.map((item) =>
      (item.product._id || item.product.id) === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    cart.push({
      product: {
        ...product,
        _id: product._id || product.id, // normalize ID
      },
      quantity: 1,
    });
  }

  saveCart(cart);
};

// ---------------- REMOVE ----------------
export const removeFromCart = (id) => {
  let cart = getCart();

  cart = cart.filter(
    (item) => (item.product._id || item.product.id) !== id
  );

  saveCart(cart);
};

// ---------------- UPDATE QTY ----------------
export const updateQuantity = (id, type) => {
  let cart = getCart();

  cart = cart.map((item) => {
    const productId = item.product._id || item.product.id;

    if (productId === id) {
      return {
        ...item,
        quantity:
          type === "inc"
            ? item.quantity + 1
            : Math.max(item.quantity - 1, 1),
      };
    }

    return item;
  });

  saveCart(cart);
};