/* =====================================================
   PRODUCT SALE APP
   ===================================================== */

let products = JSON.parse(localStorage.getItem("products") || "[]");
let sales = JSON.parse(localStorage.getItem("sales") || "[]");

let selectedProductImage = "";
let saleImage = "";


/* =====================================================
   CAMERA / IMAGE HANDLING
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const productPhoto = document.getElementById("productPhoto");
    const saleCamera = document.getElementById("saleCamera");

    if (productPhoto) {
        productPhoto.addEventListener("change", function (event) {
            handleProductPhoto(event);
        });
    }

    if (saleCamera) {
        saleCamera.addEventListener("change", function (event) {
            handleSalePhoto(event);
        });
    }

    renderSales();
});


/* =====================================================
   PRODUCT PHOTO
   ===================================================== */

function handleProductPhoto(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        selectedProductImage = e.target.result;

        const preview = document.getElementById("photoPreview");

        if (preview) {
            preview.src = selectedProductImage;
            preview.style.display = "block";
        }
    };

    reader.readAsDataURL(file);
}


/* =====================================================
   SALE CAMERA PHOTO
   ===================================================== */

function handleSalePhoto(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        saleImage = e.target.result;

        /*
         * اگر barcode موجود ہے تو barcode سے search کریں
         * اگر barcode خالی ہے تو image سے local product تلاش کریں
         */

        const barcodeInput = document.getElementById("barcode");

        if (barcodeInput && barcodeInput.value.trim() !== "") {

            searchProduct();

        } else {

            searchProductByImage();
        }
    };

    reader.readAsDataURL(file);
}


/* =====================================================
   SEARCH BY BARCODE
   ===================================================== */

function searchProduct() {

    const barcodeElement = document.getElementById("barcode");

    if (!barcodeElement) return;

    const barcode = barcodeElement.value.trim();

    if (!barcode) {

        if (saleImage) {
            searchProductByImage();
            return;
        }

        alert("Barcode یا Product کی تصویر دیں۔");
        return;
    }

    const product = products.find(function (item) {

        return String(item.barcode).trim() === barcode;

    });

    if (!product) {

        alert("یہ Product محفوظ نہیں ہے۔");

        return;
    }

    fillSaleProduct(product);
}


/* =====================================================
   SEARCH PRODUCT BY IMAGE
   ===================================================== */

function searchProductByImage() {

    if (!saleImage) {

        alert("پہلے Product کی تصویر لیں۔");

        return;
    }

    /*
     * IMPORTANT:
     *
     * Browser خود سے تصویر دیکھ کر market price نہیں جان سکتا۔
     *
     * یہاں ہم پہلے locally saved products میں image match
     * کرنے کی کوشش کرتے ہیں۔
     */

    const product = findProductFromSavedImage(saleImage);

    if (product) {

        fillSaleProduct(product);

        alert("Product تصویر سے مل گیا۔");

        return;
    }

    /*
     * اگر product local database میں نہیں ہے تو
     * AI / Product Recognition API کی ضرورت ہوگی۔
     */

    alert(
        "یہ Product ابھی database میں موجود نہیں ہے۔\n\n" +
        "پہلی دفعہ Product کو نام، Purchase Price اور Sale Price کے ساتھ Save کریں۔\n\n" +
        "اس کے بعد اسی محفوظ Product کو barcode کے بغیر بھی استعمال کیا جا سکے گا۔"
    );
}


/* =====================================================
   FIND PRODUCT FROM SAVED IMAGE
   ===================================================== */

function findProductFromSavedImage(imageData) {

    /*
     * Exact image comparison۔
     *
     * یہ تب کام کرے گا جب بالکل وہی تصویر دوبارہ استعمال ہو۔
     */

    return products.find(function (product) {

        return product.image &&
               product.image === imageData;

    });
}


/* =====================================================
   FILL SALE FORM
   ===================================================== */

function fillSaleProduct(product) {

    const name = document.getElementById("productName");
    const purchase = document.getElementById("purchasePrice");
    const sale = document.getElementById("salePrice");

    if (name) {
        name.value = product.name || "";
    }

    if (purchase) {
        purchase.value = product.cost || "";
    }

    if (sale) {
        sale.value = product.price || "";
    }
}


/* =====================================================
   SAVE PRODUCT
   ===================================================== */

function saveProduct() {

    const barcode =
        document.getElementById("newBarcode").value.trim();

    const name =
        document.getElementById("newName").value.trim();

    const cost =
        Number(document.getElementById("newCost").value);

    const price =
        Number(document.getElementById("newPrice").value);


    if (!name) {

        alert("Product Name لکھیں۔");

        return;
    }


    if (!cost || !price) {

        alert("Purchase Price اور Sale Price لکھیں۔");

        return;
    }


    /*
     * Barcode ضروری نہیں ہے۔
     */

    const product = {

        id: Date.now(),

        barcode: barcode,

        name: name,

        cost: cost,

        price: price,

        image: selectedProductImage || "",

        createdAt: new Date().toISOString()

    };


    products.push(product);

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );


    alert("Product کامیابی سے Save ہو گیا۔");


    /*
     * Form clear
     */

    document.getElementById("newBarcode").value = "";

    document.getElementById("newName").value = "";

    document.getElementById("newCost").value = "";

    document.getElementById("newPrice").value = "";

    selectedProductImage = "";


    const preview =
        document.getElementById("photoPreview");

    if (preview) {

        preview.src = "";

        preview.style.display = "none";

    }
}


/* =====================================================
   SAVE SALE
   ===================================================== */

function saveSale() {

    const barcode =
        document.getElementById("barcode").value.trim();

    const name =
        document.getElementById("productName").value.trim();

    const purchase =
        Number(document.getElementById("purchasePrice").value);

    const salePrice =
        Number(document.getElementById("salePrice").value);

    const quantity =
        Number(document.getElementById("quantity").value);


    if (!name) {

        alert("Product تلاش کریں یا Product Name لکھیں۔");

        return;
    }


    if (!salePrice) {

        alert("Sale Price ضروری ہے۔");

        return;
    }


    if (!quantity || quantity < 1) {

        alert("Quantity درست لکھیں۔");

        return;
    }


    const total =
        salePrice * quantity;


    const profit =
        (salePrice - purchase) * quantity;


    const sale = {

        id: Date.now(),

        barcode: barcode,

        name: name,

        purchasePrice: purchase,

        salePrice: salePrice,

        quantity: quantity,

        total: total,

        profit: profit,

        image: saleImage || "",

        time: new Date().toLocaleString()

    };


    sales.push(sale);

    localStorage.setItem(
        "sales",
        JSON.stringify(sales)
    );


    alert("Sale کامیابی سے Save ہو گئی۔");


    clearSaleForm();

    renderSales();
}


/* =====================================================
   CLEAR SALE FORM
   ===================================================== */

function clearSaleForm() {

    document.getElementById("barcode").value = "";

    document.getElementById("productName").value = "";

    document.getElementById("purchasePrice").value = "";

    document.getElementById("salePrice").value = "";

    document.getElementById("quantity").value = "1";

    saleImage = "";
}


/* =====================================================
   SHOW TODAY SALES
   ===================================================== */

function renderSales() {

    const list =
        document.getElementById("salesList");

    if (!list) return;


    if (sales.length === 0) {

        list.innerHTML =
            "<p>ابھی کوئی آج کی Sale نہیں۔</p>";

        return;
    }


    list.innerHTML = sales
        .slice()
        .reverse()
        .map(function (item) {

            return `
                <div class="sale-item">

                    <h3>${escapeHTML(item.name)}</h3>

                    <p>
                        Quantity:
                        ${item.quantity}
                    </p>

                    <p>
                        Sale Price:
                        Rs ${Number(item.salePrice).toLocaleString()}
                    </p>

                    <p>
                        Total:
                        Rs ${Number(item.total).toLocaleString()}
                    </p>

                    <p>
                        Profit:
                        Rs ${Number(item.profit).toLocaleString()}
                    </p>

                    <small>
                        ${escapeHTML(item.time || "")}
                    </small>

                </div>
            `;

        })
        .join("");
}


/* =====================================================
   SAFE HTML
   ===================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
