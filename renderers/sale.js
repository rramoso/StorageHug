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

productQuantity.addEventListener('click',function(){

  if(products.includes(productName.value)){
    db.collection("products").doc(productName.value).get().then(function(querySnapshot) {
        productPrice.value = querySnapshot.data().price
    });
  }
})
productQuantity.addEventListener('input',function(){

  if(products.includes(productName.value)){
    db.collection("products").doc(productName.value).get().then(function(querySnapshot) {
        productPrice.value = querySnapshot.data().price * productQuantity.value
        var totalElems = 0

        document.getElementsByName('price').forEach((quanti)=>{
          var valueInElem = quanti.value
          if(valueInElem == ''){
            valueInElem = 0;
          }
          totalElems += parseInt(valueInElem);
        })
        document.getElementById('totalRevenue').innerHTML = parseInt(totalElems)
    });
  }
})

document.getElementsByName('quantity').forEach(function (elem) {

  elem.addEventListener("input", function() {

    var totalElems = 0
    document.getElementsByName('quantity').forEach((quanti)=>{
      var valueInElem = quanti.value
      if(valueInElem == ''){
        valueInElem = 0;
      }
      totalElems += parseInt(valueInElem);
    })
    document.getElementById('totalQuantity').innerHTML = parseInt(totalElems)
});

document.getElementsByName('price').forEach(function (elem) {
  elem.addEventListener("input", function() {
      var totalElems = 0

      document.getElementsByName('price').forEach((quanti)=>{
        var valueInElem = quanti.value
        if(valueInElem == ''){
          valueInElem = 0;
        }
        totalElems += parseInt(valueInElem);
      })
      document.getElementById('totalRevenue').innerHTML = parseInt(totalElems)
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
  var productNameLineIndex = document.getElementById("productName"+ productLineIndex)
  var productQuantityLineIndex = document.getElementById("productQuantity"+ productLineIndex)
  var productPriceLineIndex = document.getElementById("productPrice"+ productLineIndex)
  autocomplete(document.getElementById("productName"+ productLineIndex), products);

  productQuantityLineIndex.addEventListener('click',function(){

    if(products.includes(productNameLineIndex.value)){
      db.collection("products").doc(productNameLineIndex.value).get().then(function(querySnapshot) {
          productPriceLineIndex.value = querySnapshot.data().price * productQuantityLineIndex.value
      });
    }
  })
  productQuantityLineIndex.addEventListener('input',function(){

    if(products.includes(productNameLineIndex.value)){
      db.collection("products").doc(productNameLineIndex.value).get().then(function(querySnapshot) {
          productPriceLineIndex.value = querySnapshot.data().price * productQuantityLineIndex.value
          var totalElems = 0

          document.getElementsByName('price').forEach((quanti)=>{
            var valueInElem = quanti.value
            if(valueInElem == ''){
              valueInElem = 0;
            }
            totalElems += parseInt(valueInElem);
          })
          document.getElementById('totalRevenue').innerHTML = parseInt(totalElems)
      });
    }
  })
  document.getElementsByName('quantity').forEach(function (elem) {
    elem.addEventListener("input", function() {
      var totalElems = 0
      var valueInElem = elem.value
      if(valueInElem == ''){
        valueInElem = 0;
      }
      document.getElementsByName('quantity').forEach((quanti)=>{
        var valueInElem = quanti.value
        if(valueInElem == ''){
          valueInElem = 0;
        }
        totalElems += parseInt(valueInElem);
      })
      document.getElementById('totalQuantity').innerHTML = parseInt(totalElems)
    });

  })

  document.getElementsByName('price').forEach(function (elem) {
    elem.addEventListener("input", function() {
      var totalElems = 0

      document.getElementsByName('price').forEach((quanti)=>{

        var valueInElem = quanti.value
        console.log('valueInElem: '+valueInElem);
        if(valueInElem == ''){
          valueInElem = 0;
        }
          totalElems += parseInt(valueInElem);
      })
      document.getElementById('totalRevenue').innerHTML = parseInt(totalElems)
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
  var dateKey = today.getDate()+'-'+parseInt(today.getMonth()+1)+'-'+today.getFullYear()

  var sale = {'client':document.getElementById('clientName').value,
              'products': saleProducts, 'DateTimestamp': today,'Date':dateKey,
            'revenue': parseInt(document.getElementById('totalRevenue').innerHTML),
            'totalProducts':parseInt(document.getElementById('totalQuantity').innerHTML)}

  for(var i = 0; i < sale.products.length; i++){
    confirmSale(sale.products[i].productName,sale.products[i].productQuantity,sale,productsToBuy);
  }
})

function confirmSale(productName, productQuantity,sale,productsToBuy){
  var productsNotEnough = []
  db.collection('products').doc(productName).get()
    .then(function(querySnapshot) {

      if(productQuantity <= querySnapshot.data().quantity){
        productsToBuy.push(productName)
      }else{
        productsNotEnough.push(productName)
      }
    }).then(function() {
        if(productsToBuy.length == sale.products.length){
          db.collection("sales").get().then(snap => {
             saveSale(sale,snap.size+1)
          });

        }else if(productsNotEnough.length > 0){
          alert("Los siguientes productos no tienen suficiente: "+productsNotEnough)
        }
    })
}
function dejaver() {
alert('Venta salvada exitosamente');
}
function subtractQuantity(p,saleProdQuantity,sale){

  p.get().then(function(querySnapshot) {

      var actualQuantity = querySnapshot.data().quantity;

      var newQ = actualQuantity - saleProdQuantity;
      p.update({'quantity':newQ})
      productsToUpdate.push(querySnapshot.data().name)

      if(productsToUpdate.length == sale.products.length){
        productsToUpdate = []
        dejaver()
      }
  })
}
function saveSale(sale,saleId){
  db.collection('sales').doc(String(saleId)).set(sale)
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
