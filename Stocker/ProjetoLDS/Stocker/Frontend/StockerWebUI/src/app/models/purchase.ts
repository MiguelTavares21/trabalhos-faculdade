export interface Purchase {
  /**
   * Identificador único da compra.
   */
  id: number;

  /**
   * Identificador do grupo associado à compra.
   */
  group_Id: number;

  /**
   * Data em que a compra foi realizada.
   */
  date: string;

  /**
   * Valor total da compra.
   */
  price: number;
}
