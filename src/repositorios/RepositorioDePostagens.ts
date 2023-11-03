import { Perfil } from "../basicas/Perfil.js";
import { Postagem } from "../basicas/Postagem.js";
import { PostagemAvancada } from "../basicas/PostagemAvancada.js";

export class RepositorioDePostagens {
  private _postagens: Postagem[] = [];

  incluir(postagem: Postagem, perfil: Perfil) {
    this._postagens.push(postagem);
    perfil.postagens.push(postagem)
  }

  consultar(
    id: number | null,
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
        !(postagem instanceof PostagemAvancada && postagem.hashtags.includes(hashtag))
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

/* testes
let repo: RepositorioDePostagens = new RepositorioDePostagens()
let perfil: Perfil = new Perfil(1, 'luiz', 'email@teste.com')
let postagem1: Postagem = new Postagem(1, 'a dalva de mini saia', 0, 0, new Date('3-11-2023'), perfil)
let postagem2: Postagem = new PostagemAvancada(2, 'a dalva bebe esperma', 0, 0, new Date('3-11-2023'), perfil)
repo.incluir(postagem1)
repo.incluir(postagem2)

const postagensFiltradas: Postagem[] = repo.consultar(2, null, null, null)
console.log(postagensFiltradas) */

