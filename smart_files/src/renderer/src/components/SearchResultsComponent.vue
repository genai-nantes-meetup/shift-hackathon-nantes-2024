<script setup>
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table'
import { DocumentTextIcon } from '@heroicons/vue/24/outline'

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js')
//     }
//   })

//   win.loadFile('index.html')
// }

// const iconName = path.join(__dirname, 'iconForDragAndDrop.png')
// const icon = fs.createWriteStream(iconName)

// document.getElementById('drag').ondragstart = (event) => {
//   event.preventDefault()
//   window.electron.startDrag('drag-and-drop.md')
// }

// Create a new file to copy - you can also copy existing files.
// fs.writeFileSync(path.join(__dirname, 'drag-and-drop-1.md'), '# First file to test drag and drop')
// fs.writeFileSync(path.join(__dirname, 'drag-and-drop-2.md'), '# Second file to test drag and drop')

// https.get('https://img.icons8.com/ios/452/drag-and-drop.png', (response) => {
//   response.pipe(icon)
// })

// app.whenReady().then(createWindow)

// ipcMain.on('ondragstart', (event, filePath) => {
//   event.sender.startDrag({
//     file: path.join(__dirname, filePath),
//     icon: iconName
//   })
// })

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

// app.on('activate', () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow()
//   }
// })

const handleClick = (file, event) => {
  if (event.shiftKey) {
    event.preventDefault()
    event.dataTransfer.setData('text/plain', file.path)
    event.dataTransfer.effectAllowed = 'move'
  }
}

const handleDragStart = (event, file) => {
  if (!event.shiftKey) {
    event.preventDefault()
  } else {
    event.dataTransfer.setData('text', file.path)
    event.dataTransfer.effectAllowed = 'move'
  }
}

defineProps({
  files: Array
})

const dateFormat = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
})

const showFileSize = (rawSize) => {
  if (rawSize == null) {
    return '(taille inconnue)'
  } else if (rawSize < 1024) {
    return `${rawSize} B`
  } else if (rawSize < 1024 * 1024) {
    return `${(rawSize / 1024).toFixed(2)} KB`
  } else if (rawSize < 1024 * 1024 * 1024) {
    return `${(rawSize / (1024 * 1024)).toFixed(2)} MB`
  } else {
    return `${(rawSize / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }
}

const openPath = window.api.openPath
</script>

<template>
  <Table class="overflow">
    <TableCaption>...</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead class="w-2/4"> Fichiers </TableHead>
        <TableHead class="w-1/4 text-right">Taille</TableHead>
        <TableHead class="w-1/4 text-right">Date</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-for="file in files"
        :key="file.fichier"
        class="cursor-pointer"
        title="Double clic pour ouvrir le fichier"
        @dblclick="openPath(file.path)"
        @click="handleClick(file.path, $event)"
        @dragstart="handleDragStart($event, file)"
        draggable
      >
        <TableCell class="font-medium w-2/4 text">
          <div class="flex">
            <div>
              <DocumentTextIcon class="h-5 w-5 mr-2" />
            </div>
            <p>{{ file.name }}</p>
          </div>
          <div class="text-gray-400 text-sm ml-7">{{ file.path }}</div>
        </TableCell>
        <TableCell class="w-1/4 text-right">{{ showFileSize(file.size) }}</TableCell>
        <TableCell class="w-1/4 text-right">{{ dateFormat.format(file.date) }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
