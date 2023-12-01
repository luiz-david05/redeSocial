import { AplicacaoError } from "./AplicacaoError.js";

export class InputInvalidoErro extends AplicacaoError {
    constructor(mensagem: string) {
        super(mensagem);
    }
}