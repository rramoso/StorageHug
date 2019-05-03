// Initialize Firebase
require('../firebase/firebase.js')
const remote = require('electron').remote;

const {ipcRenderer} = require('electron');


var db = firebase.firestore();

var table = $('#dataTable').DataTable();
const months = {1:"Enero",2:"Febrero",3:"Marzo",4:"Abril",5:"Mayo",6:"Junio",7:"Julio",8:"Agosto",9:"Septiembre",10:"Octubre",11:"Noviembre",12:"Diciembre"}


db.collection('sales').orderBy('Date').get().then(function(querySnapshot) {
  var dates = {}
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        var key = doc.data().Date

        var dateKey = months[key.split('-')[1]]+"-"+key.split('-')[2]
        if(dateKey in dates){
          dates[dateKey].push(doc.id)
        }else {
          dates[dateKey] = [doc.id]
        }


    });
    for(var i = 0; i< Object.keys(dates).length; i++){

      var row = [
                Object.keys(dates)[i],
                '<button id="addProduct" onclick="conio('+"'"+Object.keys(dates)[i]+"'"+')" class="btn btn-info" type="button" name="button"><b>Ver Reporte</b></button>'
              ]

      table.row.add(row);
    }
    // viewSale()
    table.draw()
    // for(var i = 0; i < document.getElementById('dataTable').children[2].children.length; i++){
    //   console.log(document.getElementById('dataTable').children[2].children[i])
    // }
});
