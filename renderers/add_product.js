// Initialize Firebase
require('../firebase/firebase.js')
const remote = require('electron').remote;

var db = firebase.firestore();
var products = []

db.collection("products").where('quantity','>',0).get().then(function(querySnapshot) {

    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        if(doc.exists){products.push(doc.data().name);}
    });

});

addProductBtn.addEventListener('click',()=>{
  var today = new Date();
  var product = {'name':document.getElementById('productName').value,
                 'type':document.getElementById('productType').value,
                 'quantity':parseInt(document.getElementById('productQuantity').value),
                 'cost':document.getElementById('productCost').value,
                 'price':document.getElementById('productPrice').value,
                 'description':document.getElementById('productDescription').value,
                 'date':document.getElementById('productDate').value,
                 'toSale': document.getElementById('productPurpose').checked,
                 'createdDate': today
                }

  db.collection('products').doc(product.name).set(product)
  .then(function(docRef) {
      alert('Product Creado');
      var window = remote.getCurrentWindow();
      window.close();
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  })

includeProduct.addEventListener('click',() =>{
  productLine.appendChild(newProductLine());
  var productLineIndex = document.getElementById('productLine').children.length - 1
  autocomplete(document.getElementById("productName"+productLineIndex), products);

})


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

  return item;

}
