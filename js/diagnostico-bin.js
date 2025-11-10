// ===========================================
// DIAGNÓSTICO DE BIN ID - Dr.Malestar
// Script para encontrar el Bin ID correcto
// ===========================================

console.log('🔍 DIAGNÓSTICO DE BIN ID');
console.log('═══════════════════════════════════════');

async function diagnosticarBinId() {
    const apiKey = '$2a$10$oYe3uG0XIyCLhNeLvtrZjOSEAkLtqlABuEdQbM9QRKK0FRGVRdxfC';
    const baseUrl = 'https://api.jsonbin.io/v3';
    
    // 1. Bin ID del config.js
    const configBinId = window.CONFIG?.BIN_ID || 'No configurado';
    console.log('1️⃣ Bin ID en config.js:', configBinId);
    
    // 2. Bin ID en localStorage
    const localBinId = localStorage.getItem('drmalestar_bin_id');
    console.log('2️⃣ Bin ID en localStorage:', localBinId || 'No hay');
    
    // 3. Verificar contenido de cada bin
    const binsParaVerificar = [configBinId, localBinId].filter(id => id && id !== 'No configurado');
    
    console.log('\n🔍 Verificando contenido de los bins...\n');
    
    for (const binId of binsParaVerificar) {
        try {
            console.log(`\n📦 Verificando bin: ${binId}`);
            const response = await fetch(`${baseUrl}/b/${binId}`, {
                headers: {
                    'X-Master-Key': apiKey
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                const data = result.record || {};
                
                const flyers = Array.isArray(data.flyers) ? data.flyers.length : 0;
                const photos = Array.isArray(data.photos) ? data.photos.length : 0;
                const videos = Array.isArray(data.videos) ? data.videos.length : 0;
                const total = flyers + photos + videos;
                
                console.log(`   ✅ Flyers: ${flyers}`);
                console.log(`   ✅ Photos: ${photos}`);
                console.log(`   ✅ Videos: ${videos}`);
                console.log(`   📊 Total: ${total} elementos`);
                
                if (total > 0) {
                    console.log(`\n🎯 ¡ESTE ES EL BIN CORRECTO!`);
                    console.log(`\n📋 COPIA ESTE VALOR:`);
                    console.log(`%c${binId}`, 'background: #4ecdc4; color: white; font-size: 16px; font-weight: bold; padding: 10px;');
                    console.log(`\n✅ Actualiza config.js con este Bin ID para que todos los dispositivos lo usen.`);
                    return binId;
                } else {
                    console.log(`   ⚠️ Este bin está vacío`);
                }
            } else {
                console.log(`   ❌ Error ${response.status}: Bin no válido o no encontrado`);
            }
        } catch (error) {
            console.log(`   ❌ Error verificando bin:`, error.message);
        }
    }
    
    console.log('\n❌ No se encontró ningún bin con contenido.');
    console.log('💡 Puede que el contenido esté en otro bin o necesites cargarlo de nuevo.');
    return null;
}

// Ejecutar diagnóstico
diagnosticarBinId().then(binId => {
    if (binId) {
        console.log('\n═══════════════════════════════════════');
        console.log('📝 PRÓXIMOS PASOS:');
        console.log('1. Copia el Bin ID mostrado arriba');
        console.log('2. Abre config.js');
        console.log('3. Reemplaza BIN_ID con el valor copiado');
        console.log('4. Guarda y sube a Git/Netlify');
        console.log('═══════════════════════════════════════');
    }
});


