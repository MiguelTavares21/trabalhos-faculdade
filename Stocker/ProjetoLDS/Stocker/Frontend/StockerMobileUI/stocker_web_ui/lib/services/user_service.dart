import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:http/io_client.dart';
import 'package:provider/provider.dart';
import 'package:stocker_web_ui/models/UserDto.dart';
import 'package:stocker_web_ui/models/userUpdateDto.dart';
import 'package:stocker_web_ui/services/group_provider.dart';
import 'package:stocker_web_ui/services/token_provider.dart';

class UserService {
  // A URL base da API.
  final String baseUri = "https://10.0.2.2:50001/api";

  UserService();

  /// Obtém o token de autenticação atual a partir do `TokenProvider`.
  ///
  /// Parâmetros:
  /// - `context`: O contexto atual do aplicativo.
  ///
  /// Retorna:
  /// - O token de autenticação, ou uma string vazia se o token não for encontrado.
  String getToken(BuildContext context) {
    return Provider.of<TokenProvider>(context, listen: false).token ?? '';
  }

  /// Obtém os dados do utilizador a partir da API.
  ///
  /// Parâmetros:
  /// - `context`: O contexto atual do aplicativo, necessário para aceder ao `TokenProvider`.
  ///
  /// Retorna:
  /// - O objeto `Userdto` contendo os dados do utilizador.
  ///
  /// Lança uma exceção se ocorrer algum erro durante a requisição.
  Future<Userdto> getUser(BuildContext context) async {
    final int userId = int.parse(
      Provider.of<TokenProvider>(context, listen: false).getUserIdFromToken() ??
          "0",
    );

    final String userPath = "$baseUri/Users/$userId";
    final uri = Uri.parse(userPath);

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
        return Userdto.fromJson(jsonDecode(response.body));
      } else {
        throw Exception(
            "Erro ao buscar utilizador: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      print("Erro ao carregar utilizador: $e");
      throw Exception("Erro ao carregar utilizador: $e");
    }
  }

  /// Edita os dados da conta do utilizador.
  ///
  /// Parâmetros:
  /// - `context`: O contexto atual do aplicativo, necessário para aceder ao `TokenProvider`.
  /// - `user`: O objeto `UserUpdateDto` contendo os dados a serem atualizados.
  ///
  /// Retorna:
  /// - O objeto `Userdto` atualizado após a requisição ser bem-sucedida.
  ///
  /// Lança uma exceção se ocorrer algum erro durante a requisição.
  Future<Userdto?> editAccount(BuildContext context, UserUpdateDto user) async {
    final String userPath = "$baseUri/Users/edit-account";
    final uri = Uri.parse(userPath);

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
        body: json.encode(user.toJson()),
      );

      if (response.statusCode == 200) {
        print(response.body);

        final tokenProvider =
            Provider.of<TokenProvider>(context, listen: false);
        tokenProvider.token = null;

        final groupProvider =
            Provider.of<GroupProvider>(context, listen: false);
        groupProvider.clearSelectedGroupId();

        return Userdto.fromJson(jsonDecode(response.body));
      } else if (response.statusCode == 400) {
        throw Exception(
            "Esse e-mail já se enocntra em uso por outro utilizador!");
      } else {
        throw Exception(
            "Erro ao atualizar a conta: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      print("Erro ao atualizar a conta: $e");
      rethrow;
    }
  }

  /// Altera a palavra-passe do utilizador.
  ///
  /// Parâmetros:
  /// - `context`: O contexto atual da aplicação, necessário para acessar o `TokenProvider`.
  /// - `currentPassword`: A palavra-passe atual do utilizador.
  /// - `newPassword`: A nova palavra-passe desejada.
  ///
  /// Retorna:
  /// - Nada (void) se a alteração da palavra-passe for bem-sucedida.
  ///
  /// Lança uma exceção se ocorrer algum erro durante a requisição.
  Future<void> changePassword(
      BuildContext context, String currentPassword, String newPassword) async {
    final String userPath = "$baseUri/Users/change-password";
    final uri = Uri.parse(userPath);

    try {
      final token = getToken(context);

      final passwordDto = {
        'NovaPass': newPassword,
        'PassAtual': currentPassword,
      };

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
        body: json.encode(passwordDto),
      );

      if (response.statusCode == 200) {
        print('Senha alterada com sucesso');
        return;
      } else if (response.statusCode == 400) {
        throw Exception("Pass atual inválida.");
      } else {
        throw Exception(
            "Erro ao alterar senha: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      print("Erro ao alterar a senha: $e");
      rethrow;
    }
  }
}
