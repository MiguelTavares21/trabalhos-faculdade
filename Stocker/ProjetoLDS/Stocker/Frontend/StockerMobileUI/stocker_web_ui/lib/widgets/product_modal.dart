import 'package:flutter/material.dart';
import '../models/product.dart';
import '../enums/types_enum.dart';
import '../enums/unity_enum.dart';

class ProductModal extends StatefulWidget {
  // Objeto que representa o produto.
  final Product? product; 

  // Se true, o campo de quantidade não será exibido.
  final bool? dontShowQuantity; 

  // Função chamada ao abrir, fechar ou eliminar o modal.
  final Function(Product) onSave;
  final VoidCallback onClose;
  final VoidCallback? onDelete;

  const ProductModal(
      {Key? key,
      this.dontShowQuantity,
      this.product,
      required this.onSave,
      required this.onClose,
      this.onDelete
      })
      : super(key: key);

  @override
  _ProductModalState createState() => _ProductModalState();
}

class _ProductModalState extends State<ProductModal> {
  // Chave para o formulário.
  final _formKey = GlobalKey<FormState>();

  late String name;
  late String type;
  late double quantity;
  late int orderPoint;
  late int idealPoint;
  late String unity;

  @override
  void initState() {
    super.initState();
    name = widget.product?.Name ?? '';
    type = widget.product?.Type.description ?? '';
    if (widget.dontShowQuantity == true) {
      quantity = 0;
    } else {
      quantity = widget.product?.Quantity ?? 1;
    }
    orderPoint = widget.product?.OrderPoint ?? 0;
    idealPoint = widget.product?.IdealPoint ?? 0;
    unity = widget.product?.Unities.description ?? '';
  }

  @override
  void dispose() {
    super.dispose();
  }

  // Guarda o produto.
  void saveProduct() {
    if (_formKey.currentState!.validate()) {
      final newProduct = Product(
        Id: widget.product?.Id ?? DateTime.now().millisecondsSinceEpoch,
        Name: name,
        Quantity: quantity,
        Unities: UnityExtension.fromDescription(unity),
        OrderPoint: orderPoint,
        IdealPoint: idealPoint,
        Type: TypesExtension.fromDescription(type),
        InList: true,
        GroupId: 1, 
      );

      widget.onSave(newProduct);
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
                              widget.product == null
                                  ? 'CRIAR PRODUTO'
                                  : 'EDITAR PRODUTO',
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),

                          // Nome Field
                          _buildTextField(
                            initialValue: name,
                            label: 'Nome',
                            validator: (value) =>
                                value!.isEmpty ? 'O nome é obrigatório.' : null,
                            onChanged: (value) => name = value,
                          ),
                          const SizedBox(height: 10),

                          // Tipo Field
                          if (widget.product == null)
                            _buildDropdownField(
                              value: type.isNotEmpty ? type : null,
                              label: 'Tipo',
                              items: Types.values
                                  .map((t) => DropdownMenuItem(
                                        value: t.description,
                                        child: Text(t.description),
                                      ))
                                  .toList(),
                              onChanged: (value) =>
                                  setState(() => type = value ?? ''),
                            ),
                          const SizedBox(height: 10),

                          // Quantidade Field
                          _buildTextField(
                            initialValue: quantity.toString(),
                            label: 'Quantidade',
                            keyboardType: TextInputType.number,
                            validator: (value) {
                              final val = int.tryParse(value ?? '');
                              if (val == null || val < 0) {
                                return 'Quantidade deve ser maior ou igual a 0.';
                              }
                              return null;
                            },
                            onChanged: (value) =>
                                quantity = double.tryParse(value) ?? 1,
                            enabled: !(this.widget.dontShowQuantity ?? false),
                          ),

                          const SizedBox(height: 10),

                          // Ponto de Encomenda Field
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  const Text(
                                    'Ponto de Encomenda',
                                    style: TextStyle(color: Colors.white),
                                  ),
                                  const SizedBox(
                                      width:
                                          5), 
                                  GestureDetector(
                                    onTap: () {
                                      showDialog(
                                        context: context,
                                        builder: (BuildContext context) {
                                          return AlertDialog(
                                            title: Text('Informação'),
                                            content: Text(
                                             "Quantidade mínima de um produto no stock que, ao ser atingida, indica que é hora de fazer adicionar à lista de compras e evitar falta de mercadoria.",
                                            ),
                                            actions: <Widget>[
                                              TextButton(
                                                onPressed: () {
                                                  Navigator.of(context).pop();
                                                },
                                                child: Text('Fechar'),
                                              ),
                                            ],
                                          );
                                        },
                                      );
                                    },
                                    child: Image.asset(
                                      'assets/information.png',
                                      width: 16,
                                      height: 16,
                                      color: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 1),
                              // Remove unnecessary space here or reduce it
                              _buildTextField(
                                initialValue: orderPoint.toString(),
                                label:
                                    'Insira o ponto de encomenda', // No label here as it's already above
                                keyboardType: TextInputType.number,
                                validator: (value) {
                                  final val = int.tryParse(value ?? '');
                                  if (val == null || val <= 0) {
                                    return 'Ponto de encomenda deve ser maior que 0.';
                                  }
                                  return null;
                                },
                                onChanged: (value) => orderPoint =
                                    int.tryParse(value) ?? orderPoint,
                              ),
                            ],
                          ),

                          const SizedBox(height: 10),

                          // Valor Ideal Field
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Label com ícone de informação para o "Valor Ideal"
                              Row(
                                children: [
                                  const Text(
                                    'Valor Ideal',
                                    style: TextStyle(color: Colors.white),
                                  ),
                                  const SizedBox(
                                      width:
                                          5), // Pequeno espaço entre label e ícone
                                  GestureDetector(
                                    onTap: () {
                                      showDialog(
                                        context: context,
                                        builder: (BuildContext context) {
                                          return AlertDialog(
                                            title: const Text('Informação'),
                                            content: const Text(
                                              "Quantidade que você deseja manter no stock para evitar excesso e desperdício.",
                                            ),
                                            actions: <Widget>[
                                              TextButton(
                                                onPressed: () {
                                                  Navigator.of(context).pop();
                                                },
                                                child: const Text('Fechar'),
                                              ),
                                            ],
                                          );
                                        },
                                      );
                                    },
                                    child: Image.asset(
                                      'assets/information.png',
                                      width: 16,
                                      height: 16,
                                      color: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(
                                  height:
                                      1), // Pequeno espaço entre label e campo de input

                              // Campo de input para o "Valor Ideal"
                              _buildTextField(
                                initialValue: idealPoint.toString(),
                                label:
                                    'Insira o valor ideal', // Deixe a label em branco, pois já está acima
                                keyboardType: TextInputType.number,
                                validator: (value) {
                                  final val = int.tryParse(value ?? '');
                                  if (val == null || val <= 0) {
                                    return 'Valor ideal deve ser maior que 0.';
                                  }
                                  return null;
                                },
                                onChanged: (value) => idealPoint =
                                    int.tryParse(value) ?? idealPoint,
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),

                          // Unidade Field
                          _buildDropdownField(
                            value: unity.isNotEmpty ? unity : null,
                            label: 'Unidade',
                            items: Unity.values
                                .map((u) => DropdownMenuItem(
                                      value: u.description,
                                      child: Text(u.description),
                                    ))
                                .toList(),
                            onChanged: (value) =>
                                setState(() => unity = value ?? ''),
                          ),
                          const SizedBox(height: 20),

                          // Botões
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Color(0xFF212F3D),
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
                              if (widget.onDelete != null) 
                                const SizedBox(height: 8),
                                ElevatedButton(
                                  onPressed: widget.onDelete,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color.fromARGB(255, 236, 155, 150),
                                    foregroundColor: Colors.white,
                                  ),
                                  child: const Text('ELIMINAR PRODUTO'),
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
    bool enabled = true,
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
      enabled: enabled,
    );
  }

  Widget _buildDropdownField({
    required String? value,
    required String label,
    required List<DropdownMenuItem<String>> items,
    required Function(String?) onChanged,
    bool enabled = true,
  }) {
    return DropdownButtonFormField<String>(
      value: value,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.white),
      ),
      style: const TextStyle(color: Color.fromARGB(255, 255, 255, 255)),
      dropdownColor: Color.fromARGB(255, 107, 129, 149),
      items: enabled ? items : null, // Desativa a interação se não habilitado
      onChanged: enabled ? onChanged : null,
      validator: (value) => (value == null || value.isEmpty) && enabled
          ? '$label é obrigatório.'
          : null,
    );
  }
}
