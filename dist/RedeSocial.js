export class RedeSocial {
    _repositorioPerfis;
    _repositorioPostagens;
    incluirPerfil(perfil) {
        if (perfil.id !== null && perfil.nome !== null && perfil.email !== null) {
            if (this._repositorioPerfis.consultar(perfil.id, perfil.nome, perfil.email) === null) {
                this._repositorioPerfis.incluir(perfil);
            }
        }
    }
    consultarPerfil(id, nome, email) {
        return this._repositorioPerfis.consultar(id, nome, email);
    }
}
