// Initialize Firebase
require('../firebase/firebase.js')
const remote = require('electron').remote;

const ipcRenderer = require('electron').ipcRenderer;


var db = firebase.firestore();

var table = $('#dataTable').DataTable();



db.collection("sales").get().then(function(querySnapshot) {

    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots

        var row = [doc.id,
                   doc.data().client,
                  new Date(doc.data().Date.seconds*1000),
                  '<button id="addProduct" onclick="ipcRenderer.send('+"'viewAllSales',"+"'wtf'"+')" class="btn btn-info" type="button" name="button"><b>Ver Factura</b></button>'
                ]

        table.row.add(row);
    });

    // viewSale()
    table.draw()
    // for(var i = 0; i < document.getElementById('dataTable').children[2].children.length; i++){
    //   console.log(document.getElementById('dataTable').children[2].children[i])
    // }
});
function conio() {

}
