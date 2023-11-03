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
    id: number | null,
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

// fazer testes aqui amannhã
// let repositorioPerfis = new RepositorioDePerfis()
// let perfil = new Perfil(3, 'david', 'cannabis@gmail.com')
// let perfil2 = new Perfil(3, 'luiz', 'cannabis@gmail.com')

// repositorioPerfis.incluir(perfil)
// repositorioPerfis.incluir(perfil2)


// let perfilAlvo = repositorioPerfis.consultar(3, null, null)


// console.log(perfilAlvo)


