import { readdir } from 'node:fs/promises';
import sharp from 'sharp';
import path from 'path';

const gallery = document.getElementById("gallery")
console.log(gallery)

async function createResizedImage(newSize, imagePath, imageName, endPointFolder, imageSuffix = "altered") {
  const newImageName = `${imageName}_${imageSuffix}.jpg`;
  const outputFilePath = path.join(endPointFolder, newImageName);

  try {
    await sharp(imagePath)
      .resize(newSize, newSize)
      .toFile(outputFilePath, { force: true }); // Set force option to true

    console.log(`Created resized image: ${outputFilePath}`);
  } catch (error) {
    console.error(`Error creating resized image: ${error}`);
  }
}

async function processPhotos() {
  try {
    await processDirectory('photos', 'bigImg', 1200, "big");
    await processDirectory('photos', 'smallImg', 300, "small");
  } catch (err) {
    console.error(err);
  }
}

async function processDirectory(directoryPath, endPointFolder, newSize, imageSuffix) {
  const photoRoot = await readdir(directoryPath, { withFileTypes: true });

  for (const photoDirent of photoRoot) {
    const photoPath = path.join(directoryPath, photoDirent.name);

    if (photoDirent.isDirectory()) {
      await processDirectory(photoPath, endPointFolder, newSize, imageSuffix);
    } else if (photoDirent.isFile() && photoDirent.name.toLowerCase().endsWith('.jpg')) {
      const imageName = path.parse(photoDirent.name).name;
      await createResizedImage(newSize, photoPath, imageName, endPointFolder, imageSuffix);
    }
  }
}

processPhotos();


//projdi složku s obrázky
//pro každý obrázek vytvoř 300x300 náhled a velký obrázek;
// přelož je do nových souborů

 // console.log(` photos/${photoDirent.name}/${photoName}`, photoName)
          // sharp( `photos/${photoDirent.name}/${photoName}`)
          //   .resize(1200, 1200)
          //   .rotate(10, {background: "#ff0000"})
          //   .toFile((Math.random()*10).floor, function(err) {
          //   });