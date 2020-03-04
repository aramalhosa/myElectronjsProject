const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');

const { app, BrowserWindow, Menu, ipcMain } = electron;

//Set Env process.env.NODE_ENV = 'production';
process.env.NODE_ENV = 'development';

let mainWindow;
let addWindow;
let newTaskWindow;

// Listen for app to be ready
app.on('ready', function () {
    // Create new window
    mainWindow = new BrowserWindow({
        width: 1300,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Load html into the window
    mainWindow.loadURL('file://' + path.join(__dirname, 'mainWindow.html'));
    //AJR : mainWindow.webContents.openDevTools();

    // Quit app when closed
    mainWindow.on('closed', function () {
        app.quit();
    })

    // Build menu from templates   
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert Menu
    Menu.setApplicationMenu(mainMenu);
});



//Handle create add window
function createAddWindow() {
    //Create new window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add new task',
        webPreferences: {
            nodeIntegration: true
        }
    });

    addWindow.removeMenu();

    // Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    // Garbage collection handle
    addWindow.on('close', function () {
        addWindow = null;
    });
}

//Handle save data to a file
function saveDataInFile() {
    //Create new window
    saveFileWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Name of the file to save the data',
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load html into window
    saveFileWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'saveFileWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    saveFileWindow.removeMenu();

    // Garbage collection handle
    saveFileWindow.on('close', function () {
        saveFileWindow = null;
    });
}

//Handle save data to a file
function saveRegDataInFile() {
    //Create new window
    saveFileRegWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Name of the file to save the data',
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load html into window
    saveFileRegWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'saveFileRegWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    saveFileRegWindow.removeMenu();

    // Garbage collection handle
    saveFileRegWindow.on('close', function () {
        saveFileRegWindow = null;
    });
}

//Handle load data to a file
function loadDataInFile() {
    //Create new window
    loadFileWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Load tasks from a file',
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load html into window
    loadFileWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'loadFileWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    loadFileWindow.removeMenu();

    // Garbage collection handle
    loadFileWindow.on('close', function () {
        loadFileWindow = null;
    });
}

//Handle load data to a file
function newTaskEntry() {
    //Create new window
    newTaskWindow = new BrowserWindow({
        width: 300,
        height: 235,
        title: 'New task Entry',
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load html into window
    newTaskWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'newTaskWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    newTaskWindow.removeMenu();

    // Garbage collection handle
    newTaskWindow.on('close', function () {
        newTaskWindow = null;
    });
}


//Handle save data to a file
function arquiveWeekRegestry() {
    //Create new window
    archiveWeekRegWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Name of the file to save the data',
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load html into window
    archiveWeekRegWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'archiveWeekRegWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    archiveWeekRegWindow.removeMenu();

    // Garbage collection handle
    archiveWeekRegWindow.on('close', function () {
        archiveWeekRegWindow = null;
    });
}
//Handle load data to a file
function viewWeekRegestry() {
    //Create new window
    weekRegestryWindow = new BrowserWindow({
        width: 1400,
        height: 650,
        title: 'Tasks Registration App',
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load html into window
    weekRegestryWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'weekRegestry.html'),
        protocol: 'file',
        slashes: true
    }));

    //weekRegestryWindow.removeMenu();

    // Garbage collection handle
    weekRegestryWindow.on('close', function () {
        weekRegestryWindow = null;
    });
}

ipcMain.on('item:showNewTaskWindow', function (e, item) {
    newTaskEntry();
    if (item != "") {
        newTaskWindow.webContents.once('dom-ready', () => {
            newTaskWindow.webContents.send('item:newTaskText', item)
        })
    }
})

ipcMain.on('item:createNewTask', function (e, item) {
    mainWindow.webContents.send('item:addRegTask', item);
    newTaskWindow.close();
})

// Catch item:add
ipcMain.on('item:add', function (e, item) {
    //console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})

// Catch item:save
ipcMain.on('item:save', function (e, item) {

    mainWindow.webContents.send('item:save', item);

    saveFileWindow.close();
})

// Catch item:saveRegClose
ipcMain.on('item:saveRegClose', function (e, item) {

    mainWindow.webContents.send('item:saveReg', item);

    saveFileRegWindow.close();
})

// Catch item:saveReg
ipcMain.on('item:saveReg', function (e, item) {

    mainWindow.webContents.send('item:saveReg', item);

})

// Catch item:load
ipcMain.on('item:load', function (e, item) {

    item = process.cwd() + '\\myFiles\\' + item + '.txt';

    fs.readFileSync(item, 'utf-8').split(/\r?\n/).forEach(function (line) {
        mainWindow.webContents.send('item:add', line);
    });

    //fs.readFile(item, 'utf-8', (err, data) => {
    //    if (err) {
    //        alert("An error ocurred reading the file :" + err.message);
    //        return;
    //    }
    //    console.log("The file content is : " + data.toString());
    //});

    loadFileWindow.close();
})

// Catch item:loadinit
ipcMain.on('item:loadinit', function (e, item) {

    item = process.cwd() + '\\myFiles\\' + item + '.txt';

    try {
        fs.readFileSync(item, 'utf-8').split(/\r?\n/).forEach(function (line) {
            mainWindow.webContents.send('item:add', line);
        });
    } catch (err) { }
})

// Catch item:loadinit
ipcMain.on('item:loadRegTasks', function (e, item) {

    var linesInFile = 0;

    item = process.cwd() + '\\myFiles\\' + item;

    try {
        fs.readFileSync(item, 'utf-8').split(/\r?\n/).forEach(function (line) {
            linesInFile = linesInFile + 1;
            mainWindow.webContents.send('item:addRegTask', line);
        });
    } catch (err) { }

    if (linesInFile == 0) {
        var d = new Date();
        var today = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + '\r\n';
        mainWindow.webContents.send('item:addRegTask', today);
    }

})

function readFileAndArquive(file, item) {

    var myDirectorie = process.cwd() + '\\myFiles';

    ensureDirectoryExistence(myDirectorie);

    file = myDirectorie + '\\' + file;

    var text = '';

    // Read all the linhes in the origin file!
    try {
        fs.readFileSync(file, 'utf-8').split(/\r?\n/).forEach(function (line) {
            text = text + line + '\r\n';
        });
    } catch (err) { }

    //Copy the lines to the arquive file!    
    fs.appendFile(item, text, (err) => {
        if (err) throw err;
    });

    // Delete de origin file
    if (fs.existsSync(file)) {
        fs.unlink(file, (err) => {
            if (err) {
                console.log(err);
                return;
            }
        });
    } else { }
}

// Catch item:archiveWeekRegClose
ipcMain.on('item:archiveWeekRegClose', function (e, item) {

    readFileAndArquive('1_DayOfTheWeek_Tasks.txt', item);
    readFileAndArquive('2_DayOfTheWeek_Tasks.txt', item);
    readFileAndArquive('3_DayOfTheWeek_Tasks.txt', item);
    readFileAndArquive('4_DayOfTheWeek_Tasks.txt', item);
    readFileAndArquive('5_DayOfTheWeek_Tasks.txt', item);

    mainWindow.webContents.send('item:cleanReg', '');
    var d = new Date();
    var today = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + '\r\n';
    mainWindow.webContents.send('item:addRegTask', today);

    archiveWeekRegWindow.close();
})

// -------------------------------------------- //
// ---------- Tips Section ------------------- //
// -------------------------------------------- //

// Catch item:loadinit
ipcMain.on('item:loadRegTips', function (e, item) {

    var linesInFile = 0;

    item = process.cwd() + '\\myFiles\\myTips\\myTipsFile.txt';

    try {
        fs.readFileSync(item, 'utf-8').split(/\r?\n/).forEach(function (line) {
            if (line != '') {
                mainWindow.webContents.send('item:addRegTip', line);
                /* console.log('Foi lida a seguinte linha ' + line + '!'); */
            }
        });
    } catch (err) { }

})

// Handle create add window
function addNewTip() {
    //Create new window
    addNewTipWindow = new BrowserWindow({
        width: 500,
        height: 200,
        title: 'Add new tip',
        webPreferences: {
            nodeIntegration: true
        }
    });

    addNewTipWindow.removeMenu();

    // Load html into window
    addNewTipWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'newTipWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    // Garbage collection handle
    addNewTipWindow.on('close', function () {
        addNewTipWindow = null;
    });
}

// Catch item:addNewTip
ipcMain.on('item:addNewTip', function (e, item) {

    var myDirectorie = process.cwd() + '\\myFiles\\myTips';

    ensureDirectoryExistence(myDirectorie);

    var fileSave = myDirectorie + "\\myTipsFile.txt";

    var myDirectorieTip = myDirectorie + "\\" + item;

    ensureDirectoryExistence(myDirectorieTip);

    var fileSaveTip = myDirectorieTip + "\\" + item + "_File.txt";

    fs.appendFile(fileSaveTip, "Empty", function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Dados foram gravados no ficheiro ' + fileSaveTip + '!');
    });

    var content = item + '\r\n';

    fs.appendFile(fileSave, content, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Dados foram gravados no ficheiro ' + fileSave + '!');

        mainWindow.webContents.send('item:refreshRegTips');
    });

    addNewTipWindow.close();

})

function deleteTip() {
    //Create new window
    deleteTipWindow = new BrowserWindow({
        width: 500,
        height: 170,
        title: 'Delete tip',
        webPreferences: {
            nodeIntegration: true
        }
    });

    deleteTipWindow.removeMenu();

    // Load html into window
    deleteTipWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'deleteTipWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    // Garbage collection handle
    deleteTipWindow.on('close', function () {
        deleteTippWindow = null;
    });

    deleteTipWindow.webContents.once('dom-ready', () => {
        deleteTipWindow.webContents.send('item:passInfoToDelete', 'xxx');
    })

}

ipcMain.on('item:deleteTip', function (e, item) {

    deleteTip();

})

ipcMain.on('item:deleteTipConfirm', function (e, item) {

    deleteTipWindow.close();

})

ipcMain.on('item:deleteTipAbort', function (e, item) {

    deleteTipWindow.close();

})

var deleteFolderRecursive = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

// -------------------------------------------- //
// ---------- Links Section ------------------- //
// -------------------------------------------- //

//Handle create add window
function addNewLink() {
    //Create new window
    addNewLinkWindow = new BrowserWindow({
        width: 550,
        height: 650,
        title: 'Add new link',
        webPreferences: {
            nodeIntegration: true
        }
    });

    addNewLinkWindow.removeMenu();

    // Load html into window
    addNewLinkWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'newLinkWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    // Garbage collection handle
    addNewLinkWindow.on('close', function () {
        addNewLinkWindow = null;
    });
}

//Handle create add window
function saveLinks() {

    mainWindow.webContents.send('item:saveLinks');

}

ipcMain.on('item:createNewLink', function (e, item, item1, classification) {

    var myDirectorie = process.cwd() + '\\myFiles';

    ensureDirectoryExistence(myDirectorie);

    var fileSave = myDirectorie + '\\' + classification + ".txt";

    var content = item + "#" + item1 + '\r\n';

    fs.appendFile(fileSave, content, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Dados foram gravados no ficheiro ' + fileSave + '!');
    });

    // mainWindow.webContents.send('item:addRegLink', item);

    addNewLinkWindow.close();
})

ipcMain.on('item:getLinksFromFile', function (e, file) {

    try {

        var myDirectorie = process.cwd() + '\\myFiles';
        var fileName = myDirectorie + '\\' + file;

        mainWindow.webContents.send('item:cleanLinkWindow');

        fs.readFileSync(fileName, 'utf-8').split(/\r?\n/).forEach(function (line) {
            if (line != '') {
                mainWindow.webContents.send('item:addLinkWindow', line);
            }
        });
    } catch (err) { }

})

function ensureDirectoryExistence(dirname) {

    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
    }
}

// -------------------------------------------- //
// ---------- Notes Section ------------------- //
// -------------------------------------------- //

//Handle create add window
function addNewNote() {
    //Create new window
    addNewNoteWindow = new BrowserWindow({
        width: 500,
        height: 200,
        title: 'Add new note',
        webPreferences: {
            nodeIntegration: true
        }
    });

    addNewNoteWindow.removeMenu();

    // Load html into window
    addNewNoteWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'newNoteWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    // Garbage collection handle
    addNewNoteWindow.on('close', function () {
        addNewNoteWindow = null;
    });
}

// Catch item:addNewNote
ipcMain.on('item:addNewNote', function (e, item) {
    addNewNoteWindow.close();
    openNewNote(item);
})

// Catch item:openOldNote
ipcMain.on('item:openOldNote', function (e, item) {
    openOldNote(item);
})

//Handle create add window
function openNewNote(item) {
    //Create new window
    openNoteWindow = new BrowserWindow({
        width: 800,
        height: 690,
        title: 'Add new link',
        webPreferences: {
            nodeIntegration: true
        }
    });

    openNoteWindow.removeMenu();

    // Load html into windowf
    openNoteWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'richText.html'),
        protocol: 'file',
        slashes: true
    }));

    if (item != "") {
        openNoteWindow.webContents.once('dom-ready', () => {
            openNoteWindow.webContents.send('item:newNote', item);
        })
    }

    // Garbage collection handle
    openNoteWindow.on('close', function () {
        openNoteWindow = null;
    });
}

//Handle create add window
function openOldNote(item) {
    //Create new window
    openNoteWindow = new BrowserWindow({
        width: 800,
        height: 690,
        title: 'Add new link',
        webPreferences: {
            nodeIntegration: true
        }
    });

    //openNoteWindow.removeMenu();

    // Load html into windowf
    openNoteWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'richText.html'),
        protocol: 'file',
        slashes: true
    }));

    if (item != "") {
        openNoteWindow.webContents.once('dom-ready', () => {
            openNoteWindow.webContents.send('item:oldNote', item);
        })
    }

    // Garbage collection handle
    openNoteWindow.on('close', function () {
        openNoteWindow = null;
    });
}

// -------------------------------------------- //
// ---------------- Menu Options -------------- //
// -------------------------------------------- //

const mainMenuTemplate = [
    {
        label: 'Tasks',
        submenu: [
            {
                label: 'Add new task',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear tasks',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Save tasks in file',
                click() {
                    saveDataInFile();
                }
            },
            {
                label: 'Load tasks from file',
                click() {
                    loadDataInFile();
                }
            },
            {
                label: 'Save registed tasks',
                click() {
                    saveRegDataInFile();
                }
            },
            {
                label: 'Arquive week Regetry',
                click() {
                    arquiveWeekRegestry();
                }
            },
            {
                label: 'View week regestry',
                click() {
                    viewWeekRegestry();
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Tips',
        submenu: [
            {
                label: 'Add new tip',
                click() {
                    addNewTip();
                }
            },
            {
                label: 'Save Tips in File',
                click() {
                    saveTipsInFile();
                }
            }
        ]
    },
    {
        label: 'Links',
        submenu: [
            {
                label: 'Add new links',
                click() {
                    addNewLink();
                }
            },
            {
                label: 'Save Links in File',
                click() {
                    saveLinks();
                }
            }
        ]
    },
    {
        label: 'Notes',
        submenu: [
            {
                label: 'Add new note',
                click() {
                    addNewNote();
                }
            }
        ]
    }
];


// if mac, add empty object to the menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshif({});
}

// Add developer tools if not in production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toogle Devtools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}