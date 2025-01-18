import 'package:flutter/material.dart';
import 'package:stocker_web_ui/models/group.dart';
import 'package:stocker_web_ui/models/groupCreatedDto.dart';
import 'package:stocker_web_ui/pages/groupDetails_page.dart';
import 'package:stocker_web_ui/pages/groups_page.dart';
import 'package:stocker_web_ui/services/group_service.dart';
import 'package:stocker_web_ui/utils/drawer.dart';

/// Página de Edição de Grupos.
/// Permite ao utilizador atualizar as informações de um grupo existente.
class EditGroupPage extends StatefulWidget {
  // O grupo que será editado, passado como parâmetro ao construir a página.
  final Group group;

  const EditGroupPage({super.key, required this.group});

  @override
  State<EditGroupPage> createState() => _EditGroupPageState();
}

class _EditGroupPageState extends State<EditGroupPage> {
  // Controladores para os campos de texto do formulário.
  late TextEditingController _nameController;
  late TextEditingController _descriptionController;
  late TextEditingController _budgetController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.group.name);
    _descriptionController =
        TextEditingController(text: widget.group.description);
    _budgetController =
        TextEditingController(text: widget.group.budget.toString());
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _budgetController.dispose();
    super.dispose();
  }

  /// Salva as alterações feitas no grupo.
  /// Envia os dados atualizados para o serviço responsável e exibe feedback ao utilizador.
  Future<void> _saveGroupEdits() async {
    final updatedGroup = GroupCreate(
      name: _nameController.text,
      description: _descriptionController.text,
      budget: double.tryParse(_budgetController.text) ?? 0.0,
    );

    try {
      await GroupService().editGroup(widget.group.id, updatedGroup, context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Grupo atualizado com sucesso")),
      );
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const GroupDetailsPage()),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Erro ao atualizar grupo: $e")),
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
          'EDITAR GRUPO',
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
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            const Text(
              "Nome grupo",
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
              ),
              style: const TextStyle(color: Colors.black),
            ),
            const SizedBox(height: 15),
            const Text(
              "Descrição",
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            TextField(
              controller: _descriptionController,
              decoration: InputDecoration(
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
              ),
              style: const TextStyle(color: Colors.black),
            ),
            const SizedBox(height: 15),
            const Text(
              "Budget",
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            TextField(
              controller: _budgetController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
              ),
              style: const TextStyle(color: Colors.black),
            ),
            const SizedBox(height: 30),
            Center(
              child: ElevatedButton(
                onPressed: _saveGroupEdits,
                style: ElevatedButton.styleFrom(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 15, vertical: 15),
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
          ],
        ),
      ),
    );
  }
}
