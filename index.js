 

  import { readdir } from 'node:fs/promises';
 
/*
const sharp = require('sharp')
 
console.log('Resizing')
 
sharp('alps.jpg')
  .resize(1200, 1200)
  .rotate(10, {background: "#ff0000"})
  .toFile('output.jpg', function(err) {
  });
*/
 
try {
  const photoRoot = await readdir('photos');
  for (const photoDirName of photoRoot){
    console.log(photoDirName);
    if(!photoDirent.isDirectory()){
      continue
    }
    // Jednotliva galerie
    const photoDir = await readdir(`photos/${photoDirName}`)
 
      for (const photoName of photoDir){
        if(photoName.toLowerCase().endsWith('.jpg')){
          console.log(` photos/${photoDirName}/${photoName}`)
        }
      }
 
  }
} catch (err) {
  console.error(err);
} 