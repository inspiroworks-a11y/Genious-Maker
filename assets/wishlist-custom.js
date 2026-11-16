
document.addEventListener('DOMContentLoaded', () => {

  const STORAGE_KEY = 'wishlist';

  // Get wishlist from localStorage safely
  function getWishlist() {
  try {
    const savedWishlist = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    );

    return Array.isArray(savedWishlist) ? savedWishlist : [];

  } catch (error) {
    console.error('Error reading wishlist:', error);
    return [];
  }
}

  // Save wishlist
  /**
 * Save wishlist to localStorage
 * @param {string[]} wishlist // describing type explecitly.....
 */
function saveWishlist(wishlist) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(wishlist)
    );
  } catch (error) {
    console.error('Error saving wishlist:', error);
  }
}

/**
 * Update wishlist button appearance
 * @param {HTMLButtonElement} button - Wishlist button element
 * @param {string[]} wishlist - Array of saved product handles
 */

  // Update wishlist button appearance
  function updateButton(button, wishlist) {

    const handle = button.dataset.productHandle;

    if (!handle) return;

    const icon = button.querySelector('.wishlist-icon');
    const text = button.querySelector('.wishlist-text');

    const isWishlisted = wishlist.includes(handle);

    // Update icon
    if (icon instanceof HTMLElement) {
    icon.textContent = isWishlisted ? '♥' : '♡';
    icon.style.color = isWishlisted ? 'red' : '';
  }

    // Update button text
    if (text instanceof HTMLElement) {
      text.textContent = isWishlisted
        ? 'Remove from Wishlist'
        : 'Add to Wishlist';
    }

    // Accessibility
    button.setAttribute('aria-pressed', String(isWishlisted));
    button.classList.toggle('is-wishlisted', isWishlisted);
  }

  
// Update all wishlist buttons on the page
function updateAllButtons() {

  const wishlist = getWishlist();

  document.querySelectorAll('.wishlist-toggle-btn').forEach(button => {

    if (button instanceof HTMLButtonElement) {
      updateButton(button, wishlist);
    }

  });
}


  // Initialize wishlist buttons
  updateAllButtons();

  // Event delegation: supports dynamically loaded product cards
  
document.addEventListener('click', (event) => {

  // Check whether the event target is an HTML element
  if (!(event.target instanceof Element)) return;

  // Find the closest wishlist button
  const button = event.target.closest('.wishlist-toggle-btn');

  // Verify that the selected element is a button
  if (!(button instanceof HTMLButtonElement)) return;

  const handle = button.dataset.productHandle;

  if (!handle) return;

  let wishlist = getWishlist();

  if (wishlist.includes(handle)) {

    // Remove product
    wishlist = wishlist.filter(item => item !== handle);

  } else {

    // Add product without duplicates
    wishlist.push(handle);

  }

  // Save updated wishlist
  saveWishlist(wishlist);

  // Update all wishlist buttons
  updateAllButtons();

});


  // Sync wishlist when localStorage changes in another browser tab
  window.addEventListener('storage', (event) => {

    if (event.key === STORAGE_KEY) {
      updateAllButtons();
    }

  });

});
