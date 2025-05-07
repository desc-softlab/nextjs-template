/* eslint-disable @typescript-eslint/no-explicit-any */

import Pica from 'pica';

export const resizeImage = async (file: Blob): Promise<Blob> => {
     const pica = new Pica();
     const img = new Image();
     img.src = URL.createObjectURL(file);

     await new Promise((resolve) => (img.onload = resolve));

     const canvas = document.createElement('canvas');
     canvas.width = img.width; // Use the original width
     canvas.height = img.height; // Use the original height

  // Skip resizing if dimensions are identical
     if (img.width === canvas.width && img.height === canvas.height) {
     return file; // Return the original file if no resizing is needed
     }

  // Perform resizing
     await pica.resize(img, canvas, {
     quality: 3, // Highest quality
     unsharpAmount: 80, // Sharpening
     unsharpThreshold: 10,
     });

  // Output the image in the same format with the highest quality
     const originalType = file.type || 'image/png'; // Fallback to 'image/png'
     const blob = await pica.toBlob(canvas, originalType, 1); // 1 for maximum quality
     return blob;
};

export const getCroppedImg = async (imageSrc: string, croppedAreaPixels: any) => {
   return new Promise<string>((resolve, reject) => {
       const image = new Image();
       image.crossOrigin = "anonymous"; // Avoid CORS issues if using remote images
       image.src = imageSrc;

       image.onload = () => {
           const canvas = document.createElement("canvas");
           const ctx = canvas.getContext("2d");

           if (!ctx) {
               reject(new Error("Failed to create canvas context"));
               return;
           }

           canvas.width = croppedAreaPixels.width;
           canvas.height = croppedAreaPixels.height;

           ctx.drawImage(
               image,
               croppedAreaPixels.x,
               croppedAreaPixels.y,
               croppedAreaPixels.width,
               croppedAreaPixels.height,
               0,
               0,
               croppedAreaPixels.width,
               croppedAreaPixels.height
           );

           canvas.toBlob((blob) => {
               if (!blob) {
                   reject(new Error("Canvas is empty"));
                   return;
               }
               resolve(URL.createObjectURL(blob));
           }, "image/jpeg");
       };

       image.onerror = (error) => reject(error);
   });
};