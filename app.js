// ==========================================
// SAIM KTK - COMPLETE APP.JS
// ==========================================


// ==========================================
// LOAD DATA
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

    return new Date()
        .toISOString()
        .slice(0, 10);

}


// ==========================================
// SALE CAMERA
// ==========================================

function openSaleCamera() {

    const camera =
        document.getElementById("saleCamera");

    if (!camera) {

        alert("Sale Camera نہیں ملا۔");

        return;
    }

    // کوئی barcode شرط نہیں
    camera.click();

}


// ==========================================
// SALE PHOTO TAKEN
// ==========================================

function salePhotoTaken(event) {

    const file =
        event.target.files &&
        event.target.files[0];

    if (!file) {
        return;
    }


    const preview =
        document.getElementById(
            "salePhotoPreview"
        );


    const reader =
        new FileReader();


    reader.onload =
        function(e) {

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
// PRODUCT CAMERA
// ==========================================

function openProductCamera() {

    const camera =
        document.getElementById(
            "productPhoto"
        );


    if (!camera) {

        alert(
            "Product Camera نہیں ملا۔"
        );

        return;
    }


    camera.click();

}


// ==========================================
// PRODUCT PHOTO PREVIEW
// ==========================================

function previewPhoto(event) {

    const file =
        event.target.files &&
        event.target.files[0];


    const preview =
        document.getElementById(
            "photoPreview"
        );


    if (!file) {

        if (preview) {

            preview.src = "";

            preview.style.display =
                "none";

        }

        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function(e) {

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
// SEARCH PRODUCT
// ==========================================

function searchProduct() {

    const barcodeInput =
        document.getElementById(
            "barcode"
        );


    if (!barcodeInput) {

        alert(
            "Barcode field نہیں ملا۔"
        );

        return;
    }


    const code =
        barcodeInput.value.trim();


    if (!code) {

        alert(
            "Barcode نہ بھی ہو تو کوئی مسئلہ نہیں۔ اگر Product پہلے محفوظ ہے تو Barcode لکھ کر تلاش کریں۔"
        );

        return;
    }


    const product =
        products.find(
            function(item) {

                return item.barcode === code;

            }
        );


    if (!product) {

        alert(
            "یہ Product ابھی محفوظ نہیں ہے۔"
        );

        return;
    }


    const name =
        document.getElementById(
            "productName"
        );


    const purchase =
        document.getElementById(
            "purchasePrice"
        );


    const sale =
        document.getElementById(
            "salePrice"
        );


    if (name) {

        name.value =
            product.name || "";

    }


    if (purchase) {

        purchase.value =
            product.purchasePrice || "";

    }


    if (sale) {

        sale.value =
            product.salePrice || "";

    }


    // Show saved photo

    const preview =
        document.getElementById(
            "salePhotoPreview"
        );


    if (
        preview &&
        product.photo
    ) {

        preview.src =
            product.photo;

        preview.style.display =
            "block";

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


    // Barcode ضروری نہیں رکھا
    // لیکن product name اور prices ضروری ہیں

    if (
        !name ||
        purchasePrice <= 0 ||
        salePrice <= 0
    ) {

        alert(
            "Product Name، Purchase Price اور Sale Price مکمل کریں۔"
        );

        return;
    }


    function saveData(photo) {

        const product = {

            barcode:
                barcode,

            name:
                name,

            purchasePrice:
                purchasePrice,

            salePrice:
                salePrice,

            photo:
                photo || ""

        };


        // اگر barcode موجود ہے تو update
        // ورنہ نیا product

        let index = -1;


        if (barcode) {

            index =
                products.findIndex(
                    function(item) {

                        return item.barcode === barcode;

                    }
                );

        }


        if (index >= 0) {

            products[index] =
                product;

        } else {

            products.push(
                product
            );

        }


        try {

            localStorage.setItem(
                "saimKtkProducts",
                JSON.stringify(products)
            );


            alert(
                "✅ Product تصویر کے ساتھ محفوظ ہو گیا۔"
            );


            // Clear form

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

                photoInput.value =
                    "";

            }


            const preview =
                document.getElementById(
                    "photoPreview"
                );


            if (preview) {

                preview.src =
                    "";

                preview.style.display =
                    "none";

            }


        } catch (error) {

            console.error(
                error
            );


            alert(
                "❌ Product save نہیں ہو سکا۔"
            );

        }

    }


    // Photo exists

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
            function(event) {

                saveData(
                    event.target.result
                );

            };


        reader.onerror =
            function() {

                alert(
                    "تصویر پڑھنے میں مسئلہ آیا۔"
                );

            };


        reader.readAsDataURL(file);

    } else {

        // Without photo

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


    const sale = {

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
            salePrice *
            quantity,

        profit:
            (
                salePrice -
                purchasePrice
            ) *
            quantity,

        date:
            today(),

        time:
            new Date()
                .toLocaleTimeString()

    };


    sales.push(
        sale
    );


    localStorage.setItem(
        "saimKtkSales",
        JSON.stringify(sales)
    );


    alert(
        "✅ Sale محفوظ ہو گئی۔"
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


    const preview =
        document.getElementById(
            "salePhotoPreview"
        );


    if (preview) {

        preview.src =
            "";

        preview.style.display =
            "none";

    }


    render();

}


// ==========================================
// RENDER TODAY SALES
// ==========================================

function render() {

    const list =
        sales.filter(
            function(item) {

                return item.date === today();

            }
        );


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
// START APP
// ==========================================
// ==========================================
// CAMERA FUNCTIONS
// ==========================================

function openCamera() {
    const camera = document.getElementById("productPhoto");

    if (!camera) {
        alert("Camera input نہیں ملا۔");
        return;
    }

    camera.click();
}


function scanProduct() {
    let camera = document.getElementById("saleCamera");

    if (!camera) {
        camera = document.createElement("input");

        camera.id = "saleCamera";
        camera.type = "file";
        camera.accept = "image/*";
        camera.setAttribute("capture", "environment");

        camera.style.display = "none";

        document.body.appendChild(camera);
    }

    camera.click();
}
render();
