let sales = JSON.parse(localStorage.getItem("saimKtkSales") || "[]");
let products = JSON.parse(localStorage.getItem("saimKtkProducts") || "[]");


// آج کی تاریخ
function today() {
  return new Date().toISOString().slice(0, 10);
}


// CAMERA OPEN
function openCamera() {
  document.getElementById("productPhoto").click();
}


// PHOTO PREVIEW
function previewPhoto(event) {

  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {

    const img = document.getElementById("photoPreview");

    img.src = e.target.result;
    img.style.display = "block";

    // تصویر temporary memory میں
    img.dataset.photo = e.target.result;
  };

  reader.readAsDataURL(file);
}


// PRODUCT SAVE
function saveProduct() {

  const barcode =
    document.getElementById("newBarcode").value.trim();

  const name =
    document.getElementById("newName").value.trim();

  const purchasePrice =
    Number(document.getElementById("newCost").value);

  const salePrice =
    Number(document.getElementById("newPrice").value);

  const photo =
    document.getElementById("photoPreview").dataset.photo || "";


  if (
    !barcode ||
    !name ||
    purchasePrice <= 0 ||
    salePrice <= 0
  ) {

    alert("Barcode، نام اور دونوں prices مکمل کریں");
    return;
  }


  const product = {
    barcode: barcode,
    name: name,
    purchasePrice: purchasePrice,
    salePrice: salePrice,
    photo: photo
  };


  const index =
    products.findIndex(x => x.barcode === barcode);


  if (index >= 0) {
    products[index] = product;
  } else {
    products.push(product);
  }


  localStorage.setItem(
    "saimKtkProducts",
    JSON.stringify(products)
  );


  alert("Product محفوظ ہو گیا");


  document.getElementById("newBarcode").value = "";
  document.getElementById("newName").value = "";
  document.getElementById("newCost").value = "";
  document.getElementById("newPrice").value = "";

  document.getElementById("productPhoto").value = "";

  const img = document.getElementById("photoPreview");

  img.src = "";
  img.style.display = "none";
  img.dataset.photo = "";
}


// PRODUCT SEARCH
function searchProduct() {

  const code =
    document.getElementById("barcode").value.trim();

  const product =
    products.find(x => x.barcode === code);


  if (!product) {

    alert("یہ Product محفوظ نہیں ہے");
    return;
  }


  document.getElementById("productName").value =
    product.name;

  document.getElementById("purchasePrice").value =
    product.purchasePrice;

  document.getElementById("salePrice").value =
    product.salePrice;
}


// CAMERA / BARCODE BUTTON
function scanProduct() {

  alert(
    "ابھی Camera سے Product کی تصویر لینے کے لیے نیچے Product Photo والا Camera استعمال کریں۔"
  );
}


// SALE SAVE
function saveSale() {

  const barcode =
    document.getElementById("barcode").value.trim();

  const name =
    document.getElementById("productName").value.trim();

  const purchasePrice =
    Number(document.getElementById("purchasePrice").value);

  const salePrice =
    Number(document.getElementById("salePrice").value);

  const quantity =
    Math.max(
      1,
      Number(document.getElementById("quantity").value) || 1
    );


  if (
    !name ||
    purchasePrice <= 0 ||
    salePrice <= 0
  ) {

    alert("Product اور prices مکمل کریں");
    return;
  }


  const totalSale =
    salePrice * quantity;

  const profit =
    (salePrice - purchasePrice) * quantity;


  sales.push({

    barcode: barcode,
    name: name,

    purchasePrice: purchasePrice,
    salePrice: salePrice,

    quantity: quantity,

    totalSale: totalSale,
    profit: profit,

    date: today(),

    time: new Date().toLocaleTimeString()
  });


  localStorage.setItem(
    "saimKtkSales",
    JSON.stringify(sales)
  );


  alert("Sale محفوظ ہو گئی");


  document.getElementById("barcode").value = "";
  document.getElementById("productName").value = "";

  document.getElementById("purchasePrice").value = "";
  document.getElementById("salePrice").value = "";

  document.getElementById("quantity").value = 1;


  render();
}


// SALES DISPLAY
function render() {

  const list =
    sales.filter(x => x.date === today());


  const salesList =
    document.getElementById("salesList");


  if (list.length === 0) {

    salesList.innerHTML =
      "آج ابھی کوئی sale نہیں ہوئی۔";

    return;
  }


  salesList.innerHTML =
    list
      .slice()
      .reverse()
      .map(x => `

        <div class="sale-item">

          <b>${x.name} × ${x.quantity}</b>

          <br>

          Sale:
          Rs ${x.totalSale.toLocaleString()}

          <br>

          <b>
            Profit:
            Rs ${x.profit.toLocaleString()}
          </b>

          <br>

          ${x.time}

        </div>

      `)
      .join("");
}


render();
