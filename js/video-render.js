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

    function buildVideoDeckHtml() {
        return `
            <div class="video-card-deck" aria-hidden="true">
                <div class="video-deck-controls">
                    <span class="video-deck-btn video-deck-btn--audio">
                        <span class="video-deck-led"></span>
                        <span class="video-deck-key">AUDIO</span>
                    </span>
                    <span class="video-deck-btn video-deck-btn--on-air">
                        <span class="video-deck-led"></span>
                        <span class="video-deck-key">ON AIR</span>
                    </span>
                </div>
                <div class="video-deck-vu" aria-hidden="true">
                    <span class="vu-seg"></span>
                    <span class="vu-seg"></span>
                    <span class="vu-seg"></span>
                    <span class="vu-seg"></span>
                    <span class="vu-seg"></span>
                    <span class="vu-seg"></span>
                    <span class="vu-seg"></span>
                </div>
            </div>
        `;
    }

    function buildEmbedUrl(video, videoId) {
        const origin = encodeURIComponent(window.location.origin);
        const isShort = video.url && (video.url.includes('/shorts/') || video.url.includes('youtube.com/shorts/'));
        if (isShort) {
            return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${origin}`;
        }
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${origin}`;
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
        const playerDomId = video.id ? `ytplayer-${video.id}` : `ytplayer-${videoId}`;

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
        const isShort = Boolean(video.url && (video.url.includes('/shorts/') || video.url.includes('youtube.com/shorts/')));
        const deckHtml = buildVideoDeckHtml();
        const shortClass = isShort ? ' video-card--short' : '';

        return `
            <div class="video-card${shortClass}" data-video-id="${videoId}" data-player-dom-id="${escapeHtml(playerDomId)}">
                ${deckHtml}
                <div class="video-container" id="video-wrapper-${escapeHtml(playerDomId)}">
                    <div class="video-player-mount" id="${escapeHtml(playerDomId)}"></div>
                    <div class="video-error-overlay" id="error-${escapeHtml(playerDomId)}" style="display: none;">
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

    let youtubeApiPromise = null;
    const playersByCard = new WeakMap();

    function pauseIframe(iframe) {
        if (!iframe || !iframe.contentWindow) return;
        iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'pauseVideo',
            args: ''
        }), '*');
    }

    function pauseVideoCard(card) {
        if (!card) return;

        const entry = playersByCard.get(card);
        if (entry) {
            if (entry.type === 'api' && entry.player && typeof entry.player.pauseVideo === 'function') {
                try {
                    entry.player.pauseVideo();
                } catch (_) {
                    /* player no listo */
                }
            } else if (entry.type === 'iframe' && entry.iframe) {
                pauseIframe(entry.iframe);
            }
            return;
        }

        const iframe = card.querySelector('iframe');
        if (iframe) pauseIframe(iframe);
    }

    function pauseAllExcept(activeCard) {
        document.querySelectorAll('.video-card[data-video-id]').forEach(function(card) {
            if (card === activeCard) return;
            pauseVideoCard(card);
            card.classList.remove('video-card--live');
        });
    }

    function onVideoPlay(card) {
        if (!card) return;
        pauseAllExcept(card);
        card.classList.add('video-card--live');
    }

    function registerIframePlayer(card, iframe) {
        if (!card || !iframe) return;
        playersByCard.set(card, { type: 'iframe', iframe: iframe });
    }

    function ensureYouTubeApi() {
        if (window.YT && window.YT.Player) {
            return Promise.resolve();
        }
        if (youtubeApiPromise) return youtubeApiPromise;

        youtubeApiPromise = new Promise(function(resolve) {
            const previousReady = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = function() {
                if (typeof previousReady === 'function') previousReady();
                resolve();
            };

            if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                tag.async = true;
                document.head.appendChild(tag);
            }
        });

        return youtubeApiPromise;
    }

    function setVideoLive(card, live) {
        if (!card) return;
        if (live) {
            document.querySelectorAll('.video-card--live').forEach(function(other) {
                if (other !== card) other.classList.remove('video-card--live');
            });
        }
        card.classList.toggle('video-card--live', live);
    }

    function bindYouTubePostMessage() {
        if (window.__ytVideoMessageBound) return;
        window.__ytVideoMessageBound = true;

        window.addEventListener('message', function(event) {
            if (event.origin !== 'https://www.youtube.com' && event.origin !== 'https://www.youtube-nocookie.com') {
                return;
            }

            let data;
            try {
                data = JSON.parse(event.data);
            } catch (_) {
                return;
            }

            if (data.event !== 'onStateChange' || data.info === undefined) return;

            let iframe = data.id ? document.getElementById(data.id) : null;
            if (!iframe && event.source) {
                iframe = Array.from(document.querySelectorAll('.video-card iframe')).find(function(frame) {
                    return frame.contentWindow === event.source;
                }) || null;
            }
            if (!iframe) return;

            const card = iframe.closest('.video-card');
            if (!card) return;

            if (data.info === 1) {
                onVideoPlay(card);
            } else if (data.info === 2 || data.info === 0) {
                setVideoLive(card, false);
            }
        });
    }

    function registerPlayersInScope(scope) {
        scope.querySelectorAll('.video-card[data-video-id] iframe[id^="ytplayer-"]').forEach(function(iframe) {
            const card = iframe.closest('.video-card');
            registerIframePlayer(card, iframe);
        });
    }

    function initYouTubePlayers(root) {
        const scope = root || document;
        bindYouTubePostMessage();
        registerPlayersInScope(scope);

        const mounts = scope.querySelectorAll('.video-card[data-video-id] .video-player-mount');
        if (!mounts.length) return;

        ensureYouTubeApi().then(function() {
            mounts.forEach(function(mount) {
                if (mount.dataset.ytReady === '1') return;

                const card = mount.closest('.video-card');
                const videoId = card && card.getAttribute('data-video-id');
                if (!videoId) return;

                mount.dataset.ytReady = '1';
                const player = new YT.Player(mount.id, {
                    videoId: videoId,
                    width: '100%',
                    height: '100%',
                    playerVars: {
                        rel: 0,
                        modestbranding: 1,
                        playsinline: 1,
                        origin: window.location.origin
                    },
                    events: {
                        onReady: function() {
                            playersByCard.set(card, { type: 'api', player: player });
                        },
                        onStateChange: function(event) {
                            if (event.data === YT.PlayerState.PLAYING) {
                                onVideoPlay(card);
                            } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
                                setVideoLive(card, false);
                            }
                        }
                    }
                });
                playersByCard.set(card, { type: 'api', player: player });
            });
        }).catch(function(error) {
            console.warn('No se pudo inicializar YouTube Player API:', error);
        });
    }

    return {
        escapeHtml,
        extractYouTubeId,
        resolveVideoId,
        buildVideoCard,
        buildAdminVideoItem,
        buildVideoGrid,
        checkVideoLoad,
        initYouTubePlayers
    };
})();
