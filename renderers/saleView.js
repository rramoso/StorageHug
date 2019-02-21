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
