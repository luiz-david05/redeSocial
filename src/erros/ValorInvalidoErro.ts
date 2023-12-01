import { AplicacaoError } from "./AplicacaoError.js";

export class ValorInvalidoErro extends AplicacaoError {
    constructor(mensagem: string) {
        super(mensagem);
    }
}
