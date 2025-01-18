import 'package:flutter/material.dart';
import 'package:stocker_web_ui/models/product.dart';
import 'package:stocker_web_ui/services/product_service.dart';
import 'package:stocker_web_ui/utils/drawer.dart';
import 'package:stocker_web_ui/widgets/product_modal.dart';

/// Página que exibe a lista de produtos de um tipo específico.
/// A página permite procurar, adicionar, editar e eliminar produtos.
class ProductsPage extends StatefulWidget {
  final String productTypeKey; // Chave do tipo de produto

  ProductsPage({required this.productTypeKey});

  @override
  _ProductsPageState createState() => _ProductsPageState();
}

class _ProductsPageState extends State<ProductsPage> {
  late ProductService productService; // Serviço para obter os produtos
  List<Product> products = []; // Lista de produtos
  String searchQuery = ''; // Filtro de pesquisa
  bool isLoading = true; // Flag de carregamento

  @override
  void initState() {
    super.initState();
    productService = ProductService();
    _loadProducts();
  }

  /// Formata o tipo de produto para o formato esperado pelo backend.
  /// Substitui espaços e "e" por "_".
  String formatTypeForBackend(String type) {
    return type.replaceAll(' e ', '_').replaceAll(' ', '_');
  }

  /// Carrega os produtos do backend, filtrando pelo tipo.
  Future<void> _loadProducts() async {
    setState(() {
      isLoading = true;
    });

    try {
      final userProducts = await productService.getProductsByType(
        context,
      );
      setState(() {
        products = userProducts;
      });
    } catch (e) {
      print("Erro ao carregar produtos: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao carregar produtos.')),
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  /// Filtra e retorna os produtos com base no tipo e na pesquisa do utilizador.
  List<Product> getFilteredProducts() {
    print(widget.productTypeKey);
    return products
        .where((product) =>
            product.Type.toString().split('.').last ==
                formatTypeForBackend(
                    widget.productTypeKey) && // Filtra pelo tipo de produto
            (product.Name.toLowerCase()
                    .contains(searchQuery.toLowerCase()) || // Filtro pelo nome
                product.Unities.toString().toLowerCase().contains(
                    searchQuery.toLowerCase()))) // Filtro pela unidade
        .toList()
      ..sort(
          (a, b) => a.Name.compareTo(b.Name)); // Ordena os produtos pelo nome
  }

  /// Abre o modal de produto para adicionar ou editar.
  /// - [product]: Produto existente para edição, ou `null` para criar um novo.
  void _openProductModal({Product? product}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return ProductModal(
          product: product,
          onSave: (newProduct) {
            setState(() {
              if (product == null) {
                ProductService().saveProduct(newProduct, context);
                _loadProducts();
              } else {
                ProductService()
                    .updateProduct(newProduct.Id, newProduct, context);
                _loadProducts();
              }
            });
            Navigator.pop(context);
          },
          onClose: () {
            Navigator.pop(context); // Fecha o modal ao clicar em "fechar".
          },
          onDelete: product != null
              ? () {
                  // Apenas exibe o botão de eliminar quando for edição
                  _deleteProduct(
                      product.Id); // Chama a função para eliminar o produto
                }
              : null,
        );
      },
    );
  }

  /// Elimina o produto pelo ID e atualiza a lista local.
  void _deleteProduct(int productId) async {
    try {
      await ProductService().deleteProduct(productId, context);
      _loadProducts(); // Atualiza a lista após a exclusão
      products.removeWhere((product) =>
          product.Id == productId); // Remove o produto da lista local
      Navigator.pop(context); // Fecha o modal
    } catch (e) {
      // Se ocorrer algum erro, você pode exibir uma mensagem
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao eliminar o produto: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "${widget.productTypeKey}",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        foregroundColor: Colors.white,
        backgroundColor: Color(0xFF212F3D),
        elevation: 0,
      ),
      drawer: buildDrawer(context),
      body: Container(
        color: Color(0xFF212F3D),
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Barra de pesquisa e botão de adicionar produto
            Row(
              children: [
                Expanded(
                  child: TextField(
                    onChanged: (value) {
                      setState(() {
                        searchQuery = value;
                      });
                    },
                    style: TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Procurar produto...',
                      hintStyle: TextStyle(color: Colors.grey),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30.0),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30.0),
                        borderSide: BorderSide(
                          color: Color(0xFF1ABC9C),
                          width: 2,
                        ),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30.0),
                        borderSide: BorderSide(color: Colors.grey, width: 1),
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 16),
                GestureDetector(
                  onTap: () => _openProductModal(),
                  child: Image.asset(
                    'assets/add-product-icon.png', // Caminho do ícone
                    width: 60, // Largura do ícone
                    height: 75,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Carregamento ou exibição de produtos
            if (isLoading)
              const Center(child: CircularProgressIndicator())
            else if (products.isEmpty)
              const Center(
                child: Text(
                  'Nenhum produto encontrado.',
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
              )
            else
              Expanded(
                child: ListView.builder(
                  itemCount: getFilteredProducts().length,
                  itemBuilder: (context, index) {
                    final product = getFilteredProducts()[index];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 8.0),
                      decoration: BoxDecoration(
                        color: Color.fromARGB(255, 107, 129, 149),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(16.0),
                        title: Text(
                          product.Name,
                          style: TextStyle(
                            fontSize: 18,
                            color: Color.fromARGB(255, 255, 255, 255),
                          ),
                        ),
                        subtitle: Text(
                          '${product.Unities.name}',
                          style: TextStyle(
                            fontSize: 14,
                            color: Color.fromARGB(255, 255, 255, 255),
                          ),
                        ),
                        trailing: IconButton(
                          icon: Icon(Icons.edit,
                              color: Color.fromARGB(255, 255, 255, 255)),
                          onPressed: () => _openProductModal(product: product),
                        ),
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

class AlertWidget extends StatelessWidget {
  final String message;

  const AlertWidget({required this.message});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.green,
      padding: EdgeInsets.all(10),
      child: Row(
        children: [
          Icon(Icons.check, color: Colors.white),
          SizedBox(width: 8),
          Expanded(child: Text(message, style: TextStyle(color: Colors.white))),
        ],
      ),
    );
  }
}
