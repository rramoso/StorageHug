// Initialize Firebase
require('../firebase/firebase.js')
const remote = require('electron').remote;

var db = firebase.firestore();
const ipc = require('electron').ipcRenderer;
var table = $('#dataTable').DataTable();

ipc.on('reportID', (event, message) => {


console.log(message);
    db.collection("sales").where('Date','==',message).get().then(function (snap) {
      var totalProducts = 0
      var totalRevenue = 0
      for(var i = 0; i < snap.docs.length; i++){
        var row = [
          snap.docs[i].id,
          snap.docs[i].data().client,
          snap.docs[i].data().totalProducts,
          snap.docs[i].data().revenue
        ]
        totalProducts += snap.docs[i].data().totalProducts
        totalRevenue += snap.docs[i].data().revenue

        table.row.add(row);
      }
      document.getElementById('totalQuantity').innerHTML = '<b>'+ totalProducts + '</b>'
      document.getElementById('totalRevenue').innerHTML = '<b>'+ totalRevenue + '</b>'

      table.draw()
    })


})

ipc.on('reportMonth', (event, message) => {


console.log(message);
    db.collection("sales").where('Month','==',message).get().then(function (snap) {
      var totalProducts = 0
      var totalRevenue = 0
      for(var i = 0; i < snap.docs.length; i++){
        var row = [
          snap.docs[i].id,
          snap.docs[i].data().client,
          snap.docs[i].data().totalProducts,
          snap.docs[i].data().revenue
        ]
        totalProducts += snap.docs[i].data().totalProducts
        totalRevenue += snap.docs[i].data().revenue

        table.row.add(row);
      }
      document.getElementById('totalQuantity').innerHTML = '<b>'+ totalProducts + '</b>'
      document.getElementById('totalRevenue').innerHTML = '<b>'+ totalRevenue + '</b>'

      table.draw()
    })


})
