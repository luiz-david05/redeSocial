import { question } from 'readline-sync';
export const input = (texto) => question(texto);
export const getNumber = (texto) => {
    let n = Number(input(texto));
    while (isNaN(n)) {
        n = getNumber(texto);
        while (isNaN(n)) {
            n = getNumber(texto);
        }
    }
    return n;
};
