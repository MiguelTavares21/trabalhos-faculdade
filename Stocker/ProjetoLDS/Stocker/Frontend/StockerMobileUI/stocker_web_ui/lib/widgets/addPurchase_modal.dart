import 'package:flutter/material.dart';
import 'package:stocker_web_ui/models/PurchaseProductsCreatedto.dart';
import 'package:stocker_web_ui/widgets/addProduct_modal.dart';
import '../models/product.dart';
import '../enums/types_enum.dart';
import '../enums/unity_enum.dart';

/// Modal para adicionar uma compra a partir de um produto existente.
/// Exibe um formulário para entrada de quantidade e preço, que são enviados
/// como um objeto `PurchaseproductsCreatedto` para o callback `onSave`.
class AddPurchaseModal extends StatefulWidget {
  /// O produto associado à compra.
  final Product product;

  /// Callback para guardar a compra, recebendo o DTO criado.
  final Function(PurchaseproductsCreatedto) onSave;

  /// Callback para fechar o modal.
  final VoidCallback onClose;

  const AddPurchaseModal(
      {Key? key,
      required this.product,
      required this.onSave,
      required this.onClose})
      : super(key: key);

  @override
  _AddPurchaseModalState createState() => _AddPurchaseModalState();
}

class _AddPurchaseModalState extends State<AddPurchaseModal> {
  /// Chave para validar o formulário.
  final _formKey = GlobalKey<FormState>();

  /// Variáveis para armazenar os valores do formulário.
  late double quantity;
  late double price;

  @override
  void initState() {
    super.initState();
    quantity = 0;
    price = 0;
  }

  /// Função para salvar o produto após validar o formulário.
  void saveProduct() {
    if (_formKey.currentState!.validate()) {
      final newProduct = PurchaseproductsCreatedto(
        Quantity: this.quantity,
        Unities: this.widget.product.Unities,
        Price: this.price,
        Product_Id: (this.widget.product.Id as num).toInt(),
        Name: this.widget.product.Name,
      );

      widget.onSave(newProduct);
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.of(context).pop(),
      child: LayoutBuilder(
        builder: (context, constraints) {
          return Container(
            color: Colors.black.withOpacity(0.7),
            child: Center(
              child: GestureDetector(
                onTap: () {}, // Impede o fechamento ao clicar dentro
                child: SingleChildScrollView(
                  child: Container(
                    padding: const EdgeInsets.all(20.0),
                    decoration: BoxDecoration(
                      color: const Color(0xFF455361),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: const [
                        BoxShadow(color: Colors.black26, blurRadius: 10)
                      ],
                    ),
                    width: constraints.maxWidth * 0.9, // Tornar responsivo
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Título
                          Center(
                            child: Text(
                              'CRIAR PRODUTO',
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                                decoration: TextDecoration.underline,
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),

                          // Quantidade Field
                          _buildTextField(
                            initialValue: quantity.toString(),
                            label: 'Quantidade',
                            keyboardType: TextInputType.number,
                            validator: (value) {
                              final val = double.tryParse(value ?? '');
                              if (val == null || val <= 0) {
                                return 'Quantidade deve ser maior a 0.';
                              }
                              return null;
                            },
                            onChanged: (value) =>
                                quantity = double.tryParse(value) ?? 1,
                          ),
                          const SizedBox(height: 10),

                          // Quantidade Field
                          _buildTextField(
                            initialValue: price.toString(),
                            label: 'Preço',
                            keyboardType: TextInputType.number,
                            validator: (value) {
                              final val = double.tryParse(value ?? '');
                              if (val == null || val < 0) {
                                return 'Preço deve ser maior ou igual a 0.';
                              }
                              return null;
                            },
                            onChanged: (value) =>
                                price = double.tryParse(value) ?? 1,
                          ),
                          const SizedBox(height: 10),

                          // Botões
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.teal,
                                  foregroundColor: Colors.white,
                                ),
                                onPressed: saveProduct,
                                child: const Text('GUARDAR'),
                              ),
                              const SizedBox(height: 10),
                              ElevatedButton(
                                onPressed: () => Navigator.pop(context),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.red,
                                  foregroundColor: Colors.white,
                                ),
                                child: const Text('CANCELAR'),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildTextField({
    required String initialValue,
    required String label,
    TextInputType keyboardType = TextInputType.text,
    required String? Function(String?) validator,
    required Function(String) onChanged,
  }) {
    return TextFormField(
      initialValue: initialValue,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.white),
        focusedBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.teal),
        ),
        enabledBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.white),
        ),
      ),
      style: const TextStyle(color: Colors.white),
      keyboardType: keyboardType,
      validator: validator,
      onChanged: onChanged,
    );
  }

  Widget _buildDropdownField({
    required String? value,
    required String label,
    required List<DropdownMenuItem<String>> items,
    required Function(String?) onChanged,
  }) {
    return DropdownButtonFormField<String>(
      value: value,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.white),
      ),
      style: const TextStyle(color: Colors.black),
      dropdownColor: Colors.white,
      items: items,
      onChanged: onChanged,
      validator: (value) =>
          value == null || value.isEmpty ? '$label é obrigatório.' : null,
    );
  }
}
