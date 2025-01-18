import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:http/io_client.dart';
import 'package:provider/provider.dart';
import 'package:stocker_web_ui/models/PurchaseDto.dart';
import 'package:stocker_web_ui/models/PurchaseProductDto.dart';
import 'package:stocker_web_ui/models/PurchaseProductsCreatedto.dart';
import 'package:stocker_web_ui/models/productInListDto.dart';
import 'package:stocker_web_ui/services/group_provider.dart';
import 'package:stocker_web_ui/services/token_provider.dart';

class PurchaseService {
  final String baseUri = "https://10.0.2.2:50001/api";

  PurchaseService();

  /// Recupera o token de autenticação do utilizador a partir do contexto.
  ///
  /// Parâmetros:
  /// - `context`: O contexto de construção que contém o token armazenado.
  ///
  /// Retorna:
  /// - O token de autenticação como uma string. Caso o token não exista, retorna uma string vazia.
  String? getToken(BuildContext context) {
    return Provider.of<TokenProvider>(context, listen: false).token;
  }

  /// Recupera o ID do grupo selecionado a partir do contexto.
  ///
  /// Parâmetros:
  /// - `context`: O contexto de construção que contém o ID do grupo selecionado.
  ///
  /// Retorna:
  /// - O ID do grupo selecionado ou `null` se não houver grupo selecionado.
  int? getSelectedGroupId(BuildContext context) {
    return Provider.of<GroupProvider>(context, listen: false).selectedGroupId;
  }

  /// Função assíncrona para obter o histórico de compras.
  ///
  /// Parâmetros:
  /// - `context`: O contexto usado para aceder ao token de autenticação e o ID do grupo.
  ///
  /// Retorna:
  /// - Uma lista de objetos `Purchasedto` que representa o histórico de compras.
  Future<List<Purchasedto>> getPurchaseHistory(BuildContext context) async {
    final groupId = getSelectedGroupId(context);
    final String purchasePath = "$baseUri/Purchases/$groupId/history";
    final uri = Uri.parse(purchasePath);
    List<Purchasedto> purchases = [];

    try {
      final token = getToken(context);

      HttpClient httpClient = HttpClient()
        ..badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;

      final ioClient = IOClient(httpClient);
      final response = await ioClient.get(
        uri,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> jsonResponse = json.decode(response.body);
        purchases = jsonResponse.map((e) => Purchasedto.fromJson(e)).toList();
      } else {
        throw Exception(
            "Erro ao carregar histórico: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      print("Erro ao carregar histórico: $e");
      throw Exception("Erro ao carregar histórico: $e");
    }

    return purchases;
  }

  /// Função para eliminar uma compra.
  ///
  /// Parâmetros:
  /// - `context`: O contexto usado para aceder ao token de autenticação e o ID do grupo.
  /// - `purchaseId`: O ID da compra a ser eliminada.
  Future<void> deletePurchase(BuildContext context, int purchaseId) async {
    final groupId = getSelectedGroupId(context);
    final String purchasePath = "$baseUri/Purchases/$groupId/$purchaseId";
    final uri = Uri.parse(purchasePath);

    try {
      final token = getToken(context);

      HttpClient httpClient = HttpClient()
        ..badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;

      final ioClient = IOClient(httpClient);
      final response = await ioClient.delete(
        uri,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode != 204) {
        throw Exception(
            "Erro ao eliminar compra: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      print("Erro ao eliminar compra: $e");
      throw Exception("Erro ao eliminar compra: $e");
    }
  }

  /// Função para obter os produtos de uma compra específica.
  ///
  /// Parâmetros:
  /// - `context`: O contexto usado para aceder ao token de autenticação e o ID do grupo.
  /// - `purchaseId`: O ID da compra da qual os produtos serão recuperados.
  Future<List<PurchaseProductdto>> getPurchaseProducts(
      BuildContext context, int purchaseId) async {
    final groupId = getSelectedGroupId(context);
    final String purchasePath =
        "$baseUri/Purchases/$groupId/$purchaseId/products";
    final uri = Uri.parse(purchasePath);
    List<PurchaseProductdto> purchaseProducts = [];

    try {
      final token = getToken(context);

      HttpClient httpClient = HttpClient()
        ..badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;

      final ioClient = IOClient(httpClient);
      final response = await ioClient.get(
        uri,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode != 200) {
        throw Exception(
            "Erro ao resgatar produtos: ${response.statusCode} - ${response.body}");
      } else {
        print(response.body);
        final List<dynamic> jsonResponse = json.decode(response.body);
        purchaseProducts =
            jsonResponse.map((e) => PurchaseProductdto.fromJson(e)).toList();
      }
    } catch (e) {
      throw Exception("Erro ao resgatar produtos: $e");
    }
    return purchaseProducts;
  }

  /// Função para obter a lista de compras de produtos.
  ///
  /// Parâmetros:
  /// - `context`: O contexto usado para aceder ao token de autenticação e o ID do grupo.
  Future<List<ProductInListDto>> getShoppingList(BuildContext context) async {
    final groupId = getSelectedGroupId(context);
    final String purchasePath = "$baseUri/Purchases/$groupId/shoppingList";
    final uri = Uri.parse(purchasePath);
    List<ProductInListDto> products = [];

    try {
      final token = getToken(context);

      HttpClient httpClient = HttpClient()
        ..badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;

      final ioClient = IOClient(httpClient);
      final response = await ioClient.get(
        uri,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        print(response.body);
        final List<dynamic> jsonResponse = json.decode(response.body);
        products =
            jsonResponse.map((e) => ProductInListDto.fromJson(e)).toList();
      } else {
        throw Exception(
            "Erro ao resgatar produtos: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      throw Exception("Erro ao resgatar produtos: $e");
    }
    return products;
  }

  /// Função para adicionar um produto à lista de compras.
  /// 
  /// Parâmetros:
  /// - `context`: O contexto usado para aceder ao token de autenticação e o ID do grupo.
  /// - `productId`: O ID do produto a ser adicionado à lista de compras.
  Future<void> toggleProductInList(BuildContext context, int productId) async {
    final groupId = getSelectedGroupId(context);
    final String purchasePath =
        "$baseUri/Purchases/$groupId/addToList/$productId";
    final uri = Uri.parse(purchasePath);

    try {
      final token = getToken(context);

      HttpClient httpClient = HttpClient()
        ..badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;

      final ioClient = IOClient(httpClient);
      final response = await ioClient.put(
        uri,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode != 204) {
        throw Exception(
            "Erro ao atualizar produto: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      throw Exception("Erro ao atualizar produto: $e");
    }
  }

  /// Função para remover um produto da lista de compras.
  /// 
  /// Parâmetros:
  /// - `context`: O contexto usado para aceder ao token de autenticação e o ID do grupo.
  /// - `products`: A lista de produtos a serem registados na lista de compras.
  Future<void> registerPurchase(
      BuildContext context, List<PurchaseproductsCreatedto> products) async {
    final groupId = getSelectedGroupId(context);
    final String purchasePath = "$baseUri/Purchases/$groupId/register";
    final uri = Uri.parse(purchasePath);

    try {
      for (var product in products) {
        print("Produto: ${product.Name}, Quantidade: ${product.Quantity}");
      }

      final token = getToken(context);

      HttpClient httpClient = HttpClient()
        ..badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;

      final ioClient = IOClient(httpClient);
      final response = await ioClient.post(
        uri,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(products),
      );

      if (response.statusCode != 200) {
        throw Exception(
            "Erro ao registrar compra: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      throw Exception("Erro ao registrar compra: $e");
    }
  }
}
