// Description: Creates a new email with the title and link of the current page.

(function(){
   open("mailto:team@example.com?subject=FYI: " + encodeURI(document.title) + "&body=" + encodeURI(location));
})();