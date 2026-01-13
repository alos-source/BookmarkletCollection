// Description: A toolbox bookmarklet that provides context-specific tools for various websites like recipe extraction, Humble Bundle downloads, Amazon price tracking, and YouTube channel analysis via SocialBlade.

(function(){
    /* 0. Basis-URL fuer RAW Skripte zum Laden */
    const BASE_URL='https://raw.githubusercontent.com/alos-source/BookmarkletCollection/main/src/';
    
    /* 1. Skript-Liste */
    const SCRIPTS={
        recipe: 'recipe-to-obsidian.js',
        humble: 'humble-bulk-downloader.js',
        humbleKeys: 'humble-keys.js',
        amazonKeepa: 'amazon-to-keepa.js',
        amazonCamel: 'amazon-to-camel.js',
        socialblade: 'yt-to-socialblade.js'
    };

    window.runToolboxModule=function(key){
        const url=BASE_URL+SCRIPTS[key]+'?t='+Date.now();
        fetch(url).then(r=>{if(!r.ok)throw new Error('404: '+url);return r.text();}).then(c=>{
            const s=document.createElement('script');
            s.textContent='\n'+c+'\n';
            document.head.appendChild(s);
        }).catch(e=>alert(e.message));
    };

    const host=window.location.hostname;
    const box=document.createElement('div');
    box.style="position:fixed;top:20px;right:20px;z-index:9999999;background:#1a1a1a;color:#fff;padding:15px;border-radius:10px;border:1px solid #ed1c24;font-family:sans-serif;box-shadow:0 10px 25px rgba(0,0,0,0.5);min-width:210px;";
    box.innerHTML=`<div style="font-weight:bold;color:#ed1c24;margin-bottom:10px;display:flex;justify-content:space-between"><span>Site Toolbox</span><span id="close-tb" style="cursor:pointer;color:#888">×</span></div>`;
    
    const area=document.createElement('div');
    box.appendChild(area);

    function addB(txt,fn){
        const b=document.createElement('button');
        b.innerText=txt;
        b.style="width:100%;margin-bottom:6px;padding:10px;background:#333;color:#fff;border:none;border-radius:4px;cursor:pointer;text-align:left;font-size:13px;display:block;";
        b.onclick=fn;
        area.appendChild(b);
    }

    /* 2. Kontext-Logik */
    if(host.includes('chefkoch.de') || host.includes('kitchenstories.com')){
        addB("📝 Rezept -> Obsidian", () => runToolboxModule('recipe'));
    } 
    else if(host.includes('humblebundle.com')){
        addB("🚀 Humble Bulk Download", () => runToolboxModule('humble'));
        addB("🔑 Humble Keys Export", () => runToolboxModule('humbleKeys'));
    } 
    else if(host.includes('amazon.')){
        addB("📉 Amazon -> Keepa", () => runToolboxModule('amazonKeepa'));
        addB("🐫 Amazon -> CamelCamelCamel", () => runToolboxModule('amazonCamel'));
    }
    else if(host.includes('youtube.com')){
        addB("📊 Video -> SocialBlade", () => runToolboxModule('socialblade'));
    }

    /* System-Bereich */
    addB("⚙️ Vault Name", () => {
        const v=prompt("Vault Name:", localStorage.getItem('obsidian_vault_name') || "Privat");
        if(v) localStorage.setItem('obsidian_vault_name', v);
    });

    document.body.appendChild(box);
    document.getElementById('close-tb').onclick=()=>box.remove();
})();