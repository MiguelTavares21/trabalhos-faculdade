import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/io_client.dart';
import 'package:provider/provider.dart';
import 'package:stocker_web_ui/models/productConsuptionDto.dart';
import 'package:stocker_web_ui/models/productStatisticsDto.dart';
import 'package:stocker_web_ui/models/spendingStatisticsDto.dart';
import 'package:stocker_web_ui/models/typeStatisticsDto.dart';
import 'token_provider.dart';
import 'group_provider.dart';

// Service para obter estatísticas de gastos e consumo
class StatisticService {
  final String baseUri = "https://10.0.2.2:50001/api";

  StatisticService();

  /// Recupera o token de autenticação do contexto.
  ///
  /// Parâmetros:
  /// - `context`: O contexto onde o token está armazenado.
  ///
  /// Retorna:
  /// - O token de autenticação ou null se não encontrado.
  String? getToken(BuildContext context) {
    return Provider.of<TokenProvider>(context, listen: false).token;
  }

  /// Recupera o ID do grupo selecionado a partir do contexto.
  ///
  /// Parâmetros:
  /// - `context`: O contexto onde o ID do grupo está armazenado.
  ///
  /// Retorna:
  /// - O ID do grupo selecionado ou null se não encontrado.
  int? getSelectedGroupId(BuildContext context) {
    return Provider.of<GroupProvider>(context, listen: false).selectedGroupId;
  }

  /// Recupera a estatística de gastos totais de um grupo no intervalo de datas fornecido.
  ///
  /// Parâmetros:
  /// - `context`: O contexto que contém o token e o grupo.
  /// - `startDate`: Data de início do intervalo.
  /// - `endDate`: Data de fim do intervalo.
  ///
  /// Retorna:
  /// - Um objeto `SpendingStatisticsDto` com os dados de gastos totais.
  ///
  /// Lança uma exceção caso falhe ao recuperar os dados.
  Future<SpendingStatisticsDto> getTotalSpent(
    BuildContext context, {
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    final groupId = getSelectedGroupId(context);
    if (groupId == null) {
      throw Exception("Nenhum grupo selecionado.");
    }

    final String url =
        "$baseUri/statistics/total-spent/$groupId?startDate=${startDate.toIso8601String()}&endDate=${endDate.toIso8601String()}";
    final token = getToken(context);

    if (token == null) {
      throw Exception("Token não encontrado. Por favor, faça login novamente.");
    }

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
        final Map<String, dynamic> responseBody = json.decode(response.body);
        return SpendingStatisticsDto.fromJson(responseBody);
      } else if (response.statusCode == 400) {
        throw Exception(response.body);
      } else if (response.statusCode == 500) {
        throw Exception("Erro no servidor. Tente novamente mais tarde.");
      } else {
        throw Exception(
            "Erro inesperado: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      rethrow;
    }
  }

  /// Recupera as estatísticas de consumo de produtos de um grupo no intervalo de datas fornecido.
  ///
  /// Parâmetros:
  /// - `context`: O contexto que contém o token e o grupo.
  /// - `startDate`: Data de início do intervalo.
  /// - `endDate`: Data de fim do intervalo.
  ///
  /// Retorna:
  /// - Uma lista de objetos `ProductConsumptionDto` com os dados de consumo.
  ///
  /// Lança uma exceção caso falhe ao recuperar os dados.
  Future<List<ProductConsumptionDto>> getTotalConsumption(
    BuildContext context, {
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    final groupId = getSelectedGroupId(context);
    if (groupId == null) {
      throw Exception("Nenhum grupo selecionado.");
    }

    final String url =
        "$baseUri/statistics/consumption-stats/$groupId?startDate=${startDate.toIso8601String()}&endDate=${endDate.toIso8601String()}";
    final token = getToken(context);

    if (token == null) {
      throw Exception("Token não encontrado. Por favor, faça login novamente.");
    }

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
        final List<dynamic> responseBody = json.decode(response.body);
        return responseBody
            .map((item) => ProductConsumptionDto.fromJson(item))
            .toList();
      } else if (response.statusCode == 400) {
        throw Exception(response.body);
      } else if (response.statusCode == 500) {
        throw Exception("Erro no servidor. Tente novamente mais tarde.");
      } else {
        throw Exception(
            "Erro inesperado: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      rethrow;
    }
  }

  /// Recupera as estatísticas de tipo de produto de um grupo no intervalo de datas fornecido.
  ///
  /// Parâmetros:
  /// - `context`: O contexto que contém o token e o grupo.
  /// - `productType`: Tipo de produto para o qual as estatísticas são solicitadas.
  /// - `startDate`: Data de início do intervalo.
  /// - `endDate`: Data de fim do intervalo.
  ///
  /// Retorna:
  /// - Um objeto `TypeStatisticsDto` com os dados das estatísticas de tipo.
  ///
  /// Lança uma exceção caso falhe ao recuperar os dados.
  Future<TypeStatisticsDto> getTypeStatistics(
    BuildContext context, {
    required String productType,
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    final groupId = getSelectedGroupId(context);
    if (groupId == null) {
      throw Exception("Nenhum grupo selecionado.");
    }

    final String url =
        "$baseUri/statistics/type-statistics/$groupId/$productType?startDate=${startDate.toIso8601String()}&endDate=${endDate.toIso8601String()}";
    final token = getToken(context);

    if (token == null) {
      throw Exception("Token não encontrado. Por favor, faça login novamente.");
    }

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
        final Map<String, dynamic> responseBody = json.decode(response.body);
        return TypeStatisticsDto.fromJson(responseBody);
      } else if (response.statusCode == 400) {
        throw Exception(response.body);
      } else if (response.statusCode == 500) {
        throw Exception("Erro no servidor. Tente novamente mais tarde.");
      } else {
        throw Exception(
            "Erro inesperado: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      rethrow;
    }
  }

  /// Recupera as estatísticas de um produto específico de um grupo no intervalo de datas fornecido.
  ///
  /// Parâmetros:
  /// - `context`: O contexto que contém o token e o grupo.
  /// - `productId`: ID do produto para o qual as estatísticas são solicitadas.
  /// - `startDate`: Data de início do intervalo.
  /// - `endDate`: Data de fim do intervalo.
  ///
  /// Retorna:
  /// - Um objeto `ProductStatisticsDto` com os dados das estatísticas do produto.
  ///
  /// Lança uma exceção caso falhe ao recuperar os dados.
  Future<ProductStatisticsDto> getProductStatistics(
    BuildContext context, {
    required int productId,
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    final groupId = getSelectedGroupId(context);
    if (groupId == null) {
      throw Exception("Nenhum grupo selecionado.");
    }

    final token = getToken(context);

    if (token == null) {
      throw Exception("Token não encontrado. Por favor, faça login novamente.");
    }

    final String url =
        "$baseUri/statistics/product-statistics/$groupId/$productId?startDate=${startDate.toIso8601String()}&endDate=${endDate.toIso8601String()}";

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
        final Map<String, dynamic> responseBody = json.decode(response.body);
        return ProductStatisticsDto.fromJson(responseBody);
      } else if (response.statusCode == 400) {
        throw Exception(response.body);
      } else if (response.statusCode == 500) {
        throw Exception("Erro no servidor. Tente novamente mais tarde.");
      } else {
        throw Exception(
            "Erro inesperado: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      rethrow;
    }
  }
}
