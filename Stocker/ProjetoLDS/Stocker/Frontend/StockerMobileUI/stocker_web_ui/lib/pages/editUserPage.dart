import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:stocker_web_ui/models/UserDto.dart';
import 'package:stocker_web_ui/models/userUpdateDto.dart';
import 'package:stocker_web_ui/pages/changePassword_page.dart';
import 'package:stocker_web_ui/pages/main_page.dart';
import 'package:stocker_web_ui/services/user_service.dart';
import 'package:stocker_web_ui/utils/drawer.dart';

/// Página de edição de utilizador.
/// Permite ao utilizador atualizar seus dados como email, nome e preferências de notificação.
class EditUserPage extends StatefulWidget {
  const EditUserPage({super.key});

  @override
  State<EditUserPage> createState() => _EditUserPageState();
}

class _EditUserPageState extends State<EditUserPage> {
  // Chave global para validação do formulário.
  final _formKey = GlobalKey<FormState>();

  // Instância do serviço de utilizador para manipular dados do backend.
  final UserService _userService = UserService();

  // Controladores para os campos de texto.
  TextEditingController email = TextEditingController();
  TextEditingController name = TextEditingController();
  bool notifications = false;

  // Indica se os dados estão sendo carregados.
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  /// Carrega os dados do utilizador do serviço e atualiza os controladores.
  Future<void> _loadUser() async {
    try {
      final user = await _userService.getUser(context);
      setState(() {
        email.text = user.Email;
        name.text = user.Name;
        notifications = user.Notifications;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  /// Salva as alterações feitas pelo utilizador.
  Future<void> _saveChanges() async {
    if (!_formKey.currentState!.validate()) return;

    final updatedUser = UserUpdateDto(
      Email: email.text,
      Name: name.text,
      Notifications: notifications,
    );

    try {
      await _userService.editAccount(context, updatedUser);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text(
                "Você editou informações sensíveis, por favor faça login novamente.")),
      );
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const MainPage()),
      );
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
          'EDITAR UTILIZADOR',
          style: TextStyle(
            color: Colors.white,
            fontSize: 24.0,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        backgroundColor: const Color(0xFF212F3D),
      ),
      drawer: buildDrawer(context),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(20.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Email",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                    TextFormField(
                      controller: email,
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      style: const TextStyle(color: Colors.black),
                      keyboardType: TextInputType.emailAddress,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'O email é obrigatório.';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      "Nome",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                    TextFormField(
                      controller: name,
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
                          return 'O nome é obrigatório.';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    SwitchListTile(
                      title: const Text(
                        'Notificações',
                        style: TextStyle(color: Colors.white),
                      ),
                      value: notifications,
                      onChanged: (value) {
                        setState(() => notifications = value);
                      },
                      activeColor: Colors.blue,
                    ),
                    const SizedBox(height: 16),
                    Center(
                      child: ElevatedButton(
                        onPressed: _saveChanges,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 15, vertical: 15),
                          backgroundColor: Colors.transparent,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                          side: BorderSide(color: Colors.white),
                        ),
                        child: const Text(
                          "Salvar Alterações",
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Center(
                      child: TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const ChangePasswordPage(),
                            ),
                          );
                        },
                        style: TextButton.styleFrom(
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 10),
                          textStyle: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.normal,
                          ),
                        ),
                        child: const Text(
                          "Editar password",
                          style: TextStyle(
                            fontSize: 16,
                          ),
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ),
    );
  }
}
