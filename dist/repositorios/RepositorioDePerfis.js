class RepositorioDePerfis {
    _perfis = [];
    incluir(perfil) {
        if (this.consultar(perfil.id, perfil.nome, perfil.email) == null) {
            this._perfis.push(perfil);
        }
    }
    consultar(id, nome, email) {
        for (let perfil of this._perfis) {
            if ((id == null || perfil.id == id) &&
                (nome == null || perfil.nome == nome) &&
                (email == null || perfil.email == email)) {
                return perfil;
            }
        }
        return null;
    }
}
export {};
