import '../enums/unity_enum.dart';
import '../enums/types_enum.dart';

/// Classe `PurchaseproductsCreatedto`
///
/// Representa um produto a ser criado numa compra, incluindo informações
/// como o identificador do produto, nome, preço, quantidade e unidade de medida.
class PurchaseproductsCreatedto {
  /// Identificador único do produto.
  final int Product_Id;

  /// Nome do produto.
  final double Price;

  /// Nome do produto.
  final String Name;

  /// Quantidade do produto.
  late final double Quantity;

  /// Unidade de medida do produto.
  final Unity Unities;

  /// Construtor da classe `PurchaseproductsCreatedto`.
  ///
  /// - [Product_Id] é o identificador único do produto.
  /// - [Name] é o nome do produto.
  /// - [Price] é o preço do produto.
  /// - [Quantity] é a quantidade do produto.
  /// - [Unities] é a unidade de medida do produto.
  PurchaseproductsCreatedto({
    required this.Product_Id,
    required this.Name,
    required this.Price,
    required this.Quantity,
    required this.Unities,
  });

  /// Converte um JSON num objeto `Purchaseproductsdto`.
  factory PurchaseproductsCreatedto.fromJson(Map<String, dynamic> json) {
    return PurchaseproductsCreatedto(
        Product_Id: json['product_id'] as int,
        Name: json['name'] as String,
        Price: (json["price"] as num).toDouble(),
        Quantity: (json['quantity'] as num).toDouble(),
        Unities: UnityExtension.fromDescription(json['unity'] as String));
  }

  /// Converte um objeto `PurchaseproductsCreatedto` num JSON.
  Map<String, dynamic> toJson() {
    return {
      'product_id': Product_Id,
      'price': Price,
      'quantity': Quantity,
      'unity': Unities.description,
    };
  }
}
