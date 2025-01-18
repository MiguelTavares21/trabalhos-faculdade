import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart'; 
import 'package:stocker_web_ui/pages/changePassword_page.dart';
import 'package:stocker_web_ui/services/token_provider.dart'; 

void main() {
  group('ChangePasswordPage Tests', () {
    testWidgets('Testa a exibição da página de alteração de password', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: ChangePasswordPage(),
        ),
      );

      expect(find.text('ALTERAR PASSWORD'), findsOneWidget);
      expect(find.text('Password Atual'), findsOneWidget);
      expect(find.text('Nova Password'), findsOneWidget);
      expect(find.text('Confirmar Nova Password'), findsOneWidget);
    });

    testWidgets('Testa as validações de campo', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: ChangePasswordPage(),
        ),
      );

      await tester.tap(find.text('Alterar Password'));
      await tester.pump();

      expect(find.text('A Password atual é obrigatória.'), findsOneWidget);
      expect(find.text('A nova password é obrigatória.'), findsOneWidget);
      expect(find.text('A confirmação de password é obrigatória.'), findsOneWidget);
    });

    testWidgets('Testa a validação de passes não coincidentes', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: ChangePasswordPage(),
        ),
      );

      await tester.enterText(find.byType(TextFormField).at(0), 'senhaAtual');
      await tester.enterText(find.byType(TextFormField).at(1), 'novaSenha');
      await tester.enterText(find.byType(TextFormField).at(2), 'senhaDiferente');

      await tester.tap(find.text('Alterar Password'));
      await tester.pump();

      expect(find.text('As passwords não coincidem.'), findsOneWidget);
    });
  });
}
