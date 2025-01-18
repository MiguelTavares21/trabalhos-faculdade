/// Classe `Userlogindto`
///
/// Representa os dados necessários para o login de um utilizaador, contendo o email e a senha.
class Userlogindto {
  /// Email do utilizaador.
  final String Email;

  /// Palvra-passe do utilizaador.
  final String Password;

  /// Construtor da classe `Userlogindto`.
  ///
  /// Recebe o [Email] e [Password] como parâmetros obrigatórios para criar uma instância de `Userlogindto`.
  const Userlogindto({
    required this.Email,
    required this.Password,
  });

  /// Converte um JSON num objeto `Userlogindto`.
  factory Userlogindto.fromJson(Map<String, dynamic> json) =>
      Userlogindto(Email: json["Email"], Password: json["Password"]);

  /// Converte um objeto `Userlogindto` num JSON.
  Map<String, dynamic> toJson() => {
        "Email": Email,
        "Password": Password,
      };
}
