import 'package:flutter/material.dart';
import 'package:stocker_web_ui/services/user_service.dart';

/// Página para alteração da senha do utilizador.
///
/// A `ChangePasswordPage` permite ao utilizador alterar a sua palavra-passe, fornecendo
/// campos para a palavra-passe atual, nova palavra-passe e confirmação da nova palavra-passe.
/// A página valida as entradas e realiza a mudança de palavra-passe utilizando
/// o serviço de utilizador `UserService`.
/// Caso ocorra algum erro durante o processo de alteração, uma mensagem
/// de erro será exibida.
class ChangePasswordPage extends StatefulWidget {
  const ChangePasswordPage({super.key});

  @override
  State<ChangePasswordPage> createState() => _ChangePasswordPageState();
}

class _ChangePasswordPageState extends State<ChangePasswordPage> {
  // Chave global para o formulário, usada para validar os campos.
  final _formKey = GlobalKey<FormState>();

  // Instância do serviço de utilizador para realizar a alteração da palavra-passe.
  final UserService _userService = UserService();

  // Controladores para os campos de palavra-passe atual, nova palavra-passe e confirmação.
  TextEditingController currentPassword = TextEditingController();
  TextEditingController newPassword = TextEditingController();
  TextEditingController confirmNewPassword = TextEditingController();

  /// Função que altera a senha do utilizador.
  ///
  /// Valida os campos do formulário, verifica se as novas palavras-passe são iguais
  /// e, em seguida, chama o serviço de utilizador para realizar a alteração da palavra-passe.
  /// Se a operação for bem-sucedida, o utilizador será notificado com uma mensagem
  /// de sucesso e a página será fechada. Caso ocorra algum erro, o erro será exibido
  /// ao utilizador.
  Future<void> _changePassword() async {
    if (!_formKey.currentState!.validate()) return;

    if (newPassword.text != confirmNewPassword.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("As passwords não coincidem.")),
      );
      return;
    }

    try {
      await _userService.changePassword(
        context,
        currentPassword.text,
        newPassword.text,
      );
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Password alterada com sucesso!")),
      );
      Navigator.pop(context);
    } catch (e) {
      print('Erro ao editar conta: $e');
      String errorMessage = e.toString();
      if (errorMessage.startsWith("Exception: ")) {
        errorMessage = errorMessage.substring(11);
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(errorMessage)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF212F3D),
      appBar: AppBar(
        foregroundColor: Colors.white,
        title: const Text(
          'ALTERAR PASSWORD',
          style: TextStyle(
            color: Colors.white,
            fontSize: 24.0,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        backgroundColor: const Color(0xFF212F3D),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Password Atual",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 6),
              TextFormField(
                controller: currentPassword,
                obscureText: true,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide.none,
                  ),
                ),
                style: const TextStyle(color: Colors.black),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'A Password atual é obrigatória.';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 14),
              const Text(
                "Nova Password",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: newPassword,
                obscureText: true,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide.none,
                  ),
                ),
                style: const TextStyle(color: Colors.black),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'A nova password é obrigatória.';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              const Text(
                "Confirmar Nova Password",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: confirmNewPassword,
                obscureText: true,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide.none,
                  ),
                ),
                style: const TextStyle(color: Colors.black),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'A confirmação de password é obrigatória.';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              Center(
                child: ElevatedButton(
                  onPressed: _changePassword,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 15, vertical: 15),
                    backgroundColor: Colors.transparent,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    side: const BorderSide(color: Colors.white),
                  ),
                  child: const Text(
                    "Alterar Password",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
