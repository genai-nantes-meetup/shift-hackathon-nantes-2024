import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { spawn } from 'child_process'
import { stat } from 'fs/promises'
import path from 'path'

// Custom APIs for renderer
const api = {
  populateDatabase: (folderPaths, callbacks) => {
    ipcRenderer.on('populate-database-progress', (_, progress) => {
      callbacks.onProgress(progress)
    })
    ipcRenderer.once('populate-database-reply', (_, result) => {
      ipcRenderer.removeAllListeners('populate-database-progress')
      callbacks.onFinish(result)
    })
    ipcRenderer.send('populate-database', folderPaths)
  },
  showOpenDialog: (options, callback) => {
    ipcRenderer.once('show-open-dialog-reply', (_, result) => {
      callback(result)
    })
    ipcRenderer.send('show-open-dialog', options)
  },
  openPath: (path) => {
    ipcRenderer.send('open-path', path)
  },
  startDrag: (fileName) => {
    ipcRenderer.send('ondragstart', path.join(process.cwd(), fileName))
  },
  runSearchPrompt: (prompt, callback) => {
    const child = spawn('python', ['./smart_files/query_db.py'])
    let output = ''
    const input = {
      user_prompt: prompt
    }

    child.stdin.write(JSON.stringify(input))
    child.stdin.end()

    child.stdout.on('data', (data) => {
      output += data
    })

    child.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`)
    })

    child.on('exit', async (code) => {
      console.log(`child process exited with code ${code}`)

      if (code !== 0) {
        callback(null)
        return
      }
      let files = JSON.parse(output)

      await Promise.allSettled(
        files.map(async (file) => {
          file.name = path.basename(file.path)
          file.size = null
          file.date = null

          try {
            const stats = await stat(file.path)

            file.size = stats.size
            file.date = stats.mtime
          } catch (error) {
            console.error('Failed to read stats of ' + file, error)
            return
          }
        })
      )

      files = files.sort((f1, f2) => f1.distance - f2.distance)

      console.log('Final files', files)

      callback(code == 0 ? files : null)
    })

    child.on('error', (error) => {
      console.error(`spawn error: ${error}`)
      callback(null)
    })
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
