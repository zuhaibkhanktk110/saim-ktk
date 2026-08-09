let sales=JSON.parse(localStorage.getItem("saimKtkSales")||"[]");
let products=JSON.parse(localStorage.getItem("saimKtkProducts")||"[]");

function today(){return new Date().toISOString().slice(0,10)}

function searchProduct(){
  const code=document.getElementById("barcode").value.trim();
  const p=products.find(x=>x.barcode===code);
  if(!p){alert("یہ product ابھی محفوظ نہیں ہے۔");return;}
  document.getElementById("productName").value=p.name;
  document.getElementById("purchasePrice").value=p.purchasePrice;
  document.getElementById("salePrice").value=p.salePrice;
}

function saveProduct(){
  const barcode=document.getElementById("newBarcode").value.trim();
  const name=document.getElementById("newName").value.trim();
  const purchasePrice=Number(document.getElementById("newCost").value);
  const salePrice=Number(document.getElementById("newPrice").value);
  if(!barcode||!name||purchasePrice<=0||salePrice<=0){
    alert("Barcode، نام، خرید قیمت اور فروخت قیمت مکمل کریں۔");return;
  }
  const obj={barcode,name,purchasePrice,salePrice};
  const i=products.findIndex(x=>x.barcode===barcode);
  if(i>=0) products[i]=obj; else products.push(obj);
  localStorage.setItem("saimKtkProducts",JSON.stringify(products));
  alert("Product محفوظ ہو گیا۔");
  document.getElementById("newBarcode").value="";
  document.getElementById("newName").value="";
  document.getElementById("newCost").value="";
  document.getElementById("newPrice").value="";
}

function saveSale(){
  const barcode=document.getElementById("barcode").value.trim();
  const name=document.getElementById("productName").value.trim();
  const purchasePrice=Number(document.getElementById("purchasePrice").value);
  const salePrice=Number(document.getElementById("salePrice").value);
  const quantity=Math.max(1,Number(document.getElementById("quantity").value)||1);
  if(!name||purchasePrice<=0||salePrice<=0){
    alert("Product اور prices مکمل کریں۔");return;
  }
  const totalSale=salePrice*quantity;
  const profit=(salePrice-purchasePrice)*quantity;
  sales.push({barcode,name,purchasePrice,salePrice,quantity,totalSale,profit,date:today(),time:new Date().toLocaleTimeString()});
  localStorage.setItem("saimKtkSales",JSON.stringify(sales));
  alert("Sale محفوظ ہو گئی۔");
  document.getElementById("barcode").value="";
  document.getElementById("productName").value="";
  document.getElementById("purchasePrice").value="";
  document.getElementById("salePrice").value="";
  document.getElementById("quantity").value=1;
  render();
}

function render(){
  const list=sales.filter(x=>x.date===today());
  const total=list.reduce((s,x)=>s+x.totalSale,0);
  const profit=list.reduce((s,x)=>s+x.profit,0);
  document.getElementById("totalSales").textContent="Rs "+total.toLocaleString();
  document.getElementById("totalProfit").textContent="Rs "+profit.toLocaleString();
  document.getElementById("totalOrders").textContent=list.length;
  document.getElementById("salesList").innerHTML=list.length
    ? list.slice().reverse().map(x=>`<div class="sale-item"><b>${x.name}</b> × ${x.quantity}<br>Sale: Rs ${x.totalSale.toLocaleString()}<br><span class="profit">Profit: Rs ${x.profit.toLocaleString()}</span><br><small>${x.time}</small></div>`).join("")
    : "آج ابھی کوئی sale نہیں ہوئی۔";
}
render();
