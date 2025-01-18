import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:stocker_web_ui/pages/addGroup_page.dart';
import 'package:stocker_web_ui/pages/createGroup_page.dart';
import 'package:stocker_web_ui/pages/joinGroup_page.dart';

void main() {
  group('AddGroupPage Tests', () {
    testWidgets('Testa se os botões e o título estão presentes', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(home: AddGroupPage()));

      expect(find.text('ADICIONAR GRUPO'), findsOneWidget);

      expect(find.text('Criar um grupo'), findsOneWidget);
      expect(find.text('Juntar-se a um Grupo'), findsOneWidget);
    });

    testWidgets('Testa navegação para CreateGroupPage', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(home: AddGroupPage()));

      await tester.tap(find.text('Criar um grupo'));
      await tester.pumpAndSettle();

      expect(find.byType(CreateGroupPage), findsOneWidget);
    });

    testWidgets('Testa navegação para JoinGroupPage', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(home: AddGroupPage()));

      await tester.tap(find.text('Juntar-se a um Grupo'));
      await tester.pumpAndSettle();

      expect(find.byType(JoinGroupPage), findsOneWidget);
    });
  });
}
