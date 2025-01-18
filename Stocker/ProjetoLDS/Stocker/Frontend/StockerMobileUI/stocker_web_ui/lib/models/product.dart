import '../enums/unity_enum.dart';
import '../enums/types_enum.dart';

/// Classe `Product`
///
/// Representa um produto com informações como nome, quantidade, tipo,
/// unidade de medida, pontos de encomenda, entre outros.
class Product {
  /// Identificador único do produto.
  final int Id;

  /// Nome do produto.
  final String Name;

  /// Quantidade do produto.
  late double Quantity;

  /// Unidade de medida do produto.
  final Unity Unities;

  /// Ponto de pedido do produto.
  final int? OrderPoint;

  /// Valor ideal do produto.
  final int? IdealPoint;

  /// Tipo do produto.
  final Types Type;

  /// Identificador se o produto está na lista.
  final bool InList;

  /// Identificador do grupo do produto.
  final int GroupId;

  /// Construtor para criar uma instância de `Product`.
  ///
  /// - [Id]: Identificador único do produto (obrigatório).
  /// - [Name]: Nome do produto (obrigatório).
  /// - [Quantity]: Quantidade do produto (obrigatório).
  /// - [Unities]: Unidade de medida do produto (obrigatório).
  /// - [OrderPoint]: Ponto de pedido do produto (opcional).
  /// - [IdealPoint]: Valor ideal do produto (opcional).
  /// - [Type]: Tipo do produto (obrigatório).
  /// - [InList]: Identificador se o produto está na lista (obrigatório).
  /// - [GroupId]: Identificador do grupo do produto (obrigatório).
  Product({
    required this.Id,
    required this.Name,
    required this.Quantity,
    required this.Unities,
    required this.OrderPoint,
    required this.IdealPoint,
    required this.Type,
    required this.InList,
    required this.GroupId,
  });

  /// Converte um JSON num objeto `Product`.
  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      Id: json['id'] as int,
      Name: json['name'] as String,
      Quantity: (json['quantity'] as num).toDouble(),
      Unities: UnityExtension.fromDescription(json['unity'] as String),
      OrderPoint: json['order_Point'] != null ? json['order_Point'] as int : null,
      IdealPoint: json['ideal_Point'] != null ? json['ideal_Point'] as int : null,
      Type: TypesExtension.fromDescription(json['type'] as String),
      InList: json['in_List'] as bool,
      GroupId: json['group_Id'] as int,
    );
  }

  /// Converte um objeto `Product` num JSON.
  Map<String, dynamic> toJson() {
    return {
      'id': Id,
      'name': Name,
      'quantity': Quantity,
      'unity': Unities.description,
      'order_Point': OrderPoint,
      'ideal_Point': IdealPoint,
      'type': TypesExtension.getDescription(Type),
      'in_List': InList,
      'group_Id': GroupId,
    };
  }
}
