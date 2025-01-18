import { Types } from '../enums/types.enum';
import { Unity } from '../enums/unity.enum';

export interface Product {
  /**
   * Identificador único do produto.
   */
  id: number;

  /**
   * Nome do produto.
   */
  name: string;

  /**
   * Quantidade do produto.
   */
  quantity: number;

  /**
   * Unidade de medida do produto.
   */
  unity: Unity;

  /**
   * Ponto de pedido do produto.
   */
  order_Point: number;

  /**
   * Ponto ideal do produto.
   */
  ideal_Point: number;

  /**
   * Tipo do produto.
   */
  type: Types;

  /**
   * Identificador do grupo do produto.
   */
  in_List: boolean;

  /**
   * Identificador do grupo do produto.
   */
  group_Id: number;
}
