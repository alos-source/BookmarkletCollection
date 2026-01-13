// Description: Extracts recipe data from structured JSON-LD and creates a markdown note in Obsidian if installed. Asks for the Obsidian vault name on first use. Tested with chefkoch.de and kitchenstories.com, but should work with any site that uses JSON-LD.

(function() {
    // 1. Suche nach Rezept-Daten (LD+JSON)
    var scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    var recipeData = null;

    for (var i = 0; i < scripts.length; i++) {
        try {
            var json = JSON.parse(scripts[i].textContent);
            var graph = json['@graph'] || (Array.isArray(json) ? json : [json]);
            recipeData = graph.find(function(item) {
                return item['@type'] === 'Recipe' || (Array.isArray(item['@type']) && item['@type'].includes('Recipe'));
            });
            if (recipeData) break;
        } catch (e) {}
    }

    if (!recipeData) {
        alert("Kein Rezept im Quellcode gefunden.");
        return;
    }

    // 2. Daten extrahieren
    var title = recipeData.name || document.title;
    var ingredients = Array.isArray(recipeData.recipeIngredient) ? recipeData.recipeIngredient.join('\n- ') : (recipeData.recipeIngredient || '');
    
    function parseSteps(stepArray) {
        var allSteps = [];
        stepArray.forEach(function(s) {
            if (s['@type'] === 'HowToSection' && s.itemListElement) {
                allSteps = allSteps.concat(parseSteps(s.itemListElement));
            } else {
                var text = (typeof s === 'object') ? (s.text || s.name || "") : s;
                if (text) allSteps.push(text.trim());
            }
        });
        return allSteps;
    }

    var rawSteps = recipeData.step || recipeData.recipeInstructions || [];
    var stepList = parseSteps(Array.isArray(rawSteps) ? rawSteps : [rawSteps]);
    var instructions = stepList.map(function(text, i) { return (i + 1) + ". " + text; }).join('\n\n');

    // 3. Markdown-Inhalt zusammenbauen
    var md = "---\nsource: " + window.location.href + "\nauthor: " + (recipeData.author && recipeData.author.name ? recipeData.author.name : 'Unbekannt') + "\ntags: [rezept]\n---\n# " + title + "\n\n## Zutaten\n- " + ingredients + "\n\n## Anleitung\n" + instructions;

    // 4. Vault-Logik (Robust)
    var VAULT_KEY = 'obsidian_vault_name';
    var vaultName = localStorage.getItem(VAULT_KEY);

    if (!vaultName || vaultName === "undefined" || vaultName === "null") {
        vaultName = prompt("Obsidian Vault nicht gefunden. Bitte gib den Namen deines Vault ein (Exakte Groß-/Kleinschreibung!):", "Privat");
        if (vaultName) {
            try { localStorage.setItem(VAULT_KEY, vaultName); } catch(e) {}
        } else {
            return; 
        }
    }

    // 5. Obsidian URI ausführen
    var fileName = title.replace(/[/\\?%*:|"<>]/g, '-');
    var obsidianUrl = "obsidian://new?vault=" + encodeURIComponent(vaultName) + 
                      "&name=" + encodeURIComponent(fileName) + 
                      "&content=" + encodeURIComponent(md);

    // Virtueller Link-Klick für maximale Kompatibilität
    var link = document.createElement('a');
    link.href = obsidianUrl;
    link.click();
})();