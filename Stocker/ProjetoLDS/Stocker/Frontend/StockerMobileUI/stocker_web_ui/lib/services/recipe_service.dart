import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/io_client.dart';
import 'package:provider/provider.dart';
import 'package:stocker_web_ui/models/ProductInRecipeDto.dart';
import 'package:stocker_web_ui/models/ProductToRecipeDto.dart';
import 'package:stocker_web_ui/models/RecipeDto.dart';
import 'package:stocker_web_ui/services/group_provider.dart';
import 'package:stocker_web_ui/services/token_provider.dart';

import 'package:http/http.dart' as http;

// Serviço para manipulação de receitas
class RecipeService {
  final String apiUrl = "https://10.0.2.2:50001/api";

  /// Recupera o token de autenticação do utilizador do contexto.
  ///
  /// Parâmetros:
  /// - `context`: O contexto de construção onde o token do utilizador é armazenado.
  ///
  /// Retorna:
  /// - O token de autenticação do utilizador.
  String getToken(BuildContext context) {
    // Obtenha o token de autenticação do utilizador
    return Provider.of<TokenProvider>(context, listen: false).token ?? '';
  }

  /// Recupera o ID do grupo selecionado a partir do contexto.
  ///
  /// Parâmetros:
  /// - `context`: O contexto de construção onde o ID do grupo é armazenado.
  ///
  /// Retorna:
  /// - O ID do grupo selecionado ou `null` caso não tenha um grupo selecionado.
  int? getSelectedGroupId(BuildContext context) {
    return Provider.of<GroupProvider>(context, listen: false).selectedGroupId;
  }

  /// Recupera a lista de receitas de um grupo específico.
  ///
  /// Parâmetros:
  /// - `context`: O contexto que contém informações sobre o grupo e o token.
  ///
  /// Retorna:
  /// - Lista de receitas do grupo.
  /// - Lança uma exceção caso não consiga recuperar as receitas.
  Future<List<RecipeDto>> getGroupRecipes(BuildContext context) async {
    final int groupId = getSelectedGroupId(context) ?? 0;
    final String path = "$apiUrl/Recipe/$groupId/recipes";
    final uri = Uri.parse(path);
    List<RecipeDto> recipes = [];

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
        recipes = jsonResponse.map((e) => RecipeDto.fromJson(e)).toList();
      } else {
        recipes = [];
      }
    } catch (e) {
      print("Erro ao carregar receitas: $e");
      throw Exception("Erro ao carregar as receitas: $e");
    }
    return recipes;
  }

  /// Elimina uma receita existente de um grupo.
  ///
  /// Parâmetros:
  /// - `recipeId`: ID da receita que será deletada.
  /// - `context`: O contexto que contém o token e o grupo.
  ///
  /// Lança uma exceção caso a remoção da receita falhe.
  Future<void> deleteRecipe(int recipeId, BuildContext context) async {
    final int groupId = getSelectedGroupId(context) ?? 0;
    final String path = "$apiUrl/Recipe/$groupId/recipes";
    final uri = Uri.parse(path).replace(queryParameters: {
      'recipeId': recipeId.toString(),
    });

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
            "Erro ao apagar receita: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      print("Erro ao apagar receita: $e");
      throw Exception("Erro ao apagar receita: $e");
    }
  }

  /// Marca uma receita como consumida.
  ///
  /// Parâmetros:
  /// - `recipeId`: ID da receita a ser consumida.
  /// - `context`: O contexto que contém o token e o grupo.
  ///
  /// Lança uma exceção caso a operação falhe.
  Future<void> consumeRecipe(int recipeId, BuildContext context) async {
    final int groupId = getSelectedGroupId(context) ?? 0;
    final String path = "$apiUrl/Recipe/$groupId/recipes/$recipeId/consume";
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
          'Content-type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode != 204) {
        throw Exception(
            "Erro ao consumir receita: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      print("Erro ao consumir receita: $e");
      throw Exception("Erro ao consumir receita: $e");
    }
  }

  /// Cria uma nova receita para o grupo.
  ///
  /// Parâmetros:
  /// - `context`: O contexto que contém o token e o grupo.
  /// - `recipeName`: Nome da nova receita.
  ///
  /// Retorna:
  /// - A receita recém-criada.
  /// Lança uma exceção caso a criação da receita falhe.
  Future<RecipeDto> createRecipe(
      BuildContext context, String recipeName) async {
    final int groupId = getSelectedGroupId(context) ?? 0;
    final String path = "$apiUrl/Recipe/$groupId/recipes";
    final uri = Uri.parse(path);
    RecipeDto createdRecipe;

    try {
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
        body: json.encode({'name': recipeName}),
      );

      if (response.statusCode == 201) {
        final dynamic jsonResponse = json.decode(response.body);
        createdRecipe = RecipeDto.fromJson(jsonResponse);
      } else {
        throw Exception(
            "Erro ao criar receita: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      print("Erro ao criar receita: $e");
      throw Exception("Erro ao criar receita: $e");
    }
    return createdRecipe;
  }

  /// Recupera os ingredientes de uma receita.
  ///
  /// Parâmetros:
  /// - `context`: O contexto que contém o token e o grupo.
  /// - `recipeId`: ID da receita para a qual queremos os ingredientes.
  ///
  /// Retorna:
  /// - Lista de ingredientes da receita.
  /// Lança uma exceção caso a requisição falhe.
  Future<List<ProductInRecipeDto>> getRecipeIngredients(
      BuildContext context, int recipeId) async {
    final int groupId = getSelectedGroupId(context) ?? 0;
    final String path = "$apiUrl/Recipe/$groupId/recipes/$recipeId/products";
    final uri = Uri.parse(path);
    List<ProductInRecipeDto> ingredients = [];

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
        ingredients =
            jsonResponse.map((e) => ProductInRecipeDto.fromJson(e)).toList();
      } else {
        throw Exception(
            "Erro ao buscar ingredientes: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      print("Erro ao carregar ingredientes: $e");
      throw Exception("Erro ao carregar os ingredientes: $e");
    }
    return ingredients;
  }

  /// Edita o nome de uma receita existente.
  ///
  /// Parâmetros:
  /// - `recipeId`: ID da receita a ser editada.
  /// - `context`: O contexto que contém o token e o grupo.
  /// - `newName`: Novo nome para a receita.
  ///
  /// Retorna:
  /// - A receita editada.
  /// Lança uma exceção caso a edição falhe.
  Future<RecipeDto> editRecipeName(
      int recipeId, BuildContext context, String newName) async {
    final int groupId = getSelectedGroupId(context) ?? 0;
    final String path = "$apiUrl/Recipe/$groupId/recipes/$recipeId/edit";
    final uri = Uri.parse(path);
    RecipeDto editedRecipe;

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
        body: json.encode({'name': newName}),
      );

      if (response.statusCode == 200) {
        final dynamic jsonResponse = json.decode(response.body);
        editedRecipe = RecipeDto.fromJson(jsonResponse);
      } else {
        throw Exception(
            "Erro ao editar receita: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      print("Erro ao editar receita: $e");
      throw Exception("Erro ao editar receita: $e");
    }
    return editedRecipe;
  }

  /// Adiciona um produto a uma receita.
  ///
  /// Parâmetros:
  /// - `context`: O contexto que contém o token e o grupo.
  /// - `recipeId`: ID da receita à qual o produto será adicionado.
  /// - `productToAdd`: Produto a ser adicionado à receita.
  ///
  /// Lança uma exceção caso a adição falhe.
  Future<void> addProductToRecipe(BuildContext context, int recipeId,
      ProductToRecipeDto productToAdd) async {
    final int groupId = getSelectedGroupId(context) ?? 0;
    final String path = "$apiUrl/Recipe/$groupId/recipes/$recipeId";
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
          'Content-type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(productToAdd),
      );

      if (response.statusCode != 204) {
        throw Exception(
            "Erro ao adicionar produto: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      print("Erro ao adicionar produto: $e");
      throw Exception("Erro ao adicionar produto: $e");
    }
  }

  /// Remove um produto de uma receita.
  ///
  /// Parâmetros:
  /// - `context`: O contexto que contém o token e o grupo.
  /// - `recipeId`: ID da receita de onde o produto será removido.
  /// - `productId`: ID do produto a ser removido da receita.
  ///
  /// Lança uma exceção caso a remoção falhe.
  Future<void> removeProductFromRecipe(
      BuildContext context, int recipeId, int productId) async {
    final int groupId = getSelectedGroupId(context) ?? 0;
    final String path = "$apiUrl/Recipe/$groupId/recipes/$recipeId";
    final uri = Uri.parse(path).replace(queryParameters: {
      'productId': productId.toString(),
    });

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
            "Erro ao remover produto da receita: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      print("Erro ao remover produto da receita: $e");
      throw Exception("Erro ao remover produto da receita: $e");
    }
  }

  /// Edita um produto dentro de uma receita.
  ///
  /// Parâmetros:
  /// - `context`: O contexto que contém o token e o grupo.
  /// - `recipeId`: ID da receita onde o produto será editado.
  /// - `editedProduct`: Produto editado.
  ///
  /// Lança uma exceção caso a edição falhe.
  Future<void> editProductInRecipe(BuildContext context, int recipeId,
      ProductToRecipeDto editedProduct) async {
    final int groupId = getSelectedGroupId(context) ?? 0;
    final String path = "$apiUrl/Recipe/$groupId/recipes/$recipeId/editProduct";
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
          'Content-type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(editedProduct),
      );

      if (response.statusCode != 204) {
        throw Exception(
            "Erro ao editar o produto: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      print("Erro ao editar o produto: $e");
      throw Exception("Erro ao editar o produto: $e");
    }
  }
}
