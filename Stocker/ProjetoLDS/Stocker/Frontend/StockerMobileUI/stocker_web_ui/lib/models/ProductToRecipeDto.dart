/// Representa a associação básica de um produto a uma receita.
///
/// Esta classe é usada para descrever os dados necessários para vincular um produto a uma receita,
/// incluindo o nome do produto e a quantidade necessária.
class ProductToRecipeDto {
  /// Nome do produto.
  final String Name;

  /// Quantidade do produto necessária para a receita.
  final int Quantity;

  /// Construtor da classe [ProductToRecipeDto].
  ///
  /// - [Name]: Nome do produto (obrigatório).
  /// - [Quantity]: Quantidade necessária do produto (obrigatório).
  const ProductToRecipeDto({
    required this.Name,
    required this.Quantity,
  });

  /// Converte um mapa JSON em uma instância de [ProductToRecipeDto].
  factory ProductToRecipeDto.fromJson(Map<String, dynamic> json) =>
      ProductToRecipeDto(
        Name: json["name"],
        Quantity: (json["quantity"] as num).toInt(),
      );

  /// Converte uma instância de [ProductToRecipeDto] para um mapa JSON.
  Map<String, dynamic> toJson() => {
        "name": Name,
        "quantity": Quantity,
      };
}
