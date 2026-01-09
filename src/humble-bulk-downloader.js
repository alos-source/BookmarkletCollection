// Description: Downloads all available zip files from a Humble Bundle page in bulk.

(function() {
    // 1. Alle potenziellen Download-Links sammeln
    const links = Array.from(document.querySelectorAll('a'));
    const downloadUrls = [];
    const seen = new Set();

    links.forEach(a => {
        const href = a.href || "";
        const text = (a.innerText || "").toUpperCase().trim();
        
        // Filter-Kriterien:
        // - Enthält cdn.humble.com
        // - ODER Text ist genau "ZIP"
        // - ODER Text ist "HERUNTERLADEN"
        const isHumbleCdn = href.includes('cdn.humble.com');
        const isZipText = text === 'ZIP';
        const isDownloadText = text === 'HERUNTERLADEN' || text === 'DOWNLOAD';

        if (href && (isHumbleCdn || isZipText || isDownloadText) && !seen.has(href)) {
            // Wir filtern Anker-Links und leere URLs aus
            if (href.startsWith('http')) {
                seen.add(href);
                downloadUrls.push(href);
            }
        }
    });

    if (downloadUrls.length === 0) {
        alert("Keine Download-Links gefunden!");
        return;
    }

    if (!confirm(downloadUrls.length + " Downloads gefunden. Möchtest du den Bulk-Download starten?\n\n(Hinweis: Erlaube Pop-ups für diese Seite, falls der Browser blockiert.)")) {
        return;
    }

    // 2. Downloads sequenziell starten (um den Browser nicht zu überlasten)
    downloadUrls.forEach((url, index) => {
        setTimeout(() => {
            console.log("Starte Download " + (index + 1) + ": " + url);
            
            // Wir nutzen ein verstecktes IFrame für den Download, 
            // damit keine 20 Tabs geöffnet werden.
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);
            
            // Nach 30 Sekunden aufräumen
            setTimeout(() => document.body.removeChild(iframe), 30000);
            
        }, index * 1500); // 1.5 Sekunden Pause zwischen den Downloads
    });

    alert("Bulk-Download gestartet. Bitte lass den Tab offen, bis alle Dateien angefordert wurden.");
})();