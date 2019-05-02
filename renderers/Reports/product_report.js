// Initialize Firebase
require('../../firebase/firebase.js')
const remote = require('electron').remote;

var db = firebase.firestore();
const ipcRenderer = require('electron').ipcRenderer;

var table = $('#dataTable').DataTable();
var totalProducts = 0
var totalValue = 0
var dataTableData = [['Nombre', 'Cantidad','Precio Unidad','Valor Total']]

db.collection("products").get().then(function(querySnapshot) {

    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        itemQuantity = parseInt(doc.data().quantity) || 0
        itemPrice = parseInt(doc.data().price) || 0
        itemValue = itemPrice*itemQuantity

        var row = doc.data().name
        var item = ['<a id="showProduct" href = "#" onclick="show('+"'"+row+"'"+')" >'+row+'</a>',
                    itemQuantity,
                    itemPrice,
                    itemValue]

        var dataTableItem = [row,
                    itemQuantity,
                    itemPrice,
                    itemValue]


        totalProducts += itemQuantity
        totalValue += itemValue


        dataTableData.push(dataTableItem)
        table.row.add(item);
    });
    document.getElementById('totalQuantity').innerHTML = formatNumber(totalProducts);
    document.getElementById('totalRevenue').innerHTML = formatNumber(totalValue);
    dataTableData.push(['TOTAL PRODUCTO:',totalProducts,'TOTAL VALOR RD$:',totalValue,'Fecha descarga:',new Date()])

    table.draw()

});

exports.dataTableData = dataTableData;
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
