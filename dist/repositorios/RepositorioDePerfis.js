export class RepositorioDePerfis {
    _perfis = [];
    get perfis() {
        return this._perfis;
    }
    incluir(perfil) {
        this._perfis.push(perfil);
    }
    consultar(id, nome, email) {
        for (const perfil of this._perfis) {
            if (perfil.id == id)
                return perfil;
            else if (perfil.email == email)
                return perfil;
            else if (perfil.nome == nome)
                return perfil;
        }
        return null;
    }
}
