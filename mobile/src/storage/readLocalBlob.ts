// Firebase combines native Blobs with multipart headers. React Native's Blob
// constructor cannot combine those headers with an ArrayBuffer or typed array.
export function readLocalBlob(uri: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const readError = () => reject(new Error('Could not read the attachment. Choose the file again.'));

    request.open('GET', uri);
    request.responseType = 'blob';
    request.onload = () => {
      const blob = request.response;
      if (
        (request.status === 200 || request.status === 0) &&
        blob instanceof Blob &&
        blob.size > 0
      ) {
        resolve(blob);
      } else {
        readError();
      }
    };
    request.onerror = readError;
    request.onabort = readError;
    request.send();
  });
}
