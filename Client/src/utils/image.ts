export const createDataUrl = (blob: Blob) => {
	return new Promise<string | null | undefined>((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.onload = (e) => {
			resolve(e.target?.result as string);
		};
		fileReader.readAsDataURL(blob);
	});
};

export const getDataUrl = (base64: string, mimeType?: string) =>
	`data:${mimeType};base64,${base64}`;
