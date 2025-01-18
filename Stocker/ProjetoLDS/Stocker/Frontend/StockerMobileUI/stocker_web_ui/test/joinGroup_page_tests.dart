import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:stocker_web_ui/pages/joinGroup_page.dart';

void main() {
  group('JoinGroupPage Tests', () {
    testWidgets('Testa se o título, campo de texto e botão estão presentes', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: JoinGroupPage(),
        ),
      );

      expect(find.text('ENTRAR NUM GRUPO'), findsOneWidget);

      expect(find.byType(TextField), findsOneWidget);

      expect(find.text('ENTRAR'), findsOneWidget);
    });

    testWidgets('Testa mensagem de erro ao tentar entrar sem inserir código', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: JoinGroupPage(),
        ),
      );

      await tester.tap(find.text('ENTRAR'));
      await tester.pump();

      expect(find.text('Por favor, insira um código válido.'), findsOneWidget);
    });

    testWidgets('Testa a interação ao inserir código válido', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: JoinGroupPage(),
        ),
      );
      await tester.enterText(find.byType(TextField), 'codigo123');
      await tester.pump();

      await tester.tap(find.text('ENTRAR'));
      await tester.pump();
      expect(find.byType(CircularProgressIndicator), findsNothing);
    });
  });
}
