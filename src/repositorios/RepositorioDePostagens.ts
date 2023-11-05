import { Perfil } from "../basicas/Perfil.js";
import { Postagem } from "../basicas/Postagem.js";
import { PostagemAvancada } from "../basicas/PostagemAvancada.js";

export class RepositorioDePostagens {
  private _postagens: Postagem[] = [];

  get postagens() {
    return this._postagens
  }

  incluir(postagem: Postagem) {
    this._postagens.push(postagem);
    postagem.perfil.incluir(postagem)
  }

  consultar(
    id: string | null,
    texto: string | null,
    hashtag: string | null,
    perfil: Perfil | null
  ): Postagem[] {
    return this._postagens.filter((postagem) => {
      if (id !== null && postagem.id !== id) {
        return false;
      }
      if (texto !== null && !postagem.texto.includes(texto)) {
        return false;
      }
      if (
        hashtag !== null &&
        !(postagem instanceof PostagemAvancada && postagem.existeHashtag(hashtag))
      ) {
        return false;
      }
      if (perfil !== null && postagem.perfil !== perfil) {
        return false;
      }
      return true;
    });
  }
}