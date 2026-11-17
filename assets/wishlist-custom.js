
document.addEventListener('DOMContentLoaded', () => {

  const STORAGE_KEY = 'wishlist';

  /**
   * @type {number | null}
   */
  let toastTimer = null;

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

  /**
   * Save wishlist to localStorage
   * @param {string[]} wishlist - Array of product handles
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
   * Show wishlist toast notification
   * @param {string} message - Toast notification message
   */
  function showWishlistToast(message) {
    const toast = document.getElementById('wishlist-toast');

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimer !== null) {
      clearTimeout(toastTimer);
    }

    toastTimer = window.setTimeout(() => {
      toast.classList.remove('show');
      toastTimer = null;
    }, 3000);
  }

  /**
   * Update wishlist button appearance
   * @param {HTMLButtonElement} button - Wishlist button element
   * @param {string[]} wishlist - Array of saved product handles
   */
  function updateButton(button, wishlist) {

    const handle = button.dataset.productHandle;

    if (!handle) return;

    const icon = button.querySelector('.wishlist-icon');

    const isWishlisted = wishlist.includes(handle);

    // Update heart icon
    if (icon instanceof HTMLElement) {
      icon.textContent = isWishlisted ? '♥' : '♡';
      icon.style.color = isWishlisted ? 'red' : '';
    }

    // Update accessibility
    button.setAttribute('aria-pressed', String(isWishlisted));

    button.setAttribute(
      'aria-label',
      `${isWishlisted ? 'Remove' : 'Add'} ${handle} ${isWishlisted ? 'from' : 'to'} wishlist`
    );

    // Update button styling
    button.classList.toggle('is-wishlisted', isWishlisted);
  }

  // Update all wishlist buttons and navbar count
  function updateAllButtons() {

    const wishlist = getWishlist();

    // Update product wishlist buttons
    document.querySelectorAll('.wishlist-toggle-btn').forEach(button => {

      if (button instanceof HTMLButtonElement) {
        updateButton(button, wishlist);
      }

    });

    // Update navbar wishlist count
    document.querySelectorAll('.wishlist-nav-count').forEach(count => {

      count.textContent = wishlist.length > 0
        ? String(wishlist.length)
        : '';

    });
  }

  // Initialize wishlist buttons
  updateAllButtons();

  // Event delegation: supports dynamically loaded product cards
  document.addEventListener('click', (event) => {

    if (!(event.target instanceof Element)) return;

    // Find the closest wishlist button
    const button = event.target.closest('.wishlist-toggle-btn');

    if (!(button instanceof HTMLButtonElement)) return;

    // Prevent product card navigation
    event.preventDefault();
    event.stopPropagation();

    const handle = button.dataset.productHandle;

    if (!handle) return;

    let wishlist = getWishlist();

    const isWishlisted = wishlist.includes(handle);

    if (isWishlisted) {

      // Remove product
      wishlist = wishlist.filter(item => item !== handle);

      showWishlistToast('Removed from wishlist!');

    } else {

      // Add product without duplicates
      wishlist.push(handle);

      showWishlistToast('Successfully added to wishlist!');

    }

    // Save updated wishlist
    saveWishlist(wishlist);

    // Update all wishlist buttons
    updateAllButtons();

  });

  // Sync wishlist when localStorage changes in another browser tab
  window.addEventListener('storage', (event) => {

    if (event.key === STORAGE_KEY || event.key === null) {
      updateAllButtons();
    }

  });

});
