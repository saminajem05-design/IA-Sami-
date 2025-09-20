import { loadLeads } from './shared.js';

document.addEventListener('DOMContentLoaded', () => {
  const counter = document.querySelector('[data-lead-count]');
  if (!counter) return;
  const leads = loadLeads();
  counter.textContent = leads.length;
});
