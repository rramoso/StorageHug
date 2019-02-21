// Initialize Firebase
require('../firebase/firebase.js')
const remote = require('electron').remote;

var db = firebase.firestore();
addProductBtn.addEventListener('click',()=>{
  var today = new Date();
  var product = {'name':document.getElementById('productName').value,
                 'type':document.getElementById('productType').value,
                 'quantity':document.getElementById('productQuantity').value,
                 'cost':document.getElementById('productCost').value,
                 'price':document.getElementById('productPrice').value,
                 'description':document.getElementById('productDescription').value,
                 'date':document.getElementById('productDate').value,
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
