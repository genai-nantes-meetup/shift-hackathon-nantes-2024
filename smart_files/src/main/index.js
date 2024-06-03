import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { spawn } from 'child_process'
import icon from '../../resources/icon.png?asset'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    icon:`${__dirname}/src/renderer/assets/sm.png`,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load the local URL for development or the local
  // html file for production
  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.on('open-path', (_, path) => shell.openPath(path))
  ipcMain.on('show-open-dialog', (event, options) => {
    const result = dialog.showOpenDialogSync(options)
    event.reply('show-open-dialog-reply', result)
  })
  ipcMain.on('populate-database', (event, folderPaths) => {
    const child = spawn('python', ['./smart_files/populate_db.py'])
    let output = ''

    child.stdin.write(
      JSON.stringify({
        folder_paths: folderPaths
      })
    )
    console.log(
      JSON.stringify({
        folder_paths: folderPaths
      })
    )
    child.stdin.end()

    child.stdout.on('data', (data) => {
      output += data
    })

    child.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`)
    })

    child.on('exit', (code) => {
      if (code !== 0) {
        event.reply('populate-database-reply', { error: 'populate db failure' })
      } else {
        event.reply('populate-database-reply', { success: output })
      }
    })

    child.on('error', (error) => {
      event.reply('populate-database-reply', { error })
    })
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
