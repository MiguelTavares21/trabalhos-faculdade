/// Representa as estatísticas de gastos, incluindo o total gasto, o número total de compras e a média de gastos.
///
/// Esta classe é usada para modelar dados financeiros e estatísticos relacionados a gastos num sistema.
class SpendingStatisticsDto {
  /// Valor total gasto.
  final double totalSpent;

  /// Número total de compras realizadas.
  final int totalPurchases;

  /// Valor médio gasto por compra.
  final double averageSpent;

  /// Construtor da classe [SpendingStatisticsDto].
  ///
  /// - [totalSpent]: Valor total gasto (obrigatório).
  /// - [totalPurchases]: Número total de compras realizadas (obrigatório).
  /// - [averageSpent]: Valor médio gasto por compra (obrigatório).
  SpendingStatisticsDto({
    required this.totalSpent,
    required this.totalPurchases,
    required this.averageSpent,
  });

  /// Converte um mapa JSON em uma instância de [SpendingStatisticsDto].
  factory SpendingStatisticsDto.fromJson(Map<String, dynamic> json) {
    return SpendingStatisticsDto(
      totalSpent: (json['totalSpent'] as num).toDouble(),
      totalPurchases: json['totalPurchases'] as int,
      averageSpent: (json['averageSpent'] as num).toDouble(),
    );
  }

  /// Converte uma instância de [SpendingStatisticsDto] para um mapa JSON.
  Map<String, dynamic> toJson() {
    return {
      'totalSpent': totalSpent,
      'totalPurchases': totalPurchases,
      'averageSpent': averageSpent,
    };
  }
}
