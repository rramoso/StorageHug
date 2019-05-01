// Initialize Firebase
require('../../firebase/firebase.js')
const remote = require('electron').remote;

var db = firebase.firestore();

var table = $('#dataTable').DataTable();


db.collection("products").get().then(function(querySnapshot) {

    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots

        var row = doc.data().name
        var item = ['<a id="showProduct" href = "#" onclick="show('+"'"+row+"'"+')" >'+row+'</a>']

        table.row.add(item);
    });

    table.draw()

});
const ipc = require('electron').ipcRenderer;
