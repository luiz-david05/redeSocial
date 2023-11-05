import { RepositorioDePerfis } from "./repositorios/RepositorioDePerfis.js";
import { RepositorioDePostagens } from "./repositorios/RepositorioDePostagens.js";
import { PostagemAvancada } from "./basicas/PostagemAvancada.js";
export class RedeSocial {
    _repositorioPerfis = new RepositorioDePerfis();
    _repositorioPostagens = new RepositorioDePostagens();
    get repositorioPerfis() {
        return this._repositorioPerfis;
    }
    get repositorioPostagens() {
        return this._repositorioPostagens;
    }
    incluirPerfil(perfil) {
        if (perfil.id !== null && perfil.nome !== null && perfil.email !== null) {
            if (this.repositorioPerfis.consultar(perfil.id, null, null) === null) {
                if (this.repositorioPerfis.consultar(null, perfil.nome, null) === null) {
                    if (this.repositorioPerfis.consultar(null, null, perfil.email) === null) {
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
                if (postagem instanceof PostagemAvancada && !postagem.podeSerExibida()) {
                }
                else {
                    postagensPerfil.push(postagem);
                }
            }
        }
        return postagensPerfil;
    }
    toStringPostagem(postagem) {
        let texto = "\n---------------- POSTAGEM ----------------\n";
        texto += `ID do usuário: ${postagem.perfil.id}\n`;
        texto += `Nome: ${postagem.perfil.nome}\n`;
        texto += `Postagem: "${postagem.texto}"\n`;
        texto += `Curtidas: ${postagem.curtidas}, Descurtidas: ${postagem.descurtidas}\n`;
        if (postagem instanceof PostagemAvancada) {
            texto += "Hashtags: ";
            texto += postagem.hashtags.join(", ") + "\n";
            texto += `Vizualizações restantes: ${postagem.visualizacoesRestantes}`;
        }
        texto += "\n---------------- FIM DA POSTAGEM ----------------\n";
        return texto;
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
    obterHashtagsPopulares() {
        const postagens = this._repositorioPostagens.postagens;
        const todasHashtags = [];
        postagens.forEach((postagem) => {
            if (postagem instanceof PostagemAvancada) {
                todasHashtags.push(...postagem.hashtags);
            }
        });
        const countHashtags = new Map();
        todasHashtags.forEach((hashtag) => {
            const count = countHashtags.get(hashtag) || 0;
            countHashtags.set(hashtag, count + 1);
        });
        const hashtagsPopulares = Array.from(countHashtags.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([hashtag]) => hashtag);
        return hashtagsPopulares;
    }
    exibirHashtagsPopulares() {
        console.log("\nHashtags Populares:");
        const hashtagsPopulares = this.obterHashtagsPopulares();
        if (hashtagsPopulares.length > 0) {
            for (let i = 0; i < hashtagsPopulares.length; i++) {
                console.log(`#${hashtagsPopulares[i]}`);
            }
        }
        else {
            console.log("Nenhuma hashtag popular encontrada.");
        }
    }
    formatarData(data) {
        const dia = data.getDate().toString().padStart(2, "0");
        const mes = (data.getMonth() + 1).toString().padStart(2, "0");
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }
    toStringPostagemArquivo(postagem) {
        let tipo = "p";
        if (postagem instanceof PostagemAvancada) {
            tipo = "pa";
        }
        let postagemString = `${tipo};${postagem.id};${postagem.texto};${postagem.curtidas};${postagem.descurtidas};${postagem.data};${postagem.perfil.id}`;
        if (postagem instanceof PostagemAvancada) {
            const hashtagsString = postagem.hashtags.join(",");
            postagemString += `;${hashtagsString};${postagem.visualizacoesRestantes}`;
        }
        return postagemString;
    }
    toStringPerfilArquivo(perfil) {
        return `${perfil.id};${perfil.nome};${perfil.email}`;
    }
    filtrarPostagensPopulares() {
        const postagens = this._repositorioPostagens.postagens;
        const postagensPopulares = postagens
            .filter((postagem) => postagem.ehPopular())
            .sort((a, b) => b.curtidas - a.curtidas);
        return postagensPopulares.slice(0, 10);
    }
}
