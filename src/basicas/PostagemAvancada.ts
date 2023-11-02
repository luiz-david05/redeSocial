import { Perfil } from "./Perfil.js";
import { Postagem } from "./Postagem.js";

export class PostagemAvancada extends Postagem {
  constructor(
    id: number,
    texto: string,
    curtidas: number,
    descurtidas: number,
    data: Date,
    perfil: Perfil,
  ) {
    super(id, texto, curtidas, descurtidas, data, perfil);
  }

  private _hashtags: string[] = [];
  private _visualizacoesRestantes = 1000

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
}
