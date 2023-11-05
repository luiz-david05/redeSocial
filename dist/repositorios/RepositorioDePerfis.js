export class RepositorioDePerfis {
    _perfis = [];
    get perfis() {
        return this._perfis;
    }
    incluir(perfil) {
        this._perfis.push(perfil);
    }
    consultar(id, nome, email) {
        for (let perfil of this._perfis) {
            if ((id === null || perfil.id === id) &&
                (nome === null || perfil.nome === nome) &&
                (email === null || perfil.email === email)) {
                return perfil;
            }
        }
        return null;
    }
}
