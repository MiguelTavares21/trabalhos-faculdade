import 'package:flutter/material.dart';
import 'package:stocker_web_ui/models/product.dart';
import 'package:stocker_web_ui/services/product_service.dart';
import 'package:stocker_web_ui/utils/drawer.dart';
import 'package:stocker_web_ui/widgets/productConsume_modal.dart';
import 'package:stocker_web_ui/widgets/product_modal.dart';

/// A página de inventário onde os produtos podem ser visualizados, consumidos,
/// editados ou removidos. Só aparecem os produtos em stock.
class InventoryPage extends StatefulWidget {
  @override
  _InventoryPageState createState() => _InventoryPageState();
}

class _InventoryPageState extends State<InventoryPage> {
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

  /// Função para formatar o tipo de produto para envio ao backend.
  ///
  /// Este método converte o tipo de produto para um formato específico esperado
  /// pela API, substituindo espaços e a palavra "e" por underscores.
  String formatTypeForBackend(String type) {
    return type.replaceAll(' e ', '_').replaceAll(' ', '_');
  }

  /// Carrega a lista de produtos do serviço.
  ///
  /// Este método pru os produtos no backend, mostrando um indicador de
  /// carregamento enquanto os dados estão sendo carregados. Se ocorrer um erro,
  /// uma mensagem será exibida.
  Future<void> _loadProducts() async {
    if (!mounted) return;

    setState(() {
      isLoading = true;
    });

    try {
      final userProducts = await productService.getInventory(context);
      if (mounted) {
        setState(() {
          products = userProducts;
        });
      }
    } catch (e) {
      print("Erro ao carregar produtos: $e");
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao carregar produtos.')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  /// Filtra os produtos com base na pesquisa do usuário e na quantidade disponível.
  ///
  /// Este método retorna uma lista de produtos onde a quantidade é maior que 0
  /// e o nome ou unidade do produto contém a string de pesquisa fornecida.
  List<Product> getFilteredProducts() {
    return products
        .where((product) =>
            product.Quantity > 0) // Filtra produtos com quantidade > 0
        .where((product) =>
            product.Name.toLowerCase().contains(searchQuery.toLowerCase()) ||
            product.Unities.toString()
                .toLowerCase()
                .contains(searchQuery.toLowerCase()))
        .toList() // Converte o iterable para lista
      ..sort(
          (a, b) => a.Name.compareTo(b.Name)); // Ordena os produtos pelo nome
  }

  /// Abre o modal para consumir um produto.
  ///
  /// Este método abre um modal para o utuilizador consumir uma quantidade de um produto.
  /// Após consumir o produto, a lista de produtos é atualizada.
  void _openProductConsumeModal({Product? product}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return ProductModalConsume(
          product: product,
          onSave: (updatedProduct) async {
            // Captura a quantidade do modal antes de consumir
            double quantityToConsume =
                product!.Quantity - updatedProduct.Quantity;
            if (quantityToConsume < 0) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                    content: Text(
                        'Quantidade inválida. Insira um valor maior que 0.')),
              );
              return;
            }

            try {
              // Consome a quantidade informada
              await productService.consumeProduct(
                updatedProduct.Id,
                quantityToConsume,
                context,
              );

              // Atualiza os produtos após consumo
              await _loadProducts();
            } catch (e) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Erro ao consumir produto: $e')),
              );
            } finally {
              // Fecha o modal
              Navigator.pop(context);
            }
          },
          onClose: () {
            Navigator.pop(context);
          },
        );
      },
    );
  }

  /// Elimina um produto.
  ///
  /// Este método chama o serviço de exclusão de produtos e remove o produto da lista local
  /// após a exclusão bem-sucedida.
  void _deleteProduct(int productId) async {
    try {
      // Chama a função de exclusão do serviço
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

  /// Decrementa a quantidade de um produto.
  ///
  /// Este método decrementa a quantidade de um produto no stock. Se a quantidade
  /// atingir 0, o produto é removido da lista. Caso ocorra um erro ao consumir,
  /// a operação é revertida.
  void decrementQuantity(Product product, BuildContext context) async {
    // Verifica se o produto existe
    if (product == null) {
      showAlert(context, 'Produto não encontrado.');
      return;
    }

    // Verifica se a quantidade do produto é maior que 0
    if (product.Quantity != null && product.Quantity! > 0) {
      // Armazena a quantidade antiga antes de modificar
      double oldQuantity = product.Quantity!;

      // Atualiza a quantidade localmente
      setState(() {
        product.Quantity = product.Quantity! - 1;
      });

      // Se a quantidade for 0, remove o produto da lista
      if (product.Quantity == 0) {
        setState(() {
          products.removeWhere((p) => p.Id == product.Id);
        });
      }

      try {
        await productService.consumeProduct(product.Id, 1, context);
        showAlert(context, 'Quantidade atualizada com sucesso.');
      } catch (e) {

        setState(() {
          product.Quantity = oldQuantity;
          if (!products.contains(product)) {
            products.add(product);
          }
        });

        showAlert(context,
            'Erro ao atualizar a quantidade do produto. A quantidade deve ser superior a 1 para decrementar.');
      }
    } else {
      // Se a quantidade for 0 ou menor, exibe a mensagem de alerta
      showAlert(context, 'Quantidade já é 0, impossível decrementar.');
    }
  }

  /// Exibe uma mensagem de alerta.
  ///
  /// Este método exibe uma mensagem de erro ou sucesso na forma de um `SnackBar`.
  void showAlert(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  /// Abre o modal de edição ou criação de produto.
  ///
  /// Este método abre um modal onde o utilizador pode editar ou adicionar um produto ao stock.
  void _openProductModal({Product? product}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return ProductModal(
          product: product,
          onSave: (newProduct) async {
            try {
              if (product == null) {
                await ProductService().saveProduct(newProduct, context);
              } else {
                await ProductService()
                    .updateProduct(newProduct.Id, newProduct, context);
              }
              await _loadProducts(); 
            } catch (e) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Erro ao salvar produto: $e')),
              );
            } finally {
              Navigator.pop(context);
            }
          },
          onClose: () {
            Navigator.pop(context); 
          },
          onDelete: product != null
              ? () {
                  _deleteProduct(
                      product.Id); 
                }
              : null, // Não mostra o botão de eliminar se for adicionar novo produto
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "INVENTÁRIO",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        foregroundColor: Colors.white,
        backgroundColor: Color(0xFF212F3D),
        elevation: 0,
      ),
      drawer: buildDrawer(context),
      backgroundColor: Color(0xFF212F3D),
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
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                                icon: Icon(Icons.remove, color: Colors.white),
                                onPressed: () =>
                                    decrementQuantity(product, context)),

                            Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 8.0),
                              child: Text(
                                '${product.Quantity}', // Quantidade atual
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            // Ícone de editar
                            IconButton(
                              icon: Icon(Icons.edit, color: Colors.white),
                              onPressed: () =>
                                  _openProductModal(product: product),
                            ),
                            // Ícone de consumir
                            IconButton(
                              icon: Icon(Icons.remove_circle_outline,
                                  color: Colors.white), // Ícone para consumir
                              onPressed: () => _openProductConsumeModal(
                                  product: product), // Abre o modal de consumo
                            ),
                          ],
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
