import { ValorInvalidoErro } from "../erros/ValorInvalidoErro.js";
import { Perfil } from "./Perfil.js";

export class Postagem {
    constructor(
        private _id: string,
        private _texto: string,
        private _curtidas: number,
        private _descurtidas: number,
        private _data: string,
        private _perfil: Perfil
    ) {
        this.validaDados();
    }

    get id() {
        return this._id;
    }

    get texto() {
        return this._texto;
    }

    get curtidas() {
        return this._curtidas;
    }

    get descurtidas() {
        return this._descurtidas;
    }

    get data() {
        return this._data;
    }

    get perfil() {
        return this._perfil;
    }

    curtir() {
        this._curtidas++;
    }

    descurtir() {
        this._descurtidas++;
    }

    ehPopular(): boolean {
        return this._curtidas > 1.5 * this._descurtidas;
    }

    private validaDados(): void {
        if (this._id == '' || this._id == undefined) {
            throw new ValorInvalidoErro('O id não pode ser vazio');
        }

        if (this._texto == '' || this._texto == undefined) {
            throw new ValorInvalidoErro('O texto não pode ser vazio');
        }

        if (isNaN(this._curtidas) || this._curtidas == undefined) {
            throw new ValorInvalidoErro('O número de curtidas não pode ser vazio, negativo ou não numérico');
        }

        if (isNaN(this._descurtidas) ||this._descurtidas == undefined) {
            throw new ValorInvalidoErro('O número de descurtidas não pode ser vazio, negativo ou não numérico');
        }

        if (this._data == '' || this._data == undefined || this._data == null) {
            throw new ValorInvalidoErro('A data não pode ser vazia');
        }

        if (this._perfil == null || this._perfil == undefined) {
            throw new ValorInvalidoErro('O perfil não pode ser vazio');
        }
    }
}
