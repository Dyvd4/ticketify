export function PushIfNotExisting(array: any[], item: any) {
    let itemExists = array.indexOf(item) !== -1;
    if (!itemExists) array.push(item);
    return array;
}

export function ReplaceItem(array: any[], item: any, replaceItem: any) {
    let spliceIndex = array.indexOf(item);
    if (spliceIndex !== -1) array.splice(spliceIndex, 1, replaceItem);
}

export function RemoveItem(array: any[], item: any) {
    let spliceIndex = array.indexOf(item);
    if (spliceIndex !== -1) array.splice(spliceIndex, 1);
}

export function getSmallestMatchingIndex(arr1, arr2) {
    let smallestIndex = -1;
    for (let i = 0; i < arr1.length; i++) {
        let element = arr1[i];
        let index = arr2.indexOf(element);
        if (smallestIndex === -1) smallestIndex = index;
        if (index < smallestIndex) smallestIndex = index;
    }
    return smallestIndex
}
export function getHighestMatchingIndex(arr1, arr2) {
    let highestIndex = -1;
    for (let i = 0; i < arr1.length; i++) {
        let element = arr1[i];
        let index = arr2.indexOf(element);
        if (highestIndex === -1) highestIndex = index;
        if (index > highestIndex) highestIndex = index;
    }
    return highestIndex
}