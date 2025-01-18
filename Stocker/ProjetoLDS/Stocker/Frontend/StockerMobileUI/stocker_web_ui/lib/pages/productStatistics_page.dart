import 'package:flutter/material.dart';
import 'package:stocker_web_ui/models/product.dart';
import 'package:stocker_web_ui/models/productStatisticsDto.dart';
import 'package:stocker_web_ui/services/product_service.dart';
import 'package:stocker_web_ui/services/statistic_service.dart';
import 'package:stocker_web_ui/utils/drawer.dart';
import 'package:stocker_web_ui/widgets/dateRangeSelector.dart';

// Página de Estatísticas dos Produtos
// Esta página permite ao utilizador visualizar as estatísticas de um produto selecionado
// dentro de um intervalo de datas determinado.
class ProductStatisticsPage extends StatefulWidget {
  const ProductStatisticsPage({super.key});

  @override
  State<ProductStatisticsPage> createState() => _ProductStatisticsPageState();
}

class _ProductStatisticsPageState extends State<ProductStatisticsPage> {
  // Instâncias dos serviços responsáveis por ir buscar os dados necessários
  final StatisticService _statisticService = StatisticService();
  final ProductService _productService = ProductService();

  // Variáveis de controlo de estado
  DateTime? _startDate; // Data de início do intervalo
  DateTime? _endDate; // Data de fim do intervalo
  int? _selectedProductId; // ID do produto selecionado
  ProductStatisticsDto? _statistics; // Estatísticas do produto selecionado
  bool _isLoading = false;  // Flag de carregamento
  String? _error; // Mensagem de erro
  List<Product> _products = []; // Lista de produtos

  @override
  void initState() {
    super.initState();
    _fetchProducts();
  }

  // Método responsável por ir buscar os produtos disponíveis no backend
  Future<void> _fetchProducts() async {
    setState(() => _isLoading = true);
    try {
      _products = await _productService.getProductsByGroup(context);
    } catch (e) {
      setState(() => _error = "Erro ao carregar os produtos: $e");
    } finally {
      setState(() => _isLoading = false);
    }
  }

  // Método responsável por ir buscar as estatísticas do produto com base no intervalo de datas e produto selecionado
  Future<void> _fetchStatistics() async {
    if (_startDate == null || _endDate == null || _selectedProductId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Por favor, selecione um produto e as datas."),
        ),
      );
      return;
    }

    if (_startDate!.isAfter(_endDate!)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content:
              Text("A data de início não pode ser maior que a data de fim."),
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final statistics = await _statisticService.getProductStatistics(
        context,
        productId: _selectedProductId!,
        startDate: _startDate!,
        endDate: _endDate!,
      );
      setState(() {
        _statistics = statistics;
      });
    } catch (e) {
      if (e is Exception) {
        final errorMessage = e.toString();

        if (errorMessage.contains("Não existem")) {
          setState(() {
            _error =
                "Não existem compras registadas para o produto no intervalo de datas especificado.";
          });
        }
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF212F3D),
      appBar: AppBar(
        foregroundColor: Colors.white,
        title: const Text(
          'ESTATÍSTICA POR PRODUTO',
          style: TextStyle(
            color: Colors.white,
            fontSize: 24.0,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        backgroundColor: const Color(0xFF212F3D),
      ),
      drawer: buildDrawer(context),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Selecione o produto e o intervalo de datas:",
              style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white),
            ),
            const SizedBox(height: 20),
            DropdownButtonFormField<int>(
              value: _selectedProductId,
              decoration: const InputDecoration(
                labelText: "Produto",
                labelStyle: TextStyle(color: Colors.white),
              ),
              style: const TextStyle(color: Colors.black),
              dropdownColor: Colors.white,
              items: _products
                  .map((product) => DropdownMenuItem(
                        value: product.Id,
                        child: Text(
                          product.Name,
                          style:
                              const TextStyle(fontSize: 20, color: Colors.grey),
                        ),
                      ))
                  .toList(),
              onChanged: (value) =>
                  setState(() => _selectedProductId = value ?? 0),
            ),
            const SizedBox(height: 15),
            DateRangeSelector(
              startDate: _startDate,
              endDate: _endDate,
              onStartDateSelected: (date) => setState(() => _startDate = date),
              onEndDateSelected: (date) => setState(() => _endDate = date),
            ),
            const SizedBox(height: 30),
            Center(
              child: ElevatedButton(
                onPressed: _fetchStatistics,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2C3E50),
                  padding: const EdgeInsets.symmetric(
                      horizontal: 30.0, vertical: 12.0),
                ),
                child: const Text(
                  "Obter Estatísticas",
                  style: TextStyle(fontSize: 20, color: Colors.white),
                ),
              ),
            ),
            const SizedBox(height: 24),
            if (_isLoading)
              const Center(
                child: CircularProgressIndicator(color: Colors.white),
              ),
            if (_error != null)
              Center(
                child: Text(
                  _error!,
                  style: const TextStyle(color: Colors.red, fontSize: 20),
                  textAlign: TextAlign.center,
                ),
              ),
            if (_statistics != null)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 24.0),
                child: _buildStatisticsCard(),
              ),
          ],
        ),
      ),
    );
  }

  // Método responsável por construir o cartão de estatísticas com os resultados
  Widget _buildStatisticsCard() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20.0),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            spreadRadius: 3,
          ),
        ],
      ),
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Resultados:",
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Color(0xFF212F3D),
            ),
          ),
          const SizedBox(height: 16),
          _buildResultItem(
            "Total Gasto",
            "€${_statistics!.totalSpent}",
            Colors.green,
          ),
          const SizedBox(height: 16),
          _buildResultItem(
            "Quantidade Total",
            "${_statistics!.totalQuantity}",
            Colors.blue,
          ),
          const SizedBox(height: 16),
          _buildResultItem(
            "Total de Compras",
            "${_statistics!.totalPurchases}",
            Colors.orange,
          ),
          const SizedBox(height: 16),
          _buildResultItem(
            "Média Gasta",
            "€${_statistics!.averageSpentByProduct.toStringAsFixed(2)}",
            Colors.purple,
          ),
        ],
      ),
    );
  }

  // Método auxiliar para criar um item de resultado no cartão de estatísticas
  Widget _buildResultItem(String title, String value, Color valueColor) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Color(0xFF212F3D),
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: valueColor,
          ),
        ),
      ],
    );
  }
}
