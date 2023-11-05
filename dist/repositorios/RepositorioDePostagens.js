import { PostagemAvancada } from "../basicas/PostagemAvancada.js";
export class RepositorioDePostagens {
    _postagens = [];
    get postagens() {
        return this._postagens;
    }
    incluir(postagem) {
        this._postagens.push(postagem);
        postagem.perfil.incluir(postagem);
    }
    consultar(id, texto, hashtag, perfil) {
        return this._postagens.filter((postagem) => {
            if (id !== null && postagem.id !== id) {
                return false;
            }
            if (texto !== null && !postagem.texto.includes(texto)) {
                return false;
            }
            if (hashtag !== null &&
                !(postagem instanceof PostagemAvancada && postagem.existeHashtag(hashtag))) {
                return false;
            }
            if (perfil !== null && postagem.perfil !== perfil) {
                return false;
            }
            return true;
        });
    }
}
