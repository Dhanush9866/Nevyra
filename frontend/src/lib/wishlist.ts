// Wishlist utility for localStorage

const WISHLIST_KEY = "wishlist";

function dispatchWishlistUpdated() {
  window.dispatchEvent(new Event("wishlistUpdated"));
}

export function getWishlist(): string[] {
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setWishlist(ids: string[]) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  dispatchWishlistUpdated();
}

export function addToWishlist(id: string) {
  const wishlist = getWishlist();
  if (!wishlist.includes(id)) {
    wishlist.push(id);
    setWishlist(wishlist);
  }
}

export function removeFromWishlist(id: string) {
  const wishlist = getWishlist().filter((itemId) => itemId !== id);
  setWishlist(wishlist);
}

export function isWishlisted(id: string): boolean {
  return getWishlist().includes(id);
}
