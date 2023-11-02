import { Perfil } from "../basicas/Perfil.js";

class RepositorioDePerfis {
  private _perfis: Perfil[] = [];

  incluir(perfil: Perfil): void {
    if (this.consultar(perfil.id, perfil.nome, perfil.email) == null) {
        this._perfis.push(perfil);
    }
  }

  consultar(
    id: number | null,
    nome: string | null,
    email: string | null
  ): Perfil | null {
    for (let perfil of this._perfis) {
      if (
        (id == null || perfil.id == id) &&
        (nome == null || perfil.nome == nome) &&
        (email == null || perfil.email == email)
      ) {
        return perfil;
      }
    }

    return null;
  }
}
