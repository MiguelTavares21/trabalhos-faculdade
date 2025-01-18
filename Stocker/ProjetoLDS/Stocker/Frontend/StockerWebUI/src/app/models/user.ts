export interface User {
    /**
     * Identificador único do utilizador.
     * Este valor é utilizado para referenciar o utilizador no sistema.
     */
    id: number;
  
    /**
     * Nome do utilizador.
     */
    name: string;
  
    /**
     * Endereço de e-mail do utilizador.
     */
    email: string;
  
    /**
     * Indicador de preferências de notificações do utilizador.
     * Determina se o utilizador deseja receber notificações.
     * Tipo: `boolean`
     * - `true`: O utilizador deseja receber notificações.
     * - `false`: O utilizador não deseja receber notificações.
     */
    notifications: boolean;
  }
  