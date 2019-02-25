// Initialize Firebase
require('../firebase/firebase.js')
const remote = require('electron').remote;

var db = firebase.firestore();

var table = $('#dataTable').DataTable();


db.collection("clients").get().then(function(querySnapshot) {

    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots

        var row = [doc.data().name,
                   doc.data().phone,
                   doc.data().email,
                   doc.data().address]
        table.row.add(row);

    });

    table.draw()

});
