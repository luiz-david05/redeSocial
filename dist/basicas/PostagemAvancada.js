import { Postagem } from "./Postagem.js";
export class PostagemAvancada extends Postagem {
    constructor(id, texto, curtidas, descurtidas, data, perfil) {
        super(id, texto, curtidas, descurtidas, data, perfil);
    }
    _hashtags = [];
    _visualizacoesRestantes = 1000;
    get hashtags() {
        return this._hashtags;
    }
    get visualizacoesRestantes() {
        return this._visualizacoesRestantes;
    }
    adicionarHashtag(hashtag) {
        if (!this.existeHashtag(hashtag)) {
            this._hashtags.push(hashtag);
            return true;
        }
        return false;
    }
    existeHashtag(hashtag) {
        return this._hashtags.includes(hashtag);
    }
    diminuirVisualizacoes() {
        this._visualizacoesRestantes--;
    }
}
