import { RepositorioDePerfis } from "./repositorios/RepositorioDePerfis.js";
import { RepositorioDePostagens } from "./repositorios/RepositorioDePostagens.js";
import { Perfil } from "./basicas/Perfil.js";
import { Postagem } from "./basicas/Postagem.js";
import { PostagemAvancada } from "./basicas/PostagemAvancada.js";
export class RedeSocial {
    _repositorioPerfis = new RepositorioDePerfis();
    _repositorioPostagens = new RepositorioDePostagens();
    // teste
    get repositorioPerfis() {
        return this._repositorioPerfis;
    }
    get repositorioPostagens() {
        return this._repositorioPostagens;
    }
    incluirPerfil(perfil) {
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
    consultarPerfil(id, nome, email) {
        return this._repositorioPerfis.consultar(id, nome, email);
    }
    incluirPostagem(postagem) {
        if (this.postagemEhValida(postagem)) {
            this._repositorioPostagens.incluir(postagem);
        }
    }
    postagemEhValida(postagem) {
        if (postagem.id !== null &&
            postagem.texto !== null &&
            postagem.curtidas !== null &&
            postagem.descurtidas !== null &&
            postagem.perfil !== null &&
            postagem.data !== null) {
            if (postagem instanceof PostagemAvancada) {
                return postagem.hashtags !== null;
            }
            return true;
        }
        return false;
    }
    consultarPostagem(id, texto, hashtag, perfil) {
        return this._repositorioPostagens.consultar(id, texto, hashtag, perfil);
    }
    curtirPostagem(id) {
        const postagens = this._repositorioPostagens.consultar(id, null, null, null);
        // garantir que o id sejá único para cada postagem
        let postagem = postagens[0];
        postagem.curtir();
    }
    descurtirPostagem(id) {
        const postagens = this._repositorioPostagens.consultar(id, null, null, null);
        // garantir que o id sejá único para cada postagem
        let postagem = postagens[0];
        postagem.descurtir();
    }
    decrementarVisualizacoes(postagem) {
        if (postagem.visualizacoesRestantes > 0) {
            postagem.diminuirVisualizacoes();
        }
    }
    PostagemPorPerfil(idPerfil) {
        const perfil = this.consultarPerfil(idPerfil, null, null);
        const postagensPerfil = [];
        if (perfil !== null) {
            for (const postagem of perfil.postagens) {
                if (postagem instanceof PostagemAvancada &&
                    postagem.podeSerExibida()) {
                    if (postagem.visualizacoesRestantes > 1) {
                        this.decrementarVisualizacoes(postagem);
                    }
                }
                postagensPerfil.push(postagem);
            }
        }
        return postagensPerfil;
    }
    exibirPostagensPorPerfil(idPerfil) {
        const postagensPerfil = this.PostagemPorPerfil(idPerfil);
        if (postagensPerfil.length > 0) {
            console.log(`\nPostagens do user: `);
            for (const postagem of postagensPerfil) {
                console.log(this.toStringPostagem(postagem));
            }
        }
    }
    postagemPorHashtag(hashtag) {
        const postagensAlvo = this.consultarPostagem(null, null, hashtag, null);
        if (postagensAlvo.length > 0) {
            for (let postagem of postagensAlvo) {
                if (postagem instanceof PostagemAvancada && postagem.podeSerExibida()) {
                    if (postagem.visualizacoesRestantes > 1) {
                        this.decrementarVisualizacoes(postagem);
                    }
                }
            }
        }
        return postagensAlvo;
    }
    formatarData(data) {
        const dia = data.getDate().toString().padStart(2, "0");
        const mes = (data.getMonth() + 1).toString().padStart(2, "0");
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }
    toStringPostagem(postagem) {
        let texto = `user: ${postagem.perfil.nome} em ${this.formatarData(postagem.data)}:\n"${postagem.texto}"\ncurtidas ${postagem.curtidas}, descurtidas ${postagem.descurtidas}`;
        if (postagem instanceof PostagemAvancada) {
            texto += `\nHashtags: ${postagem.hashtags}` +
                `\nVisualizações restantes: ${postagem.visualizacoesRestantes}`;
        }
        return texto;
    }
}
let faceboque = new RedeSocial();
faceboque.incluirPerfil(new Perfil(1, 'zezin do gas', 'zezin@hotmail.com'));
faceboque.incluirPerfil(new Perfil(2, 'zezin do gas2', 'zezin2@hotmail.com'));
faceboque.incluirPerfil(new Perfil(3, 'zezin do gas3', 'zezin3@hotmail.com'));
faceboque.incluirPostagem(new Postagem(1, 'Taticas de guerrilha, vol 1', 100, 500, new Date(), faceboque.consultarPerfil(1, null, null)));
let postagem = new PostagemAvancada(4, '2050 homens ?', 10, 0, new Date(), faceboque.consultarPerfil(3, null, null), ['#carlinhos', '#mamei2050']);
faceboque.incluirPostagem(postagem);
faceboque.exibirPostagensPorPerfil(1);
faceboque.exibirPostagensPorPerfil(2);
faceboque.exibirPostagensPorPerfil(3);
