import 'package:flutter/material.dart';
import 'package:stocker_web_ui/models/groupCreatedDto.dart';
import 'package:stocker_web_ui/pages/groups_page.dart';
import '../services/group_service.dart';

/// Página para criação de grupos.
/// Permite ao utilizador preencher informações como nome, descrição e orçamento,
/// além de validar os dados e criar um novo grupo através de uma requisição ao serviço.
class CreateGroupPage extends StatefulWidget {
  const CreateGroupPage({super.key});

  @override
  State<CreateGroupPage> createState() => _CreateGroupPageState();
}

class _CreateGroupPageState extends State<CreateGroupPage> {
  // Chave global usada para identificar o formulário e validar os campos.
  final _formKey = GlobalKey<FormState>();

  // Controladores para gerir os valores dos campos do formulário.
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  final TextEditingController _budgetController = TextEditingController();

  // Variável para controlar o estado de submissão do formulário.
  bool isSubmitting = false;

  /// Método responsável por submeter o formulário e criar o grupo.
  Future<void> _submitForm(BuildContext context) async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      isSubmitting = true;
    });

    try {
      final group = GroupCreate(
        name: _nameController.text,
        description: _descriptionController.text,
        budget: double.parse(_budgetController.text),
      );

      await GroupService().createGroup(group, context);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Grupo criado com sucesso!')),
      );
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const GroupsPage()),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
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
        title: const Text(
          'CRIAR GRUPO',
          style: TextStyle(
            color: Colors.white,
            fontSize: 24.0,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Center(
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 50.0),
                  const Text(
                    'NOME DO GRUPO',
                    style: TextStyle(
                        color: Colors.white,
                        fontFamily: 'Sans-serif',
                        fontSize: 18),
                  ),
                  const SizedBox(height: 8.0),
                  TextFormField(
                    controller: _nameController,
                    decoration: const InputDecoration(
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
                        return 'Por favor, insira o nome do grupo.';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 30.0),
                  const Text(
                    'DESCRIÇÃO (opcional)',
                    style: TextStyle(
                        color: Colors.white,
                        fontFamily: 'Sans-serif',
                        fontSize: 18),
                  ),
                  const SizedBox(height: 8.0),
                  TextFormField(
                    controller: _descriptionController,
                    decoration: const InputDecoration(
                      enabledBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                    ),
                    style: const TextStyle(color: Colors.white),
                  ),
                  const SizedBox(height: 30.0),
                  const Text(
                    'ORÇAMENTO',
                    style: TextStyle(
                        color: Colors.white,
                        fontFamily: 'Sans-serif',
                        fontSize: 18),
                  ),
                  const SizedBox(height: 8.0),
                  TextFormField(
                    controller: _budgetController,
                    decoration: const InputDecoration(
                      enabledBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                    ),
                    keyboardType:
                        TextInputType.numberWithOptions(decimal: true),
                    style: const TextStyle(color: Colors.white),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Por favor, insira o orçamento.';
                      }
                      if (double.tryParse(value) == null) {
                        return 'Insira um número válido.';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 40.0),
                  ElevatedButton(
                    onPressed: isSubmitting ? null : () => _submitForm(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      foregroundColor: Colors.white,
                      elevation: 0,
                    ),
                    child: isSubmitting
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text(
                            'Criar Grupo',
                            style: TextStyle(
                                fontSize: 20, fontWeight: FontWeight.bold),
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
