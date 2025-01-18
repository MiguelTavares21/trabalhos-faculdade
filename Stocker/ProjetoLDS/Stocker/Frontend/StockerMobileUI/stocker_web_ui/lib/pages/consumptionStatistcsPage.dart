import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:stocker_web_ui/models/productConsuptionDto.dart';
import 'package:stocker_web_ui/services/statistic_service.dart';
import 'package:stocker_web_ui/utils/drawer.dart';
import 'package:stocker_web_ui/widgets/dateRangeSelector.dart';

/// Página de Estatísticas de Consumo.
/// Esta página permite ao utilizador selecionar um intervalo de datas para visualizar as estatísticas
/// de consumo de produtos em formato de gráfico de pizza.
class ConsumptionStatisticsPage extends StatefulWidget {
  const ConsumptionStatisticsPage({super.key});

  @override
  State<ConsumptionStatisticsPage> createState() =>
      _ConsumptionStatisticsPageState();
}

class _ConsumptionStatisticsPageState extends State<ConsumptionStatisticsPage> {
  // Serviço responsável por ir buscar as estatísticas de consumo.
  final StatisticService _statisticService = StatisticService();

  // Datas de início e fim selecionadas pelo usuário.
  DateTime? _startDate;
  DateTime? _endDate;
  
  // Dados de consumo retornados pelo serviço.
  List<ProductConsumptionDto>? _consumptionStats;

  // Controla o estado de carregamento e mensagens de erro.
  bool _isLoading = false;
  String? _error;

  // Índice do segmento do gráfico tocado pelo utilizador.
  int touchedIndex = -1;

  /// Método para ir buscar as estatísticas de consumo com base no intervalo de datas selecionado.
  Future<void> _fetchConsumptionStatistics() async {
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
      final consumptionData = await _statisticService.getTotalConsumption(
        context,
        startDate: _startDate!,
        endDate: _endDate!,
      );
      setState(() {
        _consumptionStats = consumptionData;
      });
    } catch (e) {
      if (e is Exception) {
        final errorMessage = e.toString();

        if (errorMessage.contains("Nenhum consumo")) {
          setState(() {
            _error =
                "Nenhuma consumo registado para o intervalo de datas especificado.";
          });
        } else {
          setState(() {
            _error = "Ocorreu um erro ao carregar o gráfico.";
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
          'ESTATÍSTICA DE CONSUMO',
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
                onPressed: _fetchConsumptionStatistics,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2C3E50),
                  padding: const EdgeInsets.symmetric(
                      horizontal: 30.0, vertical: 12.0),
                ),
                child: const Text(
                  "Obter Estatísticas de Consumo",
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
            if (_consumptionStats != null)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 24.0),
                child: Column(
                  children: [
                    const Text(
                      "Gráfico de Consumo por Produto:",
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Color.fromARGB(255, 132, 142, 152),
                      ),
                    ),
                    const SizedBox(height: 10),
                    _buildConsumptionChart(),
                    const SizedBox(height: 20),
                    if (touchedIndex != -1) _buildProductDetails(touchedIndex),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildConsumptionChart() {
    return _consumptionStats == null
        ? const SizedBox()
        : SizedBox(
            height: 300,
            child: PieChart(
              PieChartData(
                pieTouchData: PieTouchData(
                  touchCallback: (FlTouchEvent event, pieTouchResponse) {
                    setState(() {
                      if (!event.isInterestedForInteractions ||
                          pieTouchResponse == null ||
                          pieTouchResponse.touchedSection == null) {
                        touchedIndex = -1;
                        return;
                      }
                      touchedIndex =
                          pieTouchResponse.touchedSection!.touchedSectionIndex;
                    });
                  },
                ),
                startDegreeOffset: 180,
                borderData: FlBorderData(show: false),
                sectionsSpace: 1,
                centerSpaceRadius: 0,
                sections: showingSections(),
              ),
            ),
          );
  }

  List<PieChartSectionData> showingSections() {
    return List.generate(
      _consumptionStats!.length,
      (i) {
        final isTouched = i == touchedIndex;
        final stat = _consumptionStats![i];

        return PieChartSectionData(
          color: _getSectionColor(i),
          value: stat.totalConsumed.toDouble(),
          title: "",
          radius: isTouched ? 90 : 80,
          titlePositionPercentageOffset: 0.55,
          borderSide: isTouched
              ? const BorderSide(color: Colors.white, width: 6)
              : BorderSide(color: Colors.white.withOpacity(0)),
          titleStyle: const TextStyle(color: Colors.white),
        );
      },
    );
  }

  Color _getSectionColor(int index) {
    switch (index) {
      case 0:
        return Colors.blue;
      case 1:
        return const Color.fromARGB(255, 197, 187, 103);
      case 2:
        return Colors.pink;
      case 3:
        return Colors.green;
      case 4:
        return Colors.orange;
      case 5:
        return Colors.red;
      case 6:
        return Colors.yellow;
      case 7:
        return Colors.purple;
      case 8:
        return Colors.cyan;
      case 9:
        return Colors.indigo;
      case 10:
        return Colors.teal;
      case 11:
        return Colors.brown;
      case 12:
        return Colors.amber;
      case 13:
        return Colors.lime;
      case 14:
        return Colors.deepOrange;
      case 15:
        return Colors.lightBlue;
      default:
        return Colors.grey;
    }
  }

  Widget _buildProductDetails(int index) {
    final stat = _consumptionStats![index];
    return Container(
      padding: const EdgeInsets.all(12.0),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8.0),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Produto: ${stat.productName}',
            style: const TextStyle(fontSize: 18, color: Colors.white),
          ),
          const SizedBox(height: 8),
          Text(
            'Total Consumido: ${stat.totalConsumed}',
            style: const TextStyle(fontSize: 16, color: Colors.white),
          ),
          Text(
            'Percentual de Consumo: ${stat.consumptionPercentage.toStringAsFixed(1)}%',
            style: const TextStyle(fontSize: 16, color: Colors.white),
          ),
        ],
      ),
    );
  }
}
