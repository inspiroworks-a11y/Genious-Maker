
document.addEventListener('DOMContentLoaded', function () {

  // Handle popup interactions
  document.addEventListener('click', function (event) {

    // Make sure the click target is an HTML element
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    // =====================================
    // OPEN QUOTE POPUP
    // =====================================

    const openButton = target.closest('[data-quote-open]');

    if (openButton) {

      const quotesContainer = openButton.closest('[data-quotes]');

      if (!quotesContainer) {
        return;
      }

      const modal = quotesContainer.querySelector('[data-quote-modal]');

      // Ensure the selected element is a dialog
      if (!(modal instanceof HTMLDialogElement)) {
        return;
      }

      if (!modal.open) {

        modal.showModal();

        // Focus the first input field
        const firstInput = modal.querySelector(
          'input:not([type="hidden"]), textarea'
        );

        if (firstInput instanceof HTMLElement) {
          firstInput.focus();
        }
      }

      return;
    }

    // =====================================
    // CLOSE QUOTE POPUP
    // =====================================

    const closeButton = target.closest('[data-quote-close]');

    if (closeButton) {

      const modal = closeButton.closest('[data-quote-modal]');

      // Ensure the selected element is a dialog
      if (
        modal instanceof HTMLDialogElement &&
        modal.open
      ) {
        modal.close();
      }

      return;
    }

    // =====================================
    // CLOSE WHEN CLICKING OUTSIDE CONTENT
    // =====================================

    if (
      target instanceof HTMLDialogElement &&
      target.matches('[data-quote-modal]')
    ) {

      const modal = target;
      const rect = modal.getBoundingClientRect();

      const clickedInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!clickedInside && modal.open) {
        modal.close();
      }
    }

  });


  // =====================================
  // REOPEN POPUP AFTER FORM SUBMISSION
  // =====================================

  const modals = document.querySelectorAll('[data-quote-modal]');

  modals.forEach(function (modal) {

    // Ensure the selected element is a dialog
    if (!(modal instanceof HTMLDialogElement)) {
      return;
    }

    const formState = modal.querySelector(
      '[data-quote-form-state]'
    );

    // Ensure the form state is an HTML element
    if (!(formState instanceof HTMLElement)) {
      return;
    }

    // Read data attributes without using dataset
    const isSuccessful =
      formState.getAttribute('data-success') === 'true';

    const hasErrors =
      formState.getAttribute('data-has-errors') === 'true';

    // Reopen popup after successful submission or validation errors
    if ((isSuccessful || hasErrors) && !modal.open) {
      modal.showModal();
    }

  });

});
