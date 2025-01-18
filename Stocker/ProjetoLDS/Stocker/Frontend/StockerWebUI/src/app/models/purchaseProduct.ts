import { Unity } from '../enums/unity.enum';

export interface PurchaseProduct {
  /**
   * Nome do produto comprado.
   */
  name: string;

  /**
   * Identificador único do produto.
   */
  product_Id: number;

  /**
   * Quantidade do produto comprado.
   */
  quantity: number;

  /**
   * Preço unitário do produto.
   */
  price: number;

  /**
   * Unidade de medida do produto.
   */
  unity: Unity;
}
