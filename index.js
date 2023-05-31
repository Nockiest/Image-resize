 

import { readdir } from 'node:fs/promises';
import sharp from 'sharp';

/*
 
 
console.log('Resizing')
 
sharp('alps.jpg')
  .resize(1200, 1200)
  .rotate(10, {background: "#ff0000"})
  .toFile('output.jpg', function(err) {
  });
*/
 
try {
  const photoRoot = await readdir('photos' , {withFileTypes: true});
  for (const photoDirent of photoRoot){
    console.log(photoDirent.name);
    if(!photoDirent.isDirectory()){
      continue
    }
    // Jednotliva galerie
    const photoDir = await readdir(`photos/${photoDirent.name}`)
 
      for (const photoName of photoDir){
        if(photoName.toLowerCase().endsWith('.jpg')){
          console.log(` photos/${photoDirent.name}/${photoName}`, photoName)
          sharp( `photos/${photoDirent.name}/${photoName}`)
            .resize(1200, 1200)
            .rotate(10, {background: "#ff0000"})
            .toFile('output.jpg', function(err) {
            });
        }
      }
 
  }
} catch (err) {
  console.error(err);
} 