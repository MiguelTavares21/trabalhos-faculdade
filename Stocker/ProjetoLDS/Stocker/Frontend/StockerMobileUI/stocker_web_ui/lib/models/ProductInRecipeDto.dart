import 'package:stocker_web_ui/enums/unity_enum.dart';

/// Representa a associação de um produto a uma receita, incluindo informações sobre o produto,
/// a receita, a quantidade e a unidade de medida.
///
/// Esta classe é usada em contextos onde é necessário descrever a utilização de um produto numa receita.
class ProductInRecipeDto {
  /// Identificador único do produto.
  final int productId;

  /// Identificador único da receita.
  final int recipeId;

  /// Nome do produto.
  final String Name;

  /// Quantidade do produto utilizada na receita.
  final int Quantity;

  /// Unidade de medida do produto.
  final Unity Unities;

  /// Construtor da classe [ProductInRecipeDto].
  /// 
  /// - [productId]: Identificador único do produto (obrigatório).
  /// - [recipeId]: Identificador único da receita (obrigatório).
  /// - [Name]: Nome do produto (obrigatório).
  /// - [Quantity]: Quantidade do produto (obrigatório).
  /// - [Unities]: Unidade de medida do produto (obrigatório).
  const ProductInRecipeDto({
    required this.productId,
    required this.recipeId,
    required this.Name,
    required this.Quantity,
    required this.Unities,
  });

  /// Converte um mapa JSON numa instância de [ProductInRecipeDto].
  factory ProductInRecipeDto.fromJson(Map<String, dynamic> json) =>
      ProductInRecipeDto(
          productId: json["productId"],
          recipeId: json["recipeId"],
          Name: json["name"],
          Quantity: (json["quantity"] as num).toInt(),
          Unities: UnityExtension.fromDescription(json['unity'] as String));

  /// Converte uma instância de [ProductInRecipeDto] para um mapa JSON.
  Map<String, dynamic> toJson() => {
        "productId": productId,
        "recipeId": recipeId,
        "name": Name,
        "quantity": Quantity,
        "unity": Unities.description,
      };
}
