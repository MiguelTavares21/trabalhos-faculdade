import 'dart:ffi';

// Classe `PurchaseProductdto`
///
/// Representa um produto adquirido numa compra, incluindo informações sobre
/// o identificador do produto, nome, quantidade, preço e unidade de medida.
class PurchaseProductdto {
  /// Identificador único do produto.
  final int Product_Id;

  /// Nome do produto.
  final String Name;

  /// Quantidade do produto adquirida.
  final double Quantity;

  /// Preço total do produto.
  final double Price;

  /// Unidade de medida do produto.
  final String Unity;

  /// Construtor da classe `PurchaseProductdto`.
  ///
  /// - [Product_Id]: Identificador único do produto.
  /// - [Name]: Nome do produto.
  /// - [Quantity]: Quantidade do produto adquirida.
  /// - [Price]: Preço total do produto.
  /// - [Unity]: Unidade de medida do produto.
  const PurchaseProductdto({
    required this.Product_Id,
    required this.Name,
    required this.Quantity,
    required this.Price,
    required this.Unity,
  });

  /// Converte um JSON em um objeto `PurchaseProductdto`.
  factory PurchaseProductdto.fromJson(Map<String, dynamic> json) =>
      PurchaseProductdto(
        Product_Id: json["product_Id"],
        Name: json["name"],
        Quantity: (json["quantity"] as num).toDouble(),
        Price: (json["price"] as num).toDouble(),
        Unity: json["unity"],
      );

  /// Converte um objeto `PurchaseProductdto` em um JSON.
  Map<String, dynamic> toJson() => {
        "product_Id": Product_Id,
        "name": Name,
        "quantity": Quantity,
        "price": Price,
        "unity": Unity,
      };
}
