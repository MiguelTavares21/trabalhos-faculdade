import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:provider/provider.dart';
import 'package:stocker_web_ui/models/PurchaseDto.dart';
import 'package:stocker_web_ui/models/PurchaseProductDto.dart';
import 'package:stocker_web_ui/services/group_provider.dart';
import 'package:stocker_web_ui/services/purchase_service.dart';
import 'package:stocker_web_ui/utils/drawer.dart';
import 'package:intl/intl.dart';

// Página que exibe o histórico de compras do utilizador
class PurchasePage extends StatefulWidget {
  const PurchasePage({Key? key}) : super(key: key);

  @override
  State<PurchasePage> createState() => _PurchasePageState();
}

class _PurchasePageState extends State<PurchasePage> {
  late PurchaseService purchaseService; // Serviço de compras
  List<Purchasedto> purchases = []; // Lista de compras
  List<List<PurchaseProductdto>> purchaseProductsList = []; // Lista de produtos
  List<bool> _isExpanded = []; // Lista de booleanos para controlar a expansão
  bool isLoading = true; // Flag de carregamento

  @override
  void initState() {
    super.initState();
    purchaseService = PurchaseService();
    SchedulerBinding.instance.addPostFrameCallback((_) {
      _getHistory();
    });
  }

  // Função para carregar o histórico de compras
  Future<void> _getHistory() async {
    setState(() {
      isLoading = true;
    });
    try {
      final userPurchases = await purchaseService.getPurchaseHistory(context);
      setState(() {
        purchases = userPurchases;
        _isExpanded =
            List.filled(purchases.length, false); // Inicializar lista booleana
        purchaseProductsList = List.generate(
            purchases.length, (_) => []); // Inicializar lista de produtos
      });
    } catch (e) {
      print("Erro ao carregar histórico de compras: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erro ao carregar histórico de compras.')),
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  // Função para eliminar uma compra
  Future<void> _deletePurchase(int purchaseId) async {
    try {
      await purchaseService.deletePurchase(context, purchaseId);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Compra excluída com sucesso.')),
      );
      _getHistory();
    } catch (e) {
      print("Erro ao excluir compra: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erro ao excluir compra.')),
      );
    }
  }

  // Função para carregar os produtos de uma compra específica
  Future<void> _getPurchaseProducts(int index, int purchaseId) async {
    try {
      final products =
          await purchaseService.getPurchaseProducts(context, purchaseId);

      // Certifique-se de que o índice está dentro do alcance
      if (index >= 0 && index < purchaseProductsList.length) {
        setState(() {
          purchaseProductsList[index] = products;
          _isExpanded[index] = !_isExpanded[index];
        });
      }
    } catch (e) {
      print("Erro ao carregar produtos da compra: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erro ao carregar produtos da compra.')),
      );
    }
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
          "AS MINHAS COMPRAS",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        automaticallyImplyLeading: groupProvider.selectedGroupId != null,
      ),
      drawer: buildDrawer(context),
      body: isLoading
          ? const Center(
              child: CircularProgressIndicator(
                color: Colors.white,
              ),
            )
          : ListView.builder(
              itemCount: purchases.length,
              itemBuilder: (context, index) {
                final purchase = purchases[index];
                final formattedDate = DateFormat('dd/MM/yyyy')
                    .format(DateTime.parse(purchase.Date));

                return Card(
                  margin:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                  elevation: 5,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF2A3E4D),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              formattedDate,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete, color: Colors.red),
                              onPressed: () {
                                showDialog(
                                  context: context,
                                  builder: (context) {
                                    return AlertDialog(
                                      title: const Text('Excluir compra'),
                                      content: const Text(
                                          'Tem certeza que deseja excluir esta compra?'),
                                      actions: [
                                        TextButton(
                                          onPressed: () {
                                            Navigator.of(context).pop();
                                          },
                                          child: const Text('Cancelar'),
                                        ),
                                        TextButton(
                                          onPressed: () {
                                            _deletePurchase(purchase.Id);
                                            Navigator.of(context).pop();
                                          },
                                          child: const Text('Excluir'),
                                        ),
                                      ],
                                    );
                                  },
                                );
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '${purchase.Price.toStringAsFixed(2)} €',
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Align(
                          alignment: Alignment.center,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue,
                            ),
                            onPressed: () {
                              if (index >= 0 && index < _isExpanded.length) {
                                if (!_isExpanded[index]) {
                                  _getPurchaseProducts(index, purchase.Id);
                                } else {
                                  setState(() {
                                    _isExpanded[index] = false;
                                  });
                                }
                              }
                            },
                            child: Text(
                              index < _isExpanded.length && _isExpanded[index]
                                  ? 'Ocultar produtos'
                                  : 'Ver produtos',
                              style: const TextStyle(color: Colors.white),
                            ),
                          ),
                        ),
                        if (index < _isExpanded.length &&
                            _isExpanded[index]) ...[
                          const Divider(color: Colors.white),
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: index < purchaseProductsList.length
                                ? purchaseProductsList[index].length
                                : 0,
                            itemBuilder: (context, productIndex) {
                              final product =
                                  purchaseProductsList[index][productIndex];
                              return Padding(
                                padding:
                                    const EdgeInsets.symmetric(vertical: 4.0),
                                child: Text(
                                  '- ${product.Name} (${product.Quantity} ${product.Unity})',
                                  style: const TextStyle(
                                    color: Colors.white70,
                                    fontSize: 14,
                                  ),
                                ),
                              );
                            },
                          ),
                        ],
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
