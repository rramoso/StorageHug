// Initialize Firebase
require('../firebase/firebase.js')
const remote = require('electron').remote;

var db = firebase.firestore();

var table = $('#dataTable').DataTable();
db.collection("products").get().then(function(querySnapshot) {

    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots

        var row = [doc.data().name,
                   doc.data().type,
                   doc.data().quantity,
                   doc.data().cost,
                   doc.data().price,
                   doc.data().description]
        table.row.add(row);

    });

    table.draw()

});
const ipc = require('electron').ipcRenderer;

const updateBtn = document.getElementById('updateBtn')

updateBtn.addEventListener('click', function () {
  ipc.send('update-notify-value','fuck')
  console.log('push');
  // Close this window
  // var window = remote.getCurrentWindow();
  // window.close();
})
// 'name':document.getElementById('productName').value,
// 'type':document.getElementById('productType').value,
// 'quantity':document.getElementById('productQuantity').value,
// 'cost':document.getElementById('productCost').value,
// 'price':document.getElementById('productPrice').value,
// 'description':document.getElementById('productDescription').value,
// 'date':document.getElementById('productDate').value,
// 'createdDate': today
