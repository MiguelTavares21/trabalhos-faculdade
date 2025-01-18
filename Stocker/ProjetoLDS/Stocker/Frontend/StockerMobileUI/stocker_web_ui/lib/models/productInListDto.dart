import 'package:stocker_web_ui/enums/unity_enum.dart';

/// Representa um produto em uma lista, com informações sobre identificação, nome, quantidade e unidade.
///
/// Esta classe é usada para modelar os dados de produtos numa lista, como num sistema de gestão de stock.
class ProductInListDto {
  /// Identificador único do produto.
  final int Id;

  /// Nome do produto.
  final String Name;

  /// Quantidade do produto disponível.
  final double Quantity;

  /// Unidade de medida do produto.
  final Unity Unities;

  /// Construtor da classe [ProductInListDto].
  /// 
  /// - [Id]: Identificador único do produto (obrigatório).
  /// - [Name]: Nome do produto (obrigatório).
  /// - [Quantity]: Quantidade do produto (obrigatório).
  /// - [Unities]: Unidade de medida do produto (obrigatório).
  const ProductInListDto({
    required this.Id,
    required this.Name,
    required this.Quantity,
    required this.Unities,
  });

  /// Converte um mapa JSON em uma instância de [ProductInListDto].
  factory ProductInListDto.fromJson(Map<String, dynamic> json) =>
      ProductInListDto(
          Id: json["id"],
          Name: json["name"],
          Quantity: (json["quantity"] as num).toDouble(),
          Unities: UnityExtension.fromDescription(json['unity'] as String));

  /// Converte uma instância de [ProductInListDto] para um mapa JSON.
  Map<String, dynamic> toJson() => {
        "id": Id,
        "name": Name,
        "quantity": Quantity,
        "unity": Unities.description,
      };
}
