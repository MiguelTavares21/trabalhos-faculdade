import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/io_client.dart';
import 'package:provider/provider.dart';
import 'package:stocker_web_ui/models/productType.dart';
import 'package:stocker_web_ui/services/group_provider.dart';
import 'package:stocker_web_ui/services/token_provider.dart';

import '../models/product.dart';
import 'package:http/http.dart' as http;

// Serviço para lidar com operações relacionadas a produtos
class ProductService {
  final String apiUrl = "https://10.0.2.2:50001/api";

  /// Recupera o token de autenticação do utilizador a partir do contexto.
  ///
  /// Parâmetros:
  /// - `context`: O contexto de construção que contém o token armazenado.
  ///
  /// Retorna:
  /// - O token de autenticação como uma string. Caso o token não exista, retorna uma string vazia.
  String getToken(BuildContext context) {
    // Obtenha o token de autenticação do usuário
    return Provider.of<TokenProvider>(context, listen: false).token ?? '';
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

  /// Simula a recuperação de tipos de produtos. (Normalmente, os tipos viriam de uma API).
  ///
  /// Retorna:
  /// - Uma lista de `ProductType` com tipos de produtos pré-definidos.
  Future<List<ProductType>> getProductTypes() async {
    // Simulando um atraso de rede, por exemplo
    await Future.delayed(Duration(seconds: 2));

    return [
      ProductType(
          key: 'fruitaslegumes',
          label: 'Frutas e Verduras',
          icon: 'assets/frutas_e_verduras.png'),
      ProductType(
          key: 'panificacaoConfeitaria',
          label: 'Panificação e Confeitaria',
          icon: 'assets/panificacao_e_confeitaria.png'),
      ProductType(
          key: 'laticinios',
          label: 'Laticínios',
          icon: 'assets/laticinios.png'),
      ProductType(
          key: 'carnePeixe',
          label: 'Carne e Peixe',
          icon: 'assets/carne_peixe.png'),
      ProductType(
          key: 'ingredientesTemperos',
          label: 'Ingredientes e Temperos',
          icon: 'assets/ingredientes_temperos.png'),
      ProductType(
          key: 'congelados',
          label: 'Congelados',
          icon: 'assets/congelados.png'),
      ProductType(
          key: 'ceriaisGraos',
          label: 'Cereais e Grãos',
          icon: 'assets/cereais_graos.png'),
      ProductType(
          key: 'lanchesDoces',
          label: 'Lanches e Doces',
          icon: 'assets/lanches.png'),
      ProductType(key: 'bebidas', label: 'Bebidas', icon: 'assets/bebidas.png'),
      ProductType(key: 'casa', label: 'Casa', icon: 'assets/casa.png'),
      ProductType(
          key: 'higieneSaude',
          label: 'Higiene e Saúde',
          icon: 'assets/higiene.png'),
      ProductType(key: 'animais', label: 'Animais', icon: 'assets/animais.png'),
      ProductType(
          key: 'artesanatoJardim',
          label: 'Artesanato e Jardim',
          icon: 'assets/artesanato_jardim.png'),
      ProductType(key: 'outro', label: 'Outro', icon: 'assets/outro.png'),
    ];
  }

  /// Cria e guarda um novo produto associando-o ao grupo selecionado.
  ///
  /// Parâmetros:
  /// - `product`: O objeto `Product` a ser criado e salvo.
  /// - `context`: O contexto de construção para acessar o token de autenticação e o grupo selecionado.
  ///
  /// Retorna:
  /// - O objeto `Product` salvo após a resposta bem-sucedida da API.
  ///
  /// Lança uma exceção se ocorrer um erro durante a requisição.
  Future<Product> saveProduct(Product product, BuildContext context) async {
    final int groupId = getSelectedGroupId(context) ?? 0;
    final String path = "$apiUrl/Products/create/$groupId";
    final uri = Uri.parse(path);
    print(product.Type);

    try {
      final token = getToken(context);

      HttpClient httpClient = HttpClient()
        ..badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;

      final ioClient = IOClient(httpClient);
      final response = await ioClient.post(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(product.toJson()),
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception(
            "Erro ao salvar o produto. Status: ${response.statusCode}, Body: ${response.body}");
      } else {
        final Map<String, dynamic> data = jsonDecode(response.body);
        return Product.fromJson(data);
      }
    } catch (e) {
      print("Erro ao salvar produto: $e");
      rethrow;
    }
  }

  /// Obtém uma lista de produtos baseados no tipo fornecido.
  ///
  /// Parâmetros:
  /// - `context`: O contexto de construção para acessar o grupo selecionado e o token de autenticação.
  ///
  /// Retorna:
  /// - Uma lista de produtos correspondentes ao tipo solicitado.
  ///
  /// Lança uma exceção se a requisição falhar ou se o servidor retornar um erro.
  Future<List<Product>> getProductsByType(BuildContext context) async {
    final int groupId = getSelectedGroupId(context) ?? 0;
    final String path = "$apiUrl/Products/$groupId";
    final uri = Uri.parse(path);

    try {
      final token = getToken(context);
      print("URL de solicitação: $uri");

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
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((item) => Product.fromJson(item)).toList();
      } else {
        throw Exception(
            "Erro a encontrar produtos por tipo. Status: ${response.statusCode}, Resposta: ${response.body}");
      }
    } catch (e) {
      throw Exception("Erro a encontrar produtos: $e");
    }
  }

  /// Atualiza as informações de um produto existente.
  ///
  /// Parâmetros:
  /// - `id`: O ID do produto a ser atualizado.
  /// - `product`: O objeto `Product` contendo os novos dados.
  /// - `context`: O contexto de construção para acessar o grupo selecionado e o token de autenticação.
  ///
  /// Lança uma exceção se ocorrer um erro durante a requisição.
  Future<void> updateProduct(
      int id, Product product, BuildContext context) async {
    final int groupId = getSelectedGroupId(context) ?? 0;

    final String path = "$apiUrl/Products/update/$groupId/$id";
    final uri = Uri.parse(path);

    try {
      final token = getToken(context);

      HttpClient httpClient = HttpClient()
        ..badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;

      final ioClient = IOClient(httpClient);
      final response = await ioClient.put(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(product.toJson()),
      );

      if (response.statusCode == 200) {
        print("Produto atualizado com sucesso.");
      } else {
        print("Erro ao atualizar produto: ${response.statusCode}");
        throw Exception("Erro ao atualizar produto.");
      }
    } catch (e) {
      print("Erro ao atualizar produto: $e");
      rethrow;
    }
  }

  /// Exclui um produto baseado no ID fornecido.
  ///
  /// Parâmetros:
  /// - `id`: O ID do produto a ser excluído.
  /// - `context`: O contexto de construção para acessar o grupo selecionado e o token de autenticação.
  ///
  /// Lança uma exceção se ocorrer um erro durante a requisição.
  Future<void> deleteProduct(int id, BuildContext context) async {
    final int groupId = getSelectedGroupId(context) ?? 0;
    final String path = "$apiUrl/Products/delete/$groupId/$id";
    final uri = Uri.parse(path);

    try {
      final token = getToken(context);

      HttpClient httpClient = HttpClient()
        ..badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;

      final ioClient = IOClient(httpClient);
      final response = await ioClient.delete(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode != 200 && response.statusCode != 204) {
        throw Exception(
            "Erro ao eliminar produto. Status: ${response.statusCode}, Body: ${response.body}");
      }
    } catch (e) {
      print("Erro ao eliminar produto: $e");
      rethrow;
    }
  }

  /// Consome uma quantidade específica de um produto.
  ///
  /// Parâmetros:
  /// - `productId`: O ID do produto a ser consumido.
  /// - `quantityToConsume`: A quantidade a ser consumida.
  /// - `context`: O contexto de construção para aceder ao grupo selecionado e o token de autenticação.
  ///
  /// Lança uma exceção se ocorrer um erro durante a requisição.
  Future<void> consumeProduct(
      int productId, double quantityToConsume, BuildContext context) async {
    final int groupId = getSelectedGroupId(context) ?? 0;

    // Incluindo o parâmetro quantityToConsume na query string
    final String path =
        "$apiUrl/Products/$groupId/$productId/consume?quantityToConsume=$quantityToConsume";
    final uri = Uri.parse(path);

    try {
      final token = getToken(context);

      HttpClient httpClient = HttpClient()
        ..badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;

      final ioClient = IOClient(httpClient);
      final response = await ioClient.post(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        print("Produto consumido com sucesso.");
      } else {
        print("Erro ao consumir produto: ${response.statusCode}");
        throw Exception("Erro ao consumir produto.");
      }
    } catch (e) {
      print("Erro na requisição: $e");
      throw Exception("Erro na requisição ao servidor.");
    }
  }

  /// Recupera a lista de produtos pertencentes a um grupo específico.
  ///
  /// Parâmetros:
  /// - `context`: O contexto de construção para aceder ao grupo selecionado e o token de autenticação.
  ///
  /// Retorna:
  /// - Uma lista de produtos que pertencem ao grupo selecionado.
  Future<List<Product>> getProductsByGroup(BuildContext context) async {
    final groupId = getSelectedGroupId(context);
    if (groupId == null) {
      throw Exception("Nenhum grupo selecionado.");
    }

    final token = getToken(context);

    final String url = "$apiUrl/Products/$groupId";

    try {
      HttpClient httpClient = HttpClient()
        ..badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;
      final ioClient = IOClient(httpClient);

      final response = await ioClient.get(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((item) => Product.fromJson(item)).toList();
      } else if (response.statusCode == 400) {
        throw Exception("Requisição inválida: ${response.body}");
      } else if (response.statusCode == 404) {
        throw Exception("Nenhum produto encontrado para o grupo especificado.");
      } else if (response.statusCode == 500) {
        throw Exception("Erro no servidor. Tente novamente mais tarde.");
      } else {
        throw Exception(
            "Erro inesperado: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      print("Erro: $e");
      throw Exception("Erro ao requisitar produtos por grupo.");
    }
  }

  /// Recupera o inventário de produtos de um grupo.
  ///
  /// Parâmetros:
  /// - `context`: O contexto de construção para acessar o grupo selecionado e o token de autenticação.
  ///
  /// Retorna:
  /// - Uma lista de produtos presentes no inventário do grupo selecionado.
  Future<List<Product>> getInventory(BuildContext context) async {
    final int groupId = getSelectedGroupId(context) ?? 0;
    final url =
        Uri.parse('$apiUrl/Products/inventory/$groupId'); // A URL para a API

    try {
      final token = getToken(context);
      // Criando HttpClient customizado para ignorar a verificação de certificados SSL
      HttpClient httpClient = HttpClient()
        ..badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;

      final ioClient = IOClient(httpClient);

      // Fazendo a requisição GET com o HttpClient customizado
      final response = await ioClient.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
          'Accept':
              'application/json', // Adicionando o cabeçalho Accept, se necessário
        },
      );

      // Verificando o código de status da resposta
      if (response.statusCode == 200 || response.statusCode == 204) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((item) => Product.fromJson(item)).toList();
      } else {
        throw Exception(
            'Erro ao carregar inventário. Status: ${response.statusCode}, Body: ${response.body}');
      }
    } catch (e) {
      print("Erro ao carregar inventário: $e");
      rethrow; // Re-throwing the error after logging it
    }
  }
}
