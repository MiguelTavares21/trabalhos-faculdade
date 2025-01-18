import 'package:flutter/material.dart';
import 'package:stocker_web_ui/enums/types_enum.dart';
import 'package:stocker_web_ui/models/typeStatisticsDto.dart';
import 'package:stocker_web_ui/services/statistic_service.dart';
import 'package:stocker_web_ui/utils/drawer.dart';
import 'package:intl/intl.dart';
import 'package:stocker_web_ui/widgets/dateRangeSelector.dart';

/// Página que exibe as estatísticas detalhadas de um tipo de produto selecionado
/// no intervalo de datas escolhido.
class TypeStatisticsPage extends StatefulWidget {
  const TypeStatisticsPage({super.key});

  @override
  State<TypeStatisticsPage> createState() => _TypeStatisticsPageState();
}

class _TypeStatisticsPageState extends State<TypeStatisticsPage> {
  final StatisticService _statisticService = StatisticService();

  DateTime? _startDate; // Data de início do intervalo
  DateTime? _endDate; // Data de fim do intervalo

  // Tipo de produto selecionado
  String? _selectedType;
  
  // Estatísticas do tipo de produto selecionado
  TypeStatisticsDto? _statistics;

  // Variáveis de controlo de estado
  bool _isLoading = false;

  // Mensagem de erro
  String? _error;

  // Função que procura as estatísticas com base nos parâmetros selecionados
  Future<void> _fetchStatistics() async {
    if (_startDate == null || _endDate == null || _selectedType == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Por favor, selecione o tipo e as datas."),
        ),
      );
      return;
    }

    if (_startDate!.isAfter(_endDate!)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("A data de início não pode ser maior que a data de fim."),
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      String productTypeToSend = TypesExtension.getDescription(
          TypesExtension.fromDescription(_selectedType!));

      final statistics = await _statisticService.getTypeStatistics(
        context,
        productType: productTypeToSend,
        startDate: _startDate!,
        endDate: _endDate!,
      );
      setState(() {
        _statistics = statistics;
      });
    } catch (e) {
      if (e is Exception) {
        final errorMessage = e.toString();
        setState(() {
          if (errorMessage.contains("Não existem compras")) {
            _error = "Não existem compras registadas para o tipo de produto no intervalo de datas especificado.";
          } else if (errorMessage.contains("Não existem produtos")) {
            _error = "Não existem produtos do tipo selecionado.";
          } else {
            _error = "Ocorreu um erro ao obter os dados.";
          }
        });
      }
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF212F3D),
      appBar: AppBar(
        foregroundColor: Colors.white,
        title: const Text(
          'ESTATÍSTICA POR TIPO',
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
              "Selecione o tipo e o intervalo de datas:",
              style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white),
            ),
            const SizedBox(height: 20),
            DropdownButtonFormField<String>(
              value: _selectedType,
              decoration: const InputDecoration(
                labelText: "Tipo",
                labelStyle: TextStyle(color: Colors.white),
              ),
              style: const TextStyle(color: Colors.black),
              dropdownColor: Colors.white,
              items: Types.values
                  .map((type) => DropdownMenuItem(
                        value: type.description,
                        child: Text(
                          type.description,
                          style: const TextStyle(fontSize: 20, color: Colors.grey),
                        ),
                      ))
                  .toList(),
              onChanged: (value) => setState(() => _selectedType = value ?? ''),
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

  // Constrói o cartão com as estatísticas do tipo de produto selecionado
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
            "€${_statistics!.averageSpent.toStringAsFixed(2)}",
            Colors.purple,
          ),
        ],
      ),
    );
  }

  // Constrói um item de resultado
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
