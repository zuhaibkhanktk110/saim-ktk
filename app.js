function saveProduct(){

    const barcode = document.getElementById("newBarcode").value.trim();
    const name = document.getElementById("newName").value.trim();
    const purchasePrice = Number(document.getElementById("newCost").value);
    const salePrice = Number(document.getElementById("newPrice").value);

    if(!barcode || !name || purchasePrice <= 0 || salePrice <= 0){
        alert("نام، Barcode، خرید قیمت اور فروخت قیمت مکمل کریں۔");
        return;
    }

    const photoInput = document.getElementById("productPhoto");

    function saveNow(photo){

        const obj = {
            barcode: barcode,
            name: name,
            purchasePrice: purchasePrice,
            salePrice: salePrice,
            photo: photo || ""
        };

        const i = products.findIndex(x => x.barcode === barcode);

        if(i >= 0){
            products[i] = obj;
        }else{
            products.push(obj);
        }

        localStorage.setItem(
            "saimKtkProducts",
            JSON.stringify(products)
        );

        alert("Product اور تصویر محفوظ ہو گئی۔");

        document.getElementById("newBarcode").value = "";
        document.getElementById("newName").value = "";
        document.getElementById("newCost").value = "";
        document.getElementById("newPrice").value = "";

        document.getElementById("productPhoto").value = "";

        const preview = document.getElementById("photoPreview");
        preview.src = "";
        preview.style.display = "none";
    }

    if(photoInput.files && photoInput.files[0]){

        const reader = new FileReader();

        reader.onload = function(e){
            saveNow(e.target.result);
        };

        reader.readAsDataURL(photoInput.files[0]);

    }else{

        saveNow("");
    }
}
