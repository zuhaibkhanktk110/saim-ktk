/* =========================================================
   PRODUCT SALE APP - FIXED VERSION
   Product + Image = IndexedDB
   Sales = localStorage
   ========================================================= */

const DB_NAME = "ProductSaleDB";
const DB_VERSION = 1;
const STORE_NAME = "products";

let db;

/* =========================================================
   DATABASE
   ========================================================= */

function openDB() {
  return new Promise((resolve, reject) => {

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function (event) {

      const database = event.target.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {

        const store = database.createObjectStore(
          STORE_NAME,
          { keyPath: "barcode" }
        );

        store.createIndex("name", "name", { unique: false });
      }
    };

    request.onsuccess = function () {
      db = request.result;
      resolve(db);
    };

    request.onerror = function () {
      reject(request.error);
    };
  });
}


/* =========================================================
   GET ALL PRODUCTS
   ========================================================= */

function getAllProducts() {

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(
      STORE_NAME,
      "readonly"
    );

    const store = transaction.objectStore(STORE_NAME);

    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}


/* =========================================================
   GET ONE PRODUCT
   ========================================================= */

function getProduct(barcode) {

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(
      STORE_NAME,
      "readonly"
    );

    const store = transaction.objectStore(STORE_NAME);

    const request = store.get(barcode);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}


/* =========================================================
   SAVE PRODUCT
   ========================================================= */

function putProduct(product) {

  return new Promise((resolve, reject) => {

    const transaction = db.transaction(
      STORE_NAME,
      "readwrite"
    );

    const store = transaction.objectStore(STORE_NAME);

    const request = store.put(product);

    request.onsuccess = () => {
      resolve(true);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}


/* =========================================================
   IMAGE TO DATA URL
   ========================================================= */

function imageToDataURL(file) {

  return new Promise((resolve, reject) => {

    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();

    reader.onload = function () {
      resolve(reader.result);
    };

    reader.onerror = function () {
      reject(reader.error);
    };

    reader.readAsDataURL(file);
  });
}


/* =========================================================
   PHOTO PREVIEW
   ========================================================= */

function setupPhotoPreview() {

  const photoInput =
    document.getElementById("productPhoto");

  const preview =
    document.getElementById("photoPreview");

  if (!photoInput) return;

  photoInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    if (preview) {

      preview.src = url;
      preview.style.display = "block";
    }
  });
}


/* =========================================================
   GENERATE PRODUCT CODE
   ========================================================= */

function generateProductCode() {

  return "P" +
    Date.now().toString() +
    Math.floor(Math.random() * 1000);
}


/* =========================================================
   SAVE NEW PRODUCT
   ========================================================= */

async function saveProduct() {

  try {

    const nameInput =
      document.getElementById("newName");

    const barcodeInput =
      document.getElementById("newBarcode");

    const costInput =
      document.getElementById("newCost");

    const priceInput =
      document.getElementById("newPrice");

    const photoInput =
      document.getElementById("productPhoto");

    let barcode =
      barcodeInput ? barcodeInput.value.trim() : "";

    const name =
      nameInput ? nameInput.value.trim() : "";

    const cost =
      Number(costInput ? costInput.value : 0);

    const price =
      Number(priceInput ? priceInput.value : 0);

    const file =
      photoInput && photoInput.files
        ? photoInput.files[0]
        : null;


    /* Barcode optional */

    if (!barcode) {
      barcode = generateProductCode();

      if (barcodeInput) {
        barcodeInput.value = barcode;
      }
    }


    if (!name) {

      alert("❌ Product کا نام لکھیں۔");
      return;
    }


    if (!price || price <= 0) {

      alert("❌ Sale Price لکھیں۔");
      return;
    }


    /* Convert image */

    let image = "";

    if (file) {
      image = await imageToDataURL(file);
    }


    const product = {

      barcode: barcode,

      name: name,

      cost: cost,

      price: price,

      image: image,

      createdAt: Date.now()
    };


    /* SAVE */

    await putProduct(product);


    alert(
      "✅ Product کامیابی سے Save ہوگیا۔\n\n" +
      "Product: " + name + "\n" +
      "Code: " + barcode
    );


    /* Clear fields */

    if (nameInput) nameInput.value = "";
    if (costInput) costInput.value = "";
    if (priceInput) priceInput.value = "";

    if (photoInput) {
      photoInput.value = "";
    }

    const preview =
      document.getElementById("photoPreview");

    if (preview) {
      preview.src = "";
      preview.style.display = "none";
    }

    loadProducts();


  } catch (error) {

    console.error("SAVE PRODUCT ERROR:", error);

    alert(
      "❌ Product Save نہیں ہوا۔\n\n" +
      "Error: " +
      (error.message || error)
    );
  }
}


/* =========================================================
   SEARCH PRODUCT
   ========================================================= */

async function searchProduct() {

  try {

    const barcodeInput =
      document.getElementById("barcode");

    const barcode =
      barcodeInput
        ? barcodeInput.value.trim()
        : "";


    if (!barcode) {

      alert(
        "📷 اگر Barcode نہیں ہے تو Product کی تصویر استعمال کریں۔"
      );

      return;
    }


    const product =
      await getProduct(barcode);


    if (!product) {

      alert(
        "❌ یہ Product نہیں ملا۔\n\n" +
        "Code: " + barcode
      );

      return;
    }


    fillSaleProduct(product);

  } catch (error) {

    console.error(error);

    alert(
      "❌ Search میں مسئلہ آیا۔"
    );
  }
}


/* =========================================================
   PUT PRODUCT DATA INTO SALE
   ========================================================= */

function fillSaleProduct(product) {

  const name =
    document.getElementById("productName");

  const purchase =
    document.getElementById("purchasePrice");

  const sale =
    document.getElementById("salePrice");


  if (name)
    name.value = product.name || "";

  if (purchase)
    purchase.value = product.cost || 0;

  if (sale)
    sale.value = product.price || 0;


  alert(
    "✅ Product مل گیا:\n\n" +
    product.name +
    "\nSale Price: Rs " +
    product.price
  );
}


/* =========================================================
   SALE CAMERA
   ========================================================= */

function setupSaleCamera() {

  const camera =
    document.getElementById("saleCamera");

  if (!camera) return;


  camera.addEventListener("change", async function () {

    const file = this.files[0];

    if (!file) return;


    /*
      ابھی تصویر کو product search کے لیے استعمال
      کرنے کے لیے saved product images سے matching
      کی جا سکتی ہے۔
    */

    try {

      const products =
        await getAllProducts();


      if (!products.length) {

        alert(
          "❌ پہلے کم از کم ایک Product تصویر کے ساتھ Save کریں۔"
        );

        return;
      }


      alert(
        "📷 تصویر مل گئی۔\n\n" +
        "Image-based automatic recognition کے لیے AI/vision API چاہیے۔\n" +
        "Barcode search الگ سے کام کرتا ہے۔"
      );


    } catch (error) {

      console.error(error);

      alert(
        "❌ تصویر process نہیں ہو سکی۔"
      );
    }

  });
}


/* =========================================================
   SAVE SALE
   ========================================================= */

function saveSale() {

  const name =
    document.getElementById("productName")?.value.trim();

  const purchase =
    Number(
      document.getElementById("purchasePrice")?.value || 0
    );

  const sale =
    Number(
      document.getElementById("salePrice")?.value || 0
    );

  const quantity =
    Number(
      document.getElementById("quantity")?.value || 1
    );


  if (!name) {

    alert("❌ پہلے Product تلاش کریں۔");
    return;
  }


  if (!sale || sale <= 0) {

    alert("❌ Sale Price درست لکھیں۔");
    return;
  }


  if (!quantity || quantity <= 0) {

    alert("❌ Quantity درست لکھیں۔");
    return;
  }


  const sales =
    JSON.parse(
      localStorage.getItem("sales") || "[]"
    );


  const profit =
    (sale - purchase) * quantity;


  sales.push({

    name: name,

    purchase: purchase,

    sale: sale,

    quantity: quantity,

    profit: profit,

    time: new Date().toLocaleTimeString()
  });


  localStorage.setItem(
    "sales",
    JSON.stringify(sales)
  );


  alert("✅ Sale Save ہوگئی۔");


  document.getElementById("barcode").value = "";
  document.getElementById("productName").value = "";
  document.getElementById("purchasePrice").value = "";
  document.getElementById("salePrice").value = "";
  document.getElementById("quantity").value = "1";


  showSales();
}


/* =========================================================
   SHOW SALES
   ========================================================= */

function showSales() {

  const container =
    document.getElementById("salesList");

  if (!container) return;


  const sales =
    JSON.parse(
      localStorage.getItem("sales") || "[]"
    );


  if (!sales.length) {

    container.innerHTML =
      "ابھی کوئی آج کی Sale نہیں۔";

    return;
  }


  container.innerHTML = sales
    .map(function (item) {

      return `
        <div class="sale-item">

          <b>${escapeHTML(item.name)}</b>
          × ${item.quantity}

          <br>

          Sale:
          Rs ${Number(item.sale).toLocaleString()}

          <br>

          Profit:
          Rs ${Number(item.profit).toLocaleString()}

          <br>

          ${escapeHTML(item.time || "")}

        </div>
      `;

    })
    .join("");
}


/* =========================================================
   PRODUCT LIST
   ========================================================= */

async function loadProducts() {

  try {

    const products =
      await getAllProducts();

    console.log(
      "Saved Products:",
      products
    );

  } catch (error) {

    console.error(error);
  }
}


/* =========================================================
   SECURITY
   ========================================================= */

function escapeHTML(text) {

  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================================
   START APP
   ========================================================= */

async function startApp() {

  try {

    await openDB();

    setupPhotoPreview();

    setupSaleCamera();

    showSales();

    loadProducts();

    console.log(
      "✅ Product Sale App Started"
    );

  } catch (error) {

    console.error(
      "DATABASE ERROR:",
      error
    );

    alert(
      "❌ Database start نہیں ہو سکا۔ Browser refresh کریں۔"
    );
  }
}


document.addEventListener(
  "DOMContentLoaded",
  startApp
);
