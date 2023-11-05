import { RedeSocial } from "./RedeSocial.js";
import { Perfil } from "./basicas/Perfil.js";
import { Postagem } from "./basicas/Postagem.js";
import { PostagemAvancada } from "./basicas/PostagemAvancada.js";
import { getNumber, input } from "./utils.js";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
class App {
    _redeSocial = new RedeSocial();
    static main() {
        let app = new App();
        app.run();
    }
    salvarPerfis() {
        const perfis = this._redeSocial.repositorioPerfis.perfis;
        const perfisParaEscrever = perfis.map((perfil) => {
            return this._redeSocial.toStringPerfilArquivo(perfil);
        });
        fs.writeFileSync("./perfis.txt", "");
        fs.appendFileSync("./perfis.txt", perfisParaEscrever.join("\n"));
    }
    carregarPerfis() {
        const perfisFile = fs
            .readFileSync("./perfis.txt")
            .toString()
            .split("\n");
        for (let perfil of perfisFile) {
            const trimmedPerfil = perfil.trim();
            if (trimmedPerfil !== "") {
                const dadosPerfil = trimmedPerfil.split(";");
                if (dadosPerfil.length === 3) {
                    const [id, nome, email] = dadosPerfil;
                    const novoPerfil = new Perfil(id, nome, email);
                    this._redeSocial.incluirPerfil(novoPerfil);
                }
                else {
                    return;
                }
            }
        }
    }
    salvarPostagens() {
        const postagens = this._redeSocial.repositorioPostagens.postagens;
        const postagensParaEscrever = postagens.map((postagem) => {
            return this._redeSocial.toStringPostagemArquivo(postagem);
        });
        fs.writeFileSync("./postagens.txt", "");
        fs.appendFileSync("./postagens.txt", postagensParaEscrever.join("\n"));
    }
    carregarPostagens() {
        const postagensFile = fs
            .readFileSync("./postagens.txt")
            .toString()
            .split("\n");
        for (let postagem of postagensFile) {
            const trimmedPostagem = postagem.trim();
            if (trimmedPostagem != "") {
                const dadosPostagem = trimmedPostagem.split(";");
                let [tipo, id, texto, curtidas, descurtidas, data, perfilId, hashtags, vizualizacoesRestantes,] = dadosPostagem;
                const hashtagArray = (hashtags || "").split(",");
                let novaPostagem = new Postagem(id, texto, Number(curtidas), Number(descurtidas), data, this._redeSocial.consultarPerfil(perfilId, null, null));
                if (tipo == "pa") {
                    novaPostagem = new PostagemAvancada(id, texto, Number(curtidas), Number(descurtidas), data, this._redeSocial.consultarPerfil(perfilId, null, null), hashtagArray, Number(vizualizacoesRestantes));
                }
                this._redeSocial.incluirPostagem(novaPostagem);
            }
        }
    }
    getTipoPostagem() {
        console.log("Tipo de postagem: [P] - Postagem, [PA] -Postagem Avançada ");
        let tipo = input("tipo: ").toLowerCase().trim();
        while (tipo != "p" && tipo != "pa") {
            tipo = input("tipo: ").toLowerCase().trim();
        }
        return tipo;
    }
    criarPostagem() {
        console.log("\nCriar postagem\n");
        let id = this.gerarId();
        let tipo = this.getTipoPostagem();
        let nomeUser = input("Nome do usuário: ");
        let texto = input("Texto da postagem: ");
        let perfil = this._redeSocial.consultarPerfil(null, nomeUser, null);
        if (texto == "") {
            return;
        }
        let postagem;
        if (tipo == "p") {
            postagem = new Postagem(id, texto, 0, 0, this._redeSocial.formatarData(new Date()), perfil);
        }
        else if (tipo == "pa") {
            console.log("Deseja adicionar hashtags ? [s]/[n]");
            let resposta = input("resposta: ");
            const hashtags = [];
            while (resposta === "s") {
                let hashtag = input("Digite uma hashtag: ");
                hashtags.push(hashtag);
                console.log("Deseja adicionar outra hashtag? [s]/[n]");
                resposta = input("resposta: ");
            }
            postagem = new PostagemAvancada(id, texto, 0, 0, this._redeSocial.formatarData(new Date()), perfil, hashtags, 1000);
        }
        this._redeSocial.incluirPostagem(postagem);
    }
    criarPerfil() {
        console.log("\nCriar perfil\n");
        let id = this.gerarId();
        let nome = input("nome do perfil: ");
        if (nome === "") {
            return;
        }
        let email = input("email do perfil: ");
        if (email === "" || !email.includes("@")) {
            return;
        }
        this._redeSocial.incluirPerfil(new Perfil(id, nome, email));
        console.log("Perfil criado com sucesso!");
    }
    gerarId() {
        return uuidv4();
    }
    exibirPostagensPopulares() {
        console.log("\n\t--- POSTAGENS POPULARES ---\n");
        const postagensPopulares = this._redeSocial.filtrarPostagensPopulares();
        if (postagensPopulares.length > 0) {
            for (let i = 0; i < postagensPopulares.length; i++) {
                const postagem = postagensPopulares[i];
                if (postagem instanceof PostagemAvancada && postagem.podeSerExibida) {
                    this._redeSocial.decrementarVisualizacoes(postagem);
                }
                console.log(`Postagem ${i + 1}:\n${this._redeSocial.toStringPostagem(postagem)}\n`);
                if ((i + 1) % 3 === 0 && i < postagensPopulares.length - 1) {
                    input("\nPressione Enter para ver mais postagens...\n");
                }
            }
        }
        else {
            console.log("Não há postagens populares para exibir.");
        }
    }
    exibirFeedPostagens() {
        console.log("\n\t-------FEED DE POSTAGENS--------\n");
        const postagens = this._redeSocial.repositorioPostagens.postagens;
        if (postagens.length > 0) {
            for (let i = 0; i < postagens.length; i++) {
                const postagem = postagens[i];
                if (postagem instanceof PostagemAvancada && postagem.podeSerExibida) {
                    this._redeSocial.decrementarVisualizacoes(postagem);
                }
                console.log(`Postagem ${i + 1}:\n${this._redeSocial.toStringPostagem(postagem)}\n`);
                if ((i + 1) % 3 === 0 && i < postagens.length - 1) {
                    input("\nPressione Enter para ver mais postagens...\n");
                }
            }
        }
        else {
            console.log("Não há postagens para exibir.");
        }
    }
    exibirHashtagsPopulares() {
        this._redeSocial.exibirHashtagsPopulares();
    }
    exibirPostagensPorPerfil() {
        let nome = input("Nome do usuário: ");
        let perfil = this._redeSocial.consultarPerfil(null, nome, null);
        const postagens = this._redeSocial.PostagemPorPerfil(perfil.id);
        console.log("\n\t-------POSTAGENS DO PERFIL--------\n");
        if (postagens.length > 0) {
            for (let i = 0; i < postagens.length; i++) {
                const postagem = postagens[i];
                if (postagem instanceof PostagemAvancada && postagem.podeSerExibida()) {
                    this._redeSocial.decrementarVisualizacoes(postagem);
                }
                console.log(`Postagem ${i + 1}:\n${this._redeSocial.toStringPostagem(postagem)}\n`);
                if ((i + 1) % 3 === 0 && i < postagens.length - 1) {
                    input("\nPressione Enter para ver mais postagens...\n");
                }
            }
        }
        else {
            console.log("Não há postagens para exibir.");
        }
    }
    exibirPostagensPorHashtag() {
        let hashtag = input("Hashtag para a pesquisa: #");
        const postagens = this._redeSocial.postagemPorHashtag(hashtag);
        if (postagens.length > 0) {
            for (let i = 0; i < postagens.length; i++) {
                const postagem = postagens[i];
                console.log(`Postagem ${i + 1}:\n${this._redeSocial.toStringPostagem(postagem)}\n`);
                if ((i + 1) % 3 === 0 && i < postagens.length - 1) {
                    input("\nPressione Enter para ver mais postagens...\n");
                }
            }
        }
        else {
            console.log("Não há postagens para exibir.");
        }
    }
    menu() {
        console.log("\nOpções disponíveis: ");
        const texto = `\n\t1 - Criar perfil\n` +
            `\t2 - Criar postagem\n` +
            `\t3 - Exibir postagens populares\n` +
            `\t4 - Exibir Feed de postagens\n` +
            `\t5 - Exibir Hashtags Populares\n` +
            `\t6 - Exibir Postagens por perfil\n` +
            `\t0 - Sair`;
        console.log(texto);
    }
    run() {
        console.log("Carregando dados da aplicação...");
        input("\nenter para continuar...");
        try {
            this.carregarPerfis();
            this.carregarPostagens();
            let qtdPerfisOnline = this._redeSocial.repositorioPerfis.perfis.length;
            console.log("\nDados carregados com sucesso!\n");
            console.log(`\nQuantidade de camaradas online: ${qtdPerfisOnline}`);
            console.log("\nSeja bem vindo ao Ancapistão!");
        }
        catch (error) {
            console.log(`\nSabotaram os dados: ${error}`);
        }
        console.log("\t================================");
        console.log("\t||         ANCAPISTÃO         ||");
        console.log("\t================================");
        let opcao;
        do {
            input("\nenter to continue...");
            this.menu();
            opcao = getNumber("\nSelecione uma opção: ");
            switch (opcao) {
                case 0:
                    break;
                case 1:
                    this.criarPerfil();
                    break;
                case 2:
                    this.criarPostagem();
                    break;
                case 3:
                    this.exibirPostagensPopulares();
                    break;
                case 4:
                    this.exibirFeedPostagens();
                    break;
                case 5:
                    this.exibirHashtagsPopulares();
                    break;
                case 6:
                    this.exibirPostagensPorPerfil();
                    break;
                default:
                    console.log("Opção inválida");
            }
        } while (opcao != 0);
        this.salvarPerfis();
        this.salvarPostagens();
        console.log("\nAPLICAÇÃO FINALIZADA!");
    }
}
App.main();
