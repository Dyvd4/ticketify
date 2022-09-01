export const createDataUrl = (blob: Blob) => {
    return new Promise<string | null | undefined>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            resolve(e.target?.result as string);
        }
        fileReader.readAsDataURL(blob);
    });
}