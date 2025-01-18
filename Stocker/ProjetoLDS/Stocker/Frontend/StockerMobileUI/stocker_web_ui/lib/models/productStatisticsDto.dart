/// Representa as estatísticas relacionadas a um produto.
///
/// Esta classe é usada para modelar dados estatísticos como o total gasto, a quantidade total adquirida,
/// o número total de compras e a média de gastos por produto.
class ProductStatisticsDto {
  /// Identificador único do produto.
  final int productId;

  /// Valor total gasto com o produto.
  final double totalSpent;

  /// Quantidade total adquirida do produto.
  final double totalQuantity;

  /// Número total de compras envolvendo o produto.
  final int totalPurchases;

  /// Gasto médio por unidade do produto.
  final double averageSpentByProduct;

  /// Construtor da classe [ProductStatisticsDto].
  ///
  /// - [productId]: Identificador único do produto (obrigatório).
  /// - [totalSpent]: Valor total gasto com o produto (obrigatório).
  /// - [totalQuantity]: Quantidade total adquirida do produto (obrigatório).
  /// - [totalPurchases]: Total de compras realizadas do produto (obrigatório).
  /// - [averageSpentByProduct]: Gasto médio por unidade do produto (obrigatório).
  ProductStatisticsDto({
    required this.productId,
    required this.totalSpent,
    required this.totalQuantity,
    required this.totalPurchases,
    required this.averageSpentByProduct,
  });

  /// Converte um mapa JSON numa instância de [ProductStatisticsDto].
  factory ProductStatisticsDto.fromJson(Map<String, dynamic> json) {
    return ProductStatisticsDto(
      productId: json['productId'] as int,
      totalSpent: (json['totalSpent'] as num).toDouble(),
      totalQuantity: (json['totalQuantity'] as num).toDouble(),
      totalPurchases: json['totalPurchases'] as int,
      averageSpentByProduct: (json['averageSpentByProduct'] as num).toDouble(),
    );
  }

  /// Converte uma instância de [ProductStatisticsDto] para um mapa JSON.
  Map<String, dynamic> toJson() {
    return {
      'productId': productId,
      'totalSpent': totalSpent,
      'totalQuantity': totalQuantity,
      'totalPurchases': totalPurchases,
      'averageSpentByProduct': averageSpentByProduct,
    };
  }
}
