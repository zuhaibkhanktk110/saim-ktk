// ==========================================
// SAIM KTK - COMPLETE APP.JS
// ==========================================

// LOAD DATA
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
        alert("یہ Product محفوظ نہیں ہے۔");
        return;
    }

    document.getElementById("productName").value =
        product.name || "";

    document.getElementById("purchasePrice").value =
        product.purchasePrice || "";

    document.getElementById("salePrice").value =
        product.salePrice || "";

    const preview =
        document.getElementById("photoPreview");

    if (preview && product.photo) {
        preview.src = product.photo;
        preview.style.display = "block";
    }
}


// ==========================================
// COMPRESS PHOTO
// ==========================================

function compressPhoto(file) {

    return new Promise(function(resolve, reject) {

        const reader = new FileReader();

        reader.onload = function(event) {

            const image = new Image();

            image.onload = function() {

                const maxWidth = 800;
                const maxHeight = 800;

                let width = image.width;
                let height = image.height;

                if (width > maxWidth) {

                    height =
                        height * (maxWidth / width);

                    width = maxWidth;
                }

                if (height > maxHeight) {

                    width =
                        width * (maxHeight / height);

                    height = maxHeight;
                }

                const canvas =
                    document.createElement("canvas");

                canvas.width = width;
                canvas.height = height;

                const ctx =
                    canvas.getContext("2d");

                ctx.drawImage(
                    image,
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

                resolve(compressed);
            };

            image.onerror = function() {
                reject("تصویر load نہیں ہو سکی۔");
            };

            image.src = event.target.result;
        };

        reader.onerror = function() {
            reject("تصویر read نہیں ہو سکی۔");
        };

        reader.readAsDataURL(file);
    });
}


// ==========================================
// SAVE PRODUCT
// ==========================================

async function saveProduct() {

    const barcodeElement =
        document.getElementById("newBarcode");

    const nameElement =
        document.getElementById("newName");

    const costElement =
        document.getElementById("newCost");

    const priceElement =
        document.getElementById("newPrice");

    const photoInput =
        document.getElementById("productPhoto");


    if (
        !barcodeElement ||
        !nameElement ||
        !costElement ||
        !priceElement
    ) {

        alert("Product کے fields نہیں مل رہے۔");
        return;
    }


    const barcode =
        barcodeElement.value.trim();

    const name =
        nameElement.value.trim();

    const purchasePrice =
        Number(costElement.value);

    const salePrice =
        Number(priceElement.value);


    // VALIDATION

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


    // PHOTO

    let photoData = "";


    try {

        if (
            photoInput &&
            photoInput.files &&
            photoInput.files.length > 0
        ) {

            const file =
                photoInput.files[0];

            photoData =
                await compressPhoto(file);
        }


        // PRODUCT OBJECT

        const product = {

            barcode: barcode,

            name: name,

            purchasePrice: purchasePrice,

            salePrice: salePrice,

            photo: photoData
        };


        // CHECK EXISTING PRODUCT

        const index =
            products.findIndex(function(item) {

                return item.barcode === barcode;

            });


        if (index >= 0) {

            products[index] = product;

        } else {

            products.push(product);

        }


        // SAVE

        localStorage.setItem(
            "saimKtkProducts",
            JSON.stringify(products)
        );


        alert("✅ Product کامیابی سے محفوظ ہو گیا۔");


        // CLEAR FORM

        barcodeElement.value = "";
        nameElement.value = "";
        costElement.value = "";
        priceElement.value = "";


        if (photoInput) {
            photoInput.value = "";
        }


        const preview =
            document.getElementById("photoPreview");

        if (preview) {

            preview.src = "";

            preview.style.display = "none";
        }


    } catch (error) {

        console.error(error);

        alert(
            "❌ Product save نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔"
        );
    }
}


// ==========================================
// SAVE SALE
// ==========================================

function saveSale() {

    const barcode =
        document.getElementById("barcode").value.trim();

    const name =
        document.getElementById("productName").value.trim();

    const purchasePrice =
        Number(
            document.getElementById("purchasePrice").value
        );

    const salePrice =
        Number(
            document.getElementById("salePrice").value
        );

    const quantity =
        Math.max(
            1,
            Number(
                document.getElementById("quantity").value
            ) || 1
        );


    if (
        !name ||
        purchasePrice <= 0 ||
        salePrice <= 0
    ) {

        alert("Product اور prices مکمل کریں۔");

        return;
    }


    const sale = {

        barcode: barcode,

        name: name,

        purchasePrice: purchasePrice,

        salePrice: salePrice,

        quantity: quantity,

        totalSale:
            salePrice * quantity,

        profit:
            (salePrice - purchasePrice) * quantity,

        date:
            today(),

        time:
            new Date().toLocaleTimeString()
    };


    sales.push(sale);


    localStorage.setItem(
        "saimKtkSales",
        JSON.stringify(sales)
    );


    alert("✅ Sale محفوظ ہو گئی۔");


    document.getElementById("barcode").value = "";

    document.getElementById("productName").value = "";

    document.getElementById("purchasePrice").value = "";

    document.getElementById("salePrice").value = "";

    document.getElementById("quantity").value = 1;


    render();
}


// ==========================================
// PHOTO PREVIEW
// ==========================================

const photoInput =
    document.getElementById("productPhoto");


const photoPreview =
    document.getElementById("photoPreview");


if (photoInput) {

    photoInput.addEventListener(
        "change",
        function() {

            const file =
                this.files &&
                this.files[0];

            if (!file) {
                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    if (photoPreview) {

                        photoPreview.src =
                            event.target.result;

                        photoPreview.style.display =
                            "block";
                    }
                };


            reader.readAsDataURL(file);
        }
    );
}


// ==========================================
// RENDER SALES
// ==========================================

function render() {

    const list =
        sales.filter(function(item) {

            return item.date === today();

        });


    const total =
        list.reduce(
            function(sum, item) {

                return sum +
                    Number(item.totalSale || 0);

            },
            0
        );


    const profit =
        list.reduce(
            function(sum, item) {

                return sum +
                    Number(item.profit || 0);

            },
            0
        );


    const totalSales =
        document.getElementById("totalSales");

    const totalProfit =
        document.getElementById("totalProfit");

    const totalOrders =
        document.getElementById("totalOrders");


    if (totalSales) {

        totalSales.textContent =
            "Rs " + total.toLocaleString();
    }


    if (totalProfit) {

        totalProfit.textContent =
            "Rs " + profit.toLocaleString();
    }


    if (totalOrders) {

        totalOrders.textContent =
            list.length;
    }


    const salesList =
        document.getElementById("salesList");


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
            .map(function(item) {

                return `
                    <div class="sale-item">

                        <b>${item.name}</b>

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

            })
            .join("");
}


// ==========================================
// START
// ==========================================

render();
