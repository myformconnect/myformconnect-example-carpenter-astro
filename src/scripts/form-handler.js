/**
 * Oakline Workshop — Form Handler
 * Handles AJAX submission for contact and quote forms to MyFormCapture.
 * Implements the required fetch specification without manual Content-Type or JSON stringify.
 */

export function setupFormHandler(formElement) {
  if (!formElement) return;

  const submitButton = formElement.querySelector('button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.textContent : 'Submit';
  const loadingAlert = formElement.querySelector('.form-alert-loading');
  const successAlert = formElement.querySelector('.form-alert-success');
  const errorAlert = formElement.querySelector('.form-alert-error');

  function setBusy(isBusy) {
    if (submitButton) {
      submitButton.disabled = isBusy;
      if (isBusy) {
        submitButton.textContent = 'Sending...';
      } else {
        submitButton.textContent = originalButtonText;
      }
    }
    if (loadingAlert) {
      loadingAlert.classList.toggle('is-visible', isBusy);
    }
  }

  function hideAlerts() {
    if (successAlert) successAlert.classList.remove('is-visible');
    if (errorAlert) {
      errorAlert.classList.remove('is-visible');
      errorAlert.textContent = '';
    }
  }

  formElement.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideAlerts();
    setBusy(true);

    const formData = new FormData(formElement);

    // Clean phone number formatting to avoid server-side character filtering (e.g., brackets)
    if (formData.has('phone')) {
      const rawPhone = (formData.get('phone') || '').toString().trim();
      if (rawPhone) {
        // Replace parentheses and extra spaces with standard digits / dashes
        const cleanedPhone = rawPhone.replace(/[()\s]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        formData.set('phone', cleanedPhone);
      }
    }

    try {
      const response = await fetch(formElement.action, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData,
      });

      if (response.ok) {
        // Successful submission
        formElement.reset();
        if (successAlert) {
          successAlert.classList.add('is-visible');
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        // Server error response
        let errorMsg = 'There was a problem submitting your request. Please check your details and try again.';
        try {
          const data = await response.json();
          if (data) {
            if (Array.isArray(data.details) && data.details.length > 0) {
              errorMsg = data.details.join('. ');
            } else if (data.message) {
              errorMsg = data.message;
            } else if (data.error) {
              errorMsg = data.error;
            }
          }
        } catch (_) {}
        if (errorAlert) {
          errorAlert.textContent = errorMsg;
          errorAlert.classList.add('is-visible');
          errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    } catch (error) {
      // Network failure
      if (errorAlert) {
        errorAlert.textContent = 'Network error. Please check your connection and try again.';
        errorAlert.classList.add('is-visible');
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } finally {
      setBusy(false);
    }
  });
}
