import { RepositorioDePerfis } from "./repositorios/RepositorioDePerfis.js";
import { RepositorioDePostagens } from "./repositorios/RepositorioDePostagens.js";
import { Perfil } from "./basicas/Perfil.js";

export class RedeSocial {
    private _repositorioPerfis: RepositorioDePerfis
    private _repositorioPostagens: RepositorioDePostagens

    incluirPerfil(perfil: Perfil): void {
        if (perfil.id !== null && perfil.nome !== null && perfil.email !== null) {
            if (this._repositorioPerfis.consultar(perfil.id, perfil.nome, perfil.email) === null) {
                this._repositorioPerfis.incluir(perfil)
            }
        }
    }

    consultarPerfil(id: number, nome: string, email: string): Perfil {
        return this._repositorioPerfis.consultar(id, nome, email)
    }
}