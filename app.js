// ==========================================
// SAIM KTK - COMPLETE APP.JS
// ==========================================


// ==========================================
// LOAD SAVED DATA
// ==========================================

let sales = [];
let products = [];

try {
    sales = JSON.parse(
        localStorage.getItem("saimKtkSales") || "[]"
    );
} catch (error) {
    sales = [];
}

try {
    products = JSON.parse(
        localStorage.getItem("saimKtkProducts") || "[]"
    );
} catch (error) {
    products = [];
}


// ==========================================
// TODAY
// ==========================================

function today() {

    const d = new Date();

    const year = d.getFullYear();

    const month = String(
        d.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        d.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ==========================================
// GET ELEMENT
// ==========================================

function get(id) {
    return document.getElementById(id);
}


// ==========================================
// SEARCH PRODUCT
// ==========================================

function searchProduct() {

    const barcodeInput = get("barcode");

    if (!barcodeInput) {
        alert("Barcode field نہیں ملا۔");
        return;
    }

    const code = barcodeInput.value.trim();

    if (!code) {
        alert("پہلے Barcode / Product Code لکھیں۔");
        return;
    }


    const product = products.find(function(item) {

        return String(item.barcode || "").trim() === code;

    });


    if (!product) {

        alert(
            "یہ Product محفوظ نہیں ہے۔ پہلے Product کو Save کریں۔"
        );

        return;
    }


    const nameInput = get("productName");
    const purchaseInput = get("purchasePrice");
    const saleInput = get("salePrice");

    if (nameInput) {
        nameInput.value = product.name || "";
    }

    if (purchaseInput) {
        purchaseInput.value =
            product.purchasePrice || "";
    }

    if (saleInput) {
        saleInput.value =
            product.salePrice || "";
    }


    // Show saved photo
    const preview = get("photoPreview");

    if (preview && product.photo) {

        preview.src = product.photo;

        preview.style.display = "block";

    }

}


// ==========================================
// COMPRESS PHOTO
// ==========================================

function compressImage(file) {

    return new Promise(function(resolve, reject) {

        const reader = new FileReader();


        reader.onload = function(event) {

            const image = new Image();


            image.onload = function() {

                let width = image.width;
                let height = image.height;


                // Maximum size
                const maxSize = 900;


                if (width > maxSize || height > maxSize) {

                    if (width > height) {

                        height =
                            Math.round(
                                height *
                                maxSize /
                                width
                            );

                        width = maxSize;

                    } else {

                        width =
                            Math.round(
                                width *
                                maxSize /
                                height
                            );

                        height = maxSize;

                    }

                }


                const canvas =
                    document.createElement("canvas");


                canvas.width = width;
                canvas.height = height;


                const context =
                    canvas.getContext("2d");


                context.drawImage(
                    image,
                    0,
                    0,
                    width,
                    height
                );


                // Compress JPEG
                const compressed =
                    canvas.toDataURL(
                        "image/jpeg",
                        0.75
                    );


                resolve(compressed);

            };


            image.onerror = function() {

                reject(
                    new Error("Image load failed")
                );

            };


            image.src = event.target.result;

        };


        reader.onerror = function() {

            reject(
                new Error("File read failed")
            );

        };


        reader.readAsDataURL(file);

    });

}


// ==========================================
// SAVE PRODUCT
// ==========================================

async function saveProduct() {

    const barcodeInput = get("newBarcode");
    const nameInput = get("newName");
    const costInput = get("newCost");
    const priceInput = get("newPrice");
    const photoInput = get("productPhoto");


    const barcode =
        barcodeInput ?
        barcodeInput.value.trim() :
        "";


    const name =
        nameInput ?
        nameInput.value.trim() :
        "";


    const purchasePrice =
        costInput ?
        Number(costInput.value) :
        0;


    const salePrice =
        priceInput ?
        Number(priceInput.value) :
        0;


    // ======================================
    // VALIDATION
    // ======================================

    if (!barcode) {

        alert("Barcode / Product Code لکھیں۔");
        return;

    }


    if (!name) {

        alert("Product Name لکھیں۔");
        return;

    }


    if (purchasePrice <= 0) {

        alert("Purchase Price درست لکھیں۔");
        return;

    }


    if (salePrice <= 0) {

        alert("Sale Price درست لکھیں۔");
        return;

    }


    // ======================================
    // PHOTO
    // ======================================

    let photoData = "";


    if (
        photoInput &&
        photoInput.files &&
        photoInput.files.length > 0
    ) {

        const file =
            photoInput.files[0];


        try {

            photoData =
                await compressImage(file);

        } catch (error) {

            alert(
                "تصویر process نہیں ہو سکی۔ دوبارہ تصویر لیں۔"
            );

            return;

        }

    }


    // ======================================
    // PRODUCT OBJECT
    // ======================================

    const product = {

        barcode: barcode,

        name: name,

        purchasePrice: purchasePrice,

        salePrice: salePrice,

        photo: photoData,

        date: today(),

        time: new Date().toLocaleTimeString()

    };


    // ======================================
    // UPDATE OR ADD
    // ======================================

    const index =
        products.findIndex(function(item) {

            return String(
                item.barcode || ""
            ).trim() === barcode;

        });


    if (index >= 0) {

        products[index] = product;

    } else {

        products.push(product);

    }


    // ======================================
    // SAVE LOCAL STORAGE
    // ======================================

    try {

        localStorage.setItem(
            "saimKtkProducts",
            JSON.stringify(products)
        );

    } catch (error) {

        alert(
            "Product save نہیں ہو سکا۔ Browser storage بھر گئی ہے۔"
        );

        return;

    }


    // ======================================
    // SUCCESS
    // ======================================

    alert(
        "✅ Product تصویر کے ساتھ محفوظ ہو گیا۔"
    );


    // ======================================
    // CLEAR FORM
    // ======================================

    if (barcodeInput) {
        barcodeInput.value = "";
    }

    if (nameInput) {
        nameInput.value = "";
    }

    if (costInput) {
        costInput.value = "";
    }

    if (priceInput) {
        priceInput.value = "";
    }

    if (photoInput) {
        photoInput.value = "";
    }


    const preview = get("photoPreview");

    if (preview) {

        preview.src = "";

        preview.style.display = "none";

    }

}


// ==========================================
// PHOTO PREVIEW
// ==========================================

const productPhoto =
    get("productPhoto");

const photoPreview =
    get("photoPreview");


if (productPhoto) {

    productPhoto.addEventListener(
        "change",
        async function() {

            const file =
                this.files &&
                this.files[0];


            if (!file) {

                if (photoPreview) {

                    photoPreview.src = "";

                    photoPreview.style.display =
                        "none";

                }

                return;

            }


            try {

                const compressed =
                    await compressImage(file);


                if (photoPreview) {

                    photoPreview.src =
                        compressed;

                    photoPreview.style.display =
                        "block";

                }

            } catch (error) {

                alert(
                    "تصویر preview نہیں ہو سکی۔"
                );

            }

        }
    );

}


// ==========================================
// SALE CAMERA
// ==========================================

const saleCamera =
    get("saleCamera");


if (saleCamera) {

    saleCamera.addEventListener(
        "change",
        async function() {

            const file =
                this.files &&
                this.files[0];


            if (!file) {
                return;
            }


            // Try barcode detection
            if (
                "BarcodeDetector" in window
            ) {

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


                    const image =
                        new Image();


                    const imageURL =
                        URL.createObjectURL(file);


                    image.src = imageURL;


                    image.onload =
                        async function() {

                            try {

                                const codes =
                                    await detector.detect(
                                        image
                                    );


                                if (
                                    codes &&
                                    codes.length > 0
                                ) {

                                    const code =
                                        codes[0].rawValue;


                                    const barcode =
                                        get("barcode");


                                    if (barcode) {

                                        barcode.value =
                                            code;

                                    }


                                    searchProduct();

                                } else {

                                    alert(
                                        "Barcode تصویر میں نہیں ملا۔"
                                    );

                                }

                            } catch (error) {

                                alert(
                                    "Barcode detect نہیں ہو سکا۔"
                                );

                            }


                            URL.revokeObjectURL(
                                imageURL
                            );

                        };


                } catch (error) {

                    alert(
                        "اس browser میں Barcode Scanner support نہیں ہے۔"
                    );

                }

            } else {

                alert(
                    "Camera کھل گیا ہے، لیکن اس browser میں automatic barcode scanning support نہیں ہے۔"
                );

            }


            // Allow same photo again
            this.value = "";

        }
    );

}


// ==========================================
// SAVE SALE
// ==========================================

function saveSale() {

    const barcodeInput =
        get("barcode");

    const nameInput =
        get("productName");

    const purchaseInput =
        get("purchasePrice");

    const saleInput =
        get("salePrice");

    const quantityInput =
        get("quantity");


    const barcode =
        barcodeInput ?
        barcodeInput.value.trim() :
        "";


    const name =
        nameInput ?
        nameInput.value.trim() :
        "";


    const purchasePrice =
        purchaseInput ?
        Number(purchaseInput.value) :
        0;


    const salePrice =
        saleInput ?
        Number(saleInput.value) :
        0;


    let quantity =
        quantityInput ?
        Number(quantityInput.value) :
        1;


    if (!quantity || quantity < 1) {

        quantity = 1;

    }


    // ======================================
    // VALIDATION
    // ======================================

    if (!name) {

        alert(
            "Product تلاش کریں یا Product Name لکھیں۔"
        );

        return;

    }


    if (purchasePrice <= 0) {

        alert(
            "Purchase Price درست لکھیں۔"
        );

        return;

    }


    if (salePrice <= 0) {

        alert(
            "Sale Price درست لکھیں۔"
        );

        return;

    }


    // ======================================
    // CALCULATE
    // ======================================

    const totalSale =
        salePrice * quantity;


    const profit =
        (salePrice - purchasePrice) *
        quantity;


    // ======================================
    // SALE OBJECT
    // ======================================

    const sale = {

        barcode: barcode,

        name: name,

        purchasePrice: purchasePrice,

        salePrice: salePrice,

        quantity: quantity,

        totalSale: totalSale,

        profit: profit,

        date: today(),

        time: new Date().toLocaleTimeString()

    };


    sales.push(sale);


    // ======================================
    // SAVE SALE
    // ======================================

    try {

        localStorage.setItem(
            "saimKtkSales",
            JSON.stringify(sales)
        );

    } catch (error) {

        alert(
            "Sale save نہیں ہو سکی۔"
        );

        return;

    }


    alert(
        "✅ Sale محفوظ ہو گئی۔"
    );


    // ======================================
    // CLEAR SALE FORM
    // ======================================

    if (barcodeInput) {
        barcodeInput.value = "";
    }

    if (nameInput) {
        nameInput.value = "";
    }

    if (purchaseInput) {
        purchaseInput.value = "";
    }

    if (saleInput) {
        saleInput.value = "";
    }

    if (quantityInput) {
        quantityInput.value = "1";
    }


    if (photoPreview) {

        photoPreview.src = "";

        photoPreview.style.display =
            "none";

    }


    render();

}


// ==========================================
// RENDER TODAY SALES
// ==========================================

function render() {

    const salesList =
        get("salesList");


    const todaySales =
        sales.filter(function(item) {

            return item.date === today();

        });


    if (!salesList) {
        return;
    }


    if (todaySales.length === 0) {

        salesList.innerHTML =
            "ابھی کوئی آج کی Sale نہیں۔";

        return;

    }


    salesList.innerHTML =
        todaySales
        .slice()
        .reverse()
        .map(function(item) {

            return `

                <div class="sale-item">

                    <b>
                        ${escapeHTML(item.name)}
                    </b>

                    × ${Number(item.quantity || 1)}

                    <br>

                    Sale:
                    Rs ${Number(
                        item.totalSale || 0
                    ).toLocaleString()}

                    <br>

                    <b>
                        Profit:
                        Rs ${Number(
                            item.profit || 0
                        ).toLocaleString()}
                    </b>

                    <br>

                    ${escapeHTML(
                        item.time || ""
                    )}

                </div>

            `;

        })
        .join("");

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// START APP
// ==========================================

render();
