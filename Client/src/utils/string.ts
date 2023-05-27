export const getMatchingChars = (baseString: string, stringToMatch: string) => {
    const matchingChars: string[] = [];
    stringToMatch.split("").forEach((char) => {
        if (baseString.includes(char)) matchingChars.push(char);
    });
    return matchingChars;
};

export const getMatchingCharLength = (baseString: string, stringToMatch: string) => {
    return getMatchingChars(baseString, stringToMatch).length;
};
