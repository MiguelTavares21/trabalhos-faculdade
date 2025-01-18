/// Representa os dados de consumo de um produto.
///
/// Esta classe é usada para descrever informações relacionadas ao consumo de um produto,
/// incluindo o identificador do produto, o nome, o total consumido e a percentagem de consumo.
class ProductConsumptionDto {
  /// Identificador único do produto.
  final int productId;

  /// Nome do produto.
  final String? productName;

  /// Quantidade total consumida do produto.
  final double totalConsumed;

  /// Percentagem de consumo do produto em relação ao total.
  final double consumptionPercentage;

  /// Construtor da classe [ProductConsumptionDto].
  /// 
  /// - [productId]: Identificador único do produto (obrigatório).
  /// - [productName]: Nome do produto (opcional).
  /// - [totalConsumed]: Quantidade total consumida do produto (obrigatório).
  /// - [consumptionPercentage]: Percentagem de consumo do produto (obrigatório).
  ProductConsumptionDto({
    required this.productId,
    this.productName,
    required this.totalConsumed,
    required this.consumptionPercentage,
  });

  /// Converte um mapa JSON numa instância de [ProductConsumptionDto].
  factory ProductConsumptionDto.fromJson(Map<String, dynamic> json) {
    return ProductConsumptionDto(
      productId: json['productId'],
      productName: json['productName'],
      totalConsumed: json['totalConsumed'].toDouble(),
      consumptionPercentage: json['consumptionPercentage'].toDouble(),
    );
  }

  /// Converte uma instância de [ProductConsumptionDto] para um mapa JSON.
  Map<String, dynamic> toJson() {
    return {
      'productId': productId,
      'productName': productName,
      'totalConsumed': totalConsumed,
      'consumptionPercentage': consumptionPercentage,
    };
  }
}
