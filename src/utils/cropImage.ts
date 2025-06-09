export const getCroppedImg = (file: File, croppedAreaPixels: any): Promise<File> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject("Could not get canvas context");
        return;
      }

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
          reject("Canvas is empty");
          return;
        }
        const croppedFile = new File([blob], file.name, { type: file.type });
        resolve(croppedFile);
      }, file.type);
    };

    image.onerror = () => {
      reject("Failed to load image");
    };

    image.src = url;
  });
};
