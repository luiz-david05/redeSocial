import { PostagemAvancada } from "../basicas/PostagemAvancada.js";
export class RepositorioDePostagens {
    _postagens = [];
    get postagens() {
        return this._postagens;
    }
    incluir(postagem) {
        this._postagens.push(postagem);
        postagem.perfil.postagens.push(postagem);
    }
    consultar(id, texto, hashtag, perfil) {
        return this.postagens.filter((postagem) => (id === null || postagem.id == id) &&
            (texto === null || postagem.texto.indexOf(texto) != 1) &&
            (hashtag === null ||
                (postagem instanceof PostagemAvancada &&
                    postagem.existeHashtag(hashtag))) &&
            (perfil === null || postagem.perfil == perfil));
    }
}
