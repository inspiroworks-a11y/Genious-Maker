function initializeQuotes() {
  if (document.documentElement.dataset.quotesInitialized === 'true') {
    reopenSubmittedQuoteModals();
    return;
  }

  document.documentElement.dataset.quotesInitialized = 'true';

  document.addEventListener('click', function (event) {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const openButton = target.closest('[data-quote-open]');

    if (openButton) {
      const quotesContainer = openButton.closest('[data-quotes]');
      if (!quotesContainer) return;

      const modal = quotesContainer.querySelector('[data-quote-modal]');
      if (!(modal instanceof HTMLDialogElement)) {
        return;
      }

      if (!modal.open) {
        modal.showModal();
        const firstInput = modal.querySelector(
          'input:not([type="hidden"]), textarea'
        );
        if (firstInput instanceof HTMLElement) {
          firstInput.focus();
        }
      }

      return;
    }

    const closeButton = target.closest('[data-quote-close]');
    if (closeButton) {
      const modal = closeButton.closest('[data-quote-modal]');
      if (
        modal instanceof HTMLDialogElement &&
        modal.open
      ) {
        modal.close();
      }

      return;
    }

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

  reopenSubmittedQuoteModals();
}

function reopenSubmittedQuoteModals() {
  const modals = document.querySelectorAll('[data-quote-modal]');

  modals.forEach(function (modal) {
    if (!(modal instanceof HTMLDialogElement)) {
      return;
    }

    const formState = modal.querySelector(
      '[data-quote-form-state]'
    );
    if (!(formState instanceof HTMLElement)) {
      return;
    }
    const isSuccessful =
      formState.getAttribute('data-success') === 'true';
    const hasErrors =
      formState.getAttribute('data-has-errors') === 'true';
    if ((isSuccessful || hasErrors) && !modal.open) {
      modal.showModal();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeQuotes, { once: true });
} else {
  initializeQuotes();
}
