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
// OPEN CAMERA / PHOTO
// ==========================================

function openCamera() {

    const input =
        document.getElementById("productPhoto");

    if (!input) {
        alert("Camera input نہیں ملا۔");
        return;
    }

    input.click();
}


// ==========================================
// PHOTO PREVIEW
// ==========================================

function previewPhoto(event) {

    const preview =
        document.getElementById("photoPreview");

    const file =
        event.target.files &&
        event.target.files[0];

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

async function scanProduct() {

    const barcodeInput =
        document.getElementById("barcode");

    if (!barcodeInput) {
        alert("Barcode field نہیں ملا۔");
        return;
    }

    // BarcodeDetector supported?
    if (!("BarcodeDetector" in window)) {

        alert(
            "آپ کے browser میں barcode camera scanning supported نہیں ہے۔ براہِ کرم barcode نمبر خود لکھیں۔"
        );

        barcodeInput.focus();

        return;
    }

    try {

        const detector =
            new BarcodeDetector({
                formats: [
                    "ean_13",
                    "ean_8",
                    "upc_a",
                    "upc_e",
                    "code_128",
                    "code_39"
                ]
            });


        const stream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: {
                        ideal: "environment"
                    }
                }
            });


        // Create temporary camera
        const video =
            document.createElement("video");

        video.setAttribute(
            "playsinline",
            ""
        );

        video.autoplay = true;

        video.muted = true;

        video.style.position = "fixed";
        video.style.left = "10px";
        video.style.right = "10px";
        video.style.top = "100px";
        video.style.width = "calc(100% - 20px)";
        video.style.maxHeight = "60vh";
        video.style.background = "black";
        video.style.zIndex = "99999";
        video.style.borderRadius = "15px";


        const closeButton =
            document.createElement("button");

        closeButton.innerText =
            "✖ Camera بند کریں";

        closeButton.style.position =
            "fixed";

        closeButton.style.bottom =
            "30px";

        closeButton.style.left =
            "50%";

        closeButton.style.transform =
            "translateX(-50%)";

        closeButton.style.zIndex =
            "100000";

        closeButton.style.padding =
            "15px 25px";

        closeButton.style.fontSize =
            "18px";


        document.body.appendChild(video);
        document.body.appendChild(closeButton);


        video.srcObject =
            stream;


        await video.play();


        let scanning = true;


        function closeCamera() {

            scanning = false;

            stream
                .getTracks()
                .forEach(function(track) {
                    track.stop();
                });


            video.remove();
            closeButton.remove();
        }


        closeButton.onclick =
            closeCamera;


        async function scanLoop() {

            if (!scanning) {
                return;
            }


            try {

                const barcodes =
                    await detector.detect(video);


                if (
                    barcodes &&
                    barcodes.length > 0
                ) {

                    const code =
                        barcodes[0].rawValue;


                    barcodeInput.value =
                        code;


                    closeCamera();


                    searchProduct();

                    return;
                }

            } catch (error) {

                console.log(
                    "Barcode scan:",
                    error
                );

            }


            requestAnimationFrame(
                scanLoop
            );
        }


        scanLoop();


    } catch (error) {

        console.error(
            "Camera error:",
            error
        );


        alert(
            "Camera open نہیں ہو سکا۔ Browser میں Camera Permission Allow کریں۔"
        );

    }
}


// ==========================================
// SEARCH PRODUCT
// ==========================================

async function searchProduct() {

    const barcodeInput =
        document.getElementById("barcode");


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
            "پہلے Barcode / Product Code لکھیں۔"
        );

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
            "photoPreview"
        );


    if (
        preview &&
        product.photo
    ) {

        preview.src =
            product.photo;

        preview.style.display =
            "block";

    } else if (preview) {

        preview.src =
            "";

        preview.style.display =
            "none";

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


        try {

            localStorage.setItem(
                "saimKtkProducts",
                JSON.stringify(products)
            );


            alert(
                "✅ Product تصویر کے ساتھ محفوظ ہو گیا۔"
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
                "❌ Product save نہیں ہو سکا۔ Browser storage بھر گئی ہے۔"
            );

        }

    }


    // Photo selected

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
                    "تصویر read نہیں ہو سکی۔"
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


    render();

}


// ==========================================
// PHOTO INPUT
// ==========================================

const photoInput =
    document.getElementById(
        "productPhoto"
    );


if (photoInput) {

    photoInput.addEventListener(
        "change",
        function(event) {

            previewPhoto(event);

        }
    );

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
