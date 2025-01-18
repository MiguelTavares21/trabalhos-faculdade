import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:http/io_client.dart';
import 'package:flutter/material.dart';
import 'package:stocker_web_ui/models/UserRegisterDto.dart';
import 'package:stocker_web_ui/models/group.dart';
import 'package:provider/provider.dart';
import 'token_provider.dart';

/// Classe responsável por lidar com as requisições à API.
class ApiHandler {
  // URI base da API, utilizada para montar os caminhos das requisições.
  final String baseUri = "https://10.0.2.2:50001/api";

  ApiHandler();

  /// Realiza o login do utilizador utilizando o e-mail e palavra-passe fornecidos.
  ///
  /// Parâmetros:
  /// - [email]: O e-mail do utilizador para login.
  /// - [password]: A palavra-passe do utilizador para login.
  /// - [context]: O contexto do Flutter, usado para aceder ao [Provider].
  ///
  /// Retorna uma lista com o token de autenticação, ou uma lista vazia se o login falhar.
  Future<List<String>> login(
      String email, String password, BuildContext context) async {
    List<String> data = [];
    String loginPath = baseUri + "/Users/login";
    final uri = Uri.parse(loginPath);

    try {
      HttpClient httpClient = HttpClient()
        ..badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;

      final ioClient = IOClient(httpClient);
      final response = await ioClient.post(
        uri,
        headers: <String, String>{
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          'Email': email,
          'Password': password,
        }),
      );

      print("Response status: ${response.statusCode}");
      print("Response body: ${response.body}");

      if (response.statusCode >= 200 && response.statusCode <= 299) {
        final Map<String, dynamic> jsonResponse = json.decode(response.body);
        if (jsonResponse.containsKey('token')) {
          String token = jsonResponse['token'];
          Provider.of<TokenProvider>(context, listen: false).token = token;
          data.add(token);
        } else {
          print('Token não encontrado no retorno da API');
        }
      }
    } catch (e) {
      print("Error: $e");
    }
    return data;
  }

  /// Realiza o registo de um novo utilizador.
  ///
  /// Parâmetros:
  /// - [user]: Um objeto do tipo [UserRegisterDto] contendo os dados do novo utilizador.
  ///
  /// Retorna:
  /// - [true] se o registo for bem-sucedido.
  /// - [false] se o registo falhar.
  Future<bool> register(Userregisterdto user) async {
    String registerPath = baseUri + "/Users/register";
    final uri = Uri.parse(registerPath);

    try {
      HttpClient httpClient = HttpClient()
        ..badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;

      final ioClient = IOClient(httpClient);
      final response = await ioClient.post(
        uri,
        headers: <String, String>{
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          'Email': user.Email,
          'Password': user.Password,
          'Name': user.Name,
          'PasswordConfirmation': user.PasswordConfirmation,
        }),
      );

      print("Response status: ${response.statusCode}");
      print("Response body: ${response.body}");

      if (response.statusCode >= 200 && response.statusCode <= 299) {
        return true;
      }
    } catch (e) {
      print("Error: $e");
    }
    return false;
  }
}
