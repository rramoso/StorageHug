// Initialize Firebase
require('../firebase/firebase.js')

const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;

users = {}
admin = 'mcruz'
var db = firebase.firestore();
db.collection('users').get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      users[doc.id] = doc.data()
  });
// add.addEventListener('click',function (event) {
//   event.preventDefault()
//   user = {'username': 'acollado', 'password': 'ventas2','Nombre': 'Arisleida Collado'}
//   // db.collection('users').doc(user.username).set(user)
//   //     .then(function(docRef) {
//   //
//   //     })
//   db.collection('users').get().then(function(querySnapshot) {
//     querySnapshot.forEach(function(doc) {
//         // doc.data() is never undefined for query doc snapshots
//         console.log(doc.id, " => ", doc.data());
//     });
// })
//   // console.log(user);
// })
login.addEventListener('click',function (event) {
  event.preventDefault()
  user = document.getElementById('user').value
  password = document.getElementById('password').value
  if(user in users && password == users[user].password){
    if(user == admin){
      ipc.send('admin-view',user.username)
    }else{

        ipc.send('sales-view',user.username)
    }
  }
    // console.log(user);
  })

})

$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});
