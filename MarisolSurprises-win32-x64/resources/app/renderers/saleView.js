// Initialize Firebase
require('../firebase/firebase.js')
const remote = require('electron').remote;

var db = firebase.firestore();
const ipc = require('electron').ipcRenderer;
var table = $('#dataTable').DataTable();

ipc.on('saleID', (event, message) => {


    document.getElementById('saleId').innerHTML = message

    db.collection("sales").doc(message).get().then(function(querySnapshot) {
        document.getElementById('clientName').innerHTML = querySnapshot.data().client
        var products = querySnapshot.data().products;
        for(var i = 0; i < products.length; i++){
          var row = [
                products[i].productName,
                products[i].productQuantity,
                products[i].productPrice
          ]
          table.row.add(row)
        }
        table.draw()

    });


})
