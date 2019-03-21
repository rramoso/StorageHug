// Initialize Firebase
require('../firebase/firebase.js')
const remote = require('electron').remote;

var db = firebase.firestore();
var products = []
var productsToUpdate = []
db.collection("products").where('quantity','>',0).get().then(function(querySnapshot) {

    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        if(doc.exists){products.push(doc.data().name);}
    });

});

addProductBtn.addEventListener('click',()=>{
  var today = new Date();
  var productsToInclude = []

  var numOfProducts = productLine.children.length;

  for(var i =0; i<numOfProducts; i++){
    var prodName = 'productName'
    var prodQuantity = 'productQuantity'

      prodName += i
      prodQuantity += i

    productsToInclude.push({
      'productName' : document.getElementById(prodName).value,
      'productQuantity' : document.getElementById(prodQuantity).value
    })
  }
  var product = {'name':document.getElementById('productName').value,
                 'type':document.getElementById('productType').value,
                 'quantity':parseInt(document.getElementById('productQuantity').value),
                 'cost':document.getElementById('productCost').value,
                 'price':document.getElementById('productPrice').value,
                 'description':document.getElementById('productDescription').value,
                 'date':document.getElementById('productDate').value,
                 'toSale': document.getElementById('productPurpose').checked,
                 'includedProducts': productsToInclude,
                 'createdDate': today
                }

  var toInclude = []
  if(productsToInclude.length > 0){
    for (var i = 0; i < productsToInclude.length; i++) {
      console.log(productsToInclude[i].productName);
      confirmProducts(productsToInclude[i].productName,productsToInclude[i].productQuantity,productsToInclude,toInclude,product)
    }
  }else {
    db.collection('products').doc(product.name).set(product)
    .then(function(docRef) {
        alert('Product Creado');
        var window = remote.getCurrentWindow();
        window.close();
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
  }

})



  function confirmProducts(productName,productQuantity,productsToInclude,toInclude,product){
    var productsNotEnough = []

    db.collection('products').doc(productName).get()
      .then(function(querySnapshot) {


        if(productQuantity > querySnapshot.data().quantity){
          productsNotEnough.push(productName)
        }else{
          toInclude.push(productName)
        }
      }).then(function() {
          if(toInclude.length == productsToInclude.length){
            console.log('Se pueden guardar');
            db.collection('products').doc(product.name).set(product)
            .then(function(docRef) {
                alert('Product Creado');
                var window = remote.getCurrentWindow();
                window.close();
              })
              .catch(function(error) {
                  console.error("Error adding document: ", error);
              });
            for (var i = 0; i < productsToInclude.length; i++) {
              var toSub = parseInt(productsToInclude[i].productQuantity);
              var p = db.collection('products').doc(productsToInclude[i].productName);
              subtractQuantity(p,toSub,productsToInclude)
            }

          }else if(productsNotEnough.length > 0){
            alert("Los siguientes productos no tienen suficiente: "+productsNotEnough)
          }
      })
  }
  function subtractQuantity(p,saleProdQuantity,products){

    p.get().then(function(querySnapshot) {

        var actualQuantity = querySnapshot.data().quantity;

        var newQ = actualQuantity - saleProdQuantity;
        p.update({'quantity':newQ})
        productsToUpdate.push(querySnapshot.data().name)

        if(productsToUpdate.length == products.length){
          productsToUpdate = []
        }
    })
  }

includeProduct.addEventListener('click',() =>{
  productLine.appendChild(newProductLine());
  var productLineIndex = document.getElementById('productLine').children.length - 1
  autocomplete(document.getElementById("productName"+productLineIndex), products);

})
something.addEventListener('click',() => {
  storage = [
   {
      "name": "BASE MAD FORMA CANASTA BLA GR",
      "quantity": 1,
      "price": 245,
      "description": 245
   },
   {
      "name": "BAUL MEDIANO.. MARISOL"
   },
   {
      "name": "CUBITOS D METAL MEDIANO",
      "quantity": 7,
      "price": 125,
      "description": 875
   },
   {
      "name": "CUBITOS D METAL PQ�",
      "quantity": 2,
      "price": 115,
      "description": 230
   },
   {
      "name": "CAJAS PARA BASE  ESCARCHA DOR,PL",
      "quantity": 3,
      "price": 115,
      "description": 345
   },
   {
      "name": "CALENDABRO METAL,CON UECO",
      "quantity": 12,
      "price": 185,
      "description": 2220
   },
   {
      "name": "CALENDABRO METAL,FORM CORON BL",
      "quantity": 8,
      "price": 125,
      "description": 1000
   },
   {
      "name": "JUEGO DE TAZA PQ� ANTIGUO",
      "quantity": 1,
      "price": 650,
      "description": 650
   },
   {
      "name": "MOCHILA PQ�",
      "quantity": 9,
      "price": 365,
      "description": 3285
   },
   {
      "name": "PQT.COLLARES HORA LOCA",
      "quantity": 39,
      "price": 115,
      "description": 4485
   },
   {
      "name": "MASETA ",
      "quantity": 4,
      "price": 285,
      "description": 1140
   },
   {
      "name": "SUBENILES CANASTICA BLANCAS",
      "quantity": 18,
      "price": 115,
      "description": 2070
   },
   {
      "name": "PQT.D PETALOS D OLOR, MARISOL",
      "quantity": 2
   },
   {
      "name": "CAJAS DE REGALOS BRILOS",
      "quantity": 6
   },
   {
      "name": "LENTES GRANDES HORA LOCA"
   },
   {
      "name": "LENTES MEDIANO HORAS LOCA"
   },
   {
      "name": "LENTE PQ�. HORA LOCA"
   },
   {
      "name": "FUNDA D REGALOS SHOPPING",
      "quantity": 10,
      "price": 65,
      "description": 650
   },
   {
      "name": "FUNDA D REGALOS SHOPPING AZUL",
      "quantity": 12,
      "price": 65,
      "description": 780
   },
   {
      "name": "FUNDA D REGALO SHOPPING VINO",
      "quantity": 11,
      "price": 35,
      "description": 385
   },
   {
      "name": "SHOPPING MEDIANO ROJO",
      "quantity": 9,
      "price": 40,
      "description": 360
   },
   {
      "name": "SHOPPING MEDIANO AZUL",
      "quantity": 11,
      "price": 40,
      "description": 440
   },
   {
      "name": "SHOPPING MEDIANO BLANCO",
      "quantity": 10,
      "price": 40,
      "description": 400
   },
   {
      "name": "SHOPPING GRANDE CARTON",
      "quantity": 12,
      "price": 150,
      "description": 600
   },
   {
      "name": "SHOPPING MEDIANO DORADO NEGRO",
      "quantity": 1,
      "price": 45,
      "description": 45
   },
   {
      "name": "SHOPPING MEDIANO HOMBRE",
      "quantity": 2,
      "price": 50,
      "description": 100
   },
   {
      "name": "SHOPPING GRANDE CARTON",
      "quantity": 2,
      "price": 60,
      "description": 120
   },
   {
      "name": "SHOPPING LOVE",
      "quantity": 5,
      "price": 75,
      "description": 375
   },
   {
      "name": "SHOPPING EXTRA GRANDE LOVE",
      "quantity": 12,
      "price": 195,
      "description": 2340
   },
   {
      "name": "SHOPPING MEDIANO CUADRO",
      "quantity": 2,
      "price": 45,
      "description": 90
   },
   {
      "name": "SHOPPING VARIADOS",
      "quantity": 5,
      "price": 45,
      "description": 225
   },
   {
      "name": "SHOPPING GRANDE SAN VALENTIN",
      "quantity": 2,
      "price": 60,
      "description": 120
   },
   {
      "name": "SHOPPING MEDIANO CIRCULO",
      "quantity": 1,
      "price": 60,
      "description": 60
   },
   {
      "name": "SHOPPING PEQUE�O ",
      "quantity": 3,
      "price": 25,
      "description": 75
   },
   {
      "name": "SHOPPING GRANDE MORAD",
      "quantity": 12,
      "price": 55,
      "description": 660
   },
   {
      "name": "SHOPPING GRANDE PLAYA",
      "quantity": 12,
      "price": 55,
      "description": 660
   },
   {
      "name": "SHOPPINH MEDIANO MORADI",
      "quantity": 12,
      "price": 35,
      "description": 420
   },
   {
      "name": "GLOBOS LETRA BOY",
      "quantity": 3,
      "price": 360,
      "description": 1080
   },
   {
      "name": "GLOBOS  OSO",
      "quantity": 2,
      "price": 550,
      "description": 1100
   },
   {
      "name": "GLOBOS ROPA D BB",
      "quantity": 2,
      "price": 550,
      "description": 1100
   },
   {
      "name": "GLOBOS NI�OS NI�AS",
      "quantity": 2,
      "price": 800,
      "description": 1600
   },
   {
      "name": "GLOBOS  WELCOM BOY",
      "quantity": 2,
      "price": 150,
      "description": 300
   },
   {
      "name": "GLOBOS HAPPY BOY",
      "quantity": 1,
      "price": 150,
      "description": 150
   },
   {
      "name": "GLOBOS  HOLA BEBITO",
      "quantity": 2,
      "price": 150,
      "description": 300
   },
   {
      "name": "GLOBO STAR IS BORN",
      "quantity": 2,
      "price": 150,
      "description": 300
   },
   {
      "name": "GLOBO BEY BOY",
      "quantity": 1,
      "price": 150,
      "description": 150
   },
   {
      "name": "GLOBO IS TS A BORGIR",
      "quantity": 2,
      "price": 150,
      "description": 300
   },
   {
      "name": "GLOBOS BOY GIR BOY",
      "quantity": 2,
      "price": 150,
      "description": 300
   },
   {
      "name": "GLOBOS LOVE",
      "quantity": 3,
      "price": 260,
      "description": 780
   },
   {
      "name": "GLOBOS  PI�A.no 17",
      "quantity": 6,
      "price": 160,
      "description": 960
   },
   {
      "name": "GLOBOS  GRADUACION",
      "quantity": 3,
      "price": 530,
      "description": 1590
   },
   {
      "name": "GLOBOS  ANILLO NO.37",
      "quantity": 2,
      "price": 520,
      "description": 1040
   },
   {
      "name": "GLOBOS NO.40 HBD TO YOU",
      "quantity": 1,
      "price": 530,
      "description": 530
   },
   {
      "name": "GLOBOS HAPPY CAKE",
      "quantity": 1,
      "price": 460,
      "description": 460
   },
   {
      "name": "GLOBOS  SWEET BABY GIRL",
      "quantity": 1,
      "price": 150,
      "description": 150
   },
   {
      "name": "GLOBOS  HAPPY ANIVERSARIO",
      "quantity": 2,
      "price": 150,
      "description": 300
   },
   {
      "name": "GLOBOS PIZZA NO.34",
      "quantity": 1,
      "price": 530,
      "description": 530
   },
   {
      "name": "GLOBOS HAPPY BETHDAY CATUS",
      "quantity": 1,
      "price": 150,
      "description": 150
   },
   {
      "name": "GLOBOS  HAVE A MAGICAL",
      "quantity": 2,
      "price": 150,
      "description": 300
   },
   {
      "name": "GLOBOS  HAPPY PI�A",
      "quantity": 2,
      "price": 150,
      "description": 300
   },
   {
      "name": "GLOBOS  BIRTHADAY GIL",
      "quantity": 2,
      "price": 150,
      "description": 300
   },
   {
      "name": "GLOBOS BIRTHADAY PRINCES",
      "quantity": 1,
      "price": 150,
      "description": 150
   },
   {
      "name": " GLOBOS HAPPY BIRTHADAY AVION",
      "quantity": 1,
      "price": 150,
      "description": 150
   },
   {
      "name": "BLOBOS  BIRTHADAY ZIRENA",
      "quantity": 1,
      "price": 150,
      "description": 150
   },
   {
      "name": "BLOBOS BIRTHADAY CUADRADO",
      "quantity": 1,
      "price": 150,
      "description": 150
   },
   {
      "name": "GLOBOS HAPPY",
      "quantity": 1,
      "price": 150,
      "description": 150
   },
   {
      "name": "GLOBOS BIRTHADAY DUBBLE",
      "quantity": 1
   },
   {
      "name": "GLOBOS  DUBLE TRANSPARENTE",
      "quantity": 1,
      "price": 320,
      "description": 320
   },
   {
      "name": "97GLOBOS METALICO VARIADOS",
      "quantity": 97,
      "price": 100,
      "description": 9700
   },
   {
      "name": "ABANCO FORMA DE BLOBOS PAPE DEC",
      "quantity": 4,
      "price": 380,
      "description": 1520
   },
   {
      "name": "LETRAS MADERA BLANCA D",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "�LETRAS MADERA BLANCA E",
      "quantity": 1,
      "price": 65,
      "description": 65
   },
   {
      "name": "LETRAS MADERA BLANCA F",
      "quantity": 1,
      "price": 65,
      "description": 65
   },
   {
      "name": "LETRAS MADERA BLANCA I",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA BLANCA K",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA BLANCA L",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA BLANCA P",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA BLANCA R",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA BLANCA S",
      "quantity": 2,
      "price": 65,
      "description": 520
   },
   {
      "name": "LETRAS MADERA BLANCA Y",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA BLANCA Z",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "NUMEROS 5",
      "quantity": 1,
      "price": 65,
      "description": 65
   },
   {
      "name": "NUMEROS 1",
      "quantity": 2,
      "price": 65,
      "description": 130
   },
   {
      "name": "LETRAS MADERA BLANCAS B",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRA  MADERA MARRON C",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON D",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON F",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LERAS MADERA MARRON G",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON I",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON H",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON J",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON K",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON O",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON P",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON Q     ",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON T",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA M,ARRON U",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON V",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON W",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON X",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON Y",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON Y",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON Y",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON Y",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON Y",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON Y",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON Y",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON Y",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON Y",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON Y",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "LETRAS MADERA MARRON Y",
      "quantity": 3,
      "price": 65,
      "description": 195
   },
   {
      "name": "PULSA ROSARIO D MANO",
      "quantity": 5,
      "price": 120,
      "description": 600
   },
   {
      "name": "ROSARIO PARA VEHICULO",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "LLAVERO TAMBORA",
      "quantity": 4,
      "price": 50,
      "description": 200
   },
   {
      "name": "CAJITA LARGA REGALO",
      "quantity": 15,
      "price": 60,
      "description": 900
   },
   {
      "name": "CAJITA PQN.  D REGALO CUADRADA",
      "price": 40
   },
   {
      "name": "COLGANTE D  VEHICULO",
      "quantity": 2,
      "price": 140,
      "description": 280
   },
   {
      "name": "FULSA PANDERO",
      "quantity": 1,
      "price": 500,
      "description": 500
   },
   {
      "name": "COLLAR ZIPPER",
      "quantity": 1,
      "price": 480,
      "description": 480
   },
   {
      "name": "ASCESORIO FORMA DE CORAZON",
      "quantity": 1,
      "price": 600,
      "description": 600
   },
   {
      "name": "CADENA TORRE EIFFER",
      "quantity": 1,
      "price": 700,
      "description": 700
   },
   {
      "name": "FULSA HOMBRE",
      "quantity": 4,
      "price": 400,
      "description": 1600
   },
   {
      "name": "CADENA FORMA D +,MUJER,PLATEADA",
      "quantity": 2,
      "price": 350,
      "description": 700
   },
   {
      "name": "CADENA FORMA +,MUJER DORADA",
      "quantity": 2,
      "price": 400,
      "description": 800
   },
   {
      "name": "CADENA ROSARIO D.COLORES",
      "quantity": 1,
      "price": 300,
      "description": 300
   },
   {
      "name": "JUEGO CADENA,PULSA,DE YAVE",
      "quantity": 1,
      "price": 750,
      "description": 750
   },
   {
      "name": "PULSA  AJUSTABLE",
      "quantity": 1,
      "price": 350,
      "description": 350
   },
   {
      "name": "CADENA ROSARIO DE ACERO",
      "quantity": 3,
      "price": 350,
      "description": 1050
   },
   {
      "name": "DESTAPADORES",
      "quantity": 4,
      "price": 100,
      "description": 400
   },
   {
      "name": "LLAVERO GIRADORIO",
      "quantity": 1,
      "price": 160,
      "description": 160
   },
   {
      "name": "LLAVERO OBALADO",
      "quantity": 1,
      "price": 160,
      "description": 160
   },
   {
      "name": "PQT.D FUNDA PAPEL TRITUTADO",
      "quantity": 15,
      "price": 35,
      "description": 525
   },
   {
      "name": "PULSA D PIELCON IM�GENES RELIGIO",
      "quantity": 12,
      "price": 125,
      "description": 1500
   },
   {
      "name": "CADENA VARIADA EN CAJITA",
      "quantity": 5,
      "price": 390,
      "description": 1950
   },
   {
      "name": "PERFUME",
      "quantity": 4,
      "price": 150,
      "description": 600
   },
   {
      "name": "PQT.PLATO HAPPY BIRTHADAY MARIS",
      "quantity": 7,
      "price": 150,
      "description": 1050
   },
   {
      "name": "PQT.SERVILLETAS HAPPY MARISOL",
      "quantity": 5,
      "price": 150,
      "description": 750
   },
   {
      "name": "ADORNO MADERA CASITA",
      "quantity": 1,
      "price": 75,
      "description": 75
   },
   {
      "name": "ADORNO MADERA MARIOISA",
      "quantity": 1,
      "price": 75,
      "description": 75
   },
   {
      "name": "ADORNO MADERA MARIQUITA",
      "quantity": 2,
      "price": 75,
      "description": 150
   },
   {
      "name": "ADORNO MADERA PEROOS",
      "quantity": 2,
      "price": 75,
      "description": 150
   },
   {
      "name": "ADORNO MADERA CARACOL",
      "quantity": 1,
      "price": 75,
      "description": 75
   },
   {
      "name": "ADORNO MADERA GUANTE",
      "quantity": 1,
      "price": 75,
      "description": 75
   },
   {
      "name": "ADORNO MADERA COTORA",
      "quantity": 1,
      "price": 75,
      "description": 75
   },
   {
      "name": "ADRNO MADERA FLORES",
      "quantity": 2,
      "price": 75,
      "description": 150
   },
   {
      "name": "ADORNO MADERA CARRO",
      "quantity": 2,
      "price": 75,
      "description": 150
   },
   {
      "name": "ADORNO MADERA PIZARRA",
      "quantity": 1,
      "price": 75,
      "description": 75
   },
   {
      "name": "ADORNO MADERA TIMON D BARCO",
      "quantity": 1,
      "price": 75,
      "description": 150
   },
   {
      "name": "ADORNO MADERA DONA",
      "quantity": 1,
      "price": 75,
      "description": 75
   },
   {
      "name": "ADORNO MADERA CONO",
      "quantity": 1,
      "price": 105,
      "description": 105
   },
   {
      "name": "VEHIGA TRANSPARENTE DESE�O N.12",
      "quantity": 36,
      "price": 30,
      "description": 1080
   },
   {
      "name": "VEHIGA TRANSPARENTE ESTAM. N.12",
      "quantity": 102,
      "price": 30,
      "description": 3060
   },
   {
      "name": "VEHIGA AGATTA NO.12",
      "quantity": 4,
      "price": 40,
      "description": 160
   },
   {
      "name": "VEHIGA CHOME NO.12",
      "quantity": 44,
      "price": 35,
      "description": 1540
   },
   {
      "name": "VEHIGA FLUTA",
      "quantity": 407,
      "price": 5,
      "description": 2035
   },
   {
      "name": "VEHIGA  PQ�A. NO.5",
      "quantity": "1,363",
      "price": 5,
      "description": 6815
   },
   {
      "name": "VEHIGA  NEGRA NO.9",
      "quantity": 90,
      "price": 10,
      "description": 900
   },
   {
      "name": "VEHIGA  LISA NO.12",
      "quantity": 225,
      "price": 15,
      "description": 3375
   },
   {
      "name": "VEHIGA  LISAS NO.9",
      "quantity": 81,
      "price": 5,
      "description": 405
   },
   {
      "name": "GLOBO   NUMERO CERO PLATEADO",
      "quantity": 3,
      "price": 300,
      "description": 900
   },
   {
      "name": "BLOBO  NO.4,PLATEADO",
      "quantity": 1,
      "price": 300,
      "description": 300
   },
   {
      "name": "GLOBO NO. 5 PLATEADO",
      "quantity": 3,
      "price": 300,
      "description": 900
   },
   {
      "name": "GLOBO NO. 7 PLATEADO",
      "quantity": 1,
      "price": 300,
      "description": 300
   },
   {
      "name": "GLOBO  NO.8,PLATEADO",
      "quantity": 1,
      "price": 300,
      "description": 300
   },
   {
      "name": "GLOBO  NO.9,PLATEADO",
      "quantity": 1,
      "price": 300,
      "description": 300
   },
   {
      "name": "GLOBO  NO. 2 ORO ROSA",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO  NO. 3 OTRO ROSA",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO  NO. 4, ORO ROSA",
      "quantity": 3,
      "price": 300,
      "description": 900
   },
   {
      "name": "GLOBO  NO.5, ORO ROSA",
      "quantity": 3,
      "price": 300,
      "description": 900
   },
   {
      "name": "GLOBO NO. 6, ORO ROSA",
      "quantity": 3,
      "price": 300,
      "description": 900
   },
   {
      "name": "GLOBO NO. 7 ORO ROSA",
      "quantity": 3,
      "price": 300,
      "description": 900
   },
   {
      "name": "GLOBO NO.9 ORO ROSA",
      "quantity": 3,
      "price": 300,
      "description": 900
   },
   {
      "name": "GLOBO NO. 0  FUSIA",
      "quantity": 3,
      "price": 300,
      "description": 900
   },
   {
      "name": "GLOBO NO. 1,FUSIA",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO NO.2,FISIA",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO NO. 4,FISIA",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO NO.5,FUSIA",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO NO.6 FUSIA",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO NO.7 FUSIA",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO NO.8 FUSIA",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO NO.9 FUSIA",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO 0 NEGRO",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO 1, NEGRO",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO 2,NEGRO",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO NO.4, NEGRO",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO NO. 5,NEGRO",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO NO.6,NEGRO",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO NO.7,NEGRO",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO NO. 8, NEGRO",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "GLOBO NO. 9, NEGRO",
      "quantity": 2,
      "price": 300,
      "description": 600
   },
   {
      "name": "PQT.VEJIGA NO.12..MARISOL",
      "quantity": 5,
      "price": 175,
      "description": 875
   },
   {
      "name": "VEJIGA BALLON GRAND MARISOL",
      "quantity": 12,
      "price": 300,
      "description": 3600
   },
   {
      "name": "VEJIGA BALLON PQхMARISOL",
      "quantity": 4,
      "price": 250,
      "description": 1000
   },
   {
      "name": "PESITAS PARA GLOBO",
      "quantity": 22,
      "price": 65,
      "description": 1430
   },
   {
      "name": "GLOBO HAPPY PARTY",
      "quantity": 3,
      "price": 150,
      "description": 450
   },
   {
      "name": "ABANICOS COLOR CARTON",
      "quantity": 11,
      "price": 80,
      "description": 880
   },
   {
      "name": "MO�OS ESCARCHAS AZUL GRANDE",
      "quantity": 30,
      "price": 50,
      "description": 1500
   },
   {
      "name": "MO�OS ESCARCHAS DORADO GRAN",
      "quantity": 29,
      "price": 50,
      "description": 1450
   },
   {
      "name": "MO�OS ESCARCHA PLATEADO GRAN",
      "quantity": 29,
      "price": 50,
      "description": 1450
   },
   {
      "name": "MO�OS ESCARCHA FUSIA GRANDE",
      "quantity": 29,
      "price": 50,
      "description": 1450
   },
   {
      "name": "MO�OS ESCARCHA AZUL PQ�",
      "quantity": 48,
      "price": 30,
      "description": 1440
   },
   {
      "name": "MO�OS ESCARCHA DORADO PQ�",
      "quantity": 24,
      "price": 30,
      "description": 720
   },
   {
      "name": "MO�OS  ESCARCHADOSPLATEAD PQ",
      "quantity": 42,
      "price": 30,
      "description": 1260
   },
   {
      "name": "MO�OS  ESCARCHADO FUSIA PQ�",
      "quantity": 36,
      "price": 30,
      "description": 1080
   },
   {
      "name": "SERVILLITAS  VARIOS COLORES",
      "quantity": 300,
      "price": 15,
      "description": 4500
   },
   {
      "name": "SERVILLITAS  VARIOS COLORES..USO",
      "quantity": 4,
      "price": 15
   },
   {
      "name": "CAJAS DECORATIBA HEXAGONAL MO",
      "quantity": 1,
      "price": 155,
      "description": 155
   },
   {
      "name": "CAJAS DECOR HEXAGON.PQ�.FLAMEN",
      "quantity": 1,
      "price": 280,
      "description": 280
   },
   {
      "name": "CAJAS DECOR HEXAG.RAMAS GRAND",
      "quantity": 1,
      "price": 360,
      "description": 360
   },
   {
      "name": "CAJAS DECOR HEXAG.FLAMENTOS PQ",
      "quantity": 1,
      "price": 160,
      "description": 160
   },
   {
      "name": "CAJAS DECOR HEXAG.RAMAS PQ�",
      "quantity": 1,
      "price": 160,
      "description": 160
   },
   {
      "name": "CAJA DECOR BLANC",
      "quantity": 1,
      "price": 480,
      "description": 480
   },
   {
      "name": "CAJA DECOR REDONDA MOSAICO GR",
      "quantity": 1,
      "price": 460,
      "description": 460
   },
   {
      "name": "CAJA DECOR REDONDA MOSAICO ME",
      "quantity": 1,
      "price": 395,
      "description": 395
   },
   {
      "name": "CENTRO DE MESA CORAZONES",
      "quantity": 6,
      "price": 160,
      "description": 960
   },
   {
      "name": "LAPICERO SAN VALENTIN",
      "quantity": 11,
      "price": 45,
      "description": 495
   },
   {
      "name": "CORAZON ESCARCHADOS GRANDE",
      "quantity": 5,
      "price": 75,
      "description": 375
   },
   {
      "name": "CORAZON ESCACHA PQ�",
      "quantity": 2,
      "price": 25,
      "description": 50
   },
   {
      "name": "SERVILLETAS AMARILLA MARISOL",
      "quantity": 79,
      "price": 10,
      "description": 790
   },
   {
      "name": "ROLLOS CINTA CRESPED MARISOL",
      "quantity": 2,
      "price": 50,
      "description": 100
   },
   {
      "name": "TENEDORE C U",
      "quantity": 11,
      "price": 5,
      "description": 55
   },
   {
      "name": "CUCGILLO C U",
      "quantity": 11,
      "price": 5,
      "description": 55
   },
   {
      "name": "TENEDORES PICADERA",
      "quantity": 24,
      "price": 3,
      "description": 72
   },
   {
      "name": "PORTASERVILLETAS",
      "quantity": 12,
      "price": 15,
      "description": 180
   },
   {
      "name": "CUCHARAS",
      "quantity": 8,
      "price": 5,
      "description": 40
   },
   {
      "name": "TENEDORES PLATEADO NEGRO",
      "quantity": 24,
      "price": 10,
      "description": 240
   },
   {
      "name": "TAZA PEERSONALIZADA MAGICA",
      "quantity": 2,
      "price": 450,
      "description": 900
   },
   {
      "name": "TAZA PERSONALIZADA DORADA",
      "quantity": 2,
      "price": 400,
      "description": 800
   },
   {
      "name": "TAZA PERSONALIZADA PLATEADA",
      "quantity": 2,
      "price": 400,
      "description": 800
   },
   {
      "name": "TAZA PERSONALIZADA  CUCHARITA",
      "quantity": 3,
      "price": 400,
      "description": 1200
   },
   {
      "name": "TAZA PERSON NORMAL ,COLO FUE D",
      "quantity": 3,
      "price": 400,
      "description": 1200
   },
   {
      "name": "TAZA PERSONA CON BORDE Y AZA",
      "quantity": 10,
      "price": 375,
      "description": 3750
   },
   {
      "name": "CAJA EN BLANCO PQ�",
      "quantity": 2,
      "price": 40,
      "description": 80
   },
   {
      "name": "CAJA EN CUADRADO",
      "quantity": 6,
      "price": 40,
      "description": 240
   },
   {
      "name": "CAJA LARGA",
      "quantity": 5,
      "price": 40,
      "description": 200
   },
   {
      "name": "CAJA RECTANGULO",
      "quantity": 2,
      "price": 40,
      "description": 80
   },
   {
      "name": "CAJA GRANDE ",
      "quantity": 3,
      "price": 75,
      "description": 225
   },
   {
      "name": "CAJA DECORADA ",
      "quantity": 3,
      "price": 180,
      "description": 540
   },
   {
      "name": "CAJA DECORADO ONDA",
      "quantity": 2,
      "price": 140,
      "description": 280
   },
   {
      "name": "ANTIFASES PQ�",
      "quantity": 4,
      "price": 125,
      "description": 500
   },
   {
      "name": "LENTES GRANDES HORA LOCA",
      "quantity": 3,
      "price": 85,
      "description": 255
   },
   {
      "name": "ANTIFAS ALTO",
      "quantity": 3,
      "price": 145,
      "description": 435
   },
   {
      "name": "LENTE MARIPOSA",
      "quantity": 1,
      "price": 105,
      "description": 105
   },
   {
      "name": "PALITO GRANDE D GLOBOS",
      "quantity": 95,
      "price": 15,
      "description": 1425
   },
   {
      "name": "PALITO PQ�.GLOBOS ",
      "quantity": 79,
      "price": 12,
      "description": 948
   },
   {
      "name": "PQT�D BELITAS CUMPLEA�O MARISOL",
      "quantity": 2,
      "price": 50,
      "description": 100
   },
   {
      "name": "CHOCALATE KISS",
      "quantity": 60,
      "price": 5,
      "description": 300
   },
   {
      "name": "CAJA D BOMBONES MARISOL",
      "quantity": 1,
      "price": 150,
      "description": 150
   },
   {
      "name": "GALLETA CUBIERTAS D CHOCOLATE",
      "quantity": 3,
      "price": 50,
      "description": 150
   },
   {
      "name": "BOMBONES SUELTOS",
      "quantity": 12,
      "price": 15,
      "description": 180
   },
   {
      "name": "PALETAS FRESA ",
      "quantity": 12,
      "price": 5,
      "description": 60
   },
   {
      "name": "CHOCOLATE MENTA MARISOL",
      "quantity": 4,
      "price": 5,
      "description": 20
   },
   {
      "name": "cajita con sa roja",
      "quantity": 1,
      "price": 375,
      "description": 375
   },
   {
      "name": "cajita con rojo pq�",
      "quantity": 1,
      "price": 312,
      "description": 312
   },
   {
      "name": "adorno espejo",
      "quantity": 4,
      "price": 425,
      "description": 1700
   },
   {
      "name": "adorno candelabro",
      "quantity": 2,
      "price": 296,
      "description": 592
   },
   {
      "name": "porta retrato dad",
      "quantity": 2,
      "price": 216,
      "description": 432
   },
   {
      "name": "porta retrato baby",
      "quantity": 2,
      "price": 216,
      "description": 432
   },
   {
      "name": "porta retrato madera",
      "quantity": 6,
      "price": 145,
      "description": 870
   },
   {
      "name": "cajita asa cad.carton",
      "quantity": 2,
      "price": 475,
      "description": 950
   },
   {
      "name": "cajita asa cad carton grande",
      "quantity": 3,
      "price": 520,
      "description": 1560
   },
   {
      "name": "cajita asa cad carton median",
      "quantity": 1,
      "price": 475,
      "description": 475
   },
   {
      "name": "cajita CILIDRO",
      "quantity": 4,
      "price": 312,
      "description": 1248
   },
   {
      "name": "CAJITA RED",
      "quantity": 1,
      "price": 360,
      "description": 360
   },
   {
      "name": "ADORNO MABO",
      "quantity": 1,
      "price": 680,
      "description": 680
   },
   {
      "name": "ADORNO ANILLO",
      "quantity": 1,
      "price": 472,
      "description": 472
   },
   {
      "name": "ADORNO TACON",
      "quantity": 1,
      "price": 520,
      "description": 520
   },
   {
      "name": "DESTAPADOR CERVESA",
      "quantity": 4,
      "price": 175,
      "description": 700
   },
   {
      "name": "DESTAPADOR CERVESA PQ�",
      "quantity": 2,
      "price": 155,
      "description": 310
   },
   {
      "name": "LETRERO MDF BEBE",
      "quantity": 2,
      "price": 128,
      "description": 256
   },
   {
      "name": "TABLERO NOTAS MDF",
      "quantity": 2,
      "price": 264,
      "description": 528
   },
   {
      "name": "PORTA LLAVES MADERAS",
      "quantity": 2,
      "price": 275,
      "description": 550
   },
   {
      "name": "COLGADOPR COCINA",
      "quantity": 1,
      "price": 360,
      "description": 360
   },
   {
      "name": "ADORNO COCINA, GRANDE",
      "quantity": 2,
      "price": 632,
      "description": 1264
   },
   {
      "name": "ADORNO BICICKETA, MEDIANO",
      "quantity": 1,
      "price": 472,
      "description": 280
   },
   {
      "name": "ADORNO BICICLETA",
      "quantity": 1,
      "price": 280,
      "description": 472
   },
   {
      "name": "ADORNO BICICLETA",
      "quantity": 1,
      "price": 472,
      "description": 472
   },
   {
      "name": "PORTA RETRATO 4 X 6",
      "quantity": 2,
      "price": 75,
      "description": 150
   },
   {
      "name": "PORTARETRATO FLAMEN",
      "quantity": 2,
      "price": 128,
      "description": 256
   },
   {
      "name": "PORTA RETRATO",
      "quantity": 1,
      "price": 165,
      "description": 165
   },
   {
      "name": "ADORNO CADELABRO",
      "quantity": 2,
      "price": 296,
      "description": 592
   },
   {
      "name": "CUBITO METAL",
      "quantity": 2,
      "price": 145,
      "description": 290
   },
   {
      "name": "TERMO INOX",
      "quantity": 2,
      "price": 840,
      "description": 1680
   },
   {
      "name": "TERMO ACERO",
      "quantity": 2,
      "price": 384,
      "description": 768
   },
   {
      "name": "LATA",
      "quantity": 3,
      "price": 480,
      "description": 1440
   },
   {
      "name": "VASO PI�A",
      "quantity": 2,
      "price": 168,
      "description": 336
   },
   {
      "name": "BURBUJA EN TUBO",
      "quantity": 11,
      "price": 75,
      "description": 825
   },
   {
      "name": "BANDEJA MADERA",
      "quantity": 3,
      "price": 760,
      "description": 2280
   },
   {
      "name": "BANDEJA 1 REC",
      "quantity": 1,
      "price": 792,
      "description": 792
   },
   {
      "name": "BOTELLITA VIDRIO",
      "quantity": 2,
      "price": 175,
      "description": 350
   },
   {
      "name": "JARR4A VIDRIO CATUS",
      "quantity": 3,
      "price": 155,
      "description": 465
   },
   {
      "name": "JARRA VIDRIO ESTAMP",
      "quantity": 2,
      "price": 155,
      "description": 310
   },
   {
      "name": "TARRO PLANTA MADERA",
      "quantity": 3,
      "price": 120,
      "description": 360
   },
   {
      "name": "CERAMICA BUHOS",
      "quantity": 3,
      "price": 125,
      "description": 375
   },
   {
      "name": "BUHOS CANDELABROS",
      "quantity": 1,
      "price": 235,
      "description": 235
   },
   {
      "name": "BUHOS CANDELABROS GRANDE",
      "quantity": 1,
      "price": 792,
      "description": 792
   },
   {
      "name": "SET.MARINERO",
      "quantity": 1,
      "price": 825,
      "description": 825
   },
   {
      "name": "FLOR ARTIFICIA",
      "quantity": 1,
      "price": 95,
      "description": 95
   },
   {
      "name": "FLORES GIRASOLES",
      "quantity": 1,
      "price": 96,
      "description": 96
   },
   {
      "name": "TERMO INOX",
      "quantity": 1,
      "price": 792,
      "description": 792
   }
]
  for (var i = 0; i < storage.length; i++) {
    var product = storage[i]
    var today = new Date();
    product['createdDate'] = today
    // console.log(product);
    db.collection('products').doc(product.name).set(product)
    .then(function(docRef) {
      console.log(product.name);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
  }
})

function newProductLine(){

  var n = document.getElementById('productLine').children.length;
  var item = document.createElement('div')
    item.setAttribute('id','productItem'+n)
    item.setAttribute('class','form-row')

  var div0 = document.createElement('div')
    div0.setAttribute('class','col-md-1')
  var div01 = document.createElement('div')
    div01.setAttribute('class','form-label-group')
    var input0 = document.createElement('input')
      input0.setAttribute('class','btn btn-danger')
      input0.setAttribute('type','button')
      input0.setAttribute('value','x')
      input0.setAttribute('id','deleteBtn')
      input0.setAttribute('onclick','deleteRow(this)')
        div01.appendChild(input0)
        div0.appendChild(div01)
        item.appendChild(div0)


  var div1 = document.createElement('div')
    div1.setAttribute('class','col-md-5')
  var form1 = document.createElement('div')
    form1.setAttribute('class','form-label-group')
  var input1 = document.createElement('input')
    input1.setAttribute('class','form-control')
    input1.setAttribute('id','productName'+n)
  var label1 = document.createElement('label')
    label1.innerHTML = 'Nombre Producto'
    label1.setAttribute('for','Nombre Producto')
      form1.appendChild(input1)
      form1.appendChild(label1)
      div1.appendChild(form1)
      item.appendChild(div1)

  var div2 = document.createElement('div')
    div2.setAttribute('class','col-md-3')
  var form2 = document.createElement('div')
    form2.setAttribute('class','form-label-group')
  var input2 = document.createElement('input')
    input2.setAttribute('class','form-control')
    input2.setAttribute('type','number')
    input2.setAttribute('name','quantity')
    input2.setAttribute('id','productQuantity'+n)
  var label2 = document.createElement('label')
    label2.innerHTML = 'Cantidad'
    label2.setAttribute('for','Cantidad')
      form2.appendChild(input2)
      form2.appendChild(label2)
      div2.appendChild(form2)
      item.appendChild(div2)

  return item;

}
