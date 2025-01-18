import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:stocker_web_ui/pages/register_page.dart';
import 'package:stocker_web_ui/pages/main_page.dart';

void main() {
  group('MainPage Renderização e Navegação', () {
    Widget buildTestWidget() {
      return MaterialApp(
        home: MainPage(),
      );
    }

    testWidgets('Renderiza corretamente a MainPage', (WidgetTester tester) async {
      await tester.pumpWidget(buildTestWidget());

      expect(find.text('STOCKER'), findsOneWidget);
      expect(find.text('Gira o seu stock de casa de forma inteligente'), findsOneWidget);

      expect(find.text('EMAIL'), findsOneWidget);
      expect(find.text('PALAVRA-PASSE'), findsOneWidget);

      expect(find.text('ENTRAR'), findsOneWidget);
      expect(find.text('CRIAR CONTA'), findsOneWidget);
    });

    testWidgets('Clica no botão ENTRAR', (WidgetTester tester) async {
      await tester.pumpWidget(buildTestWidget());

      await tester.enterText(find.byType(TextFormField).at(0), 'user@email.com');
      await tester.enterText(find.byType(TextFormField).at(1), 'password123');

      await tester.tap(find.text('ENTRAR'));
      await tester.pumpAndSettle();

  
      expect(find.text('ENTRAR'), findsOneWidget);
    });

    testWidgets('Navega para a página de registro ao clicar no botão CRIAR CONTA', (WidgetTester tester) async {
      await tester.pumpWidget(buildTestWidget());

      await tester.tap(find.text('CRIAR CONTA'));
      await tester.pumpAndSettle();

      expect(find.byType(RegisterPage), findsOneWidget);
    });
  });
}
