/// Representa os dados de atualização de um utilizador, incluindo e-mail, 
/// nome e preferências de notificações.
///
/// Essa classe é usada para modelar as informações que podem ser 
/// alteradas de um utilizador, como parte de uma operação de atualização no sistema.
class UserUpdateDto {
  /// Endereço de e-mail do utilizador.
  final String Email;

  /// Nome do utilizador.
  final String Name;

  /// Indica se o utilizador deseja receber notificações.
  final bool Notifications;

  /// Construtor da classe [UserUpdateDto].
  ///
  /// - [Email]: Endereço de e-mail do utilizador (obrigatório).
  /// - [Name]: Nome do utilizador (obrigatório).
  /// - [Notifications]: Indica se o utilizador deseja notificações (obrigatório).
  const UserUpdateDto({
    required this.Email,
    required this.Name,
    required this.Notifications,
  });

  /// Converte um mapa JSON numa instância de [UserUpdateDto].
  factory UserUpdateDto.fromJson(Map<String, dynamic> json) => UserUpdateDto(
      Email: json["email"],
      Name: json["name"],
      Notifications: json["notifications"]);

  /// Converte uma instância de [UserUpdateDto] para um mapa JSON.
  Map<String, dynamic> toJson() => {
        "Email": Email,
        "Name": Name,
        "notifications": Notifications,
      };
}
