// Initialize Firebase
require('../firebase/firebase.js')
const remote = require('electron').remote;

var db = firebase.firestore();
addClientBtn.addEventListener('click',()=>{
  var today = new Date();
  var client = {'name':document.getElementById('clientName').value,
                 'phone':document.getElementById('clientPhone').value,
                 'email':document.getElementById('clientEmail').value,
                 'address':document.getElementById('clientAddress').value,
                 'createdDate': today
                }

  db.collection('clients').add(client)
  .then(function(docRef) {
      alert('Client Creado');
      var window = remote.getCurrentWindow();
      window.close();
  })
  .catch(function(error) {
      console.error("Error agregando cliente document: ", error);
  });
})
