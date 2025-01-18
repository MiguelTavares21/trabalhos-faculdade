import 'package:flutter/material.dart';
import 'package:stocker_web_ui/models/product.dart';

class ProductModalConsume extends StatefulWidget {
  // O produto que sera alterado
  final Product? product;

  // Função para abrir e fecahr o modal
  final Function(Product) onSave;
  final Function() onClose;

  ProductModalConsume({
    required this.product,
    required this.onSave,
    required this.onClose,
  });

  @override
  _ProductModalConsumeState createState() => _ProductModalConsumeState();
}

class _ProductModalConsumeState extends State<ProductModalConsume> {
  // ID do grupo selecionado
  late int currentGroupId;

  // Controlador do campo de quantidade
  late TextEditingController quantityController;

  // Variáveis para controlar a exibição dos modais
  bool showConfirmationModal = false;
  bool showEditModal = false;

  @override
  void initState() {
    super.initState();
    //_getSelectedGroupId();
    quantityController = TextEditingController(
        text:
            widget.product != null ? widget.product!.Quantity.toString() : '');
  }

  /// Método para submeter o formulário de alteração da quantidade.
  void onSubmit() async {
    if (quantityController.text.isNotEmpty) {
      double? quantity = double.tryParse(quantityController.text);
      if (quantity == null || quantity < 0) {
        // Exibe um alerta se a quantidade for inválida
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: Text('Quantidade inválida'),
            content:
                Text('A quantidade não pode ser negativa ou não numérica.'),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: Text('OK'),
              ),
            ],
          ),
        );
        return;
      }

      // Exibe um indicador de carregamento
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => Center(
          child: CircularProgressIndicator(),
        ),
      );

      try {
        final updatedProduct = Product(
          Id: widget.product!.Id,
          Name: widget.product!.Name,
          Quantity: quantity,
          Unities: widget.product!.Unities,
          OrderPoint: widget.product!.OrderPoint,
          IdealPoint: widget.product!.IdealPoint,
          Type: widget.product!.Type,
          InList: widget.product!.InList,
          GroupId: widget.product!.GroupId,
        );

        // Chama o método onSave e espera a conclusão
        await widget.onSave(updatedProduct);
        widget.onClose();
      } catch (e) {
        Navigator.of(context).pop(); // Fecha o indicador de carregamento
        // Exibe uma mensagem de erro
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: Text('Erro'),
            content: Text('Erro ao guardar os dados: $e'),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: Text('OK'),
              ),
            ],
          ),
        );
      }
    }
  }

  // Método para fechar o modal
  void closeModal() {
    widget.onClose();
  }

  // Método para abrir o modal de edição
  void openEditModal(int productId) {
    if (productId > 0) {
      setState(() {
        showConfirmationModal = false;
        showEditModal = true;
      });
    } else {
      throw Exception('ID do produto inválido ou não fornecido.');
    }
  }

  // Método para fechar o modal de edição
  void closeEditModal() {
    setState(() {
      showEditModal = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: closeModal,
      child: Dialog(
        backgroundColor: Colors.transparent,
        child: GestureDetector(
          onTap: () {}, // Impede o clique dentro do modal de fechar o modal
          child: Center(
            child: Container(
              width: 400,
              height: 350,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Color(0xFF455361),
                borderRadius: BorderRadius.circular(10),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.3),
                    blurRadius: 15,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Alterar Quantidade',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 15),
                  Text(
                    'Quantidade:',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                    ),
                  ),
                  SizedBox(height: 5),
                  TextFormField(
                    controller: quantityController,
                    keyboardType: TextInputType.number,
                    style: TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Digite a quantidade',
                      hintStyle:
                          TextStyle(color: Colors.white.withOpacity(0.7)),
                      border: UnderlineInputBorder(
                        borderSide: BorderSide(color: Colors.white),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: Color(0xFF1ABC9C)),
                      ),
                    ),
                    validator: (value) {
                      if (value == null ||
                          value.isEmpty ||
                          int.parse(value) < 0) {
                        return 'Quantidade inválida';
                      }
                      return null;
                    },
                  ),
                  SizedBox(height: 20),
                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        // Botão Salvar
                        ElevatedButton(
                          onPressed: onSubmit,
                          style: ElevatedButton.styleFrom(
                            foregroundColor: Color.fromARGB(255, 29, 44, 83),
                            textStyle: TextStyle(
                                fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                          child: Text('Guardar'),
                        ),
                        SizedBox(height: 10), // Espaço entre os botões
                        // Botão Cancelar
                        TextButton(
                          onPressed: closeModal,
                          style: TextButton.styleFrom(
                            foregroundColor:
                                const Color.fromARGB(255, 240, 60, 60),
                            textStyle: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          child: Text('Cancelar'),
                        ),
                      ],
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
