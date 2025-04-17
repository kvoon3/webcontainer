import type { FileSystemTree } from '@webcontainer/api'
// import { readdirSync, readFileSync } from 'node:fs'

// const _files = readdirSync('./express').map((file) => {
//   return {
//     [file]: {
//       file: {
//         contents: readFileSync(`./express/${file}`, 'utf-8'),
//       },
//     },
//   }
// })

const files = {
  'index.js': {
    file: {
      contents: `
import express from 'express';
const app = express();
const port = 3111;

app.get('/', (req, res) => {
  res.send('Welcome to a WebContainers app! 🥳');
});

app.listen(port, () => {
  console.log(\`App is live at http://localhost:\${port}\`);
});`,
    },
  },
  'package.json': {
    file: {
      contents: `
{
  "name": "example-app",
  "type": "module",
  "dependencies": {
    "express": "latest",
    "nodemon": "latest"
  },
  "scripts": {
    "start": "nodemon --watch './' index.js"
  }
}`,
    },
  },
} satisfies FileSystemTree

console.log('files', files)

export { files }
