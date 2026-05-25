/**
 * Create your Demo Playground request form — posts to demo Cloudflare Worker.
 */

const DEFAULT_ACTION = 'https://demo.bbird.live/playground-request';

function getPayload(form) {
  const data = {};
  [...form.elements].forEach((el) => {
    if (!el.name || el.disabled) return;
    if (el.type === 'radio' && !el.checked) return;
    if (el.type === 'checkbox') {
      if (el.checked) data[el.name] = el.value;
      return;
    }
    data[el.name] = el.value.trim();
  });
  return data;
}

function setStatus(form, message, isError = false) {
  const status = form.querySelector('.form-status');
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('is-error', isError);
}

function toggleForm(form, disabled) {
  [...form.elements].forEach((el) => {
    el.disabled = disabled;
  });
}

function showSuccess(form) {
  const panel = form.closest('.playground-form-panel');
  if (!panel) return;
  panel.innerHTML = `
    <div class="playground-success">
      <h2>Request received</h2>
      <p>Provisioning usually takes a few minutes. Watch for an email with your DA folder, preview/publish URLs, and GitHub repository details.</p>
      <p>If you do not hear back within one business day, contact your Adobe representative.</p>
      <a class="btn btn-secondary" href="../playbooks/index.html">Browse playbooks while you wait</a>
    </div>
  `;
}

async function handleSubmit(form, event) {
  event.preventDefault();
  if (!form.reportValidity()) {
    const invalid = form.querySelector(':invalid');
    invalid?.focus();
    return;
  }

  const action = form.dataset.action || DEFAULT_ACTION;
  const payload = getPayload(form);

  toggleForm(form, true);
  setStatus(form, 'Submitting your request…');

  try {
    const response = await fetch(action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `${response.status}`);
    }

    showSuccess(form);
  } catch (error) {
    console.error('Playground request failed:', error);
    setStatus(form, 'Unable to submit right now. Please try again in a moment.', true);
    toggleForm(form, false);
  }
}

const form = document.getElementById('playground-form');
if (form) {
  form.addEventListener('submit', (e) => handleSubmit(form, e));
}
