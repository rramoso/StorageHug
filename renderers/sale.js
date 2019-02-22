// Initialize Firebase
require('../firebase/firebase.js')

const remote = require('electron').remote;

var db = firebase.firestore();
var products = []
var clients = []
var productsToUpdate = []
// Fill products list with products name
db.collection("products").where('quantity','>',0).get().then(function(querySnapshot) {

    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        if(doc.exists){products.push(doc.data().name);}
    });

});
// Fill clients list with client's name
db.collection("clients").get().then(function(querySnapshot) {

    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        clients.push(doc.data().name);
    });
});

autocomplete(document.getElementById("productName"), products);
autocomplete(document.getElementById("clientName"), clients);
document.getElementsByName('quantity').forEach(function (elem) {
  elem.addEventListener("input", function() {
    var quantityTotalIni = parseInt(document.getElementById('totalQuantity').innerHTML)

    document.getElementById('totalQuantity').innerHTML = quantityTotalIni + parseInt(elem.value)
});
document.getElementsByName('price').forEach(function (elem) {
  elem.addEventListener("input", function() {
       var quantityTotalIni = parseInt(document.getElementById('totalQuantity').innerHTML)

       document.getElementById('totalRevenue').innerHTML = quantityTotalIni + parseInt(elem.value)
   });

})
})
// PRODUCT LINE ITEM

var productLine = document.getElementById('productLine');
var addProduct = document.getElementById('addProduct');
var saveSaleBtn = document.getElementById('addSaleBtn');

addProduct.addEventListener('click', function(){
  productLine.appendChild(newProductLine());
  var productLineIndex = document.getElementById('productLine').children.length - 1
  autocomplete(document.getElementById("productName"+productLineIndex), products);

  document.getElementsByName('quantity').forEach(function (elem) {
    elem.addEventListener("input", function() {
         var quantityTotalIni = parseInt(document.getElementById('totalQuantity').innerHTML)
         document.getElementById('totalQuantity').innerHTML = quantityTotalIni + parseInt(elem.value)
     });

  })

  document.getElementsByName('price').forEach(function (elem) {
    elem.addEventListener("input", function() {
         var priceInTotal = parseInt(document.getElementById('totalRevenue').innerHTML)
         var priceInteger = priceInTotal + parseInt(elem.value)
         document.getElementById('totalRevenue').innerHTML = priceInteger
     });

  })
})


saveSaleBtn.addEventListener('click', function(){

  var productsToBuy = []
  var saleProducts = []
  var numOfProducts = productLine.children.length;

  for(var i =0; i<numOfProducts; i++){
    var prodName = 'productName'
    var prodQuantity = 'productQuantity'
    var prodPrice = 'productPrice'

    if (i>0){
      prodName += i
      prodQuantity += i
       prodPrice += i
    }

    saleProducts.push({
      'productName' : document.getElementById(prodName).value,
      'productQuantity' : document.getElementById(prodQuantity).value,
      'productPrice' : document.getElementById(prodPrice).value
    })
  }
  var today = new Date();

  var sale = {'client':document.getElementById('clientName').value,
              'products': saleProducts, 'Date': today}

  for(var i = 0; i < sale.products.length; i++){
    confirmSale(sale.products[i].productName,sale.products[i].productQuantity,sale,productsToBuy);
  }
})
//.where('quantity','>=',productQuantity)
function confirmSale(productName, productQuantity,sale,productsToBuy){
  var productsNotEnough = []
  db.collection('products').doc(productName).get()
    .then(function(querySnapshot) {
      // console.log(productName);
      if(productQuantity <= querySnapshot.data().quantity){
        productsToBuy.push(productName)
      }else{
        productsNotEnough.push(productName)
      }
    }).then(function() {
        if(productsToBuy.length == sale.products.length){
          saveSale(sale)
        }else if(productsNotEnough.length > 0){
          alert("Los siguientes productos no tienen suficiente: "+productsNotEnough)
        }
    })
}

function subtractQuantity(p,saleProdQuantity,sale){

  p.get().then(function(querySnapshot) {

      var actualQuantity = querySnapshot.data().quantity;

      var newQ = actualQuantity - saleProdQuantity;
      p.update({'quantity':newQ})
      productsToUpdate.push(querySnapshot.data().name)
        console.log('productsToUpdate: '+productsToUpdate.length);
          console.log('sale.products.length: '+sale.products.length);
      if(productsToUpdate.length == sale.products.length){
        productsToUpdate = []
        alert('Venta salvada exitosamente');
      }
  })
}
function saveSale(sale){
  db.collection('sales').add(sale)
      .then(function(docRef) {
          for(var i = 0; i < sale.products.length; i++){
            var p = db.collection('products').doc(sale.products[i].productName)
            var saleProdQuantity = sale.products[i].productQuantity

            subtractQuantity(p,saleProdQuantity,sale)
          }

      })
}


// <div class="col-md-1">
//
//   <div class="form-label-group ">
//   <input id="deleteProduct" class="btn btn-danger" type="button" value="x" onclick="deleteRow(this)"/>
//   </div>
// </div>

function newProductLine(){

  var n = document.getElementById('productLine').children.length;
  var item = document.createElement('div')
    item.setAttribute('id','productItem'+n)
    item.setAttribute('class','form-row')

  var div0 = document.createElement('div')
    div0.setAttribute('class','col-md-1')
  var div01 = document.createElement('div')
    div01.setAttribute('class','form-label-group')
    var input0 = document.createElement('input')
      input0.setAttribute('class','btn btn-danger')
      input0.setAttribute('type','button')
      input0.setAttribute('value','x')
      input0.setAttribute('id','deleteBtn')
      input0.setAttribute('onclick','deleteRow(this)')
        div01.appendChild(input0)
        div0.appendChild(div01)
        item.appendChild(div0)


  var div1 = document.createElement('div')
    div1.setAttribute('class','col-md-5')
  var form1 = document.createElement('div')
    form1.setAttribute('class','form-label-group')
  var input1 = document.createElement('input')
    input1.setAttribute('class','form-control')
    input1.setAttribute('id','productName'+n)
  var label1 = document.createElement('label')
    label1.innerHTML = 'Nombre Producto'
    label1.setAttribute('for','Nombre Producto')
      form1.appendChild(input1)
      form1.appendChild(label1)
      div1.appendChild(form1)
      item.appendChild(div1)

  var div2 = document.createElement('div')
    div2.setAttribute('class','col-md-3')
  var form2 = document.createElement('div')
    form2.setAttribute('class','form-label-group')
  var input2 = document.createElement('input')
    input2.setAttribute('class','form-control')
    input2.setAttribute('type','number')
    input2.setAttribute('name','quantity')
    input2.setAttribute('id','productQuantity'+n)
  var label2 = document.createElement('label')
    label2.innerHTML = 'Cantidad'
    label2.setAttribute('for','Cantidad')
      form2.appendChild(input2)
      form2.appendChild(label2)
      div2.appendChild(form2)
      item.appendChild(div2)
  //
  var div3 = document.createElement('div')
    div3.setAttribute('class','col-md-3')
  var form3 = document.createElement('div')
    form3.setAttribute('class','form-label-group')
  var input3 = document.createElement('input')
    input3.setAttribute('class','form-control')
    input3.setAttribute('type','number')
    input3.setAttribute('name','price')
    input3.setAttribute('id','productPrice'+n)
  var label3 = document.createElement('label')
    label3.innerHTML = 'Precio'
    label3.setAttribute('for','Precio')
      form3.appendChild(input3)
      form3.appendChild(label3)
      div3.appendChild(form3)
      item.appendChild(div3)

  return item;

}
