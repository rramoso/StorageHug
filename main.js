//Firebase
// require('firebase')
// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron')
const ipcMain = require('electron').ipcMain
const remote = require('electron').remote;
const {download} = require("electron-dl");
// loadFile('./vendor/bootstrap/js/bootstrap.bundle.min.js')


let mainWindow
var loggedUser = ''
const salesMenuTemplate = [
  {
    label: 'Producto',
    submenu:[
      {
        label: 'Inventario',
        accelerator: process.platform == 'darwin'? 'Command+K':'Ctrl+K',
        click(){
          createProductsWindow();
        }
      },  { type: 'separator' },
      {
        label: 'Cerrar',
        accelerator: process.platform == 'darwin'? 'Command+Q':'Ctrl+Q',
        click(){
          app.quit()
        }
      }
    ]
  },{
      label: 'Ventas',
      submenu:[
      {
        label: 'Agregar Venta',
        accelerator: process.platform == 'darwin'? 'Command+Shift+V':'Ctrl+Shift+V',

        click(){
          createNewSaleWindow();
        }
      },
        {
          label: 'Todas las Ventas',
          accelerator: process.platform == 'darwin'? 'Command+Shift+S':'Ctrl+Shift+S',
          click(){
            createAllSaleWindow();
          }
        }
      ]
  }
]
const mainMenuTemplate = [

  {
    label: 'Producto',
    submenu:[
      {
        label: 'Nuevo Producto',
        accelerator: process.platform == 'darwin'? 'Command+P':'Ctrl+P',
        click(){
          createNewProductWindow();
        }
      },
      {
        label: 'Compra Producto',
        accelerator: process.platform == 'darwin'? 'Command+P':'Ctrl+P',
        click(){
          createPurchaseProductWindow();
        }
      },
      {
        label: 'Productos',
        accelerator: process.platform == 'darwin'? 'Command+K':'Ctrl+K',
        click(){
          createProductsWindow();
        }
      },  { type: 'separator' },
      {
        label: 'Cerrar',
        accelerator: process.platform == 'darwin'? 'Command+Q':'Ctrl+Q',
        click(){
          app.quit()
        }
      }
    ]
  },
  {
    label: 'Cliente',
    submenu:[
      {
        label: 'Agregar Cliente',
        accelerator: process.platform == 'darwin'? 'Command+Shift+C':'Ctrl+Shift+C',

        click(){
          createNewClientWindow();
        }
      },
      {
        label: 'Clientes',
        click(){
          createClientWindow();
        }
      }]
  },
  {
      label: 'Ventas',
      submenu:[
      {
        label: 'Agregar Venta',
        accelerator: process.platform == 'darwin'? 'Command+Shift+V':'Ctrl+Shift+V',

        click(){
          createNewSaleWindow();
        }
      },
        {
          label: 'Todas las Ventas',
          accelerator: process.platform == 'darwin'? 'Command+Shift+S':'Ctrl+Shift+S',
          click(){
            createAllSaleWindow();
          }
        }
      ]
  },
  {
      label: 'Reportes',
      submenu:[
        {
          label: 'Reportes diario',
          accelerator: process.platform == 'darwin'? 'Command+Shift+R':'Ctrl+Shift+R',
          click(){
            createAllReportsWindow();
          }
        },
          {
            label: 'Reportes mensual',
            accelerator: process.platform == 'darwin'? 'Command+Shift+R':'Ctrl+Shift+R',
            click(){
              createMonthlyReportsWindow();
            }
          },
          {
            label: 'Reporte de Productos',
            accelerator: process.platform == 'darwin'? 'Command+Shift+R':'Ctrl+Shift+R',
            click(){
              createProductReportWindow();
            }
          }
      ]
  },
  {
    label: 'Edit',
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]
  },
  {
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle Devtools',
        accelerator: process.platform == 'darwin'? 'Command+I':'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  }

]
const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
const salesMenu = Menu.buildFromTemplate(salesMenuTemplate);

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadFile('./templates/login.html')
  // mainWindow.loadFile('./vendor/jquery/jquery.min.js')
  mainWindow.on('close', function () {
    app.quit();

  });
  ipcMain.on('download', (event, info) => {
    console.log('info: '+info);
          download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
              .then(dl => window.webContents.send("download complete", dl.getSavePath()));
      })
  mainWindow.setMenu(null)
}
// Handle View one sale
ipcMain.on('update-notify-value',  (event, arg) => {
  let win = new BrowserWindow({width: 800, height: 500,title:arg})
  win.loadFile('./templates/saleView.html')
  win.webContents.on('did-finish-load', () => {
      win.webContents.send('saleID', arg);
  });
  win.on('close', function () {
    addWindow = null;
  });
})

// Handle View one sale
ipcMain.on('report-view',  (event, arg) => {
  console.log(arg);

  let win = new BrowserWindow({width: 800, height: 500,title:arg})
  win.loadFile('./templates/reportView.html')
  win.webContents.on('did-finish-load', () => {
      win.webContents.send('reportID', arg);
  });
  win.on('close', function () {
    addWindow = null;
  });
})

ipcMain.on('report-month',  (event, arg) => {
  console.log(arg);

  let win = new BrowserWindow({width: 800, height: 500,title:arg})
  win.loadFile('./templates/reportView.html')
  win.webContents.on('did-finish-load', () => {
      win.webContents.send('reportMonth', arg);
  });
  win.on('close', function () {
    addWindow = null;
  });
})

ipcMain.on('report-product',  (event, arg) => {
  console.log(arg);

  let win = new BrowserWindow({width: 800, height: 500,title:arg})
  win.loadFile('./templates/reportView.html')
  win.webContents.on('did-finish-load', () => {
      win.webContents.send('reportMonth', arg);
  });
  win.on('close', function () {
    addWindow = null;
  });
})
function createAllReportsWindow(){
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadFile('./templates/reports.html')
  // mainWindow.loadFile('./vendor/jquery/jquery.min.js')
}
function createMonthlyReportsWindow(){
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadFile('./templates/monthlyReport.html')
  // mainWindow.loadFile('./vendor/jquery/jquery.min.js')
}


// Handle create-new-product Window
function createLoginWindow(){
  addWindow = new BrowserWindow({width: 800, height: 500,title:'Agregar Nuevo Producto'})

  addWindow.loadFile('./templates/login.html')
  addWindow.on('close', function () {
    addWindow = null;
  });

}


function createMainWindow(){
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadFile('./templates/index.html')
  // mainWindow.loadFile('./vendor/jquery/jquery.min.js')

    mainWindow.setMenu(main)

}

ipcMain.on('admin-view',  (event, arg) => {
  loggedUser = arg

  // var window = remote.getCurrentWindow();
  // window.close();
  mainWindow.loadFile('./templates/main.html')
  Menu.setApplicationMenu(mainMenu);
})
ipcMain.on('sales-view',  (event, arg) => {
  loggedUser = arg
  // var window = remote.getCurrentWindow();
  // window.close();

  mainWindow.loadFile('./templates/main.html')
  Menu.setApplicationMenu(salesMenu);

})


// Handle create-new-product Window
function createNewProductWindow(){
  addWindow = new BrowserWindow({width: 800, height: 500,title:'Agregar Nuevo Producto'})

  addWindow.loadFile('./templates/addProduct.html')
  addWindow.on('close', function () {
    addWindow = null;
  });

}

function createNewSaleWindow(){
  addWindow = new BrowserWindow({width: 800, height: 500,title:'Agregar Nueva Venta'})

  addWindow.loadFile('./templates/sale.html')
  addWindow.webContents.on('did-finish-load', () => {
      addWindow.webContents.send('loggedUser', loggedUser);
  });
  addWindow.on('close', function () {
    addWindow = null;
  });

}

function createPurchaseProductWindow(){
  addWindow = new BrowserWindow({width: 800, height: 500,title:'Agregar Nueva Venta'})

  addWindow.loadFile('./templates/purchaseProduct.html')
  addWindow.on('close', function () {
    addWindow = null;
  });

}

function createProductReportWindow(){
  addWindow = new BrowserWindow({width: 800, height: 500,title:'Agregar Nueva Venta'})

  addWindow.loadFile('./templates/Reports/product_report.html')
  addWindow.on('close', function () {
    addWindow = null;
  });

}

function createViewSaleWindow(){
  addWindow = new BrowserWindow({width: 800, height: 500,title:'Vista Venta'})

  addWindow.loadFile('./templates/saleView.html')
  addWindow.on('close', function () {
    addWindow = null;
  });

}


function createAllSaleWindow(){
  addWindow = new BrowserWindow({width: 800, height: 500,title:'Vista Venta'})

  addWindow.loadFile('./templates/allSales.html')
  addWindow.on('close', function () {
    addWindow = null;
  });

}

// Handle create add Window
function createNewClientWindow(){
  newLoanWindow = new BrowserWindow({width: 800, height: 500,title:'Agregar Nuevo Cliente'})

  newLoanWindow.loadFile('./templates/addClient.html')
  newLoanWindow.on('close', function () {
    newLoanWindow = null;
  });

}


// Handle create add Window
function createClientWindow(){
  newLoanWindow = new BrowserWindow({width: 800, height: 500,title:'Clientes'})

  newLoanWindow.loadFile('./templates/clients.html')
  newLoanWindow.on('close', function () {
    newLoanWindow = null;
  });

}

// Handle create add Window
function createProductsWindow(){
  newLoanWindow = new BrowserWindow({width: 800, height: 500,title:'Productos'})

  newLoanWindow.loadFile('./templates/products.html')
  newLoanWindow.on('close', function () {
    newLoanWindow = null;
  });

}


app.on('ready', createWindow)

if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({label:'Not'});
}

if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({

  });
}
app.on('window-all-closed', function () {

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {

  if (mainWindow === null) {
    createWindow()
  }
})
