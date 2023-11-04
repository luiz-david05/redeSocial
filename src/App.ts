import { RedeSocial } from "./RedeSocial.js";
import { Perfil } from "./basicas/Perfil.js";
import { getNumber, input } from "./utils.js";

class App {
    private _redeSocial:RedeSocial = new RedeSocial()

    menu() {
        const texto = `\t1 - Criar perfil\n`+
        `\t2 - Criar postagem\n`+
        `\t0 - Sair`

        console.log(texto)
    }

    run() {
        this.menu()

        let opcao: number

        do {
            this.menu()

            opcao = getNumber("\nSelecione uma opção: ")

            switch (opcao) {
                case 1:
                    this.criarPerfil()
                    break
                default:
                    console.log("Incorrect option: " + opcao)
            }
        } while (opcao != 0)
    }

    criarPerfil(): void {
        console.log("\nCriar perfil\n")
        let id = this.gerarId()
        let nome = input("nome do perfil: ")

        if (nome === '') {
            throw new Error("ERROR: O nome não pode sar vazio")
        }

        let email = input("email do perfil: ")

        this._redeSocial.incluirPerfil(new Perfil(id, nome, email))
    }

    gerarId(): number {
        return Math.floor(Math.random() * 999999)
    }
}

let app = new App()
app.run()