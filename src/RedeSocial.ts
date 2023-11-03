import { RepositorioDePerfis } from "./repositorios/RepositorioDePerfis.js";
import { RepositorioDePostagens } from "./repositorios/RepositorioDePostagens.js";
import { Perfil } from "./basicas/Perfil.js";
import { Postagem } from "./basicas/Postagem.js";
import { PostagemAvancada } from "./basicas/PostagemAvancada.js";

export class RedeSocial {
  private _repositorioPerfis: RepositorioDePerfis = new RepositorioDePerfis();
  private _repositorioPostagens: RepositorioDePostagens = new RepositorioDePostagens();

  // teste

  get repositorioPerfis() {
    return this._repositorioPerfis;
  }

  get repositorioPostagens() {
    return this._repositorioPostagens;
  }

  incluirPerfil(perfil: Perfil): void {
    // Verifica se todos os atributos do perfil estão preenchidos
    if (perfil.id !== null && perfil.nome !== null && perfil.email !== null) {
      // Verifica se já existe um perfil com o mesmo id
      if (this.repositorioPerfis.consultar(perfil.id, null, null) === null) {
        // Verifica se já existe um perfil com o mesmo nome
        if (this.repositorioPerfis.consultar(null, perfil.nome, null) === null) {
          // Verifica se já existe um perfil com o mesmo email
          if (this.repositorioPerfis.consultar(null, null, perfil.email) === null) {
            // Se todos os testes passarem, inclui o perfil
            this.repositorioPerfis.incluir(perfil);
          }
        }
      }
    }
  }
  

  consultarPerfil(id: number, nome: string, email: string): Perfil {
    return this._repositorioPerfis.consultar(id, nome, email);
  }

  incluirPostagem(postagem: Postagem): void {
    if (this.postagemEhValida(postagem)) {

    }
  }

  private postagemEhValida(postagem: Postagem): boolean {
  if (
    postagem.id !== null &&
    postagem.texto !== null &&
    postagem.curtidas !== null &&
    postagem.descurtidas !== null &&
    postagem.perfil !== null &&
    postagem.data !== null
  ) {
    if (postagem instanceof PostagemAvancada) {
      return postagem.hashtags !== null;
    }
    return true;
  }
  return false;
}


  consultarPostagem(
    id: number,
    texto: string,
    hashtag: string,
    perfil: Perfil
  ): Postagem[] {
    return this._repositorioPostagens.consultar(id, texto, hashtag, perfil);
  }

  curtirPostagem(id: number): void {
    const postagens = this._repositorioPostagens.consultar(
      id,
      null,
      null,
      null
    );

    // garantir que o id sejá único para cada postagem
    let postagem = postagens[0];
    postagem.curtir();
  }

  descurtirPostagem(id: number): void {
    const postagens = this._repositorioPostagens.consultar(
      id,
      null,
      null,
      null
    );

    // garantir que o id sejá único para cada postagem
    let postagem = postagens[0];
    postagem.descurtir();
  }

  decrementarVisualizacoes(postagem: PostagemAvancada): void {
    if (postagem.visualizacoesRestantes > 0) {
      postagem.diminuirVisualizacoes();
    }
  }

  exibirPostagensPerfil(id: number): Postagem[] {
    let perfil = this._repositorioPerfis.consultar(id, null, null);

    for (let postagem of perfil.postagens) {
      if (postagem instanceof PostagemAvancada) {
        if (postagem.visualizacoesRestantes > 1) {
          this.decrementarVisualizacoes(postagem);
        }
      }
    }
    return perfil.postagens;
  }

  exibirPostagensPorHashtag(hashtag: string): PostagemAvancada[] {
    let postagens = this._repositorioPostagens.consultar(null, null, hashtag, null)
    const postagensFiltradas: PostagemAvancada [] = []

    for (let postagem of postagens) {
        if (postagem instanceof PostagemAvancada) {
            if (postagem.visualizacoesRestantes > 1) {
                this.decrementarVisualizacoes(postagem)
                postagensFiltradas.push(postagem)
            }
        }
    }

    return postagensFiltradas
  }

  private formatarData(data: Date): string {
    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");
    const ano = data.getFullYear();
    const hora = data.getHours();
    const minuto = data.getMinutes();

    return `${dia}/${mes}/${ano}: ${hora}/${minuto}`;
  }

  toStringPostagem(postagem: Postagem): string {
    return `\n${postagem.perfil.nome} em ${this.formatarData(postagem.data)}:\n${
      postagem.texto
    }\n curtidas ${postagem.curtidas}, ${postagem.descurtidas}`;
  }
}


// teste

let facetruco: RedeSocial = new RedeSocial()
let perfil: Perfil = new Perfil(1, 'luiz', 'ti@.com')
let perfil2: Perfil = new Perfil(2, 'maconha', 'cannabis@.com')
facetruco.incluirPerfil(perfil)
facetruco.incluirPerfil(perfil2)

console.log(facetruco.repositorioPerfis.perfis)

let postagem: Postagem = new Postagem(1, 'bostil: tanke-o ou deixe-o', 0, 0, new Date(), perfil)
let postagem2: Postagem = new Postagem(2, 'bostil: tanke-o ou deixe-o', 0, 0, new Date(), perfil2)

console.log()

facetruco.incluirPostagem(postagem)
facetruco.incluirPostagem(postagem2)

console.log(facetruco.exibirPostagensPerfil(perfil.id))