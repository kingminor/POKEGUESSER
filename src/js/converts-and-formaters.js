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

export function heightToFeetInches(height) {
    if (typeof height !== 'number') {
        throw new Error("Input must be a number");
    }

    // Convert decimeters → meters → feet
    const totalFeet = height * 0.328084; // same factor you used earlier
    const feet = Math.floor(totalFeet);
    const inches = Number(((totalFeet - feet) * 12).toFixed(2));

    return { feet, inches };
}
