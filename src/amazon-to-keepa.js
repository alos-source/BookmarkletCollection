// Description: Opens the Keepa price tracking page for the current Amazon product.

(function() {
    var url = window.location.href;
    var asin = "";

    // Versuch A: ASIN aus der URL extrahieren
    var urlMatch = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:\/|\?|$)/);
    if (urlMatch) {
        asin = urlMatch[1];
    } else {
        // Versuch B: Suche in den Seitenelementen
        var asinInput = document.getElementById("ASIN") || document.querySelector('[data-asin]');
        asin = asinInput ? (asinInput.value || asinInput.getAttribute('data-asin')) : "";
    }

    if (!asin) {
        alert("Keine Amazon ASIN gefunden. Bist du auf einer Produktseite?");
        return;
    }

    var domainId = "1"; // Default .com
    if (url.indexOf(".de") !== -1) domainId = "3";
    else if (url.indexOf(".co.uk") !== -1) domainId = "2";
    else if (url.indexOf(".fr") !== -1) domainId = "4";
    else if (url.indexOf(".it") !== -1) domainId = "8";
    else if (url.indexOf(".es") !== -1) domainId = "9";

    // Wir bauen die URL mit einfachem Plus zusammen, um Backtick-Fehler zu vermeiden
    var keepaUrl = "https://keepa.com/#!product/" + domainId + "-" + asin;

    window.open(keepaUrl, '_blank');
})();