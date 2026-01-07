// Description: Extracts video and GIF links from the current webpage and exports them as a JSON file.

(function() {
    const results = [];
    const seen = new Set();

    // 1. Suche nach echten Video-Elementen
    const videos = document.querySelectorAll('video, video source');
    videos.forEach(v => {
        let src = v.src || v.getAttribute('src');
        if (src && src.startsWith('http') && !seen.has(src)) {
            seen.add(src);
            results.push({
                type: 'video',
                url: src,
                page_title: document.title,
                timestamp: new Date().toISOString()
            });
        }
    });

    // 2. Suche nach GIFs (in img Tags und Links)
    const imgs = document.querySelectorAll('img, a');
    imgs.forEach(el => {
        let src = el.src || el.href || el.currentSrc;
        if (src && typeof src === 'string' && src.toLowerCase().includes('.gif') && !seen.has(src)) {
            seen.add(src);
            results.push({
                type: 'gif',
                url: src,
                page_title: document.title,
                timestamp: new Date().toISOString()
            });
        }
    });

    if (results.length === 0) {
        alert("Keine Videos oder GIFs gefunden!");
        return;
    }

    // Export als JSON
    const dataStr = JSON.stringify(results, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
    a.href = url;
    a.download = `${ts}_media_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    alert(`${results.length} Medien-Links (Videos/GIFs) extrahiert!`);
})();