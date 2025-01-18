/// Classe `Userregisterdto`
///
/// Representa os dados necessários para o registo de um utilizador, contendo o email,
/// a palavra-passe, a confirmação da palavra-passe e o nome do utilizador.
class Userregisterdto {
  /// Email do utilizador.
  final String Email;

  /// Palavra-passe do utilizador.
  final String Password;

  /// Confirmação da palavra-passe do utilizador.
  final String PasswordConfirmation;

  /// Nome do utilizador.
  final String Name;

  /// Construtor da classe `Userregisterdto`.
  ///
  /// Recebe os parâmetros obrigatórios: [Email], [Password], [PasswordConfirmation] e [Name].
  const Userregisterdto({
    required this.Email,
    required this.Password,
    required this.PasswordConfirmation,
    required this.Name,
  });

  /// Converte um JSON num objeto `Userregisterdto`.
  factory Userregisterdto.fromJson(Map<String, dynamic> json) =>
      Userregisterdto(
          Email: json["Email"],
          Password: json["Password"],
          PasswordConfirmation: json["PasswordConfirmation"],
          Name: json["Name"]);

  /// Converte um objeto `Userregisterdto` num JSON.
  Map<String, dynamic> toJson() => {
        "Email": Email,
        "Password": Password,
        "PasswordConfirmation": PasswordConfirmation,
        "Name": Name,
      };
}
