// ==========================================
// SAIM KTK - COMPLETE APP.JS
// Photos -> IndexedDB
// Products/Sales -> localStorage
// ==========================================


// ==========================================
// LOAD DATA
// ==========================================

let sales = [];

let products = [];

try {
    sales = JSON.parse(
        localStorage.getItem("saimKtkSales") || "[]"
    );
} catch (e) {
    sales = [];
}

try {
    products = JSON.parse(
        localStorage.getItem("saimKtkProducts") || "[]"
    );
} catch (e) {
    products = [];
}


// ==========================================
// INDEXED DB
// ==========================================

const DB_NAME = "saimKtkPhotoDB";
const DB_VERSION = 1;
const PHOTO_STORE = "photos";


function openPhotoDB() {

    return new Promise(function(resolve, reject) {

        const request =
            indexedDB.open(DB_NAME, DB_VERSION);


        request.onupgradeneeded = function(event) {

            const db = event.target.result;

            if (!db.objectStoreNames.contains(PHOTO_STORE)) {

                db.createObjectStore(
                    PHOTO_STORE,
                    { keyPath: "barcode" }
                );

            }
        };


        request.onsuccess = function() {

            resolve(request.result);

        };


        request.onerror = function() {

            reject(request.error);

        };

    });

}


// ==========================================
// SAVE PHOTO IN INDEXED DB
// ==========================================

function savePhoto(barcode, photoData) {

    return openPhotoDB().then(function(db) {

        return new Promise(function(resolve, reject) {

            const transaction =
                db.transaction(
                    PHOTO_STORE,
                    "readwrite"
                );

            const store =
                transaction.objectStore(
                    PHOTO_STORE
                );


            store.put({
                barcode: barcode,
                photo: photoData
            });


            transaction.oncomplete = function() {

                db.close();

                resolve();

            };


            transaction.onerror = function() {

                db.close();

                reject(transaction.error);

            };

        });

    });

}


// ==========================================
// GET PHOTO
// ==========================================

function getPhoto(barcode) {

    return openPhotoDB().then(function(db) {

        return new Promise(function(resolve, reject) {

            const transaction =
                db.transaction(
                    PHOTO_STORE,
                    "readonly"
                );

            const store =
                transaction.objectStore(
                    PHOTO_STORE
                );


            const request =
                store.get(barcode);


            request.onsuccess = function() {

                db.close();

                if (request.result) {

                    resolve(
                        request.result.photo || ""
                    );

                } else {

                    resolve("");

                }

            };


            request.onerror = function() {

                db.close();

                reject(request.error);

            };

        });

    });

}


// ==========================================
// DELETE PHOTO
// ==========================================

function deletePhoto(barcode) {

    return openPhotoDB().then(function(db) {

        return new Promise(function(resolve, reject) {

            const transaction =
                db.transaction(
                    PHOTO_STORE,
                    "readwrite"
                );

            const store =
                transaction.objectStore(
                    PHOTO_STORE
                );


            store.delete(barcode);


            transaction.oncomplete = function() {

                db.close();

                resolve();

            };


            transaction.onerror = function() {

                db.close();

                reject(transaction.error);

            };

        });

    });

}


// ==========================================
// TODAY
// ==========================================

function today() {

    return new Date()
        .toISOString()
        .slice(0, 10);

}


// ==========================================
// COMPRESS PHOTO
// ==========================================

function compressPhoto(file) {

    return new Promise(function(resolve, reject) {

        const reader =
            new FileReader();


        reader.onload = function(event) {

            const image =
                new Image();


            image.onload = function() {

                let width =
                    image.width;

                let height =
                    image.height;


                const maxSize = 900;


                if (width > maxSize) {

                    height =
                        height *
                        (maxSize / width);

                    width =
                        maxSize;
                }


                if (height > maxSize) {

                    width =
                        width *
                        (maxSize / height);

                    height =
                        maxSize;
                }


                const canvas =
                    document.createElement(
                        "canvas"
                    );


                canvas.width =
                    Math.round(width);

                canvas.height =
                    Math.round(height);


                const ctx =
                    canvas.getContext("2d");


                ctx.drawImage(
                    image,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );


                const result =
                    canvas.toDataURL(
                        "image/jpeg",
                        0.65
                    );


                resolve(result);

            };


            image.onerror = function() {

                reject(
                    new Error(
                        "Image load failed"
                    )
                );

            };


            image.src =
                event.target.result;

        };


        reader.onerror = function() {

            reject(
                new Error(
                    "File read failed"
                )
            );

        };


        reader.readAsDataURL(file);

    });

}


// ==========================================
// SEARCH PRODUCT
// ==========================================

async function searchProduct() {

    const barcodeInput =
        document.getElementById("barcode");


    if (!barcodeInput) {

        alert("Barcode field نہیں ملا۔");

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


    // GET PHOTO FROM INDEXED DB

    try {

        const photo =
            await getPhoto(code);


        const preview =
            document.getElementById(
                "photoPreview"
            );


        if (preview && photo) {

            preview.src =
                photo;

            preview.style.display =
                "block";
        }

    } catch (error) {

        console.log(
            "Photo not found",
            error
        );

    }

}


// ==========================================
// SAVE PRODUCT
// ==========================================

async function saveProduct() {

    const barcodeElement =
        document.getElementById(
            "newBarcode"
        );


    const nameElement =
        document.getElementById(
            "newName"
        );


    const costElement =
        document.getElementById(
            "newCost"
        );


    const priceElement =
        document.getElementById(
            "newPrice"
        );


    const photoInput =
        document.getElementById(
            "productPhoto"
        );


    if (
        !barcodeElement ||
        !nameElement ||
        !costElement ||
        !priceElement
    ) {

        alert(
            "Product کے fields نہیں مل رہے۔"
        );

        return;
    }


    const barcode =
        barcodeElement.value.trim();


    const name =
        nameElement.value.trim();


    const purchasePrice =
        Number(
            costElement.value
        );


    const salePrice =
        Number(
            priceElement.value
        );


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


    try {

        // ----------------------------------
        // PHOTO
        // ----------------------------------

        let photoData = "";


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


        // ----------------------------------
        // SAVE PHOTO SEPARATELY
        // ----------------------------------

        if (photoData) {

            await savePhoto(
                barcode,
                photoData
            );

        }


        // ----------------------------------
        // SAVE PRODUCT WITHOUT PHOTO
        // ----------------------------------

        const product = {

            barcode:
                barcode,

            name:
                name,

            purchasePrice:
                purchasePrice,

            salePrice:
                salePrice
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


        // ----------------------------------
        // LOCAL STORAGE ONLY DATA
        // ----------------------------------

        localStorage.setItem(
            "saimKtkProducts",
            JSON.stringify(products)
        );


        // ----------------------------------
        // SUCCESS
        // ----------------------------------

        alert(
            "✅ Product تصویر کے ساتھ محفوظ ہو گیا۔"
        );


        // CLEAR FORM

        barcodeElement.value =
            "";

        nameElement.value =
            "";

        costElement.value =
            "";

        priceElement.value =
            "";


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
            "SAVE PRODUCT ERROR:",
            error
        );


        alert(
            "❌ Product save نہیں ہو سکا۔ دوبارہ کوشش کریں۔"
        );

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
            salePrice * quantity,

        profit:
            (salePrice - purchasePrice) *
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
// PHOTO PREVIEW
// ==========================================

const photoInput =
    document.getElementById(
        "productPhoto"
    );


const photoPreview =
    document.getElementById(
        "photoPreview"
    );


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


            reader.readAsDataURL(
                file
            );

        }
    );

}


// ==========================================
// CLEAN OLD PHOTO DATA
// ==========================================
// پہلے والے version نے photos کو
// localStorage میں رکھا تھا۔
// یہ code پرانے photo fields ہٹا دیتا ہے۔
// ==========================================

try {

    const cleanProducts =
        products.map(
            function(item) {

                return {

                    barcode:
                        item.barcode,

                    name:
                        item.name,

                    purchasePrice:
                        item.purchasePrice,

                    salePrice:
                        item.salePrice

                };

            }
        );


    localStorage.setItem(
        "saimKtkProducts",
        JSON.stringify(
            cleanProducts
        )
    );


    products =
        cleanProducts;


} catch (error) {

    console.log(
        "Old product cleanup error",
        error
    );

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
