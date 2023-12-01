import { RepositorioDePerfis } from "./repositorios/RepositorioDePerfis.js";
import { RepositorioDePostagens } from "./repositorios/RepositorioDePostagens.js";
import { Perfil } from "./basicas/Perfil.js";
import { Postagem } from "./basicas/Postagem.js";
import { PostagemAvancada } from "./basicas/PostagemAvancada.js";
import chalk from "chalk";
import * as utils from "./utils.js";
import { PerfilJaExisteError } from "./erros/PerfilJaExisteError.js";

export class RedeSocial {
    private _repositorioPerfis: RepositorioDePerfis = new RepositorioDePerfis();
    private _repositorioPostagens: RepositorioDePostagens =
        new RepositorioDePostagens();

    get repositorioPerfis() {
        return this._repositorioPerfis;
    }

    get repositorioPostagens() {
        return this._repositorioPostagens;
    }
    
    consultarPerfil(id: string, nome: string, email: string): Perfil {
        return this._repositorioPerfis.consultar(id, nome, email);
    }

    incluirPerfil(perfil: Perfil): void {
        try {
            this.consultarPerfil(perfil.id, perfil.nome, perfil.email);
            throw new PerfilJaExisteError('Perfil já existe!');
        } catch (e: any) {
            if (e instanceof PerfilJaExisteError) {
                throw e;
            } else {
                this._repositorioPerfis.incluir(perfil);
            }
        }
    }


    incluirPostagem(postagem: Postagem): boolean {
            if (
                this.consultarPostagem(postagem.id, null, null, null).length ==
                0
            ) {
                this._repositorioPostagens.incluir(postagem);
                return true;
            }

        return false;
    }

    consultarPostagem(
        id: string,
        texto: string,
        hashtag: string,
        perfil: Perfil
    ): Postagem[] {
        return this._repositorioPostagens.consultar(id, texto, hashtag, perfil);
    }

    curtirPostagem(idPostagem: string): boolean {
        const postagens = this._repositorioPostagens.consultar(
            idPostagem,
            null,
            null,
            null
        );

        postagens.forEach((postagem) => {
            if (
                postagem instanceof PostagemAvancada &&
                postagem.visualizacoesRestantes === 0
            ) {
                return false;
            }

            postagem.curtir();
        });

        return true;
    }

    descurtirPostagem(idPostagem: string): boolean {
        const postagens = this._repositorioPostagens.consultar(
            idPostagem,
            null,
            null,
            null
        );

        postagens.forEach((postagem) => {
            if (
                postagem instanceof PostagemAvancada &&
                postagem.visualizacoesRestantes === 0
            ) {
                return false;
            }

            postagem.descurtir();
        });

        return true;
    }

    decrementarVisualizacoes(postagem: PostagemAvancada): void {
        if (postagem.visualizacoesRestantes > 0) {
            postagem.diminuirVisualizacoes();
        }
    }

    exibirPostagensPorPerfil(idPerfil: string): Postagem[] {
        const perfil = this.consultarPerfil(idPerfil, null, null);
        const postagensPerfil: Postagem[] = [];

        perfil.postagens.forEach((postagem) => {
            if (
                postagem instanceof PostagemAvancada &&
                postagem.visualizacoesRestantes > 0
            ) {
                postagensPerfil.push(postagem);
            }

            if (postagem instanceof PostagemAvancada) {
                this.decrementarVisualizacoes(postagem);
            } else if (postagem instanceof Postagem) {
                postagensPerfil.push(postagem);
            }
        });

        return postagensPerfil;
    }

    exibirPostagensPorHashtag(hashtag: string): PostagemAvancada[] {
        const postagens: Postagem[] = this.consultarPostagem(
            null,
            null,
            hashtag,
            null
        );
        const postagensHashtag: PostagemAvancada[] = [];

        postagens.forEach((postagem) => {
            if (
                postagem instanceof PostagemAvancada &&
                postagem.visualizacoesRestantes > 0
            ) {
                postagensHashtag.push(postagem);
            }

            if (postagem instanceof PostagemAvancada) {
                this.decrementarVisualizacoes(postagem);
            }
        });

        return postagensHashtag;
    }

    exibirPostagensPopulares(): Postagem[] {
        const postagens = this._repositorioPostagens.postagens;
        const postagensPopulares: Postagem[] = [];

        postagens.forEach((postagem) => {
            if (
                postagem instanceof PostagemAvancada &&
                postagem.visualizacoesRestantes > 0 &&
                postagem.ehPopular()
            ) {
                postagensPopulares.push(postagem);
            }

            if (postagem instanceof PostagemAvancada) {
                this.decrementarVisualizacoes(postagem);
            } else if (postagem instanceof Postagem && postagem.ehPopular()) {
                postagensPopulares.push(postagem);
            }

            // ordenando os elementos de acordo com o número de curtidas
            postagensPopulares.sort((a, b) => b.curtidas - a.curtidas);
        });

        // retorna até as 10 mais populares
        return postagensPopulares.slice(0, 10);
    }

    obterHashtagsPopulares(): string[] {
        const postagens = this._repositorioPostagens.postagens;

        const todasHashtags: string[] = [];

        postagens.forEach((postagem) => {
            if (
                postagem instanceof PostagemAvancada &&
                postagem.visualizacoesRestantes > 0
            ) {
                todasHashtags.push(...postagem.hashtags);
            }
        });

        const countHashtags = new Map<string, number>();
        todasHashtags.forEach((hashtag) => {
            const count = countHashtags.get(hashtag);
            countHashtags.set(hashtag, count + 1);
        });

        const hashtagsPopulares = Array.from(countHashtags.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([hashtag]) => hashtag);

        return hashtagsPopulares;
    }

    exibirHashtagsPopulares(): void {
        console.log("\nHashtags Populares:\n");

        const hashtagsPopulares = this.obterHashtagsPopulares();

        if (hashtagsPopulares.length > 0) {
            for (let i = 0; i < hashtagsPopulares.length; i++) {
                console.log(chalk.blue(`${i + 1}° ${hashtagsPopulares[i]}`));
            }
        } else {
            console.log("\nNenhuma hashtag popular encontrada!");
        }
    }

    exibirFeedPostagens(): Postagem[] {
        const postagens = this._repositorioPostagens.postagens;
        const postagensFeed: Postagem[] = [];

        postagens.forEach((postagem) => {
            if (
                postagem instanceof PostagemAvancada &&
                postagem.visualizacoesRestantes > 0
            ) {
                postagensFeed.push(postagem);
            }

            if (postagem instanceof PostagemAvancada) {
                this.decrementarVisualizacoes(postagem);
            } else if (postagem instanceof Postagem) {
                postagensFeed.push(postagem);
            }

            postagensFeed.sort((a, b) => b.curtidas - a.curtidas);
        });

        return postagensFeed;
    }

    excluirPerfil(nome: string): boolean {
        const perfil = this.consultarPerfil(null, nome, null);

        if (perfil !== null) {
            const index = this._repositorioPerfis.perfis.indexOf(perfil);
            this._repositorioPerfis.perfis.splice(index, 1);

            return true;
        }
        return false;
    }

    excluirPostagem(id: string): boolean {
        const postagens = this.consultarPostagem(id, null, null, null);

        if (postagens.length === 1) {
            postagens.forEach((postagem) => {
                const index =
                    this._repositorioPostagens.postagens.indexOf(postagem);
                this._repositorioPostagens.postagens.splice(index, 1);
    
            });
            return true;
        }
        return false;
    }

    criarPerfilAletorio(): Perfil {
        const nomes = [
            "Orca",
            "Crocodilo",
            "Urso marrom",
            "Urso polar",
            "Gorila",
            "Lobo cinzento",
            "Hipopótamo",
            "Dragão de Komodo",
            "Tubarão branco",
            "Hiena",
            "Tartaruga mordedora",
            "Leopardo",
            "Tigre siberiano",
            "Pantera negra",
            "Onça pintada",
            "Sucuri",
            "Águia cabeça branca",
            "Guepardo",
            "Leão",
        ];

        const dominios = ["gmail", "hotmail", "outlook"];

        const id = utils.gerarId();
        const nome = nomes[Math.floor(Math.random() * nomes.length)];
        const email = `${nome}@${
            dominios[Math.floor(Math.random() * dominios.length)]
        }.com`;

        const perfil = new Perfil(id, nome, email);

        return perfil;
    }

    // metodos tostring objetos
    toStringPostagem(postagem: Postagem): string {
        let texto =
            chalk.underline(
                "\n---------------- POSTAGEM ------------------------\n"
            ) +
            chalk.whiteBright("\nid postagem: ") +
            chalk.yellowBright(postagem.id) +
            chalk.whiteBright(`\n${postagem.perfil.nome}`) +
            chalk.gray(`\t@${postagem.perfil.nome}\n`) +
            `Postagem feita em: ${postagem.data}\n` +
            `Post: ` +
            chalk.greenBright(`"${postagem.texto}"\n`) +
            `Curtidas: ` +
            chalk.yellowBright(`${postagem.curtidas}, `) +
            `Descurtidas: ` +
            chalk.yellowBright(`${postagem.descurtidas}`) +
            "\n";

        if (postagem instanceof PostagemAvancada) {
            texto += "Hashtags: ";
            texto +=
                postagem.hashtags
                    .map((hashtag) => chalk.blue(`${hashtag}`))
                    .join(", ") + "\n";
            texto +=
                `Vizualizações restantes: ` +
                chalk.yellowBright(`${postagem.visualizacoesRestantes}`) +
                "\n";
        }

        texto += chalk.underline(
            "\n--------------- FIM DA POSTAGEM ------------------"
        );
        return texto;
    }

    toStringPerfil(perfil: Perfil) {
        let texto =
            chalk.underline(
                `\n -------------------- Perfil --------------------\n`
            ) +
            chalk.whiteBright(`\nid: `) +
            chalk.yellowBright(perfil.id) +
            chalk.whiteBright(`\nnome: `) +
            chalk.green(perfil.nome) +
            chalk.whiteBright(`\ne-mail: `) +
            chalk.red(perfil.email);

        return texto;
    }

    formatarData(data: Date): string {
        const dia = data.getDate().toString().padStart(2, "0");
        const mes = (data.getMonth() + 1).toString().padStart(2, "0");
        const ano = data.getFullYear();

        return `${dia}/${mes}/${ano}`;
    }

    // metodos tostring arquivo
    toStringPerfilArquivo(perfil: Perfil) {
        return `${perfil.id};${perfil.nome};${perfil.email}`;
    }

    toStringPostagemArquivo(postagem: Postagem): string {
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
}
