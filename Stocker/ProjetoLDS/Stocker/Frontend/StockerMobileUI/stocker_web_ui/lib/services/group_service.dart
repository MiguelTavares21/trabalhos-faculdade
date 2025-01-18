import 'dart:convert';
import 'dart:io';
import 'package:http/io_client.dart';
import 'package:provider/provider.dart';
import 'package:stocker_web_ui/models/UserDto.dart';
import 'package:stocker_web_ui/models/UserInGroupDto.dart';
import 'package:stocker_web_ui/models/group.dart';
import 'package:flutter/material.dart';
import 'package:stocker_web_ui/models/groupCreatedDto.dart';
import 'package:stocker_web_ui/services/group_provider.dart';
import 'token_provider.dart';

/// O [GroupService] é responsável por todas as operações relacionadas aos grupos,
/// como obter, criar, editar, eliminar grupos, além de gerir membros e permissões.
class GroupService {
  final String baseUri = "https://10.0.2.2:50001/api";

  GroupService();

  /// Obtém o token de autenticação do [TokenProvider] no contexto.
  ///
  /// Retorna:
  /// - [String?] o token do utilizador ou [null] se o token não estiver disponível.
  String? getToken(BuildContext context) {
    return Provider.of<TokenProvider>(context, listen: false).token;
  }

  /// Obtém o ID do grupo selecionado do [GroupProvider].
  ///
  /// Retorna:
  /// - [int?] o ID do grupo selecionado ou [null] se não houver grupo selecionado.
  int? getSelectedGroupId(BuildContext context) {
    return Provider.of<GroupProvider>(context, listen: false).selectedGroupId;
  }

  /// Obtém todos os grupos do utilizador autenticado.
  ///
  /// Parâmetro:
  /// - [BuildContext] contexto da aplicação para acessar os provedores de token e grupos.
  ///
  /// Retorna:
  /// - [List<Group>] lista de grupos associados ao utilizador.
  Future<List<Group>> getUserGroups(BuildContext context) async {
    final String groupsPath = "$baseUri/Users/getGroups";
    final uri = Uri.parse(groupsPath);
    List<Group> groups = [];

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
        groups = jsonResponse.map((e) => Group.fromJson(e)).toList();
      } else {
        throw Exception(
            "Erro ao buscar grupos: ${response.statusCode} - ${response.body}");
      }
    } catch (e) {
      print("Erro ao carregar grupos: $e");
      throw Exception("Erro ao carregar os grupos: $e");
    }
    return groups;
  }

  /// Permite que o utilizador entre em um grupo usando um código de acesso.
  ///
  /// Parâmetros:
  /// - [accessCode]: O código de acesso do grupo.
  /// - [BuildContext] contexto da aplicação para aceder ao token do utilizador.
  Future<void> joinGroup(String accessCode, BuildContext context) async {
    final String path = "$baseUri/Users/join-group";
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
        body: json.encode(accessCode),
      );
      if (response.statusCode == 200) {
        print("Utilizador entrou no grupo com sucesso!");
      } else if (response.statusCode == 404) {
        throw Exception(
            "Código de acesso inválido. O grupo não foi encontrado.");
      } else if (response.statusCode == 400) {
        throw Exception("Você já faz parte deste grupo.");
      } else {
        throw Exception(
            "Erro ao tentar entrar no grupo. Status: ${response.statusCode}");
      }
    } catch (e) {
      print("$e");
      rethrow;
    }
  }

  /// Cria um novo grupo.
  ///
  /// Parâmetros:
  /// - [group]: O objeto [GroupCreate] contendo as informações do grupo a ser criado.
  /// - [BuildContext] contexto da aplicação para acessar o token do utilizador.
  ///
  /// Retorna:
  /// - [Group] o grupo recém-criado.
  Future<Group> createGroup(GroupCreate group, BuildContext context) async {
    final String path = "$baseUri/Groups/create";
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
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(group.toJson()),
      );

      if (response.statusCode == 201) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        print("Grupo criado com sucesso!");
        return Group.fromJson(responseData);
      } else if (response.statusCode == 400) {
        final responseData = json.decode(response.body);
        String errorMessage = responseData['Error'] ?? "Erro ao criar o grupo.";
        throw Exception(errorMessage);
      } else {
        throw Exception(
            "Erro ao criar grupo. Status: ${response.statusCode}, Body: ${response.body}");
      }
    } catch (e) {
      print("Erro ao criar grupo: $e");
      rethrow;
    }
  }

  /// Obtém os detalhes de um grupo específico.
  ///
  /// Parâmetro:
  /// - [BuildContext] contexto da aplicação para acessar o token do utilizador e o ID do grupo selecionado.
  ///
  /// Retorna:
  /// - [Group] o grupo com os detalhes solicitados.
  Future<Group> getGroupDetails(BuildContext context) async {
    final groupId = getSelectedGroupId(context);
    if (groupId == null) {
      throw Exception("Nenhum grupo selecionado.");
    }

    final String path = "$baseUri/Groups/$groupId";
    final uri = Uri.parse(path);

    try {
      final token = getToken(context);

      HttpClient httpClient = HttpClient()
        ..badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;

      final ioClient = IOClient(httpClient);
      final response = await ioClient.get(
        uri,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        return Group.fromJson(responseData);
      } else {
        throw Exception("Erro ao obter o grupo: ${response.statusCode}");
      }
    } catch (e) {
      print("Erro ao carregar grupo: $e");
      rethrow;
    }
  }

  /// Obtém a lista de utilizadores de um grupo.
  ///
  /// Parâmetro:
  /// - [BuildContext] contexto da aplicação para acessar o token do utilizador e o ID do grupo selecionado.
  ///
  /// Retorna:
  /// - [List<UserInGroup>] lista de utilizadores no grupo selecionado.
  Future<List<UserInGroup>> getGroupUsers(BuildContext context) async {
    final groupId = getSelectedGroupId(context);
    if (groupId == null) {
      throw Exception("Nenhum grupo selecionado.");
    }

    final String path = "$baseUri/Groups/$groupId/getUsers";
    final uri = Uri.parse(path);

    try {
      final token = getToken(context);

      HttpClient httpClient = HttpClient()
        ..badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;

      final ioClient = IOClient(httpClient);
      final response = await ioClient.get(
        uri,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> jsonResponse = json.decode(response.body);
        return jsonResponse.map((e) => UserInGroup.fromJson(e)).toList();
      } else {
        throw Exception(
            "Erro ao obter os utilizadores: ${response.statusCode}");
      }
    } catch (e) {
      print("Erro: $e");
      rethrow;
    }
  }

  /// Obtém o papel (role) de um utilizador dentro de um grupo.
  ///
  /// Parâmetros:
  /// - [BuildContext] contexto da aplicação para acessar o token do utilizador e o ID do grupo selecionado.
  ///
  /// Retorna:
  /// - [String] o papel do utilizador no grupo.
  Future<String> getUserRole(BuildContext context) async {
    final groupId = getSelectedGroupId(context);
    if (groupId == null) {
      throw Exception("Nenhum grupo selecionado.");
    }

    final userId =
        Provider.of<TokenProvider>(context, listen: false).getUserIdFromToken();
    if (userId == null) {
      throw Exception("Não foi possível obter o ID do utilizador.");
    }

    final String path = "$baseUri/Groups/$groupId/users/$userId/role";
    final uri = Uri.parse(path);
    try {
      final token = getToken(context);

      HttpClient httpClient = HttpClient()
        ..badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;

      final ioClient = IOClient(httpClient);
      final response = await ioClient.get(
        uri,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        return responseData['role'] ?? 'Nenhuma role encontrada';
      } else {
        throw Exception(
            "Erro ao obter a role do utilizador: ${response.statusCode}");
      }
    } catch (e) {
      print("Erro: $e");
      rethrow;
    }
  }

  /// Função responsável por o utilizador sair de um grupo.
  ///
  /// A função envia uma solicitação `DELETE` para a API para remover o utilizador do grupo selecionado.
  /// Se o grupo não for encontrado ou não houver um grupo selecionado, será lançada uma exceção.
  ///
  /// Parâmetros:
  /// - `context`: O contexto de construção (necessário para recuperar o ID do grupo e o token).
  Future<void> leaveGroup(BuildContext context) async {
    final groupId = getSelectedGroupId(context);
    if (groupId == null) {
      throw Exception("Nenhum grupo selecionado.");
    }

    final String path = "$baseUri/Groups/leave/$groupId";
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
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 204) {
        print("Saiu do grupo com sucesso.");
      } else if (response.statusCode == 404) {
        throw Exception("Grupo ou utilizador não encontrado.");
      } else {
        throw Exception("Erro ao sair do grupo: ${response.statusCode}");
      }
    } catch (e) {
      print("Erro: $e");
      rethrow;
    }
  }

  /// Função responsável por excluir um grupo.
  ///
  /// Envia uma solicitação `DELETE` para a API para remover o grupo selecionado.
  /// Se o grupo não for encontrado, uma exceção será lançada.
  ///
  /// Parâmetros:
  /// - `context`: O contexto de construção (necessário para recuperar o ID do grupo e o token).
  Future<void> deleteGroup(BuildContext context) async {
    final groupId = getSelectedGroupId(context);
    if (groupId == null) {
      throw Exception("Nenhum grupo selecionado.");
    }

    final String path = "$baseUri/Groups/delete-group/$groupId";
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
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 204) {
        print("Grupo removido com sucesso.");
      } else if (response.statusCode == 404) {
        throw Exception("Grupo não encontrado.");
      } else {
        throw Exception("Erro ao remover grupo: ${response.statusCode}");
      }
    } catch (e) {
      print("Erro: $e");
      rethrow;
    }
  }

  /// Função responsável por editar um grupo.
  ///
  /// Envia uma solicitação `PUT` para a API para editar os dados de um grupo específico.
  ///
  /// Parâmetros:
  /// - `groupId`: ID do grupo a ser editado.
  /// - `group`: Objeto com os novos dados para o grupo.
  /// - `context`: O contexto de construção (necessário para recuperar o token de autenticação).
  Future<void> editGroup(
      int groupId, GroupCreate group, BuildContext context) async {
    final String path = "$baseUri/Groups/edit-group/$groupId";
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
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(group.toJson()),
      );

      if (response.statusCode == 200) {
        print("Grupo editado com sucesso!");
      } else {
        throw Exception("Erro ao editar o grupo: ${response.statusCode}");
      }
    } catch (e) {
      print("Erro ao editar o grupo: $e");
      rethrow;
    }
  }

  /// Função responsável por alterar o papel (role) de um utilizador dentro de um grupo.
  ///
  /// Envia uma solicitação `PUT` para a API para alterar o papel de um utilizador específico em um grupo.
  ///
  /// Parâmetros:
  /// - `userId`: ID do usuário que terá o papel alterado.
  /// - `context`: O contexto de construção (necessário para recuperar o ID do grupo e o token de autenticação).
  Future<void> changeUserRole(int userId, BuildContext context) async {
    final groupId = getSelectedGroupId(context);
    if (groupId == null) {
      throw Exception("Nenhum grupo selecionado.");
    }

    final String path = "$baseUri/Groups/$groupId/changeRole/$userId";
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
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        print("Role alterada com sucesso!");
      } else {
        throw Exception("Erro ao mudar role. Status: ${response.statusCode}");
      }
    } catch (e) {
      print("Erro ao mudar role: $e");
      rethrow;
    }
  }

  /// Função responsável por remover um utilizador de um grupo.
  ///
  /// Envia uma solicitação `DELETE` para a API para remover um utilizador de um grupo.
  ///
  /// Parâmetros:
  /// - `userId`: ID do utilizador a ser removido.
  /// - `context`: O contexto de construção (necessário para recuperar o ID do grupo e o token de autenticação).
  Future<void> removeUserFromGroup(int userId, BuildContext context) async {
    final groupId = getSelectedGroupId(context);
    if (groupId == null) {
      throw Exception("Nenhum grupo selecionado.");
    }

    final String path = "$baseUri/Groups/$groupId/remove-member/$userId";
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
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        print("Membro removido com sucesso!");
      } else {
        throw Exception(
            "Erro ao remover membro. Status: ${response.statusCode}");
      }
    } catch (e) {
      print("Erro ao remover membro: $e");
      rethrow;
    }
  }
}
