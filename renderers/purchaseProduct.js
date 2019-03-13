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


autocomplete(document.getElementById("productName"), products);

addPurchaseBtn.addEventListener('click',()=>{
  var today = new Date();
  var product = {'name':document.getElementById('productName').value,
                 'quantity':parseInt(document.getElementById('productQuantity').value),
                 'cost':document.getElementById('productCost').value,
                 'price':document.getElementById('productPrice').value,
                 'createdDate': today
                }


  db.collection('products').doc(product.name).get()
  .then(function(docRef) {
      console.log();
      oldQ = docRef.data().quantity
      newQ = parseInt(oldQ)+parseInt(product.quantity)
      db.collection('products').doc(product.name).update({'quantity':newQ})
      db.collection('products-history').add(product).then(function () {
        alert('Compra Guardada');
        var window = remote.getCurrentWindow();
        window.close();
      })
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });







})
