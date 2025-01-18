import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:intl/intl.dart';

import 'package:stocker_web_ui/widgets/dateRangeSelector.dart';

void main() {
  group('DateRangeSelector Widget', () {
    testWidgets('Exibe as datas corretas ou os placeholders iniciais',
        (WidgetTester tester) async {
      final startDate = DateTime(2023, 12, 1);
      final endDate = DateTime(2023, 12, 15);

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: DateRangeSelector(
              startDate: startDate,
              endDate: endDate,
              onStartDateSelected: (selectedDate) {},
              onEndDateSelected: (selectedDate) {},
            ),
          ),
        ),
      );

      expect(find.text(DateFormat('dd/MM/yyyy').format(startDate)),
          findsOneWidget);
      expect(find.text(DateFormat('dd/MM/yyyy').format(endDate)), findsOneWidget);
    });

    testWidgets('Exibe os placeholders quando nenhuma data é fornecida',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: DateRangeSelector(
              startDate: null,
              endDate: null,
              onStartDateSelected: (selectedDate) {},
              onEndDateSelected: (selectedDate) {},
            ),
          ),
        ),
      );

      expect(find.text('Data de início'), findsOneWidget);
      expect(find.text('Data de fim'), findsOneWidget);
    });

    testWidgets('Abre o seletor de datas ao clicar no campo correspondente',
        (WidgetTester tester) async {
      DateTime? selectedStartDate;
      DateTime? selectedEndDate;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: DateRangeSelector(
              startDate: null,
              endDate: null,
              onStartDateSelected: (selectedDate) {
                selectedStartDate = selectedDate;
              },
              onEndDateSelected: (selectedDate) {
                selectedEndDate = selectedDate;
              },
            ),
          ),
        ),
      );

      await tester.tap(find.text('Data de início'));
      await tester.pumpAndSettle(); 

      final testStartDate = DateTime(2024, 12, 1);
      await tester.tap(find.text('1')); 
      await tester.tap(find.text('OK'));
      await tester.pumpAndSettle();

      expect(selectedStartDate, equals(testStartDate));

      await tester.tap(find.text('Data de fim'));
      await tester.pumpAndSettle(); 
      final testEndDate = DateTime(2024, 12, 15);
      await tester.tap(find.text('15')); 
      await tester.tap(find.text('OK'));
      await tester.pumpAndSettle();

      expect(selectedEndDate, equals(testEndDate));
    });
  });
}
