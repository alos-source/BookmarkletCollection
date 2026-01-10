// Description: Creates a CSV export of Humble Bundle keys with title, status, key, and page link to download. Only works on Humble Bundle key redemption pages, for purchased items.

(function() {
    try {
        const jetzt = new Date();
        const datum = jetzt.toISOString().split('T')[0];
        const seitenUrl = window.location.href; /* Speichert den aktuellen Link */

        let namePart = "HumbleBundle_Export";
        const logoLink = document.querySelector('a#logo');
        if (logoLink && logoLink.getAttribute('href')) {
            const parts = logoLink.getAttribute('href').split('?')[0].split('/').filter(p => p.length > 0);
            if (parts.length >= 2) {
                namePart = parts[parts.length - 2] + "_" + parts[parts.length - 1];
            }
        }
        
        const fileName = datum + "_" + namePart;

        const items = document.querySelectorAll('.key-redeemer');
        const results = [];

        items.forEach(item => {
            const titleEl = item.querySelector('.heading-text');
            const keyEl = item.querySelector('.keyfield-value');
            
            if (titleEl && keyEl) {
                const title = titleEl.innerText.trim();
                const keyValue = keyEl.innerText.trim();
                
                let status = "Verfügbar";
                let finalKey = "";

                if (keyValue.toLowerCase().includes("abgelaufen") || keyValue.toLowerCase().includes("expired")) {
                    status = "Abgelaufen";
                    finalKey = "ABGELAUFEN";
                } else if (!keyValue.includes("Legen Sie Ihren") && !keyValue.includes("Reveal your") && keyValue.length > 5) {
                    status = "Eingelöst";
                    finalKey = keyValue;
                }

                results.push({ Titel: title, Status: status, Key: finalKey });
            }
        });

        if (results.length === 0) {
            alert("Keine Keys gefunden.");
            return;
        }

        /* Spalte 'Link' */
        let csvContent = "\uFEFFTitel;Status;Key;Link\n";
        results.forEach(r => {
            const cleanTitle = r.Titel.replace(/"/g, '""');
            csvContent += `"${cleanTitle}";"${r.Status}";"${r.Key}";"${seitenUrl}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName + ".csv";
        
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);

    } catch (err) {
        console.error("Bookmarklet Fehler:", err);
        alert("Fehler beim Export.");
    }
})();