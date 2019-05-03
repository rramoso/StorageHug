// Initialize Firebase
require('../firebase/firebase.js')
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;

var db = firebase.firestore();
const ipc = require('electron').ipcRenderer;
var table = $('#dataTable').DataTable({
        "paging" : false,
        "ordering" : false,
        "searching" : false
    });


ipc.on('saleID', (event, message) => {


    document.getElementById('saleId').innerHTML = message

    db.collection("sales").doc(message).get().then(function(querySnapshot) {

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
        document.getElementById('totalRevenue').innerHTML = querySnapshot.data().revenue
        document.getElementById('totalQuantity').innerHTML = querySnapshot.data().totalProducts

    });


})
