import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:provider/provider.dart';
import 'package:stocker_web_ui/enums/unity_enum.dart';
import 'package:stocker_web_ui/models/product.dart';
import 'package:stocker_web_ui/models/productInListDto.dart';
import 'package:stocker_web_ui/services/group_provider.dart';
import 'package:stocker_web_ui/services/purchase_service.dart';
import 'package:stocker_web_ui/utils/drawer.dart';
import 'package:stocker_web_ui/widgets/addProduct_modal.dart';

/// Página responsável por exibir e gerir a lista de compras.
///
/// Nesta página, o utilizador pode visualizar os produtos que fazem parte da
/// lista de compras, adicionar novos produtos e remover os existentes.
class ShoppingListPage extends StatefulWidget {
  const ShoppingListPage({Key? key}) : super(key: key);

  @override
  _ShoppingListPageState createState() => _ShoppingListPageState();
}

class _ShoppingListPageState extends State<ShoppingListPage> {
  // Serviço responsável por lidar com operações relacionadas a compras.
  late PurchaseService purchaseService;

  // Lista de produtos na lista de compras.
  List<ProductInListDto> products = [];

  // Estado de carregamento, usado para exibir um indicador de progresso.
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    purchaseService = PurchaseService();
    SchedulerBinding.instance.addPostFrameCallback((_) {
      _getShoppingList();
    });
  }

  /// Obtém a lista de compras do serviço de backend e atualiza o estado.
  Future<void> _getShoppingList() async {
    setState(() {
      isLoading = true;
    });
    try {
      final shoppingList = await purchaseService.getShoppingList(context);
      setState(() {
        products = shoppingList;
      });
    } catch (e) {
      print('Erro ao carregar lista de compras: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erro ao carregar produtos.')),
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  /// Remove um produto da lista de compras no backend.
  ///
  /// Atualiza a lista de compras local após a remoção.
  Future<void> _removeProduct(int productId) async {
    try {
      await purchaseService.toggleProductInList(context, productId);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Produto removido.')),
      );
      _getShoppingList();
    } catch (e) {
      print('Erro ao remover produto: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erro ao remover produto.')),
      );
    }
  }

  /// Adiciona um produto à lista de compras no backend.
  ///
  /// Atualiza a lista local após a adição.
  Future<void> _addProduct(Product product) async {
    try {
      await purchaseService.toggleProductInList(context, product.Id);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Produto adicionado.')),
      );
      _getShoppingList();
    } catch (e) {
      print('Erro ao adicionar produto: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erro ao adicionar produto.')),
      );
    }
  }

  /// Exibe o modal para adicionar um novo produto à lista de compras.
  void _showAddProductDialog() {
    showDialog(
      context: context,
      builder: (context) => AddProductModal(
        showInList: false,
        onAddProduct: (product) {
          print('Produto adicionado: ${product.Name}');
          _addProduct(product);
          Navigator.of(context).pop();
        },
        onClose: () => Navigator.of(context).pop(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final groupProvider = Provider.of<GroupProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF212F3D),
      appBar: AppBar(
        backgroundColor: const Color(0xFF212F3D),
        foregroundColor: Colors.white,
        centerTitle: true,
        title: const Text(
          "A MINHA LISTA",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        automaticallyImplyLeading: groupProvider.selectedGroupId != null,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _showAddProductDialog,
          ),
        ],
      ),
      drawer: buildDrawer(context),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: products.length,
              itemBuilder: (context, index) {
                final product = products[index];
                return Card(
                  margin: const EdgeInsets.symmetric(
                      horizontal: 16.0, vertical: 8.0),
                  color: const Color(0xFF34495E), // Mantendo o tema escuro
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
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () async {
                            _removeProduct(product.Id);
                          },
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
