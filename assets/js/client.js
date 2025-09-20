import { generateId, saveLead, formatCurrency, formatDate } from './shared.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('lead-form');
  const confirmation = document.getElementById('confirmation');
  const summaryElements = document.querySelectorAll('[data-summary]');
  const timelineInput = document.getElementById('timeline');
  let shouldShowConfirmation = false;

  if (!form) {
    return;
  }

  if (timelineInput) {
    const today = new Date();
    timelineInput.min = today.toISOString().split('T')[0];
  }

  const updateSummary = () => {
    const formData = new FormData(form);
    const getValue = (name) => formData.get(name)?.toString().trim() ?? '';

    const serviceSelect = form.elements.namedItem('service');
    const preferredContactSelect = form.elements.namedItem('preferredContact');

    const serviceLabel =
      serviceSelect instanceof HTMLSelectElement && serviceSelect.selectedOptions.length
        ? serviceSelect.selectedOptions[0].textContent
        : '';

    const preferredContactLabel =
      preferredContactSelect instanceof HTMLSelectElement && preferredContactSelect.selectedOptions.length
        ? preferredContactSelect.selectedOptions[0].textContent
        : '';

    const summaryMap = {
      fullName: getValue('fullName'),
      email: getValue('email'),
      phone: getValue('phone'),
      city: getValue('city'),
      service: serviceLabel,
      budget: formatCurrency(getValue('budget')),
      timeline: formatDate(getValue('timeline')),
      preferredContact: preferredContactLabel,
      notes: getValue('notes') || '—',
      newsletter: formData.get('newsletter') ? 'Oui' : 'Non',
    };

    summaryElements.forEach((element) => {
      const key = element.getAttribute('data-summary');
      if (!key) return;
      const value = summaryMap[key];
      element.textContent = value && value !== 'Non renseigné' ? value : '—';
    });

    if (confirmation) {
      confirmation.hidden = !shouldShowConfirmation;
    }
  };

  updateSummary();
  form.addEventListener('input', () => {
    shouldShowConfirmation = false;
    updateSummary();
  });
  form.addEventListener('change', () => {
    shouldShowConfirmation = false;
    updateSummary();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const lead = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: 'Nouveau',
      fullName: formData.get('fullName')?.toString().trim() ?? '',
      email: formData.get('email')?.toString().trim() ?? '',
      phone: formData.get('phone')?.toString().trim() ?? '',
      city: formData.get('city')?.toString().trim() ?? '',
      service: formData.get('service')?.toString() ?? '',
      serviceLabel:
        form.elements.namedItem('service') instanceof HTMLSelectElement
          ? form.elements.namedItem('service').selectedOptions[0].textContent ?? ''
          : '',
      budget: formData.get('budget')?.toString() ?? '',
      timeline: formData.get('timeline')?.toString() ?? '',
      preferredContact: formData.get('preferredContact')?.toString() ?? '',
      preferredContactLabel:
        form.elements.namedItem('preferredContact') instanceof HTMLSelectElement
          ? form.elements.namedItem('preferredContact').selectedOptions[0].textContent ?? ''
          : '',
      notes: formData.get('notes')?.toString().trim() ?? '',
      newsletter: Boolean(formData.get('newsletter')),
      consent: Boolean(formData.get('consent')),
    };

    saveLead(lead);
    form.reset();
    shouldShowConfirmation = true;
    updateSummary();

    confirmation?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
