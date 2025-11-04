export function weightToPounds(weight){
    if(typeof weight != 'number'){
        throw new Error("Input must be a number");
    }
    return Number((weight * 0.2204623).toFixed(2));
}

export function weightToKilograms(weight) {
    if(typeof weight != 'number'){
        throw new Error("Input must be a number");
    }
    return Number((weight * 0.1).toFixed(2));
}

export function heightToMeters(height) {
    if (typeof height != 'number') {
        throw new Error("Input must be a number");
    }
    return Number((height / 10).toFixed(2));
}

export function heightToFeet(height) {
    if (typeof height != 'number') {
        throw new Error("Input must be a number");
    }
    return Number((height * 0.328084).toFixed(2));
}