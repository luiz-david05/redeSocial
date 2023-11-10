import { Perfil } from "../basicas/Perfil.js";

export class RepositorioDePerfis {
    private _perfis: Perfil[] = [];

    get perfis() {
        return this._perfis;
    }

    incluir(perfil: Perfil): void {
        this._perfis.push(perfil);
    }

    consultar(id: string, nome: string, email: string): Perfil {
        for (const perfil of this._perfis) {
            if (perfil.id == id) return perfil;
            else if (perfil.email == email) return perfil;
            else if (perfil.nome == nome) return perfil;
        }

        return null;
    }
}
