import { Perfil } from "../basicas/Perfil.js";

export class RepositorioDePerfis {
  private _perfis: Perfil[] = [];

  incluir(perfil: Perfil): void {
    this._perfis.push(perfil);
  }

  consultar(
    id: number | null,
    nome: string | null,
    email: string | null
  ): Perfil | null {
    return this._perfis.find((perfil) => {
      if (id !== null && perfil.id !== id) {
        return false
      }
      if (email !== null && perfil.email !== email) {
        return false
      }
      if (nome !== null && perfil.nome !== nome) {
        return false
      }

      return true
    }) || null
  }
}
