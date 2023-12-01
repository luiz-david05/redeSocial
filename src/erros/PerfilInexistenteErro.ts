import { AplicacaoError } from "./AplicacaoError.js";

export class PerfilInexistenteErro extends AplicacaoError {
    constructor(mensagem: string) {
        super(mensagem);
    }
}