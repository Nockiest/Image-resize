import { readdir, writeFile, copyFile, readFile } from 'fs/promises';
import sharp from 'sharp';
import path from 'path';

const imagePaths = [];

const content = `
<!DOCTYPE html>
<html>
  <head>
    <title>My Web Page</title>
  </head>
  <body>
    <div id="gallery">
      ${imagePaths.map((imagePath) => `<img src="${imagePath}" />`).join('\n')}
    </div>
  </body>
</html>
`;

writeFile('index.html', content)
  .then(() => {
    console.log('index.html created successfully.');
  })
  .catch((err) => {
    console.error('Error creating index.html:', err);
  });

async function createResizedImage(newSize, imagePath, imageName, endPointFolder, imageSuffix = "altered") {
  const newImageName = `${imageName}_${imageSuffix}.jpg`;
  const outputFilePath = path.join(endPointFolder, newImageName);

  try {
    await sharp(imagePath)
      .resize(newSize, newSize)
      .toFile(outputFilePath, { force: true });

    console.log(`Created resized image: ${outputFilePath}`);

    imagePaths.push(outputFilePath); // Add the image path to the array

    await copyFile(imagePath, path.join(endPointFolder, imageName + '.jpg')); // Copy the original image to the output directory
  } catch (error) {
    console.error(`Error creating resized image: ${error}`);
  }
}

async function processPhotos() {
  try {
    await processDirectory('photos', 'bigImg', 1200, "big");
    await processDirectory('photos', 'smallImg', 300, "small");

    await updateIndexHtml();
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

async function updateIndexHtml() {
  const existingContent = await readFile('index.html', 'utf8');
  console.log('Existing Content:', existingContent);

  // Replace the placeholder <div id="gallery"></div> with the generated <img> tags
  const updatedContent = existingContent.replace('<div id="gallery"></div>', `
    <div id="gallery">
      ${imagePaths.map((imagePath) => `<img src="${imagePath.replace(/\\/g, '/')}">`).join('\n')}
    </div>
  `);
  console.log('Updated Content:', updatedContent);

  await writeFile('index.html', updatedContent);
}

processPhotos();

 

 // console.log(` photos/${photoDirent.name}/${photoName}`, photoName)
          // sharp( `photos/${photoDirent.name}/${photoName}`)
          //   .resize(1200, 1200)
          //   .rotate(10, {background: "#ff0000"})
          //   .toFile((Math.random()*10).floor, function(err) {
          //   });