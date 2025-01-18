import 'dart:convert';

/// Enumeração representando os papéis disponíveis de um utilizador no grupo.
///
/// - [Utilizador]: Representa um utilizador comum.
/// - [Admin]: Representa um administrador.
enum Role { Utilizador, Admin }

/// Representa um utilizador em um grupo, incluindo informações pessoais, preferências e o papel no grupo.
///
/// Essa classe é usada para modelar as informações de um uutilizador associado a um grupo em um sistema.
class UserInGroup {
  /// Identificador único do utilizador.
  final int id;

  /// Nome do utilizador.
  final String name;

  /// Endereço de e-mail do utilizador.
  final String email;

  /// Indica se o utilizador deseja receber notificações.
  final bool notifications;

  /// Papel do utilizador no grupo, representado pela enumeração [Role].
  final Role role;

  /// Construtor da classe [UserInGroup].
  ///
  /// - [id]: Identificador único do utilizador (obrigatório).
  /// - [name]: Nome do utilizador (obrigatório).
  /// - [email]: Endereço de e-mail do utilizador (obrigatório).
  /// - [notifications]: Indica se o utilizador deseja notificações (obrigatório).
  /// - [role]: Papel do utilizador no grupo (obrigatório).
  UserInGroup({
    required this.id,
    required this.name,
    required this.email,
    required this.notifications,
    required this.role,
  });

  /// Converte um mapa JSON em uma instância de [UserInGroup].
  /// 
  /// Observação: O papel do utilizador ([role]) é convertido de uma string
  /// para um valor da enumeração [Role].
  factory UserInGroup.fromJson(Map<String, dynamic> json) {
    Role role = Role.values[json['role']];

    return UserInGroup(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      notifications: json['notifications'],
      role: role,
    );
  }

  /// Converte uma instância de [UserInGroup] para um mapa JSON.
  /// 
  /// O papel do utilizador ([role]) é convertido de um valor da enumeração
  /// [Role] para uma string.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'notifications': notifications,
      'role': role.toString().split('.').last,
    };
  }
}
