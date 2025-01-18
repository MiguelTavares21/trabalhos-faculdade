/// Classe `Userdto`
///
/// Representa um utilizador no sistema, contendo informações como o identificador do utilizador,
/// email, nome e as preferências de notificação.
class Userdto {
  /// Identificador único do utilizador.
  final int Id;

  /// Email do utilizador.
  final String Email;

  /// Nome do utilizador.
  final String Name;

  /// Preferência de notificações do utilizador.
  final bool Notifications;

  /// Construtor da classe `Userdto`.
  ///
  /// - [Email] é o email do utilizador.
  /// - [Name] é o nome do utilizador.
  /// - [Id] é o identificador único do utilizador.
  /// - [Notifications] é a preferência de notificações do utilizador.
  const Userdto({
    required this.Email,
    required this.Name,
    required this.Id,
    required this.Notifications,
  });

  /// Converte um JSON num objeto `Userdto`.
  factory Userdto.fromJson(Map<String, dynamic> json) => Userdto(
      Email: json["email"],
      Name: json["name"],
      Id: json["id"],
      Notifications: json["notifications"]);

  /// Converte um objeto `Userdto` num JSON.
  Map<String, dynamic> toJson() => {
        "Email": Email,
        "Name": Name,
        "Id": Id,
        "notifications": Notifications,
      };
}
