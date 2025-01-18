import 'package:flutter/material.dart';

/// Modal para criar uma nova receita.
/// Exibe um campo de entrada para o nome da receita e dois botões para
/// submeter ou cancelar a operação.
class CreateRecipeModal extends StatefulWidget {
  /// Callback para fechar o modal.
  final VoidCallback onClose;

  /// Callback para submeter o nome da receita.
  final VoidCallback onSubmit;

  /// Controlador para o campo de entrada do nome da receita.
  final TextEditingController nameController;

  const CreateRecipeModal({
    Key? key,
    required this.onClose,
    required this.onSubmit,
    required this.nameController,
  }) : super(key: key);

  @override
  _CreateRecipeModalState createState() => _CreateRecipeModalState();
}

class _CreateRecipeModalState extends State<CreateRecipeModal> {
  /// Controlador interno do campo de texto (caso seja necessário localmente).
  final TextEditingController nameController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16.0),
      ),
      child: Container(
        padding: const EdgeInsets.all(16.0),
        color: Color(0xFF212F3D),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Center(
                  child: Text(
                    "Criar receita",
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(height: 20),
              ],
            ),
            const SizedBox(height: 16),
            TextField(
              controller: widget.nameController,
              decoration: InputDecoration(
                labelText: 'Nome da receita',
                labelStyle: const TextStyle(color: Colors.white),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: Colors.white),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: Colors.white),
                ),
              ),
              style: const TextStyle(color: Colors.white),
              textInputAction: TextInputAction.done,
              onSubmitted: (_) => widget.onSubmit(),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton(
                  onPressed: widget.onClose,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text('Cancelar'),
                ),
                ElevatedButton(
                  onPressed: widget.onSubmit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.teal,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text('Criar Receita'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
