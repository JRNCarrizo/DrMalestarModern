// ===========================================
// FLYER RENDER — compartido (home + admin)
// ===========================================

window.FlyerRender = (function () {
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        if (Number.isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function formatTime(timeString) {
        if (!timeString) return '';
        const parts = timeString.split(':');
        if (parts.length < 2) return timeString;
        return `${parts[0]}:${parts[1]}`;
    }

    function resolveImage(image, adminContext) {
        const fallback = adminContext ? '../img/bluseraflier.jpg' : 'img/bluseraflier.jpg';
        if (!image) return fallback;
        if (adminContext && image.startsWith('img/')) return `../${image}`;
        return image;
    }

    function buildFlyerCard(flyer, options) {
        const opts = options || {};
        const adminContext = Boolean(opts.adminContext);
        const staticPreview = Boolean(opts.staticPreview);
        const isDraft = Boolean(flyer._isDraft);
        const showActions = opts.showActions !== false;
        const index = typeof opts.index === 'number' ? opts.index : -1;

        const title = escapeHtml(flyer.title || 'Sin título');
        const date = flyer.date ? formatDate(flyer.date) : 'Fecha no disponible';
        const time = escapeHtml(formatTime(flyer.time) || 'Hora no disponible');
        const location = escapeHtml(flyer.location || 'Lugar no disponible');
        const description = flyer.description ? escapeHtml(flyer.description) : '';
        const image = resolveImage(flyer.image, adminContext);
        const fallback = resolveImage(null, adminContext);

        const extraClass = [
            opts.extraClass || '',
            staticPreview ? 'flyer-card--static-preview' : '',
            isDraft ? 'flyer-card--draft' : ''
        ].filter(Boolean).join(' ');

        const actionsHtml = showActions ? `
            <div class="flyer-actions">
                <a href="#" class="btn-console btn-console--ghost" onclick="window.shareFlyerOnFacebook('${image.replace(/'/g, "\\'")}', '${title.replace(/'/g, "\\'")}'); return false;">
                    <i class="bi bi-facebook"></i> Compartir
                </a>
                <a href="${image}" download="${(flyer.title || 'flyer').replace(/[^a-z0-9]/gi, '_')}.jpg" class="btn-console btn-console--ghost">
                    <i class="bi bi-cloud-download"></i> Descargar
                </a>
            </div>
        ` : '';

        let deckTag = 'EN CARTELERA';
        let deckChannel = index >= 0 ? `SHOW ${String(index + 1).padStart(2, '0')}` : 'SHOW';
        let deckLedOn = false;
        if (isDraft) {
            deckTag = 'VISTA PREVIA';
            deckChannel = 'INPUT';
        } else if (index === 0) {
            deckTag = 'PRÓXIMO SHOW';
            deckChannel = 'NEXT · LIVE';
            deckLedOn = true;
        }

        const deckHtml = `
            <div class="flyer-card-deck" aria-hidden="true">
                <span class="flyer-deck-led${deckLedOn ? ' flyer-deck-led--on' : ''}"></span>
                <span class="flyer-deck-tag">${deckTag}</span>
                <span class="flyer-deck-channel">${deckChannel}</span>
            </div>
        `;

        return `
            <div class="flyer-card ${extraClass}" data-flyer-id="${escapeHtml(flyer.id || '')}">
                ${deckHtml}
                <div class="flyer-image-wrapper">
                    <img src="${image}" class="flyer-image" alt="${title}" onerror="this.src='${fallback}'">
                    <div class="flyer-info-overlay">
                        <div class="flyer-info-content">
                            <h3>${title}</h3>
                            <div class="flyer-details">
                                <div class="flyer-detail-item">
                                    <i class="bi bi-calendar3"></i>
                                    <span>${date}</span>
                                </div>
                                <div class="flyer-detail-item">
                                    <i class="bi bi-clock"></i>
                                    <span>${time}</span>
                                </div>
                                <div class="flyer-detail-item">
                                    <i class="bi bi-geo-alt"></i>
                                    <span>${location}</span>
                                </div>
                            </div>
                            ${description ? `<p class="flyer-description">${description}</p>` : ''}
                            ${actionsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function buildAdminFlyerItem(flyer, options) {
        const opts = options || {};
        const index = typeof opts.index === 'number' ? opts.index : 0;
        const total = typeof opts.total === 'number' ? opts.total : 1;
        const canMoveEarlier = index > 0;
        const canMoveLater = index < total - 1;

        const card = buildFlyerCard(flyer, {
            ...opts,
            staticPreview: false,
            showActions: false,
            adminContext: true,
            index
        });
        const id = escapeHtml(flyer.id || '');
        const pos = index + 1;
        return `
            <div class="admin-flyer-grid-item" data-id="${id}" data-position="${pos}">
                <span class="admin-flyer-position" aria-label="Posición ${pos} de ${total}">POS ${pos}</span>
                ${card}
                <div class="admin-flyer-grid-actions admin-flyer-grid-actions--reorder">
                    <button type="button" class="admin-console-btn admin-console-btn--sm admin-console-btn--ghost" onclick="moveFlyer('${id}', -1)" ${canMoveEarlier ? '' : 'disabled'} title="Mover antes en la cartelera">
                        <span class="admin-console-btn-face"><i class="bi bi-arrow-left" aria-hidden="true"></i> ANTES</span>
                    </button>
                    <button type="button" class="admin-console-btn admin-console-btn--sm admin-console-btn--ghost" onclick="moveFlyer('${id}', 1)" ${canMoveLater ? '' : 'disabled'} title="Mover después en la cartelera">
                        <span class="admin-console-btn-face">DESPUÉS <i class="bi bi-arrow-right" aria-hidden="true"></i></span>
                    </button>
                </div>
                <div class="admin-flyer-grid-actions">
                    <button type="button" class="admin-console-btn admin-console-btn--sm admin-console-btn--ghost" onclick="startFlyerEdit('${id}')">
                        <span class="admin-console-btn-face"><i class="bi bi-pencil-square"></i> EDITAR</span>
                    </button>
                    <button type="button" class="admin-console-btn admin-console-btn--sm admin-console-btn--red" onclick="deleteFlyer('${id}')">
                        <span class="admin-console-btn-face"><i class="bi bi-trash"></i> ELIMINAR</span>
                    </button>
                </div>
            </div>
        `;
    }

    function buildFlyerGrid(flyers, options) {
        const opts = options || {};
        const list = Array.isArray(flyers) ? flyers : [];
        if (opts.adminList) {
            return list.map((flyer, index) => buildAdminFlyerItem(flyer, {
                ...opts,
                index,
                total: list.length
            })).join('');
        }
        return list.map((flyer, index) => buildFlyerCard(flyer, { ...opts, index })).join('');
    }

    return {
        escapeHtml,
        formatDate,
        formatTime,
        resolveImage,
        buildFlyerCard,
        buildAdminFlyerItem,
        buildFlyerGrid
    };
})();
