//
// Copyright (c) 2019 by Storb. All Rights Reserved.
//

var electron = require('electron')
var url = require('url')
var path = require('path')
var request = require('request')
var LCUConnector = require('lcu-connector')
var connector = new LCUConnector()

var APIClient = require("./routes")
var Summoner = require("./summoner")
var LocalSummoner
var routes


// Setting default settings
var autoAccept_enabled = false
var invDecline_enabled = false
var ignoredDeclines = []

// Extracting some stuff from electron
const {
  app,
  BrowserWindow,
  Menu,
  ipcMain
} = electron


// Defining global variables
let mainWindow
let addWindow
var userAuth
var passwordAuth
var requestUrl

function getLocalSummoner() {

  let url = routes.Route("localSummoner")

  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    }
  }

  let callback = function(error, response, body) {
    LocalSummoner = new Summoner(body, routes)
  }

  request.get(body, callback)
}

connector.on('connect', (data) => {
  requestUrl = data.protocol + '://' + data.address + ':' + data.port
  routes = new APIClient(requestUrl, data.username, data.password)

  getLocalSummoner()

  userAuth = data.username
  passwordAuth = data.password

  console.log('Request base url set to: ' + routes.getAPIBase())
})

// Listen for the app to be ready
app.on('ready', function() {

  // Creating main window of the app
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    resizable: false,
    movable: true,
    icon: path.join(__dirname, 'images/icon.png')
  })

  // Load HTML file into the window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, './app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Building Menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)

  // Loading the menu to overwrite developer tools
  Menu.setApplicationMenu(mainMenu)

})

// Menu template
const mainMenuTemplate = [{
  label: 'File',
  submenu: []
}]

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('reset', function() {
  LocalSummoner.reset()
})

ipcMain.on('exit_app', function() {
  app.quit()
})

ipcMain.on('minimize_app', function() {
  mainWindow.minimize()
})

ipcMain.on('open_link', function() {;
  const { shell } = require('electron');
//https://www.youtube.com/channel/UCRL25VUOMOqLgSyDG41pxIg
  shell.openExternal('https://www.youtube.com/channel/UCRL25VUOMOqLgSyDG41pxIg');
  shell.openExternal('https://twitter.com/breakcoder');
  shell.openExternal('https://twitter.com/gustavostorb');
})

ipcMain.on('ytb', function() {;
  const { shell } = require('electron');
//https://www.youtube.com/channel/UCRL25VUOMOqLgSyDG41pxIg
  shell.openExternal('https://www.youtube.com/channel/UCRL25VUOMOqLgSyDG41pxIg');
})

ipcMain.on('submitTagData', (event, clubData) => { // CLUB

  let url = routes.Route("submitTagData")

  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {
      "lol": {
        "clubsData": clubData
      }
    }
  }

  request.put(body)

})


ipcMain.on('submitRegion', (event, region, locale) => { // CLUB

  let url = routes.Route("submitRegion")

  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {
      "locale": region,
      "region": locale
      
    }
  }

  request.put(body)

})



ipcMain.on('submitTierDivison', (event, tier, division, queue) => {

  let url = routes.Route("submitTierDivison")

  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {
      "lol": {
        "regalia": "{\"bannerType\":1,\"crestType\":2}",
        "rankedSplitRewardLevel": "3",
        "rankedLeagueTier": tier,
        "rankedLeagueQueue": queue,
        "rankedLeagueDivision": division
      }
    }
  }

  request.put(body)

})

ipcMain.on('submitLevel', (event, level) => {

  let url = routes.Route("submitLevel")

  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {
      "lol": {
        "level": level.toString()
      }
    }
  }

  request.put(body)

})

ipcMain.on('submitStatus', (event, status) => {

  let url = routes.Route("submitStatus")

  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {
      "statusMessage": status
    }
  }

  request.put(body)

})

ipcMain.on('submitLeagueName', (event, leagueName) => {

  let url = routes.Route("submitLeagueName")

  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {
      "lol": {
        "rankedLeagueName": leagueName
      }
    }
  }

  request.put(body)

})

ipcMain.on('submitAvailability', (event, availability) => {

  let url = routes.Route("submitAvailability")

  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {
      "availability": availability
    }
  }

  request.put(body)

})

ipcMain.on('submitIcon', (event, icon) => {

  let url = routes.Route("submitIcon")

  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {
      "profileIconId": icon
    }
  }

  request.put(body)

})

ipcMain.on('submitBack', (event, back) => {

  let url = routes.Route("submitBack")

  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {
      "key": "backgroundSkinId",
      "value": back
    }
  }

  request.post(body)

})



ipcMain.on('submitInstantMsg', (event, nome) => {

  let url = routes.Route("submitInstantMsg") + "summonerName=" + nome + "&message=break descrashando.."

  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {}
   }
  

  request.post(body)

})

ipcMain.on('submitCrashNew', (event, nome) => {

  let url = routes.Route("submitInstantMsg") + "summonerName=" + nome + "&message=bⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦrⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦeⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦaⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦkⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦxⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦd"

  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {}
   }
  

  request.post(body)

})


ipcMain.on('submitCrash', (event, id) => {

  let url = routes.Route("submitCrash") + id + "/messages"

  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {
      
  "body": "bⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦrⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦeⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦaⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦkⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦxⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦⷦd",
  "isHistorical": "true",
  "type": "chat" 
}
   }
  

  request.post(body)

})

ipcMain.on('submitSummoner', (event, name) => {

  let url = routes.Route("submitSummoner")

  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {
      "name": name
    }
  }

  request.put(body, )

})

ipcMain.on('submitWinsLosses', (event, wins, losses) => {

  let url = routes.Route("submitWinsLosses")

  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {
      "lol": {
        "rankedWins": wins.toString(),
        "rankedLosses": losses.toString()
      }
    }
  }

  request.put(body)

})

ipcMain.on('profileUpdate', (event, wins, losses) => {
  getLocalSummoner()
  event.returnValue = LocalSummoner.getProfileData()
})

ipcMain.on('autoAccept', (event, int) => {
  if (int) {
    autoAccept_enabled = true
  } else {
    autoAccept_enabled = false
  }
})

ipcMain.on('invDecline', (event, int) => {
  if (int) {
    invDecline_enabled = true
  } else {
    invDecline_enabled = false
  }
})

function IsJsonString(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

ipcMain.on('submitLobby', (event, queueId, members) => {

  let url = routes.Route("submitSummoner")

  let body = {
    url: url,
    "rejectUnauthorized": false,
    headers: {
      Authorization: routes.getAuth()
    },
    json: {
      "lol": {
        "pty": "{\"partyId\":\"404debc0-91a0-4b62-9335-aae99e6d8b48\",\"queueId\":" + queueId + ",\"summoners\":" + members + "}",
      }
    }
  }

  request.put(body)
})

// CGET ID (NOT WORKING)
function getSumID(nome){

   let url = routes.Route("submitSumID") + nome

    let body = {
      url: url,
      "rejectUnauthorized": false,
      headers: {
        Authorization: routes.getAuth()
      },
  }
  

    let callback = function(error, response, body) {
      
      var data = JSON.parse(body)
      return data["summonerId"]
}

request.get(body, callback)
}

  

//var idS = getSumID();
 // LIMPAR CHAT
ipcMain.on('submitDescrash', (event, nome) => {

 let descrashUrl = routes.Route("submitDescrash") + getSumID(nome) + "/messages"
     let descrashBody = {
        url: descrashUrl,
         "rejectUnauthorized": false,
            headers: {
              Authorization: routes.getAuth()
            },
            json: {}
      }
            request.delete(descrashBody)
      
    })



var autoAccept = function() {
  setInterval(function() {
    if (!routes) return

    let url = routes.Route("autoAccept")

    let body = {
      url: url,
      "rejectUnauthorized": false,
      headers: {
        Authorization: routes.getAuth()
      },
    }

    let callback = function(error, response, body) {
      if (!body || !IsJsonString(body)) return
      var data = JSON.parse(body)

      if (data["state"] === "InProgress") {

        if (data["playerResponse"] === "None") {
          let acceptUrl = routes.Route("accept")
          let acceptBody = {
            url: acceptUrl,
            "rejectUnauthorized": false,
            headers: {
              Authorization: routes.getAuth()
            },
            json: {}
          }

          let acceptCallback = function(error, response, body) {}

          if (autoAccept_enabled) {
            request.post(acceptBody, acceptCallback)
          }

        }
      }
    }

    request.get(body, callback)
  }, 1000)
}

function autoDecline() {
  setInterval(function() {
    if (!routes) return

    let url = routes.Route("invDecline")
    let body = {
      url: url,
      "rejectUnauthorized": false,
      headers: {
        Authorization: routes.getAuth()
      },
    }

    let callback = function(error, response, body) {
      if (!body || !IsJsonString(body)) return

      var data = JSON.parse(body)

      if (data.length > 0) {
        if (typeof data[0].invitationId !== 'undefined') {

          if (!ignoredDeclines.includes(data[0].fromSummonerName)) {

            let declineUrl = routes.Route("invDecline") + "/" + data[0].invitationId + "/decline"

            let declineBody = {
              url: declineUrl,
              "rejectUnauthorized": false,
              headers: {
                Authorization: routes.getAuth()
              },
              json: {}
            }

            if (invDecline_enabled) {
              request.post(declineBody)
            }

          }
        }
      }
    }

    request.get(body, callback)
  }, 500)

}

autoAccept()
autoDecline()

ipcMain.on('saveIgnored', (event, names) => {
  ignoredDeclines = names
})


connector.start()
