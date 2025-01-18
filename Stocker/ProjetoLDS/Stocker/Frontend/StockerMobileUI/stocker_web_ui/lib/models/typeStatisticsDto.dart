/// Representa as estatísticas relacionadas a um tipo de produto, incluindo dados financeiros e de consumo.
///
/// Esta classe é usada para modelar informações como o tipo de produto, total gasto, quantidade adquirida,
/// número de compras realizadas e a média de gastos associados ao tipo de produto.
class TypeStatisticsDto {
  /// Tipo do produto.
  final String productType;

  /// Valor total gasto no tipo de produto.
  final double totalSpent;

  /// Quantidade total adquirida do tipo de produto.
  final double totalQuantity;

  /// Número total de compras realizadas para o tipo de produto.
  final int totalPurchases;

  /// Gasto médio por compra relacionado ao tipo de produto.
  final double averageSpent;

  /// Construtor da classe [TypeStatisticsDto].
  ///
  /// - [productType]: Tipo do produto (obrigatório).
  /// - [totalSpent]: Valor total gasto no tipo de produto (obrigatório).
  /// - [totalQuantity]: Quantidade total adquirida do tipo de produto (obrigatório).
  /// - [totalPurchases]: Número total de compras realizadas (obrigatório).
  /// - [averageSpent]: Valor médio gasto por compra (obrigatório).
  TypeStatisticsDto({
    required this.productType,
    required this.totalSpent,
    required this.totalQuantity,
    required this.totalPurchases,
    required this.averageSpent,
  });

  /// Converte um mapa JSON numa instância de [TypeStatisticsDto].
  factory TypeStatisticsDto.fromJson(Map<String, dynamic> json) {
    return TypeStatisticsDto(
      productType: json['productType'] as String,
      totalSpent: (json['totalSpent'] as num).toDouble(),
      totalQuantity: (json['totalQuantity'] as num).toDouble(),
      totalPurchases: json['totalPurchases'] as int,
      averageSpent: (json['averageSpent'] as num).toDouble(),
    );
  }

  /// Converte uma instância de [TypeStatisticsDto] para um mapa JSON.
  Map<String, dynamic> toJson() {
    return {
      'productType': productType,
      'totalSpent': totalSpent,
      'totalQuantity': totalQuantity,
      'totalPurchases': totalPurchases,
      'averageSpent': averageSpent,
    };
  }
}
