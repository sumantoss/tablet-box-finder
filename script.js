let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let img = new Image();

function processImage() {
  const fileInput = document.getElementById('imageUpload');
  const searchText = document.getElementById('searchText').value.trim().toLowerCase();

  if (!fileInput.files[0] || !searchText) {
    alert("Upload an image and enter tablet name.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      Tesseract.recognize(img.src, 'eng', {
        logger: m => console.log(m)
      }).then(({ data: { words } }) => {
        words.forEach(word => {
          const text = word.text.toLowerCase();
          if (text.includes(searchText)) {
            const { x0, y0, x1, y1 } = word.bbox;
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
          }
        });
      });
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(fileInput.files[0]);
}
