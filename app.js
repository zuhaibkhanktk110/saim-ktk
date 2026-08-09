function saveProduct() {

  const barcode = document.getElementById("newBarcode").value.trim();
  const name = document.getElementById("newName").value.trim();
  const cost = Number(document.getElementById("newCost").value);
  const price = Number(document.getElementById("newPrice").value);
  const photoInput = document.getElementById("productPhoto");

  if (!name) {
    alert("❌ Product Name لکھیں");
    return;
  }

  if (!price) {
    alert("❌ Sale Price لکھیں");
    return;
  }

  // تصویر کو پہلے چھوٹا کریں
  if (photoInput.files && photoInput.files[0]) {

    const file = photoInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {

      const img = new Image();

      img.onload = function() {

        const canvas = document.createElement("canvas");

        const maxWidth = 700;
        const scale = Math.min(1, maxWidth / img.width);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // تصویر کو compress کریں
        const photo = canvas.toDataURL("image/jpeg", 0.65);

        saveProductData(
          barcode,
          name,
          cost,
          price,
          photo
        );
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);

  } else {

    saveProductData(
      barcode,
      name,
      cost,
      price,
      ""
    );
  }
}


function saveProductData(barcode, name, cost, price, photo) {

  try {

    let products =
      JSON.parse(localStorage.getItem("products")) || [];

    const product = {
      id: Date.now(),
      barcode: barcode,
      name: name,
      cost: cost,
      price: price,
      photo: photo,
      createdAt: new Date().toISOString()
    };

    products.push(product);

    localStorage.setItem(
      "products",
      JSON.stringify(products)
    );

    alert("✅ Product کامیابی سے Save ہو گیا");

    // فارم صاف کریں
    document.getElementById("newBarcode").value = "";
    document.getElementById("newName").value = "";
    document.getElementById("newCost").value = "";
    document.getElementById("newPrice").value = "";

    const photoInput =
      document.getElementById("productPhoto");

    photoInput.value = "";

    const preview =
      document.getElementById("photoPreview");

    if (preview) {
      preview.src = "";
      preview.style.display = "none";
    }

  } catch (error) {

    console.error("Product Save Error:", error);

    alert(
      "❌ Product save نہیں ہو سکا۔\n\n" +
      "Browser storage کا مسئلہ ہے۔"
    );
  }
}
