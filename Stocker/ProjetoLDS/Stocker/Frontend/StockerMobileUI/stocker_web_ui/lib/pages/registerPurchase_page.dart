import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:stocker_web_ui/enums/unity_enum.dart';
import 'package:stocker_web_ui/models/PurchaseProductDto.dart';
import 'package:stocker_web_ui/models/PurchaseProductsCreatedto.dart';
import 'package:stocker_web_ui/models/product.dart';
import 'package:stocker_web_ui/services/group_provider.dart';
import 'package:stocker_web_ui/services/product_service.dart';
import 'package:stocker_web_ui/services/purchase_service.dart';
import 'package:stocker_web_ui/utils/drawer.dart';
import 'package:stocker_web_ui/widgets/addProduct_modal.dart';
import 'package:stocker_web_ui/widgets/addPurchase_modal.dart';
import 'package:stocker_web_ui/widgets/product_modal.dart';

/// Página responsável por registar as compras. Nela, o utilizador pode adicionar produtos
/// e finalizar o processo de registo da compra.
class RegisterPurchasePage extends StatefulWidget {
  const RegisterPurchasePage({Key? key}) : super(key: key);

  @override
  _RegisterPurchasePageState createState() => _RegisterPurchasePageState();
}

class _RegisterPurchasePageState extends State<RegisterPurchasePage> {
  // Instância dos serviços responsáveis por interagir com os dados de produtos e compras.
  ProductService productService = ProductService();
  PurchaseService purchaseService = PurchaseService();

  // Lista que armazena os produtos selecionados para a compra.
  List<PurchaseproductsCreatedto> products = [];

  /// Adiciona um produto à lista de produtos da compra.
  void _addToList(PurchaseproductsCreatedto product) {
    setState(() {
      products.add(product);
    });
  }

  /// Remove um produto da lista de produtos da compra.
  void _removeFromList(PurchaseproductsCreatedto product) {
    setState(() {
      products.remove(product);
    });
  }

  /// Regista a compra, enviando os produtos selecionados para o backend.
  Future<void> _registerPurchase() async {
    try {
      purchaseService.registerPurchase(context, products);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Compra registrada com sucesso!')),
      );

      // Limpar os produtos após o registro
      setState(() {
        products.clear();
      });
    } catch (e) {
      print("Erro ao registrar compra: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao registrar compra.')),
      );
    }
  }

  /// Exibe um modal para adicionar um novo produto à lista de compras.
  void _showAddProductDialog() {
    showDialog(
      context: context,
      builder: (context) => AddProductModal(
        showInList: true,
        onAddProduct: (product) {
          print(product.Name);
          Navigator.of(context).pop();
          _showAddPurchaseProductDialog(product);
        },
        onClose: () => Navigator.of(context).pop(),
      ),
    );
  }

  /// Exibe um modal para criar um novo produto.
  Future<void> _showCreateProductDialog() async {
    showDialog(
      context: context,
      builder: (context) => Material(
        color: Colors.transparent,
        child: ProductModal(
          dontShowQuantity: true,
          onSave: (product) {
            _handleSaveProduct(product);
          },
          onClose: () => Navigator.of(context).pop(),
        ),
      ),
    );
  }

  /// Método responsável por guardar o novo produto no sistema.
  Future<void> _handleSaveProduct(Product product) async {
    Navigator.of(context).pop();
    try {
      final newProduct = await productService.saveProduct(product, context);
      _showAddPurchaseProductDialog(newProduct);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Erro ao salvar produto, verifique as informações.'),
        ),
      );
    }
  }

  /// Exibe um modal para adicionar um produto à lista de compras, com a possibilidade
  void _showAddPurchaseProductDialog(Product product) {
    showDialog(
      context: context,
      builder: (context) => Material(
        color: Colors.transparent,
        child: AddPurchaseModal(
          product: product,
          onSave: (purchaseProduct) {
            _addToList(purchaseProduct);
          },
          onClose: () => Navigator.of(context).pop(),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final groupProvider = Provider.of<GroupProvider>(context);
    return Scaffold(
      backgroundColor: const Color(0xFF212F3D),
      appBar: AppBar(
        title: const Text('REGISTAR COMPRA'),
        automaticallyImplyLeading: groupProvider.selectedGroupId != null,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _showAddProductDialog,
          ),
          IconButton(
              onPressed: _showCreateProductDialog,
              icon: const Icon(Icons.add_circle)),
        ],
        backgroundColor: const Color(0xFF212F3D),
        foregroundColor: Colors.white,
      ),
      drawer: buildDrawer(context),
      body: Column(
        children: [
          Expanded(
            child: products.isEmpty
                ? const Center(
                    child: Text(
                      'Nenhum produto na lista.',
                      style: TextStyle(color: Colors.white),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16.0),
                    itemCount: products.length,
                    itemBuilder: (context, index) {
                      final product = products[index];
                      return Card(
                        margin: const EdgeInsets.symmetric(vertical: 8.0),
                        color: const Color(0xFF34495E),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      product.Name,
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16.0,
                                      ),
                                    ),
                                    const SizedBox(height: 8.0),
                                    Text(
                                      'Quantidade: ${product.Quantity} ${product.Unities.description}',
                                      style: const TextStyle(
                                        color: Colors.white70,
                                        fontSize: 14.0,
                                      ),
                                    ),
                                    const SizedBox(height: 4.0),
                                    Text(
                                      'Preço: ${product.Price.toStringAsFixed(2)}€',
                                      style: const TextStyle(
                                        color: Colors.greenAccent,
                                        fontSize: 14.0,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              IconButton(
                                icon:
                                    const Icon(Icons.delete, color: Colors.red),
                                onPressed: () => _removeFromList(product),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
          if (products.isNotEmpty)
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.teal,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                      vertical: 12.0, horizontal: 12.0),
                  textStyle: const TextStyle(fontSize: 16.0),
                ),
                onPressed: _registerPurchase,
                child: const Text('REGISTRAR COMPRA'),
              ),
            ),
        ],
      ),
    );
  }
}
