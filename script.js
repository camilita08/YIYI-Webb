// Menú responsive (hamburguesa)
const toggleBtn = document.getElementById('mobile-menu-toggle');
const navLinks = document.getElementById('nav-links');
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 780) {
        if (!navLinks.contains(e.target) && e.target !== toggleBtn) {
            navLinks.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    }
});
toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// Scroll suave al pulsar "Ver cómo funciona"
const goHow = document.getElementById('goHow');
if(goHow){
    goHow.addEventListener('click', function(e){
        e.preventDefault();
        document.getElementById('funciona').scrollIntoView({ behavior: 'smooth' });
    });
}

// Destacar link activo en navegación (al hacer scroll)
window.addEventListener('scroll', function(){
    const sections = document.querySelectorAll('main section[id]');
    const navItems = document.querySelectorAll('.nav-links .btn-nav');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if(scrollY >= sectionTop){
            current = section.id;
        }
    });
    navItems.forEach(li=>{
        li.classList.remove('active');
        if(current && li.getAttribute('onclick')?.includes(`#${current}`)){
            li.classList.add('active');
        }
    });
});

// Efecto "ripple" en todos los botones principales
function addRipple(btn) {
    btn.addEventListener('click', function(e) {
        // No ripple si está deshabilitado
        if(btn.getAttribute('aria-disabled')==='true') return;
        const circle = document.createElement('span');
        circle.className = 'ripple';
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        circle.style.width = circle.style.height = size + 'px';
        circle.style.left = (e.clientX - rect.left - size/2) + 'px';
        circle.style.top = (e.clientY - rect.top - size/2) + 'px';
        btn.appendChild(circle);
        setTimeout(()=>circle.remove(), 600);
    });
}
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-nav').forEach(addRipple);

/* ---------------- QR Modal / Instalar App ---------------- */

// Elementos
const installBtn = document.getElementById('install-app-btn');
const qrModal = document.getElementById('qr-modal');
const qrImage = document.getElementById('qr-image');
const qrClose = document.getElementById('qr-close');
const openPlaystore = document.getElementById('open-playstore');
const copyLinkBtn = document.getElementById('copy-link-btn');

if (installBtn && qrModal && qrImage && qrClose && openPlaystore) {
    // Leer enlace desde data-playstore para hacerlo configurable en HTML
    const PLAY_STORE_URL = installBtn.getAttribute('data-playstore') || 'https://play.google.com/store/apps/details?id=com.ejemplo.yiyi';

    // Generador de QR (puedes cambiar el servicio si prefieres otro)
    function generateQrUrl(data, size = 280) {
        return 'https://api.qrserver.com/v1/create-qr-code/?size=' + size + 'x' + size + '&data=' + encodeURIComponent(data);
    }

    // Abrir modal
    function openQrModal() {
        // Cerrar menú móvil si está abierto (UX)
        navLinks.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');

        // Poner src del QR y actualizar enlace
        qrImage.src = generateQrUrl(PLAY_STORE_URL, 360);
        openPlaystore.href = PLAY_STORE_URL;
        // Mostrar modal
        qrModal.setAttribute('aria-hidden', 'false');
        qrModal.classList.add('open');
        installBtn.setAttribute('aria-expanded', 'true');

        // Evitar scroll de fondo
        document.body.style.overflow = 'hidden';

        // Foco en botón cerrar para accesibilidad
        qrClose.focus();

        // Añadir listener de Escape para cerrar
        document.addEventListener('keydown', handleEscClose);
    }

    // Cerrar modal
    function closeQrModal() {
        qrModal.setAttribute('aria-hidden', 'true');
        qrModal.classList.remove('open');
        installBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        installBtn.focus();
        document.removeEventListener('keydown', handleEscClose);
    }

    function handleEscClose(e) {
        if (e.key === 'Escape' || e.key === 'Esc') closeQrModal();
    }

    // Eventos
    installBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openQrModal();
    });

    qrClose.addEventListener('click', (e) => {
        e.preventDefault();
        closeQrModal();
    });

    // Cerrar al hacer clic fuera del modal (en overlay)
    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) {
            closeQrModal();
        }
    });

    // Copiar enlace al portapapeles (si está disponible)
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(PLAY_STORE_URL);
                copyLinkBtn.textContent = 'Enlace copiado';
                setTimeout(() => copyLinkBtn.textContent = 'Copiar enlace', 1800);
            } catch (err) {
                // Fallback: seleccionar el texto mostrando el enlace en nueva ventana modal no implementada
                copyLinkBtn.textContent = 'No disponible';
                setTimeout(() => copyLinkBtn.textContent = 'Copiar enlace', 1800);
            }
        });
    }
}