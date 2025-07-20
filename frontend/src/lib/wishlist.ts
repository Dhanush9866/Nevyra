// Wishlist utility for localStorage

const WISHLIST_KEY = "wishlist";

function dispatchWishlistUpdated() {
  window.dispatchEvent(new Event("wishlistUpdated"));
}

export function getWishlist(): number[] {
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setWishlist(ids: number[]) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  dispatchWishlistUpdated();
}

export function addToWishlist(id: number) {
  const wishlist = getWishlist();
  if (!wishlist.includes(id)) {
    wishlist.push(id);
    setWishlist(wishlist);
  }
}

export function removeFromWishlist(id: number) {
  const wishlist = getWishlist().filter((itemId) => itemId !== id);
  setWishlist(wishlist);
}

export function isWishlisted(id: number): boolean {
  return getWishlist().includes(id);
} 