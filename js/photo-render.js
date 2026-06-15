// ===========================================
// PHOTO RENDER — compartido (home + admin)
// ===========================================

window.PhotoRender = (function () {
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function resolveImage(image, adminContext) {
        const fallback = adminContext ? '../img/bluseraflier.jpg' : 'img/bluseraflier.jpg';
        if (!image) return fallback;
        if (adminContext && image.startsWith('img/')) return `../${image}`;
        return image;
    }

    function buildPhotoCard(photo, options) {
        const opts = options || {};
        const adminContext = Boolean(opts.adminContext);
        const rawTitle = (photo.title || '').trim();
        const rawDescription = (photo.description || '').trim();
        const title = rawTitle ? escapeHtml(rawTitle) : '';
        const description = rawDescription ? escapeHtml(rawDescription) : '';
        const hasCaption = Boolean(rawTitle || rawDescription);
        const image = resolveImage(photo.image, adminContext);
        const fallback = resolveImage(null, adminContext);
        const altText = rawTitle ? escapeHtml(rawTitle) : '';

        const overlayHtml = hasCaption ? `
                <div class="photo-overlay">
                    ${title ? `<h4 class="photo-title">${title}</h4>` : ''}
                    ${description ? `<p class="photo-description">${description}</p>` : ''}
                </div>` : '';

        return `
            <div class="photo-card${hasCaption ? '' : ' photo-card--no-caption'}" data-photo-id="${escapeHtml(photo.id || '')}">
                <img src="${image}" class="photo-image" alt="${altText}" onerror="this.src='${fallback}'">
                ${overlayHtml}
            </div>
        `;
    }

    function buildAdminPhotoItem(photo, options) {
        const opts = options || {};
        const index = typeof opts.index === 'number' ? opts.index : 0;
        const total = typeof opts.total === 'number' ? opts.total : 1;
        const canMoveEarlier = index > 0;
        const canMoveLater = index < total - 1;
        const id = escapeHtml(photo.id || '');
        const pos = index + 1;

        const card = buildPhotoCard(photo, {
            ...opts,
            adminContext: true
        });

        return `
            <div class="admin-photo-grid-item" data-id="${id}" data-position="${pos}">
                <span class="admin-flyer-position" aria-label="Posición ${pos} de ${total}">POS ${pos}</span>
                ${card}
                <div class="admin-flyer-grid-actions admin-flyer-grid-actions--reorder">
                    <button type="button" class="admin-console-btn admin-console-btn--sm admin-console-btn--ghost" onclick="movePhoto('${id}', -1)" ${canMoveEarlier ? '' : 'disabled'} title="Mover antes en la galería">
                        <span class="admin-console-btn-face"><i class="bi bi-arrow-left" aria-hidden="true"></i> ANTES</span>
                    </button>
                    <button type="button" class="admin-console-btn admin-console-btn--sm admin-console-btn--ghost" onclick="movePhoto('${id}', 1)" ${canMoveLater ? '' : 'disabled'} title="Mover después en la galería">
                        <span class="admin-console-btn-face">DESPUÉS <i class="bi bi-arrow-right" aria-hidden="true"></i></span>
                    </button>
                </div>
                <div class="admin-flyer-grid-actions">
                    <button type="button" class="admin-console-btn admin-console-btn--sm admin-console-btn--ghost" onclick="startPhotoEdit('${id}')">
                        <span class="admin-console-btn-face"><i class="bi bi-pencil-square"></i> EDITAR</span>
                    </button>
                    <button type="button" class="admin-console-btn admin-console-btn--sm admin-console-btn--red" onclick="deletePhoto('${id}')">
                        <span class="admin-console-btn-face"><i class="bi bi-trash"></i> ELIMINAR</span>
                    </button>
                </div>
            </div>
        `;
    }

    function buildPhotoGrid(photos, options) {
        const opts = options || {};
        const list = Array.isArray(photos) ? photos : [];
        if (opts.adminList) {
            return list.map((photo, index) => buildAdminPhotoItem(photo, {
                ...opts,
                index,
                total: list.length
            })).join('');
        }
        return list.map(photo => buildPhotoCard(photo, opts)).join('');
    }

    return {
        escapeHtml,
        resolveImage,
        buildPhotoCard,
        buildAdminPhotoItem,
        buildPhotoGrid
    };
})();
