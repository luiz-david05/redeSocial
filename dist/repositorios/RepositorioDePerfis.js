export class RepositorioDePerfis {
    _perfis = [];
    incluir(perfil) {
        this._perfis.push(perfil);
    }
    consultar(id, nome, email) {
        return this._perfis.find((perfil) => {
            if (id !== null && perfil.id !== id) {
                return false;
            }
            if (email !== null && perfil.email !== email) {
                return false;
            }
            if (nome !== null && perfil.nome !== nome) {
                return false;
            }
            return true;
        }) || null;
    }
}
