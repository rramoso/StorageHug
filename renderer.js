// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

  // Initialize Firebase
  require('./firebase/firebase.js')


  var signUpBtn = document.getElementById('signUpBtn');
  var signInBtn = document.getElementById('signInBtn');


signUpBtn.addEventListener('click', function(){
  var passwordField = document.getElementById('password').value;
  var emailField = document.getElementById('email').value;

  firebase.auth().createUserWithEmailAndPassword(emailField,passwordField).then(function(){
    alert('User created!!');

  }).catch(function(error){
    if(error != null){
      console.log('fuck my life')
      console.error(error)
      alert(error['message'])
      return;
    }
  })

});


signInBtn.addEventListener('click', function(){
  var passwordField = document.getElementById('password').value;
  var emailField = document.getElementById('email').value;

  firebase.auth().signInWithEmailAndPassword(emailField,passwordField).then(()=>{
    document.location.href = "../index.html";
  }).catch(function(error){
      if(error != null){
        console.log('fuck my life')
        console.error(error.message)
        alert(error['message'])
        return;
      }
  })

});
