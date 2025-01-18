import 'dart:ffi';

/// Classe `Purchasedto`
///
/// Representa uma compra, contendo informações como identificador, grupo,
/// data da compra e preço total.
class Purchasedto {
  /// Identificador único da compra.
  final int Id;

  /// Identificador do grupo associado à compra.
  final int Group_Id;

  /// Data da compra.
  final String Date;

  /// Preço total da compra.
  final double Price;

  /// Construtor da classe `Purchasedto`.
  ///
  /// - [Id]: Identificador único da compra.
  /// - [Group_Id]: Identificador do grupo associado à compra.
  /// - [Date]: Data da compra.
  /// - [Price]: Preço total da compra.
  const Purchasedto({
    required this.Id,
    required this.Group_Id,
    required this.Date,
    required this.Price,
  });

  /// Converte um JSON num objeto `Purchasedto`.
  factory Purchasedto.fromJson(Map<String, dynamic> json) => Purchasedto(
      Id: json["id"],
      Group_Id: json["group_Id"],
      Date: json["date"],
      Price: (json["price"] as num).toDouble());

  /// Converte um objeto `Purchasedto` num JSON.
  Map<String, dynamic> toJson() => {
        "id": Id,
        "group_Id": Group_Id,
        "date": Date,
        "price": Price,
      };
}
