// ===========================================
// VIDEO RENDER — compartido (home + admin)
// ===========================================

window.VideoRender = (function () {
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function extractYouTubeId(url) {
        if (!url) return null;

        let cleanUrl = url.trim();
        if (cleanUrl.includes('&')) {
            cleanUrl = cleanUrl.split('&')[0];
        }

        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
            /youtu\.be\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/,
            /^([a-zA-Z0-9_-]{11})$/
        ];

        for (const pattern of patterns) {
            const match = cleanUrl.match(pattern);
            if (match && match[1] && match[1].length === 11) {
                return match[1];
            }
        }

        if (cleanUrl.includes('v=')) {
            const parts = cleanUrl.split('v=');
            if (parts.length > 1) {
                const possibleId = parts[1].split(/[&?#]/)[0].trim();
                if (possibleId.length === 11 && /^[a-zA-Z0-9_-]+$/.test(possibleId)) {
                    return possibleId;
                }
            }
        }

        if (cleanUrl.includes('youtu.be/')) {
            const parts = cleanUrl.split('youtu.be/');
            if (parts.length > 1) {
                const possibleId = parts[1].split(/[?&#]/)[0].trim();
                if (possibleId.length === 11 && /^[a-zA-Z0-9_-]+$/.test(possibleId)) {
                    return possibleId;
                }
            }
        }

        if (cleanUrl.includes('/shorts/')) {
            const parts = cleanUrl.split('/shorts/');
            if (parts.length > 1) {
                const possibleId = parts[1].split(/[?&#]/)[0].trim();
                if (possibleId.length === 11 && /^[a-zA-Z0-9_-]+$/.test(possibleId)) {
                    return possibleId;
                }
            }
        }

        return null;
    }

    function resolveVideoId(video) {
        return video.videoId || extractYouTubeId(video.url);
    }

    function buildEmbedUrl(video, videoId) {
        const isShort = video.url && (video.url.includes('/shorts/') || video.url.includes('youtube.com/shorts/'));
        if (isShort) {
            return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
        }
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
    }

    function buildInvalidVideoCard(video) {
        const title = escapeHtml(video.title || 'Video sin título');
        const description = video.description ? escapeHtml(video.description) : '';
        const url = video.url || '';
        const videoId = resolveVideoId(video);

        return `
            <div class="video-card" data-video-id="${escapeHtml(videoId || '')}">
                <div class="video-container">
                    <div class="admin-video-placeholder">
                        <i class="bi bi-exclamation-triangle" style="font-size: 3rem; color: #dc3545;"></i>
                        <p style="margin-top: 1rem; color: var(--text-muted);">Video ID inválido</p>
                    </div>
                </div>
                <div class="video-info">
                    <h3>${title}</h3>
                    ${description ? `<p>${description}</p>` : ''}
                    <p class="text-danger"><small>Error: ID de video inválido (${escapeHtml(videoId || 'no extraído')})</small></p>
                    ${url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener" class="btn-console btn-console--ghost btn-console--sm">
                        <i class="bi bi-youtube"></i> YouTube
                    </a>` : ''}
                </div>
            </div>
        `;
    }

    function buildVideoCard(video, options) {
        const opts = options || {};
        const checkEmbed = Boolean(opts.checkEmbed);
        const videoId = resolveVideoId(video);

        if (!videoId || videoId.length !== 11 || !/^[a-zA-Z0-9_-]+$/.test(videoId)) {
            return buildInvalidVideoCard(video);
        }

        const embedUrl = buildEmbedUrl(video, videoId);
        if (!embedUrl.includes('/embed/') || embedUrl === 'https://www.youtube.com/embed/') {
            return buildInvalidVideoCard(video);
        }

        const title = escapeHtml(video.title || 'Video sin título');
        const description = video.description ? escapeHtml(video.description) : '';
        const url = video.url || '';
        const onloadAttr = checkEmbed ? ` onload="VideoRender.checkVideoLoad('${videoId}')"` : '';

        return `
            <div class="video-card" data-video-id="${videoId}">
                <div class="video-container" id="video-wrapper-${videoId}">
                    <iframe
                        id="ytplayer-${videoId}"
                        src="${embedUrl}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen
                        loading="lazy"
                        style="width: 100%; height: 100%;"${onloadAttr}
                        title="${title}">
                    </iframe>
                    <div class="video-error-overlay" id="error-${videoId}" style="display: none;">
                        <div class="video-error-content">
                            <i class="bi bi-exclamation-triangle" style="font-size: 3rem; color: #ffc107; margin-bottom: 1rem;"></i>
                            <p style="color: var(--text-light); margin-bottom: 0.5rem;">Este video no permite reproducción embebida</p>
                            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Haz clic en el botón para verlo en YouTube</p>
                            ${url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener" class="btn-console btn-console--primary">
                                <i class="bi bi-youtube"></i> YouTube
                            </a>` : ''}
                        </div>
                    </div>
                </div>
                <div class="video-info">
                    <h3>${title}</h3>
                    ${description ? `<p>${description}</p>` : ''}
                    ${url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener" class="btn-console btn-console--ghost btn-console--sm">
                        <i class="bi bi-youtube"></i> YouTube
                    </a>` : ''}
                </div>
            </div>
        `;
    }

    function buildAdminVideoItem(video, options) {
        const opts = options || {};
        const index = typeof opts.index === 'number' ? opts.index : 0;
        const total = typeof opts.total === 'number' ? opts.total : 1;
        const canMoveEarlier = index > 0;
        const canMoveLater = index < total - 1;
        const id = escapeHtml(video.id || '');
        const pos = index + 1;

        const card = buildVideoCard(video, { adminContext: true });

        return `
            <div class="admin-video-grid-item" data-id="${id}" data-position="${pos}">
                <span class="admin-flyer-position" aria-label="Posición ${pos} de ${total}">POS ${pos}</span>
                ${card}
                <div class="admin-flyer-grid-actions admin-flyer-grid-actions--reorder">
                    <button type="button" class="admin-console-btn admin-console-btn--sm admin-console-btn--ghost" onclick="moveVideo('${id}', -1)" ${canMoveEarlier ? '' : 'disabled'} title="Mover antes en la sección Videos">
                        <span class="admin-console-btn-face"><i class="bi bi-arrow-left" aria-hidden="true"></i> ANTES</span>
                    </button>
                    <button type="button" class="admin-console-btn admin-console-btn--sm admin-console-btn--ghost" onclick="moveVideo('${id}', 1)" ${canMoveLater ? '' : 'disabled'} title="Mover después en la sección Videos">
                        <span class="admin-console-btn-face">DESPUÉS <i class="bi bi-arrow-right" aria-hidden="true"></i></span>
                    </button>
                </div>
                <div class="admin-flyer-grid-actions">
                    <button type="button" class="admin-console-btn admin-console-btn--sm admin-console-btn--ghost" onclick="startVideoEdit('${id}')">
                        <span class="admin-console-btn-face"><i class="bi bi-pencil-square"></i> EDITAR</span>
                    </button>
                    <button type="button" class="admin-console-btn admin-console-btn--sm admin-console-btn--red" onclick="deleteVideo('${id}')">
                        <span class="admin-console-btn-face"><i class="bi bi-trash"></i> ELIMINAR</span>
                    </button>
                </div>
            </div>
        `;
    }

    function buildVideoGrid(videos, options) {
        const opts = options || {};
        const list = Array.isArray(videos) ? videos : [];
        if (opts.adminList) {
            return list.map((video, index) => buildAdminVideoItem(video, {
                ...opts,
                index,
                total: list.length
            })).join('');
        }
        return list.map(video => buildVideoCard(video, opts)).join('');
    }

    function checkVideoLoad(videoId) {
        setTimeout(() => {
            const iframe = document.getElementById(`ytplayer-${videoId}`);
            const errorOverlay = document.getElementById(`error-${videoId}`);

            if (!iframe) return;

            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (iframeDoc) {
                    const body = iframeDoc.body;
                    if (body && (body.textContent.includes('no disponible') || body.textContent.includes('not available'))) {
                        if (errorOverlay) {
                            errorOverlay.style.display = 'flex';
                            iframe.style.display = 'none';
                        }
                    }
                }
            } catch (e) {
                // Cross-origin: comportamiento normal del iframe de YouTube
            }
        }, 2000);
    }

    return {
        escapeHtml,
        extractYouTubeId,
        resolveVideoId,
        buildVideoCard,
        buildAdminVideoItem,
        buildVideoGrid,
        checkVideoLoad
    };
})();
