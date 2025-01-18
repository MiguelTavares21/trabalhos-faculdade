import { Types } from '../enums/types.enum';

/**
 * Um mapeamento que associa cada valor do enum `Types` a um rótulo descritivo para exibição.
 * Esse objeto é útil para traduzir os valores técnicos do enum em textos amigáveis para o utilizador.
 */
export const TypeLabels: { [key in keyof typeof Types]: string } = {
  [Types.Frutas_Verduras]: 'Frutas e Verduras',
  [Types.Panificacao_Confeitaria]: 'Panificação e Confeitaria',
  [Types.Laticinios]: 'Laticínios',
  [Types.Carne_Peixe]: 'Carne e Peixe',
  [Types.Ingredientes_Temperos]: 'Ingredientes e Temperos',
  [Types.Congelados]: 'Congelados',
  [Types.Cereais_Graos]: 'Cereais e Grãos',
  [Types.Lanches_Doces]: 'Lanches e Doces',
  [Types.Bebidas]: 'Bebidas',
  [Types.Casa]: 'Casa',
  [Types.Higiene_Saude]: 'Higiene e Saúde',
  [Types.Animais]: 'Animais',
  [Types.Artesanato_Jardim]: 'Artesanato e Jardim',
  [Types.Outro]: 'Outro',
};
