export function isLetter(value: string) {
    return (value >= 'a' && value <= 'z') || (value >= 'A' && value <= 'Z') || value === '_';
}
