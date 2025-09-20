import { loadLeads, persistLeads, formatCurrency, formatDate } from './shared.js';

document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('leadList');
  const template = document.getElementById('leadCardTemplate');
  const counter = document.getElementById('leadCounter');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('search');
  const statusFilter = document.getElementById('statusFilter');
  const sortSelect = document.getElementById('sort');
  const clearButton = document.getElementById('clear');

  if (!list || !(template instanceof HTMLTemplateElement)) {
    return;
  }

  let leads = loadLeads();
  let filteredLeads = [...leads];

  const syncStorage = () => {
    persistLeads(leads);
  };

  const render = () => {
    list.innerHTML = '';
    counter.textContent = filteredLeads.length.toString();

    if (filteredLeads.length === 0) {
      emptyState?.removeAttribute('hidden');
      return;
    }

    emptyState?.setAttribute('hidden', '');

    filteredLeads.forEach((lead) => {
      const clone = template.content.cloneNode(true);
      const article = clone.querySelector('.lead-card');
      const title = clone.querySelector('h3');
      const meta = clone.querySelector('.lead-meta');
      const details = clone.querySelector('.lead-details');
      const statusSelect = clone.querySelector('.lead-status');
      const deleteButton = clone.querySelector('.lead-delete');

      if (!(article instanceof HTMLElement) || !(details instanceof HTMLElement)) {
        return;
      }

      article.dataset.id = lead.id;
      if (title) {
        title.textContent = lead.fullName || 'Nom non renseigné';
      }

      if (meta) {
        const createdAt = lead.createdAt ? formatDate(lead.createdAt) : 'Date inconnue';
        const city = lead.city || 'Ville non renseignée';
        const service = lead.serviceLabel || lead.service || 'Service non précisé';
        meta.textContent = `${createdAt} • ${city} • ${service}`;
      }

      const appendDetail = (label, value) => {
        const dt = document.createElement('dt');
        dt.textContent = label;
        const dd = document.createElement('dd');
        dd.textContent = value && value !== 'Non renseigné' ? value : '—';
        details.appendChild(dt);
        details.appendChild(dd);
      };

      appendDetail('Adresse e-mail', lead.email || 'Non renseigné');
      appendDetail('Téléphone', lead.phone || 'Non renseigné');
      appendDetail('Budget estimé', formatCurrency(lead.budget));
      appendDetail("Échéance du projet", formatDate(lead.timeline));
      appendDetail('Canal préféré', lead.preferredContactLabel || lead.preferredContact || 'Non renseigné');
      appendDetail('Notes', lead.notes || 'Non renseigné');
      appendDetail('Newsletter', lead.newsletter ? 'Inscrit' : 'Non inscrit');

      if (statusSelect instanceof HTMLSelectElement) {
        statusSelect.value = lead.status || 'Nouveau';
        statusSelect.addEventListener('change', () => {
          const newStatus = statusSelect.value;
          leads = leads.map((item) => (item.id === lead.id ? { ...item, status: newStatus } : item));
          syncStorage();
          applyFilters();
        });
      }

      if (deleteButton instanceof HTMLButtonElement) {
        deleteButton.addEventListener('click', () => {
          if (!confirm('Supprimer cette fiche prospect ?')) {
            return;
          }
          leads = leads.filter((item) => item.id !== lead.id);
          syncStorage();
          applyFilters();
        });
      }

      list.appendChild(clone);
    });
  };

  const applyFilters = () => {
    const searchTerm = searchInput?.value.trim().toLowerCase() ?? '';
    const statusValue = statusFilter?.value ?? '';
    const sortValue = sortSelect?.value ?? 'recent';

    filteredLeads = leads.filter((lead) => {
      const matchesStatus = statusValue ? lead.status === statusValue : true;
      const haystack = [
        lead.fullName,
        lead.city,
        lead.serviceLabel,
        lead.service,
        lead.email,
        lead.notes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesSearch = searchTerm ? haystack.includes(searchTerm) : true;
      return matchesStatus && matchesSearch;
    });

    filteredLeads.sort((a, b) => {
      if (sortValue === 'alpha') {
        return (a.fullName || '').localeCompare(b.fullName || '', 'fr', {
          sensitivity: 'base',
        });
      }
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (sortValue === 'oldest') {
        return dateA - dateB;
      }
      return dateB - dateA;
    });

    render();
  };

  searchInput?.addEventListener('input', () => applyFilters());
  statusFilter?.addEventListener('change', () => applyFilters());
  sortSelect?.addEventListener('change', () => applyFilters());
  clearButton?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (statusFilter) statusFilter.value = '';
    if (sortSelect) sortSelect.value = 'recent';
    applyFilters();
  });

  applyFilters();
});
