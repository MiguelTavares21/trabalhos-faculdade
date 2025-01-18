export interface Group {
  /**
   * Identificador único do grupo.
   */
  id: number;

  /**
   * Nome do grupo.
   */
  name: string;

  /**
   * Descrição do grupo.
   */
  description: string;

  /**
   * Indica se o grupo tem um código de acesso.
   */
  access_code: boolean;

  /**
   * Orçamento disponível para o grupo.
   */
  budget: number;
}
