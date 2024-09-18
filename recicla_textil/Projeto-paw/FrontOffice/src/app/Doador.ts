export interface Doador {
    nome: string;
    apelido: string;
    email: string;
    password: string;
    nif: string;
    morada: string;
    contacto?: string;
    numeroPontos?: number;
    numeroDoacoes?: number;
    doacoes?: string[];
    data?: Date;
    fotoPerfil?: string;
    role?: string;
  }
  