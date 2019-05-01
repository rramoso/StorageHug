// Initialize Firebase
require('../../firebase/firebase.js')
const remote = require('electron').remote;
const excel = require('node-excel-export');

var db = firebase.firestore();
const ipcRenderer = require('electron').ipcRenderer;

var table = $('#dataTable').DataTable();
var totalProducts = 0
var totalValue = 0

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

        totalProducts += itemQuantity
        totalValue += itemValue

        table.row.add(item);
    });
    document.getElementById('totalQuantity').innerHTML = formatNumber(totalProducts);
    document.getElementById('totalRevenue').innerHTML = formatNumber(totalValue);

    console.log('totalProducts: '+totalProducts);
    console.log('totalValue: '+totalValue);
    table.draw()

});
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// You can define styles as json object
const styles = {
  headerDark: {
    fill: {
      fgColor: {
        rgb: 'FF000000'
      }
    },
    font: {
      color: {
        rgb: 'FFFFFFFF'
      },
      sz: 14,
      bold: true,
      underline: true
    }
  },
  cellPink: {
    fill: {
      fgColor: {
        rgb: 'FFFFCCFF'
      }
    }
  },
  cellGreen: {
    fill: {
      fgColor: {
        rgb: 'FF00FF00'
      }
    }
  }
};

//Array of objects representing heading rows (very top)
const heading = [
  [{value: 'a1', style: styles.headerDark}, {value: 'b1', style: styles.headerDark}, {value: 'c1', style: styles.headerDark}],
  ['a2', 'b2', 'c2'] // <-- It can be only values
];

//Here you specify the export structure
const specification = {
  customer_name: { // <- the key should match the actual data key
    displayName: 'Customer', // <- Here you specify the column header
    headerStyle: styles.headerDark, // <- Header style
    cellStyle: function(value, row) { // <- style renderer function
      // if the status is 1 then color in green else color in red
      // Notice how we use another cell value to style the current one
      return (row.status_id == 1) ? styles.cellGreen : {fill: {fgColor: {rgb: 'FFFF0000'}}}; // <- Inline cell style is possible
    },
    width: 120 // <- width in pixels
  },
  status_id: {
    displayName: 'Status',
    headerStyle: styles.headerDark,
    cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
      return (value == 1) ? 'Active' : 'Inactive';
    },
    width: '10' // <- width in chars (when the number is passed as string)
  },
  note: {
    displayName: 'Description',
    headerStyle: styles.headerDark,
    cellStyle: styles.cellPink, // <- Cell style
    width: 220 // <- width in pixels
  }
}

// The data set should have the following shape (Array of Objects)
// The order of the keys is irrelevant, it is also irrelevant if the
// dataset contains more fields as the report is build based on the
// specification provided above. But you should have all the fields
// that are listed in the report specification
const dataset = [
  {customer_name: 'IBM', status_id: 1, note: 'some note', misc: 'not shown'},
  {customer_name: 'HP', status_id: 0, note: 'some note'},
  {customer_name: 'MS', status_id: 0, note: 'some note', misc: 'not shown'}
]

// Define an array of merges. 1-1 = A:1
// The merges are independent of the data.
// A merge will overwrite all data _not_ in the top-left cell.
const merges = [
  { start: { row: 1, column: 1 }, end: { row: 1, column: 10 } },
  { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
  { start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
]

// Create the excel report.
// This function will return Buffer
const report = excel.buildExport(
  [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
    {
      name: 'Report', // <- Specify sheet name (optional)
      heading: heading, // <- Raw heading array (optional)
      merges: merges, // <- Merge cell ranges
      specification: specification, // <- Report specification
      data: dataset // <-- Report data
    }
  ]
);

ipcRenderer.on("download complete", (event, file) => {
    console.log(file); // Full file path
});
dwnExcell = document.getElementById('dwnExcell');

dwnExcell.addEventListener('click', ()=>{
  ipcRenderer.send("download", report);
  res.send(report);
})
