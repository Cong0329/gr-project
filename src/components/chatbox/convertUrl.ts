export function dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

export async function imageToFile(imageUrlOrBase64: string, filename: string): Promise<File> {
    if (imageUrlOrBase64.startsWith('data:')) {
        // Base64 → File
        return dataURLtoFile(imageUrlOrBase64, filename);
    } else {
        // URL → tải về blob rồi → File
        const response = await fetch(imageUrlOrBase64);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
    }
}
