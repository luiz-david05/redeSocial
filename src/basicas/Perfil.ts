import { InputInvalidoErro } from "../erros/InputInvalidoErro.js";
import { Postagem } from "./Postagem.js";

export class Perfil {
    constructor(
        private _id: string,
        private _nome: string,
        private _email: string
    ) {
        this.validaDados();
    }

    private _postagens: Postagem[] = [];

    get postagens(): Postagem[] {
        return this._postagens;
    }

    get id() {
        return this._id;
    }

    get nome() {
        return this._nome;
    }

    get email() {
        return this._email;
    }

    private validaDados(): void {
        if (this._id == '' || this._id == undefined) {
            throw new InputInvalidoErro('O id não pode ser vazio');
        }

        if (this._nome == '' || this._nome == undefined) {
            throw new InputInvalidoErro('O nome não pode ser vazio');
        }

        if (this._email == '' || this._email == undefined) {
            throw new InputInvalidoErro('O email não pode ser vazio');
        }
    }
}
