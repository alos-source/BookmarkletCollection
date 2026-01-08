// Description: Opens the Socialblade page for the YouTube channel handle of the current video or channel page.

(function() {
    var url = window.location.href;
    var handle = "";

    // Fall A: Wir sind auf einer Kanalseite (z.B. youtube.com/@Name)
    var channelMatch = url.match(/\/(?:\/)?(@[a-zA-Z0-9\._\-]+)/);
    
    // Fall B: Wir schauen ein Video. Wir suchen den Link zum Kanal unter dem Video
    var channelLink = document.querySelector('ytd-video-owner-renderer a[href*="/@"]');

    if (channelMatch && !url.includes('/watch')) {
        handle = channelMatch[1];
    } else if (channelLink) {
        var href = channelLink.getAttribute('href');
        var handleMatch = href.match(/(@[a-zA-Z0-9\._\-]+)/);
        if (handleMatch) handle = handleMatch[1];
    }

    // Fall C: Fallback für ältere Layouts oder wenn nichts gefunden wurde
    if (!handle) {
        // Suche nach dem @-Zeichen im gesamten Quelltext der Seite (Metadaten)
        var metaMatch = document.documentElement.innerHTML.match(/"@([a-zA-Z0-9\._\-]+)"/);
        if (metaMatch) handle = "@" + metaMatch[1];
    }

    if (!handle) {
        alert("Kein YouTube-Handle gefunden. Bist du auf einer Video- oder Kanalseite?");
        return;
    }

    // Socialblade URL zusammenbauen
    // Wichtig: Socialblade erwartet das Format /youtube/handle/@Name
    var sbUrl = "https://socialblade.com/youtube/handle/" + handle;

    window.open(sbUrl, '_blank');
})();