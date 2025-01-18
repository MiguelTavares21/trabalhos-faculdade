import 'package:flutter/material.dart';
import 'package:stocker_web_ui/models/spendingStatisticsDto.dart';
import 'package:stocker_web_ui/services/statistic_service.dart';
import 'package:intl/intl.dart';
import 'package:stocker_web_ui/utils/drawer.dart';
import 'package:stocker_web_ui/widgets/dateRangeSelector.dart';

/// Página de exibição das estatísticas de gastos, onde o utilizador pode selecionar um
/// intervalo de datas e obter informações sobre os gastos totais, número de compras
/// e a média de gasto por compra.
class SpendingStatisticsPage extends StatefulWidget {
  const SpendingStatisticsPage({super.key});

  @override
  State<SpendingStatisticsPage> createState() => _SpendingStatisticsPageState();
}

class _SpendingStatisticsPageState extends State<SpendingStatisticsPage> {
  // Instância do serviço responsável por ir buscar as estatísticas de gastos.
  final StatisticService _statisticService = StatisticService();

  // Datas selecionadas para o intervalo de análise.
  DateTime? _startDate;
  DateTime? _endDate;

  // Armazena as estatísticas obtidas do backend.
  SpendingStatisticsDto? _statistics;

  // Controla o estado de carregamento da página.
  bool _isLoading = false;

  // Mensagem de erro, caso algo dê errado ao buscar as estatísticas.
  String? _error;

  /// Método para ir buscar as estatísticas com base no intervalo de datas selecionado.
  Future<void> _fetchStatistics() async {
    if (_startDate == null || _endDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Por favor, selecione as datas.")),
      );
      return;
    }

    if (_startDate!.isAfter(_endDate!)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content:
                Text("A data de início não pode ser maior que a data de fim.")),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final statistics = await _statisticService.getTotalSpent(
        context,
        startDate: _startDate!,
        endDate: _endDate!,
      );
      setState(() {
        _statistics = statistics;
      });
    } catch (e) {
      if (e is Exception) {
        final errorMessage = e.toString();

        if (errorMessage.contains("Nenhuma compra foi registada")) {
          setState(() {
            _error =
                "Nenhuma compra foi registada no intervalo de datas especificado.";
          });
        } else if (errorMessage.contains("grupo especificado")) {
          setState(() {
            _error = "Não existem compras registadas para este grupo.";
          });
        }
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
          'ESTATISTICA DE GASTOS',
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
              "Selecione o intervalo de datas:",
              style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white),
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
                  child: CircularProgressIndicator(color: Colors.white)),
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
                child: Container(
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
                        "Total de Compras",
                        "${_statistics!.totalPurchases}",
                        Colors.blue,
                      ),
                      const SizedBox(height: 16),
                      _buildResultItem(
                        "Média por Compra",
                        "€${_statistics!.averageSpent.toStringAsFixed(2)}",
                        Colors.orange,
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

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
