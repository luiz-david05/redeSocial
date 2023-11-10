import { Perfil } from "../basicas/Perfil.js";
import { Postagem } from "../basicas/Postagem.js";
import { PostagemAvancada } from "../basicas/PostagemAvancada.js";

export class RepositorioDePostagens {
    private _postagens: Postagem[] = [];

    get postagens() {
        return this._postagens;
    }

    incluir(postagem: Postagem) {
        this._postagens.push(postagem);
        postagem.perfil.postagens.push(postagem);
    }

    consultar(
        id: string,
        texto: string,
        hashtag: string,
        perfil: Perfil
    ): Postagem[] {
        return this.postagens.filter(
            (postagem) =>
                (id === null || postagem.id == id) &&
                (texto === null || postagem.texto.indexOf(texto) != 1) &&
                (hashtag === null ||
                    (postagem instanceof PostagemAvancada &&
                        postagem.existeHashtag(hashtag))) &&
                (perfil === null || postagem.perfil == perfil)
        );
    }
}
