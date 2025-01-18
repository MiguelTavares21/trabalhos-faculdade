import 'package:flutter/material.dart';
import 'package:stocker_web_ui/pages/products_page.dart';
import 'package:stocker_web_ui/utils/drawer.dart';
import '../services/product_service.dart';
import '../models/productType.dart';

// Página de Tipos de Produtos
// Essa página exibe uma lista de tipos de produtos e permite ao utilizador
// navegar para os produtos de um tipo específico.
class ProductsTypePage extends StatefulWidget {
  const ProductsTypePage({Key? key}) : super(key: key);

  @override
  _ProductsTypePageState createState() => _ProductsTypePageState();
}

class _ProductsTypePageState extends State<ProductsTypePage> {
  // Lista dos tipos de produtos carregados
  late List<ProductType> productTypes = [];
  bool isLoading = true; // Indica se a página está a carregar
  String searchQuery = ""; // Query de pesquisa

  @override
  void initState() {
    super.initState();
    _loadProductTypes();
  }

  @override
  void dispose() {
    super.dispose(); // Descarta recursos quando a página é fechada
  }

  // Função responsável por carregar os tipos de produtos do serviço
  Future<void> _loadProductTypes() async {
    setState(() {
      isLoading = true;
    });

    final productService = ProductService();
    final fetchedProductTypes = await productService.getProductTypes();

    setState(() {
      productTypes = fetchedProductTypes;
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("PRODUTOS",
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        foregroundColor: Colors.white,
        backgroundColor: Color(0xFF212F3D),
        elevation: 0,
      ),
      drawer: buildDrawer(context),
      body: Container(
        color: Color(0xFF212F3D),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              if (isLoading)
                const Center(child: CircularProgressIndicator())
              else
                Expanded(
                  child: ListView.builder(
                    itemCount: productTypes.length,
                    itemBuilder: (context, index) {
                      final productType = productTypes[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 8.0),
                        decoration: BoxDecoration(
                          color: Color(0xFFD9D9D9), // Cor de fundo dos itens
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(16.0),
                          leading: Image.asset(
                            productType.icon, // Caminho do ícone
                            width: 40, // Tamanho do ícone
                            height: 40,
                            fit: BoxFit.cover,
                          ),
                          title: Text(
                            productType.label,
                            style: TextStyle(
                              fontSize: 18,
                              color: Color(0xFF2C3E50),
                            ),
                          ),
                          onTap: () {
                            // Navegar para a página de produtos daquele tipo
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => ProductsPage(
                                    productTypeKey: productType.label),
                              ),
                            );
                          },
                        ),
                      );
                    },
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
