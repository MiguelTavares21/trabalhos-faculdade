import 'package:flutter/material.dart';
import 'package:stocker_web_ui/pages/groups_page.dart';
import 'package:stocker_web_ui/pages/register_page.dart';
import 'package:stocker_web_ui/services/api_handler.dart';

/// Página principal para login do utilizador.
class MainPage extends StatefulWidget {
  const MainPage({super.key});

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  // Instância da classe de manipulação da API.
  final ApiHandler apiHandler = ApiHandler();
  late String token = ''; // Token de autenticação do utilizador.
 
  // Chave global para o formulário de login.
  final _formKey = GlobalKey<FormState>(); 

  // Controladores dos campos de email e palavra-passe.
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _passwordVisible = false; // Flag para visibilidade da palavra-passe.

  /// Alterna a visibilidade da palavra-passe no campo de texto.
  void _togglePasswordVisibility() {
    setState(() {
      _passwordVisible = !_passwordVisible;
    });
  }

  /// Lógica para realizar o login do utilizador.
  void _onLogin() async {
    final email = _emailController.text;
    final password = _passwordController.text;

    final response = await apiHandler.login(email, password, context);

    if (response.isNotEmpty) {
      setState(() {
        token = response[0];
      });

      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => const GroupsPage(),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Falha no login! Verifique suas credenciais.')),
      );
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF212F3D),
      body: Center(
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Column(
                    children: [
                      Text(
                        'STOCKER',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24.0,
                          fontFamily: 'Sans-serif',
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 8.0),
                      Text(
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
                  SizedBox(height: 50.0),
                  Text(
                    'EMAIL',
                    style: TextStyle(
                      color: Colors.white,
                      fontFamily: 'Sans-serif',
                    ),
                  ),
                  SizedBox(height: 8.0),
                  TextFormField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    decoration: InputDecoration(
                      hintText: 'username@email.com',
                      hintStyle: TextStyle(
                        color: Colors.white70,
                      ),
                      enabledBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                    ),
                    style: TextStyle(color: Colors.white),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Insira um email válido';
                      }
                      return null;
                    },
                  ),
                  SizedBox(height: 30.0),
                  Text(
                    'PALAVRA-PASSE',
                    style: TextStyle(
                      color: Colors.white,
                      fontFamily: 'Sans-serif',
                    ),
                  ),
                  SizedBox(height: 8.0),
                  Stack(
                    alignment: Alignment.centerRight,
                    children: [
                      TextFormField(
                        controller: _passwordController,
                        obscureText: !_passwordVisible,
                        decoration: InputDecoration(
                          hintText: '**********',
                          hintStyle: TextStyle(
                            color: Colors.white70,
                          ),
                          enabledBorder: UnderlineInputBorder(
                            borderSide: BorderSide(color: Colors.white),
                          ),
                          focusedBorder: UnderlineInputBorder(
                            borderSide: BorderSide(color: Colors.white),
                          ),
                        ),
                        style: TextStyle(color: Colors.white),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Insira a palavra-passe';
                          }
                          return null;
                        },
                      ),
                      IconButton(
                        icon: Icon(
                          _passwordVisible
                              ? Icons.visibility
                              : Icons.visibility_off,
                          color: Colors.white,
                        ),
                        onPressed: _togglePasswordVisibility,
                      ),
                    ],
                  ),
                  SizedBox(height: 40.0),
                  ElevatedButton(
                    onPressed: _onLogin,
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
                    child: Text('ENTRAR'),
                  ),
                  SizedBox(height: 10.0),
                  Center(
                    child: GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => RegisterPage(),
                          ),
                        );
                      },
                      child: Text(
                        'CRIAR CONTA',
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
