/// Representa uma receita com informações básicas, como nome e identificador único.
///
/// Esta classe é usada para modelar os dados principais de uma receita num sistema de gestão de receitas.
class RecipeDto {
  /// Identificador único da receita.
  final int Id;

  /// Nome da receita.
  final String Name;

  /// Construtor da classe [RecipeDto].
  ///
  /// - [Id]: Identificador único da receita (obrigatório).
  /// - [Name]: Nome da receita (obrigatório).
  const RecipeDto({
    required this.Name,
    required this.Id,
  });

  /// Converte um mapa JSON numa instância de [RecipeDto].
  factory RecipeDto.fromJson(Map<String, dynamic> json) => RecipeDto(
        Name: json["name"],
        Id: json["id"],
      );

  /// Converte uma instância de [RecipeDto] para um mapa JSON.
  Map<String, dynamic> toJson() => {
        "Name": Name,
        "Id": Id,
      };
}
