//Firebase
// require('firebase')
// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain} = require('electron')
// require('./vendor/jquery/jquery.js')
// loadFile('./vendor/bootstrap/js/bootstrap.bundle.min.js')
// loadFile('./vendor/jquery-easing/jquery.easing.min.js')
// loadFile('./vendor/chart.js/Chart.min.js')
// loadFile('./vendor/datatables/jquery.dataTables.js')
// loadFile('./vendor/datatables/dataTables.bootstrap4.js')
// loadFile('./js/sb-admin.min.js')
// loadFile('./js/demo/chart-area-demo.js')
let mainWindow

const mainMenuTemplate = [

  {
    label: 'Archivo',
    submenu:[
      {
        label: 'Agregar Producto',
        accelerator: process.platform == 'darwin'? 'Command+P':'Ctrl+P',
        click(){
          createNewProductWindow();
        }
      },
      {
        label: 'Productos',
        accelerator: process.platform == 'darwin'? 'Command+K':'Ctrl+K',
        click(){
          createProductsWindow();
        }
      },
      {
        label: 'Agregar Cliente',
        accelerator: process.platform == 'darwin'? 'Command+Shift+C':'Ctrl+Shift+C',

        click(){
          createNewClientWindow();
        }
      },
      {
        label: 'Agregar Venta',
        accelerator: process.platform == 'darwin'? 'Command+Shift+V':'Ctrl+Shift+V',

        click(){
          createNewSaleWindow();
        }
      },
      {
        label: 'Clear Items',
        click(){
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin'? 'Command+Q':'Ctrl+Q',
        click(){
          app.quit()
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

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadFile('./templates/main.html')
  // mainWindow.loadFile('./vendor/jquery/jquery.min.js')

  mainWindow.on('close', function () {
    app.quit();

  });


  Menu.setApplicationMenu(mainMenu);
}
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
function createProductsWindow(){
  newLoanWindow = new BrowserWindow({width: 800, height: 500,title:'Productos'})

  newLoanWindow.loadFile('./templates/products.html')
  newLoanWindow.on('close', function () {
    newLoanWindow = null;
  });

}

ipcMain.on('add:newClient',(e,docId) => {
    console.log("NAME: "+docId);
    addWindow.close()
});

ipcMain.on('loan:newClient',(e) => {
    createNewProductWindow();
});

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
