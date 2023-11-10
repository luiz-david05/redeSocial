import { RedeSocial } from "./RedeSocial.js";
import { Perfil } from "./basicas/Perfil.js";
import { Postagem } from "./basicas/Postagem.js";
import { PostagemAvancada } from "./basicas/PostagemAvancada.js";
import * as utils from "./utils.js";
import * as fs from "fs";
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
            const dadosPerfil = perfil.split(";");
            const [id, nome, email] = dadosPerfil;
            let novoPerfil = new Perfil(id, nome, email);
            this._redeSocial.incluirPerfil(novoPerfil);
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
    criarPerfil() {
        const id = utils.gerarId();
        const nome = utils.input("Insira o nome: ");
        if (nome == "") {
            // incluir erro
            console.log("\nNome vazio ou inválido!");
            return;
        }
        const email = utils.input("Insira o e-mail: ");
        const perfil = new Perfil(id, nome, email);
        if (this._redeSocial.incluirPerfil(perfil)) {
            console.log("\nPerfil inserido com sucesso!");
        }
        else {
            console.log("\nErro ao incluir perfil!");
        }
    }
    criarPostagem() {
        const id = utils.gerarId();
        const nomePerfil = utils.input("Insira o nome do perfil: ");
        if (nomePerfil == "") {
            console.log("\nNome vazio ou inválido!");
            return;
        }
        const perfil = this._redeSocial.consultarPerfil(null, nomePerfil, null);
        if (perfil === null) {
            console.log("\nPerfil não encontrado!");
            return;
        }
        const texto = utils.input("Insira o texto da postagem: ");
        let tipo = utils.input("Insira o tipo da postagem: [p] - postagem normal / [pa] postagem avançada: ");
        if (tipo == "") {
            console.log("\nTipo da postagem vazio ou inválido!");
            return;
        }
        let postagem;
        if (tipo == "p") {
            postagem = new Postagem(id, texto, 0, 0, this._redeSocial.formatarData(new Date()), perfil);
        }
        else {
            postagem = new PostagemAvancada(id, texto, 0, 0, this._redeSocial.formatarData(new Date()), perfil, [], 300);
            while (true) {
                console.log("\nInsira: #nome_da_hashtag");
                let hashtag = utils.input("hashtag: ");
                if (postagem instanceof PostagemAvancada) {
                    postagem.adicionarHashtag(hashtag);
                }
                let outra = utils.input("Deseja adicionar mais hashtags? [s]/[n]: ");
                if (outra == "s") {
                    continue;
                }
                else {
                    break;
                }
            }
        }
        if (this._redeSocial.incluirPostagem(postagem)) {
            console.log("\nPostagem inserida com sucesso!");
        }
        else {
            console.log("\nErro ao incluir Postagem!");
        }
    }
    consultarPerfil() {
        const nomePerfil = utils.input("Nome do perfil para a consulta: ");
        if (nomePerfil == "") {
            console.log("\nNome vazio ou inválido!");
            return;
        }
        const perfil = this._redeSocial.consultarPerfil(null, nomePerfil, null);
        if (perfil !== null) {
            console.log(this._redeSocial.toStringPerfil(perfil));
        }
        else {
            console.log("\nPerfil não encontrado!");
        }
    }
    consultarPostagem() {
        const idPostagem = utils.input("ID da postagem para pesquisa: ");
        if (idPostagem == "") {
            console.log("\nID vazio ou inválido!");
            return;
        }
        const postagens = this._redeSocial.consultarPostagem(idPostagem, null, null, null);
        if (postagens.length === 1) {
            postagens.forEach((postagem) => {
                if (postagem instanceof PostagemAvancada &&
                    postagem.visualizacoesRestantes > 0) {
                    this._redeSocial.decrementarVisualizacoes(postagem);
                    console.log(this._redeSocial.toStringPostagem(postagem));
                }
                else if (postagem instanceof PostagemAvancada &&
                    postagem.visualizacoesRestantes === 0) {
                    console.log("\nPostagem sem vizualições restantes!");
                    return;
                }
                console.log(this._redeSocial.toStringPostagem(postagem));
            });
        }
        else {
            console.log("\nPostagem não encontrada!");
        }
    }
    curtirPostagem() {
        const idPostagem = utils.input("ID da postagem para curtir: ");
        const postagens = this._redeSocial.consultarPostagem(idPostagem, null, null, null);
        if (idPostagem == "") {
            console.log("\nID vazio ou inválido!");
            return;
        }
        if (postagens.length === 0) {
            console.log("\nPostagem não encontrada!");
            return;
        }
        if (this._redeSocial.curtirPostagem(idPostagem)) {
            postagens.forEach((postagem) => {
                if (postagem instanceof PostagemAvancada &&
                    postagem.visualizacoesRestantes > 0) {
                    this._redeSocial.decrementarVisualizacoes(postagem);
                }
                else if (postagem instanceof PostagemAvancada &&
                    postagem.visualizacoesRestantes === 0) {
                    console.log("\nPostagem sem vizualições restantes!");
                    return;
                }
                console.log(`\nPostagem curtida!`);
                console.log(this._redeSocial.toStringPostagem(postagem));
            });
        }
    }
    descurtirPostagem() {
        const idPostagem = utils.input("ID da postagem para descurtir: ");
        const postagens = this._redeSocial.consultarPostagem(idPostagem, null, null, null);
        if (idPostagem == "") {
            console.log("\nID vazio ou inválido!");
            return;
        }
        if (postagens.length === 0) {
            console.log("\nPostagem não encontrada!");
            return;
        }
        if (this._redeSocial.descurtirPostagem(idPostagem)) {
            postagens.forEach((postagem) => {
                if (postagem instanceof PostagemAvancada &&
                    postagem.visualizacoesRestantes > 0) {
                    this._redeSocial.decrementarVisualizacoes(postagem);
                }
                else if (postagem instanceof PostagemAvancada &&
                    postagem.visualizacoesRestantes === 0) {
                    console.log("\nPostagem sem vizualições restantes!");
                    return;
                }
                console.log(`\nPostagem descurtida!`);
                console.log(this._redeSocial.toStringPostagem(postagem));
            });
        }
    }
    exibirPostagensPorPerfil() {
        const nome = utils.input("Nome do perfil: ");
        if (nome === '') {
            console.log("\nNome vazio ou inválido!");
            return;
        }
        const perfil = this._redeSocial.consultarPerfil(null, nome, null);
        if (perfil === null) {
            console.log("\nPerfil não encontrado");
            return;
        }
        const postagensPerfil = this._redeSocial.exibirPostagensPorPerfil(perfil.id);
        if (postagensPerfil.length > 0) {
            console.log("\nPostagens do perfil:");
            for (let i = 0; i < postagensPerfil.length; i++) {
                console.log(`\nPostagem n° ${i + 1}`);
                console.log(this._redeSocial.toStringPostagem(postagensPerfil[i]));
                utils.input("\nenter para visualizar a próxima postagem...");
            }
            console.log("\nSem postagens restantes!");
        }
        else {
            console.log("\nPerfil sem postagens para exibir!");
        }
    }
    exibirPostagensPorHashtag() {
        const hashtag = utils.input("Insira a hashtag: ");
        if (hashtag === '' || !hashtag.includes("#")) {
            console.log("\nHashtag vazia ou inválida!");
            return;
        }
        const postagensHashtag = this._redeSocial.exibirPostagensPorHashtag(hashtag);
        if (postagensHashtag.length > 0) {
            console.log("\nPostagens do perfil:");
            for (let i = 0; i < postagensHashtag.length; i++) {
                console.log(`\nPostagem n° ${i + 1}`);
                console.log(this._redeSocial.toStringPostagem(postagensHashtag[i]));
                utils.input("\nenter para visualizar a próxima postagem...");
            }
            console.log("\nSem postagens restantes!");
        }
        else {
            console.log("\nSem postagens com a hashtag para exibir!");
        }
    }
    exibirPostagensPopulares() {
        const postagensPopulares = this._redeSocial.exibirPostagensPopulares();
        if (postagensPopulares.length > 0) {
            console.log("\nPostagens do perfil:");
            for (let i = 0; i < postagensPopulares.length; i++) {
                console.log(`\nPostagem n° ${i + 1}`);
                console.log(this._redeSocial.toStringPostagem(postagensPopulares[i]));
                utils.input("\nenter para visualizar a próxima postagem...");
            }
            console.log("\nSem postagens restantes!");
        }
        else {
            console.log("\nSem postagens com a hashtag para exibir!");
        }
    }
    exibirHashtagsPopulares() {
        this._redeSocial.exibirHashtagsPopulares();
    }
    exibirFeedPostagens() {
        const postagensFeed = this._redeSocial.exibirFeedPostagens();
        if (postagensFeed.length > 0) {
            for (let i = 0; i < postagensFeed.length; i++) {
                console.log(this._redeSocial.toStringPostagem(postagensFeed[i]));
                utils.input("\nenter para visualizar a próxima postagem...");
            }
            console.log("\nSem postagens restantes!");
        }
        else {
            console.log("\nSem postagens para exibir, crie alguma(s)!");
        }
    }
    menu() {
        console.log("\nOpções disponíveis: ");
        const texto = `\n\t1 - Criar perfil\n` +
            `\t2 - Criar postagem\n` +
            `\t3 - Consultar perfil\n` +
            `\t4 - Consultar postagem\n` +
            `\t5 - Curtir postagem\n` +
            `\t6 - Descurtir postagem\n` +
            `\t7 - Vizualizar postagens de um perfil\n` +
            `\t8 - Vizualizar postagens com uma hashtag específica\n` +
            `\t9 - Exibir postagens populares (maior número\n\t    de curtidas em relação as descurtidas)\n` +
            `\t10 - Exibir hashtags populares\n` +
            `\t11 - Exibir feed de postagens\n` +
            `\t0 - Sair`;
        console.log(texto);
    }
    run() {
        console.log("Carregando dados da aplicação...");
        utils.input("\nenter para continuar...");
        try {
            this.carregarPerfis();
            this.carregarPostagens();
            let qtdPerfisOnline = this._redeSocial.repositorioPerfis.perfis.length;
            console.log("\nDados carregados com sucesso!\n");
            console.log(`\nQuantidade de perfis online: ${qtdPerfisOnline}`);
            console.log("\nSeja bem vindo(a)!");
        }
        catch (error) {
            console.log(error);
        }
        const logo = "FACEBOQUE";
        console.log("\t================================");
        console.log(`\t||         ${logo}         ||`);
        console.log("\t================================");
        let opcao;
        do {
            utils.input("\nenter to continue...");
            this.menu();
            opcao = utils.getNumber("\nSelecione uma opção: ");
            switch (opcao) {
                case 0:
                    this.salvarPerfis();
                    this.salvarPostagens();
                    break;
                case 1:
                    this.criarPerfil();
                    break;
                case 2:
                    this.criarPostagem();
                    break;
                case 3:
                    this.consultarPerfil();
                    break;
                case 4:
                    this.consultarPostagem();
                    break;
                case 5:
                    this.curtirPostagem();
                    break;
                case 6:
                    this.descurtirPostagem();
                    break;
                case 7:
                    this.exibirPostagensPorPerfil();
                    break;
                case 8:
                    this.exibirPostagensPorHashtag();
                    break;
                case 9:
                    this.exibirPostagensPopulares();
                    break;
                case 10:
                    this.exibirHashtagsPopulares();
                    break;
                case 11:
                    this.exibirFeedPostagens();
                    break;
            }
        } while (opcao != 0);
        console.log("\nBye! Have a beautiful time!");
    }
}
App.main();
