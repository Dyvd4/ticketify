export const generateFakePassword = (passwordLength: number) => {
	let fakePassword = "";
	for (let i = 0; i < passwordLength; i++) {
		fakePassword += "*";
	}
	return fakePassword;
};
