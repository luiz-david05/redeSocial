import { question } from 'readline-sync';
import { v4 as uuidv4 } from "uuid";
export const input = (texto) => question(texto);
export const getNumber = (texto) => {
    let n = Number(input(texto));
    while (isNaN(n)) {
        n = getNumber(texto);
    }
    return n;
};
export const limparTela = () => {
    let ask = input("\nLimpar tela? [y]/[n]: ").toLowerCase();
    while (ask != "y" && ask != "n") {
        ask = input("\nLimpar tela? [y]/[n]: ").toLowerCase();
    }
    if (ask == "y") {
        console.log('\n'.repeat(20));
    }
};
export const gerarId = () => uuidv4();
