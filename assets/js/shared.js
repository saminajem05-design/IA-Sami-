const STORAGE_KEY = 'ia-sami-leads';

export function loadLeads() {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const leads = JSON.parse(raw);
    if (Array.isArray(leads)) {
      return leads;
    }
    return [];
  } catch (error) {
    console.error('Impossible de charger les fiches prospects :', error);
    return [];
  }
}

export function persistLeads(leads) {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

export function saveLead(lead) {
  const leads = loadLeads();
  const existingIndex = leads.findIndex((item) => item.id === lead.id);
  if (existingIndex !== -1) {
    leads[existingIndex] = lead;
  } else {
    leads.push(lead);
  }
  persistLeads(leads);
  return leads;
}

export function deleteLead(id) {
  const leads = loadLeads().filter((lead) => lead.id !== id);
  persistLeads(leads);
  return leads;
}

export function generateId() {
  return `lead-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export function formatDate(dateString) {
  if (!dateString) {
    return 'Non renseigné';
  }
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    return dateString;
  }
}

export function formatCurrency(value) {
  if (!value) {
    return 'Non renseigné';
  }
  const number = Number(value);
  if (Number.isNaN(number) || number <= 0) {
    return 'Non renseigné';
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(number);
}
