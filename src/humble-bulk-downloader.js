// Description: Downloads all available Humble Bundle files in batches to avoid browser timeouts. Also provides a "Plan B" option to copy all download links for manual use in download managers like JDownloader. Only works on Humble Bundle 'Keys & Entitlements' pages, for purchased items.

(function() {
    // --- 1. DATEN-EXTRAKTION ---
    const links = Array.from(document.querySelectorAll('a'));
    const downloadQueue = [];
    const seen = new Set();

    links.forEach(a => {
        const href = a.href || "";
        const text = (a.innerText || "").toUpperCase().trim();
        const isHumble = href.includes('cdn.humble.com');
        const isDownloadText = (text === 'ZIP' || text === 'HERUNTERLADEN' || text === 'DOWNLOAD');

        if (href && (isHumble || isDownloadText) && !seen.has(href) && href.startsWith('http')) {
            seen.add(href);
            downloadQueue.push({ url: href, element: a });
        }
    });

    if (downloadQueue.length === 0) {
        alert("Keine Downloads gefunden! Bist du auf der 'Keys & Entitlements' Seite?");
        return;
    }

    // --- 2. UI ERSTELLEN (DAS OVERLAY) ---
    const overlay = document.createElement('div');
    overlay.id = "hb-manager-overlay";
    overlay.style = "position:fixed;top:5%;left:10%;width:80%;max-height:85%;background:#111;color:#eee;z-index:1000000;padding:25px;border:3px solid #ed1c24;overflow-y:auto;font-family:monospace;box-shadow:0 0 50px rgba(0,0,0,0.8);line-height:1.5;";
    
    overlay.innerHTML = `
        <h2 style="color:#ed1c24;margin-top:0;">🚀 Humble Bulk Downloader & Plan B</h2>
        <div style="background:#222;padding:15px;border-left:4px solid #ed1c24;margin-bottom:20px;">
            <strong>Modus: Batch-Download</strong> (5 Dateien alle 2 Min, um Browser-Sperren zu umgehen).<br>
            Status: <span id="hb-status">Bereit</span>
        </div>
        
        <div style="display:flex;gap:10px;margin-bottom:20px;">
            <button id="hb-start-btn" style="background:#ed1c24;color:white;border:none;padding:10px 20px;cursor:pointer;font-weight:bold;">AUTOMATIK STARTEN</button>
            <button id="hb-copy-btn" style="background:#444;color:white;border:none;padding:10px 20px;cursor:pointer;">LINKS KOPIEREN (PLAN B)</button>
            <button id="hb-close-btn" style="background:transparent;color:#888;border:1px solid #444;padding:10px 20px;cursor:pointer;">ABBRECHEN</button>
        </div>

        <p>Gefundene Links (${downloadQueue.length}):</p>
        <textarea id="hb-url-list" readonly style="width:100%;height:150px;background:#000;color:#0f0;border:1px solid #333;padding:10px;font-size:11px;">${downloadQueue.map(d => d.url).join('\n')}</textarea>
        
        <div id="hb-log" style="margin-top:20px;font-size:12px;color:#aaa;max-height:200px;overflow-y:auto;border-top:1px solid #333;padding-top:10px;">
            [System] Warte auf Benutzereingabe...
        </div>
    `;
    document.body.appendChild(overlay);

    // --- 3. LOGIK-FUNKTIONEN ---
    const log = (msg) => {
        const entry = document.createElement('div');
        entry.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
        const logDiv = document.getElementById('hb-log');
        logDiv.prepend(entry);
    };

    const copyLinks = () => {
        const textarea = document.getElementById('hb-url-list');
        textarea.select();
        document.execCommand('copy');
        log("Links in Zwischenablage kopiert! (Ideal für JDownloader)");
        alert("Links kopiert!");
    };

    const startAutomatedDownload = () => {
        const BATCH_SIZE = 5;
        const BATCH_WAIT = 120000; // 2 Minuten
        const STEP_WAIT = 3000;   // 3 Sekunden zwischen Klicks
        let currentIndex = 0;

        document.getElementById('hb-start-btn').disabled = true;
        document.getElementById('hb-status').innerText = "Download läuft...";

        function processBatch() {
            let end = Math.min(currentIndex + BATCH_SIZE, downloadQueue.length);
            log(`Starte Batch: Dateien ${currentIndex + 1} bis ${end}...`);

            for (let i = 0; i < (end - currentIndex); i++) {
                const itemIndex = currentIndex + i;
                setTimeout(() => {
                    const item = downloadQueue[itemIndex];
                    
                    // Visuelles Feedback auf der Originalseite
                    if (item.element) {
                        item.element.style.outline = "3px solid #0f0";
                        item.element.style.background = "rgba(0,255,0,0.2)";
                    }

                    // Download triggern
                    const a = document.createElement('a');
                    a.href = item.url;
                    a.style.display = 'none';
                    a.setAttribute('download', '');
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => document.body.removeChild(a), 2000);
                    
                    log(`Getriggert (${itemIndex + 1}/${downloadQueue.length}): ${item.url.split('?')[0].split('/').pop()}`);
                }, i * STEP_WAIT);
            }

            currentIndex = end;

            if (currentIndex < downloadQueue.length) {
                let timeLeft = BATCH_WAIT / 1000;
                log(`Batch beendet. Pause für ${timeLeft}s zur Vermeidung von Browser-Sperren...`);
                
                const timer = setInterval(() => {
                    timeLeft--;
                    document.getElementById('hb-status').innerText = `Nächster Batch in ${timeLeft}s...`;
                    if (timeLeft <= 0) {
                        clearInterval(timer);
                        processBatch();
                    }
                }, 1000);
            } else {
                document.getElementById('hb-status').innerText = "✅ ALLE DOWNLOADS GETRIGGERT";
                log("Fertig! Bitte lass den Tab offen, bis alle Browser-Downloads abgeschlossen sind.");
            }
        }

        processBatch();
    };

    const downloadCrawljob = () => {
        let jobContent = "";
        downloadQueue.forEach(item => {
            // Für jeden Link einen Eintrag im Crawljob-Format
            jobContent += `text="${item.url}"\n`;
            jobContent += `packageName="${bundleName}"\n`;
            jobContent += `extractPassword="n/a"\n\n`;
        });

        const blob = new Blob([jobContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${bundleName}.crawljob`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        log("Crawljob-Datei wurde generiert und heruntergeladen.");
    };

    // --- 4. EVENT LISTENER ---
    document.getElementById('hb-copy-btn').onclick = copyLinks;
    document.getElementById('hb-start-btn').onclick = startAutomatedDownload;
    document.getElementById('hb-close-btn').onclick = () => overlay.remove();

})();