import 'package:flutter/material.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class TokenProvider with ChangeNotifier {
  String? _token;

  /// Obtém o token atual armazenado no provedor.
  ///
  /// Retorna:
  /// - O token de autenticação atual ou null, se não estiver presente.
  String? get token => _token;

  /// Define um novo token no provedor e notifica os ouvintes sobre a mudança.
  ///
  /// Parâmetros:
  /// - `newToken`: O novo token que será armazenado.
  ///
  /// A função chama `notifyListeners()` para notificar que o valor foi alterado.
  set token(String? newToken) {
    _token = newToken;
    notifyListeners();
  }

  /// Obtém o ID do utilizador a partir do token decodificado.
  ///
  /// A função tenta decodificar o payload do token e recuperar o valor associado
  /// à chave 'nameidentifier', que contém o ID do usuário.
  ///
  /// Retorna:
  /// - O ID do utilizador como uma String, ou null se o token for inválido ou se
  ///   o ID do usuário não puder ser recuperado.
  ///
  /// Lança uma exceção e regista um erro se a decodificação falhar.
  String? getUserIdFromToken() {
    if (_token == null) return null;

    try {
      // Decodifica o payload do token
      Map<String, dynamic> decodedToken = JwtDecoder.decode(_token!);

      final String userId = decodedToken[
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
          .toString();

      // Retorna o campo 'nameidentifier' como String
      return userId;
    } catch (e) {
      // Lida com possíveis erros
      debugPrint('Erro ao decodificar o token: $e');
      return null;
    }
  }

  /// Verifica se o token é válido, ou seja, se não está expirado.
  ///
  /// A função utiliza a biblioteca `jwt_decoder` para verificar a validade
  /// do token, retornando `false` se o token for nulo ou expirado.
  ///
  /// Retorna:
  /// - `true` se o token for válido (não expirado), ou
  /// - `false` se o token for nulo ou expirado.
  bool isTokenValid() {
    if (_token == null) return false;

    return !JwtDecoder.isExpired(_token!);
  }
}
