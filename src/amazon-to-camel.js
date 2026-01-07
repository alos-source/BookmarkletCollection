// Description: Opens the CamelCamelCamel price tracking page for the current Amazon product.

(function() {
    // ASIN extrahieren (10 alphanumerische Zeichen nach /dp/ oder /product/)
    var asinMatch = window.location.href.match(/\/(?:dp|product)\/([A-Z0-9]{10})/i);
    
    if (asinMatch && asinMatch[1]) {
        var asin = asinMatch[1];
        var hostname = window.location.hostname;
        var tld = hostname.split('.').pop(); // extrahiert 'de', 'com', 'it' etc.
        
        // Spezialfall für UK, da die TLD dort 'uk' ist, aber die Domain '.co.uk'
        if (hostname.indexOf('.co.uk') !== -1) { tld = 'uk'; }

        // CamelCamelCamel Subdomain bestimmen
        // .com hat keine Subdomain, andere Länder schon (de, it, fr, es, uk)
        var subdomain = (tld === 'com') ? 'https://' : 'https://' + tld + '.';
        var camelUrl = subdomain + 'camelcamelcamel.com/product/' + asin;
        
        window.open(camelUrl, '_blank');
    } else {
        alert("Keine Amazon Produkt-ID (ASIN) gefunden. Bist du auf einer Produktseite?");
    }
})();