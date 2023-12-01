import { AplicacaoError } from "./AplicacaoError.js";

class PostagemInexistenteErro extends AplicacaoError {
    constructor(mensagem: string) {
        super(mensagem);
    }
}