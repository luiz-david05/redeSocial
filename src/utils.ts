import { question } from 'readline-sync'

export const input = (texto: string) => question(texto)

export const getNumber = (texto: string) => {
    let n = Number(input(texto));

    while (isNaN(n)) {
        n = getNumber(texto);

        while (isNaN(n)) {
            n = getNumber(texto)
        }
    }

    return n
}