import { Perfil } from "./Perfil.js";
import { Postagem } from "./Postagem.js";

export class PostagemAvancada extends Postagem {
  constructor(
    id: string,
    texto: string,
    curtidas: number,
    descurtidas: number,
    data: string,
    perfil: Perfil,
    private _hashtags: string[] = [],
    private _visualizacoesRestantes: number
  ) {
    super(id, texto, curtidas, descurtidas, data, perfil);
  }


  get hashtags(): string[] {
    return this._hashtags;
  }

  get visualizacoesRestantes() {
    return this._visualizacoesRestantes;
  }

  adicionarHashtag(hashtag: string): boolean {
    if (!this.existeHashtag(hashtag)) {
        this._hashtags.push(hashtag);
        return true;
    }

    return false;
  }

  existeHashtag(hashtag: string):boolean {
    return this._hashtags.includes(hashtag);
  }

  diminuirVisualizacoes() {
    this._visualizacoesRestantes--;
  }

  podeSerExibida(): boolean {
    return this._visualizacoesRestantes > 0;
  }
}