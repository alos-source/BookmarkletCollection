// Description: Captures a screenshot of the current page and downloads it as an image.

(function() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = function() {
        html2canvas(document.body).then(canvas => {
            const link = document.createElement('a');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
            link.download = `screenshot_${timestamp}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            alert("Screenshot captured and download started!");
        });
    };
    document.head.appendChild(script);
})();