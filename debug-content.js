// ===========================================
// DEBUG CONTENT - DR. MALESTAR
// ===========================================

// Función para verificar que los elementos existen
function checkElements() {
    console.log('🔍 Verificando elementos del DOM...');
    
    const flyersContainer = document.getElementById('flyers-container');
    const photosContainer = document.getElementById('photos-container');
    const videosContainer = document.getElementById('videos-container');
    
    console.log('📋 Flyers container:', flyersContainer ? '✅ Encontrado' : '❌ No encontrado');
    console.log('📸 Photos container:', photosContainer ? '✅ Encontrado' : '❌ No encontrado');
    console.log('🎥 Videos container:', videosContainer ? '✅ Encontrado' : '❌ No encontrado');
    
    return {
        flyers: flyersContainer,
        photos: photosContainer,
        videos: videosContainer
    };
}

// Función para cargar contenido de forma muy simple
function loadDebugContent() {
    console.log('🚀 Cargando contenido de debug...');
    
    const elements = checkElements();
    
    // Cargar flyers
    if (elements.flyers) {
        console.log('🔄 Cargando flyers...');
        elements.flyers.innerHTML = `
            <div class="flyer-card fade-in">
                <img src="img/flyer1malestar.jpg" alt="Dr.Malestar en Memphis - Flyer 1" class="flyer-image" onerror="this.src='img/bluseraflier.jpg'">
                <div class="flyer-info">
                    <h3>Dr.Malestar en Memphis - Flyer 1</h3>
                    <p><i class="bi bi-calendar"></i> 31 de octubre de 2024 a las 22:00</p>
                    <p><i class="bi bi-geo-alt"></i> Memphis, Granville 1756</p>
                    <p>Show en vivo de Dr.Malestar en Memphis</p>
                </div>
                <div class="flyer-actions">
                    <a href="img/flyer1malestar.jpg" download class="btn btn-primary">
                        <i class="bi bi-cloud-download"></i> Descargar
                    </a>
                    <a href="#" class="btn btn-secondary">
                        <i class="bi bi-facebook"></i> Compartir
                    </a>
                </div>
            </div>
            <div class="flyer-card fade-in">
                <img src="img/flyer2malestar.jpg" alt="Dr.Malestar en Memphis - Flyer 2" class="flyer-image" onerror="this.src='img/bluseraflier.jpg'">
                <div class="flyer-info">
                    <h3>Dr.Malestar en Memphis - Flyer 2</h3>
                    <p><i class="bi bi-calendar"></i> 31 de octubre de 2024 a las 22:00</p>
                    <p><i class="bi bi-geo-alt"></i> Memphis, Granville 1756</p>
                    <p>Show en vivo de Dr.Malestar en Memphis</p>
                </div>
                <div class="flyer-actions">
                    <a href="img/flyer2malestar.jpg" download class="btn btn-primary">
                        <i class="bi bi-cloud-download"></i> Descargar
                    </a>
                    <a href="#" class="btn btn-secondary">
                        <i class="bi bi-facebook"></i> Compartir
                    </a>
                </div>
            </div>
            <div class="flyer-card fade-in">
                <img src="img/flyer3malestar.jpg" alt="Dr.Malestar en Memphis - Flyer 3" class="flyer-image" onerror="this.src='img/bluseraflier.jpg'">
                <div class="flyer-info">
                    <h3>Dr.Malestar en Memphis - Flyer 3</h3>
                    <p><i class="bi bi-calendar"></i> 31 de octubre de 2024 a las 22:00</p>
                    <p><i class="bi bi-geo-alt"></i> Memphis, Granville 1756</p>
                    <p>Show en vivo de Dr.Malestar en Memphis</p>
                </div>
                <div class="flyer-actions">
                    <a href="img/flyer3malestar.jpg" download class="btn btn-primary">
                        <i class="bi bi-cloud-download"></i> Descargar
                    </a>
                    <a href="#" class="btn btn-secondary">
                        <i class="bi bi-facebook"></i> Compartir
                    </a>
                </div>
            </div>
        `;
        console.log('✅ Flyers cargados');
    }
    
    // Cargar fotos
    if (elements.photos) {
        console.log('🔄 Cargando fotos...');
        elements.photos.innerHTML = `
            <div class="photo-card fade-in" onclick="openModal('img/hector1.jpg', 'Héctor Bass')">
                <img src="img/hector1.jpg" alt="Héctor Bass" class="photo-image">
                <div class="photo-overlay">
                    <h4 class="photo-title">Héctor Bass</h4>
                    <p class="photo-description">Bajo y Fundador</p>
                </div>
            </div>
            <div class="photo-card fade-in" onclick="openModal('img/hugo1.jpg', 'Hugo Mosca')">
                <img src="img/hugo1.jpg" alt="Hugo Mosca" class="photo-image">
                <div class="photo-overlay">
                    <h4 class="photo-title">Hugo "Mosca" Fleitas</h4>
                    <p class="photo-description">Batería</p>
                </div>
            </div>
            <div class="photo-card fade-in" onclick="openModal('img/moncho1.jpg', 'Moncho Carrizo')">
                <img src="img/moncho1.jpg" alt="Moncho Carrizo" class="photo-image">
                <div class="photo-overlay">
                    <h4 class="photo-title">Jorge "Moncho" Carrizo</h4>
                    <p class="photo-description">Guitarra y coros</p>
                </div>
            </div>
            <div class="photo-card fade-in" onclick="openModal('img/Tano1.jpg', 'Tano Macaroni')">
                <img src="img/Tano1.jpg" alt="Tano Macaroni" class="photo-image">
                <div class="photo-overlay">
                    <h4 class="photo-title">Julio "Tano" Macaroni</h4>
                    <p class="photo-description">Guitarra y coros</p>
                </div>
            </div>
            <div class="photo-card fade-in" onclick="openModal('img/negro1.jpg', 'Negro González')">
                <img src="img/negro1.jpg" alt="Negro González" class="photo-image">
                <div class="photo-overlay">
                    <h4 class="photo-title">Gustavo "Negro" González</h4>
                    <p class="photo-description">Voz y armónica</p>
                </div>
            </div>
            <div class="photo-card fade-in" onclick="openModal('img/pappo1.avif', 'Pappo')">
                <img src="img/pappo1.avif" alt="Pappo" class="photo-image">
                <div class="photo-overlay">
                    <h4 class="photo-title">Pappo</h4>
                    <p class="photo-description">Nuestro homenaje</p>
                </div>
            </div>
        `;
        console.log('✅ Fotos cargadas');
    }
    
    // Cargar videos
    if (elements.videos) {
        console.log('🔄 Cargando videos...');
        elements.videos.innerHTML = `
            <div class="video-card fade-in">
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/8Gt6jMM7KgY" title="Dr.Malestar - Macadam 3,2,1,0" frameborder="0" allowfullscreen loading="lazy"></iframe>
                </div>
                <div class="video-info">
                    <h3>Dr.Malestar - Macadam 3,2,1,0</h3>
                    <p>Presentación en Rodney Bar</p>
                </div>
            </div>
            <div class="video-card fade-in">
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/M6LpESnfHPY" title="Dr.Malestar - El Viejo" frameborder="0" allowfullscreen loading="lazy"></iframe>
                </div>
                <div class="video-info">
                    <h3>Dr.Malestar - El Viejo</h3>
                    <p>Interpretación clásica en vivo</p>
                </div>
            </div>
            <div class="video-card fade-in">
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/vwMUqDtNn6g" title="Dr.Malestar - Sucio y Desprolijo" frameborder="0" allowfullscreen loading="lazy"></iframe>
                </div>
                <div class="video-info">
                    <h3>Dr.Malestar - Sucio y Desprolijo</h3>
                    <p>ATP - Show completo</p>
                </div>
            </div>
            <div class="video-card fade-in">
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/yFczLmQ4TKk?start=73" title="Dr.Malestar - Botas Sucias" frameborder="0" allowfullscreen loading="lazy"></iframe>
                </div>
                <div class="video-info">
                    <h3>Dr.Malestar - Botas Sucias</h3>
                    <p>Iaios Bar - Presentación especial</p>
                </div>
            </div>
        `;
        console.log('✅ Videos cargados');
    }
    
    console.log('🎉 Contenido de debug cargado completamente');
}

// Función para verificar el estado de la página
function checkPageStatus() {
    console.log('📊 Estado de la página:');
    console.log('   📄 Documento cargado:', document.readyState);
    console.log('   🔗 URL actual:', window.location.href);
    console.log('   📱 User Agent:', navigator.userAgent);
    
    // Verificar scripts cargados
    const scripts = document.querySelectorAll('script[src]');
    console.log('   📜 Scripts cargados:', scripts.length);
    scripts.forEach((script, index) => {
        console.log(`      ${index + 1}. ${script.src}`);
    });
    
    // Verificar elementos
    checkElements();
}

// Hacer funciones disponibles globalmente
window.loadDebugContent = loadDebugContent;
window.checkPageStatus = checkPageStatus;
window.checkElements = checkElements;

// Mostrar instrucciones
console.log('🐛 Debug Content - Dr.Malestar');
console.log('💡 Instrucciones:');
console.log('   1. Ejecuta: checkPageStatus() - para ver el estado de la página');
console.log('   2. Ejecuta: checkElements() - para verificar elementos del DOM');
console.log('   3. Ejecuta: loadDebugContent() - para cargar contenido de forma simple');
console.log('');
console.log('🎯 Este script carga el contenido directamente en el HTML sin dependencias');



