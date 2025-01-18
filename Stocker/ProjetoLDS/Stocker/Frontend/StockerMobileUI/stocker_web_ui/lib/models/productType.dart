/// Classe `ProductType`
///
/// Representa o tipo de um produto, incluindo uma chave identificadora,
/// um rótulo descritivo e um ícone associado.
class ProductType {
  /// Chave única do tipo de produto.
  final String key;

  /// Rótulo descritivo do tipo de produto.
  final String label;

  /// Ícone associado ao tipo de produto.
  final String icon;

  /// Construtor para criar uma instância de `ProductType`.
  /// 
  /// -
  /// - `key`: Chave única do tipo de produto. (obrigatório)
  /// - `label`: Rótulo descritivo do tipo de produto. (obrigatório)
  /// - `icon`: Ícone associado ao tipo de produto. (obrigatório)
  ProductType({required this.key, required this.label, required this.icon});
}
