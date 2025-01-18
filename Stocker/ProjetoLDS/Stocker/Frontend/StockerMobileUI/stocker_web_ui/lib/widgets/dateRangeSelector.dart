import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

/// Um widget para selecionar um intervalo de datas.
/// Este componente exibe dois botões interativos para selecionar a data de início e a data de fim.
class DateRangeSelector extends StatelessWidget {
  /// Data inicial e final selecionada (ou null se não selecionada).
  final DateTime? startDate;
  final DateTime? endDate;

  /// Callback chamado quando a data de início e fim são selecionadas.
  final Function(DateTime) onStartDateSelected;
  final Function(DateTime) onEndDateSelected;

  const DateRangeSelector({
    super.key,
    required this.startDate,
    required this.endDate,
    required this.onStartDateSelected,
    required this.onEndDateSelected,
  });

  /// Método privado para abrir o seletor de datas (DatePicker).
  ///
  /// - [context]: O contexto atual.
  /// - [isStartDate]: Indica se o seletor é para a data de início (true) ou de fim (false).
  /// - [onDateSelected]: Callback chamado ao selecionar a data.
  Future<void> _selectDate(BuildContext context, bool isStartDate,
      Function(DateTime) onDateSelected) async {
    final initialDate = isStartDate
        ? (startDate ?? DateTime.now())
        : (endDate ?? DateTime.now());
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: DateTime(2010),
      lastDate: DateTime(2100),
    );

    if (picked != null) {
      onDateSelected(picked);
    }
  }

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('dd/MM/yyyy');

    return Row(
      children: [
        Expanded(
          child: InkWell(
            onTap: () => _selectDate(context, true, onStartDateSelected),
            child: Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 16.0,
                vertical: 12.0,
              ),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
                borderRadius: BorderRadius.circular(8.0),
                color: Colors.white.withOpacity(0.1),
              ),
              child: Text(
                startDate != null
                    ? dateFormat.format(startDate!)
                    : "Data de início",
                style: const TextStyle(fontSize: 16, color: Colors.white),
              ),
            ),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: InkWell(
            onTap: () => _selectDate(context, false, onEndDateSelected),
            child: Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 16.0,
                vertical: 12.0,
              ),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
                borderRadius: BorderRadius.circular(8.0),
                color: Colors.white.withOpacity(0.1),
              ),
              child: Text(
                endDate != null ? dateFormat.format(endDate!) : "Data de fim",
                style: const TextStyle(fontSize: 16, color: Colors.white),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
