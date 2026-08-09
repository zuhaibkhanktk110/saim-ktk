/* =====================================================
   PRODUCT SALE APP
   Camera + Photo + Product Save + Search + Sales
===================================================== */

const PRODUCTS_KEY = "products";
const SALES_KEY = "sales";

/* =========================
   START APP
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const productPhoto = document.getElementById("productPhoto");
    const saleCamera = document.getElementById("saleCamera");

    // Product photo
    if (productPhoto) {
        productPhoto.addEventListener("change", function (e) {
            previewPhoto(e);
        });
    }

    // Sale camera
    if (saleCamera) {
        saleCamera.addEventListener("change", function (e) {
            handleSalePhoto(e);
        });
    }

    showSales();

});


/* =========================
   STORAGE
========================= */

function getProducts() {
    try {
        return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}


function saveProducts(products) {
    try {
        localStorage.setItem(
            PRODUCTS_KEY,
            JSON.stringify(products)
        );

        return true;

    } catch (error) {

        console.error("Storage Error:", error);

        alert(
            "❌ Product save نہیں ہو سکا۔\n\n" +
            "Browser storage کا مسئلہ ہے۔"
        );

        return false;
    }
}


function getSales() {
    try {
        return JSON.parse(localStorage.getItem(SALES_KEY)) || [];
    } catch (error) {
        return [];
    }
}


function saveSales(sales) {
    localStorage.setItem(
        SALES_KEY,
        JSON.stringify(sales)
    );
}


/* =========================
   PRODUCT PHOTO PREVIEW
========================= */

function previewPhoto(event) {

    const file = event.target.files &&
                 event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {

        alert("❌ صرف تصویر منتخب کریں");

        event.target.value = "";
        return;
    }

    compressImage(file, function (imageData) {

        const preview =
            document.getElementById("photoPreview");

        if (preview) {

            preview.src = imageData;

            preview.style.display = "block";

            preview.dataset.image = imageData;
        }

    });
}


/* =========================
   IMAGE COMPRESS
========================= */

function compressImage(file, callback) {

    const reader = new FileReader();

    reader.onload = function (event) {

        const img = new Image();

        img.onload = function () {

            const maxWidth = 700;

            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {

                const ratio = maxWidth / width;

                width = maxWidth;
                height = height * ratio;
            }

            const canvas =
                document.createElement("canvas");

            canvas.width = width;
            canvas.height = height;

            const ctx =
                canvas.getContext("2d");

            ctx.drawImage(
                img,
                0,
                0,
                width,
                height
            );

            const compressed =
                canvas.toDataURL(
                    "image/jpeg",
                    0.65
                );

            callback(compressed);
        };

        img.onerror = function () {

            alert("❌ تصویر پڑھنے میں مسئلہ آیا");
        };

        img.src = event.target.result;
    };

    reader.onerror = function () {

        alert("❌ تصویر اپلوڈ نہیں ہو سکی");
    };

    reader.readAsDataURL(file);
}


/* =========================
   SAVE PRODUCT
========================= */

function saveProduct() {

    const barcode =
        document.getElementById("newBarcode")
        ?.value.trim() || "";

    const name =
        document.getElementById("newName")
        ?.value.trim() || "";

    const cost =
        Number(
            document.getElementById("newCost")
            ?.value
        ) || 0;

    const price =
        Number(
            document.getElementById("newPrice")
            ?.value
        ) || 0;

    const photoInput =
        document.getElementById("productPhoto");

    const preview =
        document.getElementById("photoPreview");


    /* Name required */

    if (!name) {

        alert("❌ Product Name لکھیں");
        return;
    }


    /* Price required */

    if (!price) {

        alert("❌ Sale Price لکھیں");
        return;
    }


    /* Get photo */

    let photo = "";

    if (
        preview &&
        preview.dataset &&
        preview.dataset.image
    ) {

        photo = preview.dataset.image;

    } else if (
        photoInput &&
        photoInput.files &&
        photoInput.files[0]
    ) {

        compressImage(
            photoInput.files[0],
            function (imageData) {

                saveProductFinal(
                    barcode,
                    name,
                    cost,
                    price,
                    imageData
                );
            }
        );

        return;
    }


    saveProductFinal(
        barcode,
        name,
        cost,
        price,
        photo
    );
}


/* =========================
   FINAL PRODUCT SAVE
========================= */

function saveProductFinal(
    barcode,
    name,
    cost,
    price,
    photo
) {

    const products = getProducts();


    const product = {

        id: Date.now(),

        barcode: barcode,

        name: name,

        cost: cost,

        price: price,

        photo: photo,

        createdAt:
            new Date().toISOString()
    };


    products.push(product);


    if (!saveProducts(products)) {
        return;
    }


    alert("✅ Product کامیابی سے Save ہو گیا");


    /* Clear form */

    const ids = [
        "newBarcode",
        "newName",
        "newCost",
        "newPrice"
    ];

    ids.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = "";
        }
    });


    const photoInput =
        document.getElementById("productPhoto");

    if (photoInput) {
        photoInput.value = "";
    }


    const preview =
        document.getElementById("photoPreview");

    if (preview) {

        preview.src = "";

        preview.style.display = "none";

        preview.dataset.image = "";
    }
}


/* =========================
   SEARCH PRODUCT
========================= */

function searchProduct() {

    const barcode =
        document.getElementById("barcode")
        ?.value.trim() || "";


    if (!barcode) {

        alert(
            "❌ Barcode لکھیں یا 📷 کیمرے سے Barcode scan کریں"
        );

        return;
    }


    findProductByBarcode(barcode);
}


/* =========================
   FIND PRODUCT
========================= */

function findProductByBarcode(barcode) {

    const products = getProducts();


    const product =
        products.find(function (item) {

            return String(item.barcode)
                .trim()
                .toLowerCase() ===
                String(barcode)
                .trim()
                .toLowerCase();

        });


    if (!product) {

        alert(
            "❌ یہ Product محفوظ نہیں ہے"
        );

        return;
    }


    fillSaleProduct(product);
}


/* =========================
   FILL SALE PRODUCT
========================= */

function fillSaleProduct(product) {

    const barcode =
        document.getElementById("barcode");

    const name =
        document.getElementById("productName");

    const purchase =
        document.getElementById("purchasePrice");

    const sale =
        document.getElementById("salePrice");


    if (barcode)
        barcode.value = product.barcode || "";

    if (name)
        name.value = product.name || "";

    if (purchase)
        purchase.value = product.cost || 0;

    if (sale)
        sale.value = product.price || 0;


    alert(
        "✅ Product مل گیا: " +
        product.name
    );
}


/* =========================
   SALE CAMERA
========================= */

function handleSalePhoto(event) {

    const file =
        event.target.files &&
        event.target.files[0];

    if (!file) return;


    /*
       پہلے تصویر کو دیکھیں
    */

    compressImage(
        file,
        function (imageData) {

            /*
               اگر browser BarcodeDetector
               support کرتا ہے تو barcode
               تصویر سے پڑھنے کی کوشش کریں۔
            */

            scanBarcodeFromImage(
                file,
                imageData
            );
        }
    );
}


/* =========================
   BARCODE FROM CAMERA IMAGE
========================= */

async function scanBarcodeFromImage(
    file,
    imageData
) {

    if ("BarcodeDetector" in window) {

        try {

            const detector =
                new BarcodeDetector({
                    formats: [
                        "ean_13",
                        "ean_8",
                        "code_128",
                        "code_39",
                        "upc_a",
                        "upc_e"
                    ]
                });


            const bitmap =
                await createImageBitmap(file);


            const codes =
                await detector.detect(bitmap);


            if (codes.length > 0) {

                const code =
                    codes[0].rawValue;


                const barcode =
                    document.getElementById(
                        "barcode"
                    );


                if (barcode) {
                    barcode.value = code;
                }


                findProductByBarcode(code);

                return;
            }

        } catch (error) {

            console.log(
                "Barcode scan failed:",
                error
            );
        }
    }


    /*
       Barcode نہ ملے
    */

    alert(
        "📷 تصویر لے لی گئی ہے۔\n\n" +
        "اگر Product کے barcode کو تصویر میں دکھایا گیا تھا " +
        "تو اسے scan کرنے کی کوشش کی گئی۔\n\n" +
        "اگر barcode موجود نہیں ہے تو Product کی قیمت " +
        "معلوم کرنے کے لیے AI/Product database ضروری ہوگا۔"
    );
}


/* =========================
   SAVE SALE
========================= */

function saveSale() {

    const barcode =
        document.getElementById("barcode")
        ?.value.trim() || "";

    const name =
        document.getElementById("productName")
        ?.value.trim() || "";

    const purchase =
        Number(
            document.getElementById(
                "purchasePrice"
            )?.value
        ) || 0;

    const salePrice =
        Number(
            document.getElementById(
                "salePrice"
            )?.value
        ) || 0;

    const quantity =
        Number(
            document.getElementById(
                "quantity"
            )?.value
        ) || 1;


    if (!name) {

        alert(
            "❌ پہلے Product تلاش کریں"
        );

        return;
    }


    if (!salePrice) {

        alert(
            "❌ Sale Price لکھیں"
        );

        return;
    }


    const totalSale =
        salePrice * quantity;


    const totalCost =
        purchase * quantity;


    const profit =
        totalSale - totalCost;


    const sales =
        getSales();


    sales.push({

        id: Date.now(),

        barcode: barcode,

        name: name,

        purchasePrice: purchase,

        salePrice: salePrice,

        quantity: quantity,

        totalSale: totalSale,

        profit: profit,

        time:
            new Date().toLocaleTimeString()
    });


    saveSales(sales);


    alert(
        "✅ Sale کامیابی سے Save ہو گئی"
    );


    showSales();
}


/* =========================
   SHOW SALES
========================= */

function showSales() {

    const list =
        document.getElementById(
            "salesList"
        );


    if (!list) return;


    const sales =
        getSales();


    if (sales.length === 0) {

        list.innerHTML =
            "ابھی کوئی آج کی Sale نہیں۔";

        return;
    }


    /*
       صرف آج کی Sales
    */

    const today =
        new Date()
        .toISOString()
        .slice(0, 10);


    const todaySales =
        sales.filter(function (item) {

            if (!item.time) return true;

            /*
               پرانے data کو بھی دکھائیں
            */

            return true;
        });


    if (todaySales.length === 0) {

        list.innerHTML =
            "ابھی کوئی آج کی Sale نہیں۔";

        return;
    }


    list.innerHTML =
        todaySales
        .slice()
        .reverse()
        .map(function (item) {

            return `
                <div class="sale-item">

                    <b>
                        ${escapeHTML(item.name)}
                        × ${item.quantity}
                    </b>

                    <br>

                    Sale:
                    Rs ${Number(
                        item.totalSale || 0
                    ).toLocaleString()}

                    <br>

                    Profit:
                    Rs ${Number(
                        item.profit || 0
                    ).toLocaleString()}

                    <br>

                    ${item.time || ""}

                </div>
            `;

        })
        .join("");
}


/* =========================
   SECURITY
========================= */

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
