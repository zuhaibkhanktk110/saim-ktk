// ==========================================
// SAIM KTK - COMPLETE APP.JS
// ==========================================

let sales = JSON.parse(
    localStorage.getItem("saimKtkSales") || "[]"
);

let products = JSON.parse(
    localStorage.getItem("saimKtkProducts") || "[]"
);


// ==========================================
// TODAY
// ==========================================

function today() {
    return new Date().toISOString().slice(0, 10);
}


// ==========================================
// OPEN CAMERA FOR PRODUCT PHOTO
// ==========================================

function openCamera() {

    const cameraInput =
        document.getElementById("productPhoto");

    if (!cameraInput) {
        alert("Camera نہیں مل رہا۔");
        return;
    }

    cameraInput.click();
}


// ==========================================
// PHOTO PREVIEW
// ==========================================

function previewPhoto(event) {

    const file =
        event.target.files &&
        event.target.files[0];

    const preview =
        document.getElementById("photoPreview");

    if (!file) {

        if (preview) {
            preview.src = "";
            preview.style.display = "none";
        }

        return;
    }

    const reader =
        new FileReader();

    reader.onload = function(e) {

        if (preview) {

            preview.src =
                e.target.result;

            preview.style.display =
                "block";
        }
    };

    reader.readAsDataURL(file);
}


// ==========================================
// BARCODE CAMERA
// ==========================================

function scanProduct() {

    const cameraInput =
        document.getElementById("barcodeCamera");

    if (cameraInput) {

        cameraInput.click();

    } else {

        alert(
            "Barcode Camera ابھی setup نہیں ہے۔ پہلے Product کو Save کریں۔"
        );

    }
}


// ==========================================
// SEARCH PRODUCT
// ==========================================

function searchProduct() {

    const barcodeInput =
        document.getElementById("barcode");

    if (!barcodeInput) {
        alert("Barcode field نہیں ملا۔");
        return;
    }

    const code =
        barcodeInput.value.trim();

    if (!code) {
        alert("پہلے Barcode / Product Code لکھیں۔");
        return;
    }

    const product =
        products.find(function(item) {

            return item.barcode === code;

        });


    if (!product) {

        alert(
            "یہ Product محفوظ نہیں ہے۔"
        );

        return;
    }


    document.getElementById(
        "productName"
    ).value =
        product.name || "";


    document.getElementById(
        "purchasePrice"
    ).value =
        product.purchasePrice || "";


    document.getElementById(
        "salePrice"
    ).value =
        product.salePrice || "";


    // Saved photo دکھائیں

    const preview =
        document.getElementById(
            "photoPreview"
        );


    if (preview) {

        if (product.photo) {

            preview.src =
                product.photo;

            preview.style.display =
                "block";

        } else {

            preview.src = "";

            preview.style.display =
                "none";
        }
    }
}


// ==========================================
// SAVE PRODUCT
// ==========================================

function saveProduct() {

    const barcode =
        document.getElementById(
            "newBarcode"
        ).value.trim();


    const name =
        document.getElementById(
            "newName"
        ).value.trim();


    const purchasePrice =
        Number(
            document.getElementById(
                "newCost"
            ).value
        );


    const salePrice =
        Number(
            document.getElementById(
                "newPrice"
            ).value
        );


    const photoInput =
        document.getElementById(
            "productPhoto"
        );


    if (
        !barcode ||
        !name ||
        purchasePrice <= 0 ||
        salePrice <= 0
    ) {

        alert(
            "Barcode، Product Name، Purchase Price اور Sale Price مکمل کریں۔"
        );

        return;
    }


    function saveData(photoData) {

        const product = {

            barcode: barcode,

            name: name,

            purchasePrice:
                purchasePrice,

            salePrice:
                salePrice,

            photo:
                photoData || ""

        };


        const index =
            products.findIndex(
                function(item) {

                    return item.barcode === barcode;

                }
            );


        if (index >= 0) {

            products[index] =
                product;

        } else {

            products.push(
                product
            );

        }


        localStorage.setItem(
            "saimKtkProducts",
            JSON.stringify(products)
        );


        alert(
            "Product اور تصویر محفوظ ہو گئی۔"
        );


        document.getElementById(
            "newBarcode"
        ).value = "";


        document.getElementById(
            "newName"
        ).value = "";


        document.getElementById(
            "newCost"
        ).value = "";


        document.getElementById(
            "newPrice"
        ).value = "";


        if (photoInput) {

            photoInput.value = "";

        }


        const preview =
            document.getElementById(
                "photoPreview"
            );


        if (preview) {

            preview.src = "";

            preview.style.display =
                "none";

        }
    }


    // اگر تصویر لی گئی ہے

    if (
        photoInput &&
        photoInput.files &&
        photoInput.files.length > 0
    ) {

        const file =
            photoInput.files[0];


        const reader =
            new FileReader();


        reader.onload =
            function(e) {

                saveData(
                    e.target.result
                );

            };


        reader.readAsDataURL(
            file
        );

    } else {

        saveData("");

    }
}


// ==========================================
// SAVE SALE
// ==========================================

function saveSale() {

    const barcode =
        document.getElementById(
            "barcode"
        ).value.trim();


    const name =
        document.getElementById(
            "productName"
        ).value.trim();


    const purchasePrice =
        Number(
            document.getElementById(
                "purchasePrice"
            ).value
        );


    const salePrice =
        Number(
            document.getElementById(
                "salePrice"
            ).value
        );


    const quantity =
        Math.max(
            1,
            Number(
                document.getElementById(
                    "quantity"
                ).value
            ) || 1
        );


    if (
        !name ||
        purchasePrice <= 0 ||
        salePrice <= 0
    ) {

        alert(
            "Product اور prices مکمل کریں۔"
        );

        return;
    }


    const totalSale =
        salePrice * quantity;


    const profit =
        (salePrice - purchasePrice)
        * quantity;


    sales.push({

        barcode:
            barcode,

        name:
            name,

        purchasePrice:
            purchasePrice,

        salePrice:
            salePrice,

        quantity:
            quantity,

        totalSale:
            totalSale,

        profit:
            profit,

        date:
            today(),

        time:
            new Date()
                .toLocaleTimeString()

    });


    localStorage.setItem(
        "saimKtkSales",
        JSON.stringify(sales)
    );


    alert(
        "Sale محفوظ ہو گئی۔"
    );


    document.getElementById(
        "barcode"
    ).value = "";


    document.getElementById(
        "productName"
    ).value = "";


    document.getElementById(
        "purchasePrice"
    ).value = "";


    document.getElementById(
        "salePrice"
    ).value = "";


    document.getElementById(
        "quantity"
    ).value = 1;


    render();
}


// ==========================================
// RENDER SALES
// ==========================================

function render() {

    const list =
        sales.filter(
            function(item) {

                return item.date === today();

            }
        );


    const total =
        list.reduce(
            function(sum, item) {

                return sum +
                    Number(
                        item.totalSale || 0
                    );

            },
            0
        );


    const profit =
        list.reduce(
            function(sum, item) {

                return sum +
                    Number(
                        item.profit || 0
                    );

            },
            0
        );


    const totalSales =
        document.getElementById(
            "totalSales"
        );


    const totalProfit =
        document.getElementById(
            "totalProfit"
        );


    const totalOrders =
        document.getElementById(
            "totalOrders"
        );


    if (totalSales) {

        totalSales.textContent =
            "Rs " +
            total.toLocaleString();

    }


    if (totalProfit) {

        totalProfit.textContent =
            "Rs " +
            profit.toLocaleString();

    }


    if (totalOrders) {

        totalOrders.textContent =
            list.length;

    }


    const salesList =
        document.getElementById(
            "salesList"
        );


    if (!salesList) {
        return;
    }


    if (list.length === 0) {

        salesList.innerHTML =
            "ابھی کوئی آج کی Sale نہیں۔";

        return;
    }


    salesList.innerHTML =
        list
            .slice()
            .reverse()
            .map(
                function(item) {

                    return `

                        <div class="sale-item">

                            <b>
                                ${item.name}
                            </b>

                            × ${item.quantity}

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

                            ${item.time || ""}

                        </div>

                    `;

                }
            )
            .join("");
}


// ==========================================
// START
// ==========================================

render();
