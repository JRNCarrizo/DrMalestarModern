// ===========================================
// DOWNLOAD RENDER — compartido (home + admin)
// ===========================================

window.DownloadRender = (function () {
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function resolveFile(file, adminContext) {
        const fallback = adminContext ? '../img/logoNuevo-malestar.png' : 'img/logoNuevo-malestar.png';
        if (!file) return fallback;
        if (adminContext) {
            if (file.startsWith('img/')) return `../${file}`;
            if (file.startsWith('/img/')) return `..${file}`;
        }
        return file;
    }

    function getDefaultDownloads() {
        return [{
            id: 'default-logo',
            title: 'Logo Dr.Malestar',
            description: 'Logo oficial de la banda en alta calidad.',
            file: 'img/logoNuevo-malestar.png',
            fileName: 'logoNuevo-malestar.png',
            isDefault: true
        }];
    }

    function isDefaultDownload(item) {
        return Boolean(item && (item.isDefault || item.id === 'default-logo'));
    }

    function downloadFileName(item) {
        if (item.fileName) return item.fileName;
        const file = item.file || '';
        const parts = file.split('/');
        return parts[parts.length - 1] || 'descarga-dr-malestar';
    }

    function buildDownloadCarousel(downloads, options) {
        const opts = options || {};
        const adminContext = Boolean(opts.adminContext);
        const list = Array.isArray(downloads) ? downloads : [];

        if (!list.length) {
            return '<p class="download-empty text-center text-muted py-5">No hay archivos para descargar todavía.</p>';
        }

        const slides = list.map(function(item, index) {
            const title = escapeHtml(item.title || 'Descarga');
            const file = resolveFile(item.file, adminContext);
            const fileName = escapeHtml(downloadFileName(item));
            const description = item.description ? escapeHtml(item.description) : '';
            const active = index === 0 ? ' download-slide--active' : '';
            return `
                <article class="download-slide${active}" data-download-index="${index}" data-title="${title}" data-description="${description}" data-file="${file}" data-filename="${fileName}">
                    <div class="download-slide-frame">
                        <img src="${file}" class="download-slide-image" alt="${title}" loading="lazy" onerror="this.src='${resolveFile(null, adminContext)}'">
                    </div>
                </article>
            `;
        }).join('');

        const dots = list.map(function(_, index) {
            return `<button type="button" class="download-carousel-dot${index === 0 ? ' download-carousel-dot--active' : ''}" data-download-dot="${index}" aria-label="Archivo ${index + 1}"></button>`;
        }).join('');

        const first = list[0];
        const firstTitle = escapeHtml(first.title || 'Descarga');
        const firstDesc = first.description ? escapeHtml(first.description) : '';
        const firstFile = resolveFile(first.file, adminContext);
        const firstFileName = escapeHtml(downloadFileName(first));

        return `
            <div class="download-deck-panel" data-download-carousel>
                <div class="download-carousel">
                    <button type="button" class="download-carousel-btn download-carousel-btn--prev" aria-label="Anterior">
                        <i class="bi bi-chevron-left" aria-hidden="true"></i>
                    </button>
                    <div class="download-carousel-viewport" aria-live="polite">
                        <div class="download-carousel-track">
                            ${slides}
                        </div>
                    </div>
                    <button type="button" class="download-carousel-btn download-carousel-btn--next" aria-label="Siguiente">
                        <i class="bi bi-chevron-right" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="download-carousel-dots" role="tablist" aria-label="Archivos disponibles">
                    ${dots}
                </div>
                <div class="download-carousel-meta">
                    <span class="download-carousel-tag">ASSET BANK</span>
                    <h3 class="download-carousel-title">${firstTitle}</h3>
                    <p class="download-carousel-description">${firstDesc || 'Material oficial para prensa y difusión.'}</p>
                    <div class="download-carousel-actions">
                        <a href="${firstFile}" class="btn-console btn-console--primary download-carousel-download" download="${firstFileName}">
                            <i class="bi bi-cloud-download"></i> Descargar
                        </a>
                        <span class="download-carousel-counter">01 / ${String(list.length).padStart(2, '0')}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function buildAdminDownloadItem(item, options) {
        const opts = options || {};
        const index = typeof opts.index === 'number' ? opts.index : 0;
        const total = typeof opts.total === 'number' ? opts.total : 1;
        const canMoveEarlier = index > 0;
        const canMoveLater = index < total - 1;
        const isDefault = Boolean(opts.isDefault) || isDefaultDownload(item);
        const id = escapeHtml(item.id || '');
        const pos = index + 1;
        const title = escapeHtml(item.title || 'Sin título');
        const file = resolveFile(item.file, true);
        const fileName = escapeHtml(downloadFileName(item));

        const fallbackSrc = resolveFile(null, true);

        return `
            <div class="admin-download-grid-item${isDefault ? ' admin-download-grid-item--default' : ''}" data-id="${id}" data-position="${pos}">
                ${isDefault ? '<span class="admin-download-default-badge">Vista por defecto en el sitio</span>' : ''}
                <span class="admin-flyer-position" aria-label="Posición ${pos} de ${total}">POS ${pos}</span>
                <div class="admin-download-card">
                    <div class="admin-download-thumb">
                        <img src="${file}" alt="${title}" loading="lazy" onerror="this.src='${fallbackSrc}'">
                    </div>
                    <div class="admin-download-card-body">
                        <h3 class="admin-download-card-title">${title}</h3>
                        <p class="admin-download-card-file">${fileName}</p>
                    </div>
                </div>
                <div class="admin-flyer-grid-actions admin-flyer-grid-actions--reorder">
                    <button type="button" class="admin-console-btn admin-console-btn--sm admin-console-btn--ghost" onclick="moveDownload('${id}', -1)" ${canMoveEarlier && !isDefault ? '' : 'disabled'} title="Mover antes">
                        <span class="admin-console-btn-face"><i class="bi bi-arrow-left" aria-hidden="true"></i> ANTES</span>
                    </button>
                    <button type="button" class="admin-console-btn admin-console-btn--sm admin-console-btn--ghost" onclick="moveDownload('${id}', 1)" ${canMoveLater && !isDefault ? '' : 'disabled'} title="Mover después">
                        <span class="admin-console-btn-face">DESPUÉS <i class="bi bi-arrow-right" aria-hidden="true"></i></span>
                    </button>
                </div>
                <div class="admin-flyer-grid-actions">
                    <button type="button" class="admin-console-btn admin-console-btn--sm admin-console-btn--ghost" onclick="startDownloadEdit('${id}')">
                        <span class="admin-console-btn-face"><i class="bi bi-pencil-square"></i> ${isDefault ? 'PUBLICAR' : 'EDITAR'}</span>
                    </button>
                    <button type="button" class="admin-console-btn admin-console-btn--sm admin-console-btn--red" onclick="deleteDownload('${id}')" ${isDefault ? 'disabled' : ''}>
                        <span class="admin-console-btn-face"><i class="bi bi-trash"></i> ELIMINAR</span>
                    </button>
                </div>
            </div>
        `;
    }

    function buildAdminDownloadGrid(downloads) {
        const apiList = Array.isArray(downloads) ? downloads : [];
        const list = apiList.length ? apiList : getDefaultDownloads();
        const isFallbackPreview = !apiList.length;

        if (!list.length) {
            return '<p class="admin-empty-state admin-empty-state--grid"><i class="bi bi-cloud-download"></i> No hay descargas publicadas todavía.</p>';
        }

        const notice = isFallbackPreview
            ? '<p class="admin-download-fallback-note"><i class="bi bi-info-circle" aria-hidden="true"></i> El sitio público muestra este logo por defecto. Usá <strong>Publicar</strong> o agregá una descarga para guardarlo en la base de datos.</p>'
            : '';

        return notice + list.map(function(item, index) {
            return buildAdminDownloadItem(item, {
                index: index,
                total: list.length,
                isDefault: isFallbackPreview && isDefaultDownload(item)
            });
        }).join('');
    }

    function initDownloadCarousel(root) {
        const deck = root || document.querySelector('[data-download-carousel]');
        if (!deck) return;

        const slides = Array.from(deck.querySelectorAll('.download-slide'));
        if (!slides.length) return;

        const dots = Array.from(deck.querySelectorAll('.download-carousel-dot'));
        const titleEl = deck.querySelector('.download-carousel-title');
        const descEl = deck.querySelector('.download-carousel-description');
        const counterEl = deck.querySelector('.download-carousel-counter');
        const downloadBtn = deck.querySelector('.download-carousel-download');
        const prevBtn = deck.querySelector('.download-carousel-btn--prev');
        const nextBtn = deck.querySelector('.download-carousel-btn--next');
        const viewport = deck.querySelector('.download-carousel-viewport');

        let index = slides.findIndex(function(slide) {
            return slide.classList.contains('download-slide--active');
        });
        if (index < 0) index = 0;

        function pad(n) {
            return String(n).padStart(2, '0');
        }

        function updateUI() {
            slides.forEach(function(slide, i) {
                slide.classList.toggle('download-slide--active', i === index);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle('download-carousel-dot--active', i === index);
            });

            const current = slides[index];
            if (!current) return;

            const title = current.dataset.title || 'Descarga';
            const description = current.dataset.description || '';
            const file = current.dataset.file || '#';
            const fileName = current.dataset.filename || 'descarga-dr-malestar';

            if (titleEl) titleEl.textContent = title;
            if (descEl) descEl.textContent = description || 'Material oficial para prensa y difusión.';
            if (counterEl) counterEl.textContent = pad(index + 1) + ' / ' + pad(slides.length);
            if (downloadBtn) {
                downloadBtn.href = file;
                downloadBtn.setAttribute('download', fileName);
            }
        }

        function goTo(newIndex) {
            if (!slides.length) return;
            index = (newIndex + slides.length) % slides.length;
            updateUI();
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function() { goTo(index - 1); });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function() { goTo(index + 1); });
        }
        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                const target = parseInt(dot.dataset.downloadDot, 10);
                if (!Number.isNaN(target)) goTo(target);
            });
        });

        let touchStartX = 0;
        let touchDeltaX = 0;
        if (viewport) {
            viewport.addEventListener('touchstart', function(e) {
                if (!e.touches.length) return;
                touchStartX = e.touches[0].clientX;
                touchDeltaX = 0;
            }, { passive: true });

            viewport.addEventListener('touchmove', function(e) {
                if (!e.touches.length) return;
                touchDeltaX = e.touches[0].clientX - touchStartX;
            }, { passive: true });

            viewport.addEventListener('touchend', function() {
                if (Math.abs(touchDeltaX) < 40) return;
                if (touchDeltaX < 0) goTo(index + 1);
                else goTo(index - 1);
            });
        }

        document.addEventListener('keydown', function(e) {
            if (!deck.closest('section') || !isElementInViewport(deck)) return;
            if (e.key === 'ArrowLeft') goTo(index - 1);
            if (e.key === 'ArrowRight') goTo(index + 1);
        });

        updateUI();
    }

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
    }

    return {
        escapeHtml,
        resolveFile,
        getDefaultDownloads,
        isDefaultDownload,
        downloadFileName,
        buildDownloadCarousel,
        buildAdminDownloadItem,
        buildAdminDownloadGrid,
        initDownloadCarousel
    };
})();
