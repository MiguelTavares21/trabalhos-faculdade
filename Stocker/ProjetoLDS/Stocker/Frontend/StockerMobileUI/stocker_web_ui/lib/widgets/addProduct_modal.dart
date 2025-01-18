import 'package:flutter/material.dart';
import 'package:stocker_web_ui/models/product.dart';
import 'package:stocker_web_ui/services/group_service.dart';
import 'package:stocker_web_ui/services/product_service.dart';

/// Um modal que exibe uma lista de produtos e permite adicionar um produto selecionado.
/// Este modal pode exibir todos os produtos ou filtrar produtos que já estão ou não na lista.
class AddProductModal extends StatefulWidget {
  /// Função callback que será chamada quando um produto for adicionado.
  final Function(Product) onAddProduct;

  /// Função callback que será chamada quando o modal for fechado.
  final VoidCallback onClose;

  /// Determina se o modal deve mostrar produtos que estão na lista (`true`)
  /// ou apenas produtos que não estão na lista (`false`).
  final bool showInList;

  const AddProductModal({
    Key? key,
    required this.showInList,
    required this.onAddProduct,
    required this.onClose,
  }) : super(key: key);

  @override
  _AddProductModalState createState() => _AddProductModalState();
}

class _AddProductModalState extends State<AddProductModal> {
  /// Instância do serviço de produtos, responsável por buscar os dados da API.
  late ProductService productService;

  /// Lista de produtos exibida no modal.
  List<Product> products = [];

  /// Indica se os dados ainda estão a ser carregados.
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    productService = ProductService();
    _fetchGroupProducts();
  }

  /// Faz a requisição para buscar produtos do grupo.
  ///
  /// - Se `showInList` for `true`, exibe todos os produtos.
  /// - Se `showInList` for `false`, filtra apenas os produtos que não estão na lista (`InList == false`).
  Future<void> _fetchGroupProducts() async {
    setState(() {
      isLoading = true;
    });
    try {
      final fetchedProducts = await productService.getProductsByType(context);
      setState(() {
        if (widget.showInList) {
          products = fetchedProducts;
        } else {
          products = fetchedProducts.where((p) => !p.InList).toList();
        }
      });
    } catch (e) {
      print('Erro ao buscar produtos do grupo: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erro ao carregar produtos do grupo.')),
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16.0),
      ),
      child: Container(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Adicionar Produto',
                  style: TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: widget.onClose,
                ),
              ],
            ),
            const Divider(),
            if (isLoading)
              const Center(
                child: CircularProgressIndicator(),
              )
            else if (products.isEmpty)
              const Center(
                child: Text('Nenhum produto disponível neste grupo.'),
              )
            else
              Expanded(
                child: ListView.builder(
                  itemCount: products.length,
                  itemBuilder: (context, index) {
                    final product = products[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(
                          vertical: 4.0, horizontal: 0.0),
                      child: ListTile(
                        title: Text(
                          product.Name,
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Quantidade: ${product.Quantity}'),
                            Text(
                              'Ponto mínimo: ${product.OrderPoint}', // Exemplo de segunda linha
                              style: const TextStyle(color: Colors.grey),
                            ),
                          ],
                        ),
                        trailing: const Icon(Icons.add, color: Colors.green),
                        onTap: () {
                          widget.onAddProduct(product); // Emite o evento
                        },
                      ),
                    );
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }
}
