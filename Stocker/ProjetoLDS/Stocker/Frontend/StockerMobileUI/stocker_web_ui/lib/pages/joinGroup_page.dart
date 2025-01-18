import 'package:flutter/material.dart';
import 'package:stocker_web_ui/pages/groups_page.dart';
import 'package:stocker_web_ui/services/group_service.dart';

/// Página para juntar-se a um grupo existente através de um código.
class JoinGroupPage extends StatefulWidget {
  const JoinGroupPage({super.key});

  @override
  State<JoinGroupPage> createState() => _JoinGroupPageState();
}

class _JoinGroupPageState extends State<JoinGroupPage> {
  // Controller para o campo de texto do código do grupo.
  final TextEditingController _controller = TextEditingController(); 
  bool isSubmitting = false; // Flag para indicar se o formulário está a ser submetido.

  /// Função para enviar o código e juntar-se ao grupo.
  Future<void> _joinGroup() async {
    if (_controller.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor, insira um código válido.')),
      );
      return;
    }

    setState(() {
      isSubmitting = true;
    });

    try {
      await GroupService().joinGroup(_controller.text, context);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Você entrou no grupo com sucesso!')),
      );

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const GroupsPage()),
      );
    } catch (e) {
      print('Erro ao juntar-se ao grupo: $e');
      String errorMessage = e.toString();
      if (errorMessage.startsWith("Exception: ")) {
        errorMessage = errorMessage.substring(11);
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(errorMessage)),
      );
    } finally {
      setState(() {
        isSubmitting = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF212F3D),
      appBar: AppBar(
        backgroundColor: const Color(0xFF212F3D),
        foregroundColor: Colors.white,
        title: const Text(
          'ENTRAR NUM GRUPO',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'INSERIR CÓDIGO',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                ),
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _controller,
              decoration: const InputDecoration(
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: Colors.white, width: 1),
                ),
              ),
              style: const TextStyle(color: Colors.white),
            ),
            const SizedBox(height: 30),
            ElevatedButton(
              onPressed: isSubmitting ? null : _joinGroup,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF212F3D),
              ),
              child: isSubmitting
                  ? const CircularProgressIndicator(
                      color: Colors.white,
                    )
                  : const Text(
                      'ENTRAR',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 20,
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
