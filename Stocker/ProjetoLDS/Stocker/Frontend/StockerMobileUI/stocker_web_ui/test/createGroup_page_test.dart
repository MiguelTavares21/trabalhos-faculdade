import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:stocker_web_ui/pages/createGroup_page.dart';

void main() {
  group('CreateGroupPage Tests', () {
testWidgets('Renderiza todos os campos corretamente', (WidgetTester tester) async {
  await tester.pumpWidget(
    const MaterialApp(
      home: CreateGroupPage(),
    ),
  );

  await tester.pumpAndSettle();
  expect(find.text('NOME DO GRUPO'), findsOneWidget);
  expect(find.text('DESCRIÇÃO (opcional)'), findsOneWidget);
  expect(find.text('ORÇAMENTO'), findsOneWidget);
  expect(find.text('Criar Grupo'), findsOneWidget);
  expect(find.byType(TextFormField), findsNWidgets(3));
});


    testWidgets('Valida formulário ao tentar ser submetido vazio', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: CreateGroupPage(),
        ),
      );

      await tester.tap(find.text('Criar Grupo'));
      await tester.pumpAndSettle();

      expect(find.text('Por favor, insira o nome do grupo.'), findsOneWidget);
      expect(find.text('Por favor, insira o orçamento.'), findsOneWidget);
    });

    testWidgets('Aceita dados válidos no formulário', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: CreateGroupPage(),
        ),
      );

      await tester.enterText(find.byType(TextFormField).at(0), 'Grupo Teste');
      await tester.enterText(find.byType(TextFormField).at(1), 'Descrição do Grupo');
      await tester.enterText(find.byType(TextFormField).at(2), '100.50');

      await tester.tap(find.text('Criar Grupo'));
      await tester.pumpAndSettle();

      expect(find.text('Por favor, insira o nome do grupo.'), findsNothing);
      expect(find.text('Por favor, insira o orçamento.'), findsNothing);

      expect(find.text('Grupo criado com sucesso!'), findsNothing);
    });
  });
}
