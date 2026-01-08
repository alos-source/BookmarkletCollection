// Description: Finds and displays RSS feeds on the current page.

(function() {
    const feeds = [];
    const seen = new Set();

    // 1. Priorität: Echte Meta-Tags im Header (100% sicher)
    const metaLinks = document.querySelectorAll('link[type*="rss"], link[type*="atom"], link[type*="xml"][rel="alternate"]');
    metaLinks.forEach(link => {
        const url = link.href;
        if (url && !seen.has(url)) {
            seen.add(url);
            feeds.push({ title: link.title || "RSS/Atom Feed", url: url, type: "Header Meta" });
        }
    });

    // 2. Suche in <a> Tags mit schärferen Filtern
    const anchors = document.querySelectorAll('a');
    anchors.forEach(a => {
        const url = a.href;
        const rel = (a.getAttribute('rel') || "").toLowerCase();
        const text = a.innerText.trim();
        const textLower = text.toLowerCase();
        
        // KRITERIEN:
        // - URL hat ein klares Feed-Muster (z.B. /feed/, /rss, .xml)
        const isFeedUrl = /\/(feed|rss|atom|rdf)s?(\/|$|\.|\?)/i.test(url);
        
        // - Rel-Attribut sagt explizit 'alternate'
        const isFeedRel = rel.includes('alternate');
        
        // - Der Text ist SEHR KURZ und enthält Feed-Begriffe (verhindert False-Positives bei Artikeln)
        const isShortFeedText = text.length < 15 && (textLower.includes('rss') || textLower === 'atom' || textLower === 'feed' || textLower === 'feeds');

        if (url && url.startsWith('http') && !seen.has(url)) {
            // Ein Link muss entweder die URL-Struktur haben ODER den expliziten Rel-Tag ODER einen sehr kurzen, eindeutigen Text
            if (isFeedUrl || isFeedRel || isShortFeedText) {
                // Zusätzlicher Check: Wenn es ein langer Text mit "Atom" ist, ist es wahrscheinlich ein Physik-Artikel -> Ignorieren
                if (textLower.includes('atom') && text.length > 20 && !isFeedUrl) return;

                seen.add(url);
                feeds.push({ 
                    title: text.substring(0, 50) + (text.length > 50 ? "..." : ""), 
                    url: url, 
                    type: isFeedRel ? "Standard-Link" : "Muster-Match" 
                });
            }
        }
    });

    if (feeds.length === 0) {
        alert("Kein RSS-Feed gefunden.");
        return;
    }

    console.table(feeds);
    if (feeds.length === 1) {
        if (confirm(`Feed gefunden:\n\n${feeds[0].title}\n${feeds[0].url}\n\nKopieren?`)) {
            navigator.clipboard.writeText(feeds[0].url);
        }
    } else {
        const list = feeds.map((f, i) => `${i+1}. ${f.title}: ${f.url}`).join('\n\n');
        alert(`${feeds.length} Feeds gefunden:\n\n${list}`);
    }
})();