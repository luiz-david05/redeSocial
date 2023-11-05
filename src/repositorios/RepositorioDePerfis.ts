import { Perfil } from "../basicas/Perfil.js";

export class RepositorioDePerfis {
  private _perfis: Perfil[] = [];

  get perfis() {
    return this._perfis;
  }

  incluir(perfil: Perfil): void {
    this._perfis.push(perfil)
  }

  consultar(
    id: string | null,
    nome: string | null,
    email: string | null
  ): Perfil | null {
    for (let perfil of this._perfis) {
      if (
          (id === null || perfil.id === id) &&
          (nome === null || perfil.nome === nome) &&
          (email === null || perfil.email === email)
      ) {
          return perfil;
      }
  }

  return null;
  }
}