const CART_KEY = "cart";

function dispatchCartUpdated() {
  window.dispatchEvent(new Event("cartUpdated"));
}

export function getCart(): { id: string; quantity: number }[] {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setCart(items: { id: string; quantity: number }[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  dispatchCartUpdated();
}

export function addToCart(id: string, quantity: number = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id, quantity });
  }
  setCart(cart);
}

export function removeFromCart(id: string) {
  const cart = getCart().filter((item) => item.id !== id);
  setCart(cart);
}

export function updateCartQuantity(id: string, quantity: number) {
  const cart = getCart();
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      return removeFromCart(id);
    }
    setCart(cart);
  }
}
