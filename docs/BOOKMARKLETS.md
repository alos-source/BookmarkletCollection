# Available Bookmarklets

Source Code: [https://github.com/alos-source/BookmarkletCollection](https://github.com/alos-source/BookmarkletCollection)

---

### Amazon To Camel
*Opens the CamelCamelCamel price tracking page for the current Amazon product.*

👉 [Install Amazon To Camel](javascript:(function()%7Bvar%20asinMatch=window.location.href.match(/%5C/(%3F:dp%7Cproduct)%5C/(%5BA-Z0-9%5D%7B10%7D)/i);if(asinMatch%26%26asinMatch%5B1%5D)%7Bvar%20asin=asinMatch%5B1%5D;var%20hostname=window.location.hostname;var%20tld=hostname.split(%27.%27).pop();if(hostname.indexOf(%27.co.uk%27)%21==-1)%7Btld=%27uk%27;%7D%0Avar%20subdomain=(tld===%27com%27)%3F%27https://%27:%27https://%27%2Btld%2B%27.%27;var%20camelUrl=subdomain%2B%27camelcamelcamel.com/product/%27%2Basin;window.open(camelUrl,%27_blank%27);%7Delse%7Balert(%22Keine%20Amazon%20Produkt-ID%20(ASIN)%20gefunden.%20Bist%20du%20auf%20einer%20Produktseite%3F%22);%7D%7D)();)

---
### Image Scraper
*Extracts image URLs from the current webpage and exports them as a JSON file.*

👉 [Install Image Scraper](javascript:(function()%7Bconst%20images=document.querySelectorAll(%27img%27);const%20results=%5B%5D;const%20seen=new%20Set();images.forEach((img)=%3E%7Blet%20src=img.currentSrc%7C%7Cimg.src;if(img.srcset)%7Bconst%20srcsetArray=img.srcset.split(%27,%27).map(s=%3Es.trim().split(%27%20%27)%5B0%5D);src=srcsetArray%5BsrcsetArray.length-1%5D;%7D%0Aif(src%26%26src.startsWith(%27http%27)%26%26%21seen.has(src))%7Bif(img.naturalWidth%3E50%7C%7Cimg.naturalHeight%3E50%7C%7C%21img.complete)%7Bseen.add(src);results.push(%7Balt:img.alt%7C%7C%22Kein%20Titel%22,url:src,page_title:document.title,timestamp:new%20Date().toISOString()%7D);%7D%7D%7D);if(results.length===0)%7Balert(%22Keine%20Bilder%20gefunden.%20Scrolle%20eventuell%20nach%20unten%20(Lazy%20Loading)%21%22);return;%7D%0Aconst%20dataStr=JSON.stringify(results,null,2);const%20blob=new%20Blob(%5BdataStr%5D,%7Btype:%22application/json%22%7D);const%20url=URL.createObjectURL(blob);const%20a=document.createElement(%27a%27);const%20timestamp=new%20Date().toISOString().replace(/%5B:.%5D/g,%27-%27).slice(0,16);a.href=url;a.download=%60%24%7Btimestamp%7D_images.json%60;document.body.appendChild(a);a.click();document.body.removeChild(a);alert(%60%24%7Bresults.length%7DBild-URLs%20wurden%20exportiert%21%60);%7D)();)

---
### Invert Site
*Inverts the colors of the webpage (dark mode simulator).*

👉 [Install Invert Site](javascript:(function()%7Bvar%20e=document.querySelector(%22%2A%22).style;if(e.filter.includes(%22invert(100%25)%22))%7Be.filter=%22invert(0%25)%22;%7Delse%7Be.filter=%22invert(100%25)%22;%7D%7D)();)

---
### Link Scraper
*Extracts all links from the current webpage and exports them as a JSON file.*

👉 [Install Link Scraper](javascript:(function()%7Bconst%20links=Array.from(document.links);const%20results=%5B%5D;const%20seen=new%20Set();links.forEach(link=%3E%7Bconst%20url=link.href;const%20text=link.innerText.trim()%7C%7Clink.title%7C%7C%22Kein%20Text%22;if(url.startsWith(%27http%27)%26%26%21seen.has(url))%7Bseen.add(url);results.push(%7Btext:text,url:url,page:document.title,timestamp:new%20Date().toISOString()%7D);%7D%7D);if(results.length===0)%7Balert(%22Keine%20Links%20gefunden%21%22);return;%7D%0Aconst%20dataStr=JSON.stringify(results,null,2);const%20blob=new%20Blob(%5BdataStr%5D,%7Btype:%22application/json%22%7D);const%20url=URL.createObjectURL(blob);const%20a=document.createElement(%27a%27);const%20ts=new%20Date().toISOString().replace(/%5B:.%5D/g,%27-%27).slice(0,16);a.href=url;a.download=%60%24%7Bts%7D_links_export.json%60;document.body.appendChild(a);a.click();document.body.removeChild(a);alert(%60%24%7Bresults.length%7DLinks%20wurden%20als%20JSON%20exportiert%21%60);%7D)();)

---
### Mail Share
*Creates a new email with the title and link of the current page.*

👉 [Install Mail Share](javascript:(function()%7Bopen(%22mailto:team%40example.com%3Fsubject=FYI:%20%22%2BencodeURI(document.title)%2B%22%26body=%22%2BencodeURI(location));%7D)();)

---
### Qr Generator
*Creates a QR code of the current URL for quick scanning with a mobile device.*

👉 [Install Qr Generator](javascript:(function()%7Bvar%20i=%27qr-bm-ol%27;if(document.getElementById(i))return;var%20s=document.createElement(%27script%27);s.src=%27https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js%27;s.onerror=function()%7Balert(%22Sicherheitsblockade%20(CSP):%20Diese%20Seite%20erlaubt%20das%20Laden%20externer%20Scripte%20nicht.%20Das%20Bookmarklet%20kann%20hier%20leider%20nicht%20ausgef%C3%BChrt%20werden.%22);%7D;s.onload=function()%7Bvar%20o=document.createElement(%27div%27);o.id=i;o.style.cssText=%27position:fixed;top:0;left:0;width:100%25;height:100%25;background:rgba(0,0,0,0.7);z-index:100000;display:flex;justify-content:center;align-items:center;%27;var%20b=document.createElement(%27div%27);b.style.cssText=%27background:%23fff;padding:25px;border-radius:10px;text-align:center;position:relative;font-family:sans-serif;%27;var%20c=document.createElement(%27span%27);c.innerHTML=%27%C3%97%27;c.style.cssText=%27position:absolute;top:0;right:10px;cursor:pointer;font-size:28px;color:%23999;%27;c.onclick=function()%7Bdocument.body.removeChild(o);%7D;var%20q=document.createElement(%27div%27);q.style.margin=%2715px%20auto%27;var%20d=document.createElement(%27a%27);d.innerText=%27Bild%20speichern%27;d.style.cssText=%27display:inline-block;margin-top:15px;padding:10px%2020px;background:%23333;color:white;text-decoration:none;border-radius:5px;%27;b.appendChild(c);b.appendChild(q);b.appendChild(d);o.appendChild(b);document.body.appendChild(o);new%20QRCode(q,%7Btext:window.location.href,width:220,height:220%7D);setTimeout(function()%7Bvar%20cv=q.getElementsByTagName(%27canvas%27)%5B0%5D;d.href=cv%3Fcv.toDataURL():q.getElementsByTagName(%27img%27)%5B0%5D.src;d.download=%27qr.png%27;%7D,200);%7D;document.body.appendChild(s);%7D)();)

---
### Video Scraper
*Extracts video and GIF links from the current webpage and exports them as a JSON file.*

👉 [Install Video Scraper](javascript:(function()%7Bconst%20results=%5B%5D;const%20seen=new%20Set();const%20videos=document.querySelectorAll(%27video,%20video%20source%27);videos.forEach(v=%3E%7Blet%20src=v.src%7C%7Cv.getAttribute(%27src%27);if(src%26%26src.startsWith(%27http%27)%26%26%21seen.has(src))%7Bseen.add(src);results.push(%7Btype:%27video%27,url:src,page_title:document.title,timestamp:new%20Date().toISOString()%7D);%7D%7D);const%20imgs=document.querySelectorAll(%27img,%20a%27);imgs.forEach(el=%3E%7Blet%20src=el.src%7C%7Cel.href%7C%7Cel.currentSrc;if(src%26%26typeof%20src===%27string%27%26%26src.toLowerCase().includes(%27.gif%27)%26%26%21seen.has(src))%7Bseen.add(src);results.push(%7Btype:%27gif%27,url:src,page_title:document.title,timestamp:new%20Date().toISOString()%7D);%7D%7D);if(results.length===0)%7Balert(%22Keine%20Videos%20oder%20GIFs%20gefunden%21%22);return;%7D%0Aconst%20dataStr=JSON.stringify(results,null,2);const%20blob=new%20Blob(%5BdataStr%5D,%7Btype:%22application/json%22%7D);const%20url=URL.createObjectURL(blob);const%20a=document.createElement(%27a%27);const%20ts=new%20Date().toISOString().replace(/%5B:.%5D/g,%27-%27).slice(0,16);a.href=url;a.download=%60%24%7Bts%7D_media_export.json%60;document.body.appendChild(a);a.click();document.body.removeChild(a);alert(%60%24%7Bresults.length%7DMedien-Links(Videos/GIFs)extrahiert%21%60);%7D)();)
