const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  });
});

const copyButton = document.querySelector('[data-copy-email]');
const toast = document.querySelector('.toast');
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const email = copyButton.dataset.copyEmail;
    try {
      await navigator.clipboard.writeText(email);
      showToast('邮箱已复制');
    } catch (error) {
      const input = document.createElement('textarea');
      input.value = email;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      const copied = document.execCommand('copy');
      input.remove();
      showToast(copied ? '邮箱已复制' : `请手动复制：${email}`);
    }
  });
}

const projectToggle = document.querySelector('[data-project-toggle]');
const hiddenProjects = document.getElementById('hidden-projects');

if (projectToggle && hiddenProjects) {
  const toggleLabel = projectToggle.querySelector('[data-project-toggle-label]');
  let closeTimer;

  projectToggle.addEventListener('click', () => {
    const willOpen = projectToggle.getAttribute('aria-expanded') !== 'true';
    window.clearTimeout(closeTimer);
    projectToggle.setAttribute('aria-expanded', String(willOpen));
    if (toggleLabel) toggleLabel.textContent = willOpen ? '收起项目' : '查看更多项目';

    if (willOpen) {
      hiddenProjects.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => hiddenProjects.classList.add('is-open')));
      return;
    }

    hiddenProjects.classList.remove('is-open');
    if (reducedMotion) {
      hiddenProjects.hidden = true;
    } else {
      closeTimer = window.setTimeout(() => { hiddenProjects.hidden = true; }, 560);
    }
  });
}
