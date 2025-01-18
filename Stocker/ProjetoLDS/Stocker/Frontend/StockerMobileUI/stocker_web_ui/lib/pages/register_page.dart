import 'package:flutter/material.dart';
import 'package:stocker_web_ui/models/UserRegisterDto.dart';
import 'package:stocker_web_ui/pages/main_page.dart';
import 'package:stocker_web_ui/services/api_handler.dart';

// Página de registo de utilizador
class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  // Handler para chamadas à API
  final ApiHandler apiHandler = ApiHandler();

  // Controladores e estado do formulário
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _passwordConfirmationController = TextEditingController();
  final _nameController = TextEditingController();
  bool _passwordVisible = false;

  // Alternar visibilidade da palavra-passe
  void _togglePasswordVisibility() {
    setState(() {
      _passwordVisible = !_passwordVisible;
    });
  }

  // Função para processar o registo
  void _onRegister() async {
    if (_formKey.currentState?.validate() ?? false) {
      final email = _emailController.text;
      final password = _passwordController.text;
      final passwordConfirmation = _passwordConfirmationController.text;
      final name = _nameController.text;

      final user = Userregisterdto(
          Email: email,
          Password: password,
          PasswordConfirmation: passwordConfirmation,
          Name: name);

      final response = await apiHandler.register(user);

      if (!response) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Falha no registo! Verifique suas credenciais.')),
        );
      } else {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => MainPage(),
          ),
        );
      }
    }
  }

  @override
  void dispose() {
    // Limpeza dos controladores ao sair da página
    _emailController.dispose();
    _passwordController.dispose();
    _passwordConfirmationController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF212F3D),
      body: Center(
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Logo and description
                  Column(
                    children: [
                      const Text(
                        'STOCKER',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24.0,
                          fontFamily: 'Sans-serif',
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8.0),
                      const Text(
                        'Gira o seu stock de casa de forma inteligente',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 14.0,
                          fontFamily: 'Sans-serif',
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                  const SizedBox(height: 50.0),

                  // Name input
                  const Text(
                    'Nome',
                    style: TextStyle(
                      color: Colors.white,
                      fontFamily: 'Sans-serif',
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  TextFormField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      hintText: 'Seu Nome',
                      hintStyle: TextStyle(color: Colors.white70),
                      enabledBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                    ),
                    style: const TextStyle(color: Colors.white),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Por favor insira seu nome';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16.0),

                  // Email input
                  const Text(
                    'Email',
                    style: TextStyle(
                      color: Colors.white,
                      fontFamily: 'Sans-serif',
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  TextFormField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      hintText: 'username@email.com',
                      hintStyle: TextStyle(color: Colors.white70),
                      enabledBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                    ),
                    style: const TextStyle(color: Colors.white),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Por favor insira um email válido';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16.0),

                  // Password input
                  const Text(
                    'Password',
                    style: TextStyle(
                      color: Colors.white,
                      fontFamily: 'Sans-serif',
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  TextFormField(
                    controller: _passwordController,
                    obscureText: !_passwordVisible,
                    decoration: InputDecoration(
                      hintText: 'Password',
                      hintStyle: const TextStyle(color: Colors.white70),
                      enabledBorder: const UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                      focusedBorder: const UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _passwordVisible
                              ? Icons.visibility
                              : Icons.visibility_off,
                          color: Colors.white,
                        ),
                        onPressed: _togglePasswordVisibility,
                      ),
                    ),
                    style: const TextStyle(color: Colors.white),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Por favor insira uma password';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16.0),

                  // Password Confirmation input
                  const Text(
                    'Confirmar Password',
                    style: TextStyle(
                      color: Colors.white,
                      fontFamily: 'Sans-serif',
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  TextFormField(
                    controller: _passwordConfirmationController,
                    obscureText: !_passwordVisible,
                    decoration: InputDecoration(
                      hintText: 'Confirmar Password',
                      hintStyle: const TextStyle(color: Colors.white70),
                      enabledBorder: const UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                      focusedBorder: const UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _passwordVisible
                              ? Icons.visibility
                              : Icons.visibility_off,
                          color: Colors.white,
                        ),
                        onPressed: _togglePasswordVisibility,
                      ),
                    ),
                    style: const TextStyle(color: Colors.white),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Por favor confirme sua senha';
                      }
                      if (value != _passwordController.text) {
                        return 'As passwords não coincidem';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 32.0),

                  // Register button
                  ElevatedButton(
                    onPressed: _onRegister,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      textStyle: TextStyle(
                        fontFamily: 'Sans-serif',
                        fontSize: 18.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    child: const Text(
                      'Cadastrar',
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                  SizedBox(height: 10.0),
                  Center(
                    child: GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => MainPage(),
                          ),
                        );
                      },
                      child: Text(
                        'FAZER LOGIN',
                        style: TextStyle(
                          color: Colors.white70,
                          fontFamily: 'Sans-serif',
                          fontSize: 14.0,
                          decoration: TextDecoration.underline,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
