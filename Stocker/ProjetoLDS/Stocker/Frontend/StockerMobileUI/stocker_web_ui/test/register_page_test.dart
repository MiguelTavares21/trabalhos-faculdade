import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:stocker_web_ui/pages/main_page.dart';
import 'package:stocker_web_ui/pages/register_page.dart';

void main() {
  group('RegisterPage Widget Tests', () {

testWidgets('Verifica se os elementos principais são bem renderizados', (WidgetTester tester) async {
  await tester.pumpWidget(const MaterialApp(home: RegisterPage()));

  expect(find.text('STOCKER'), findsOneWidget);
  expect(find.text('Gira o seu stock de casa de forma inteligente'), findsOneWidget);

  expect(find.text('Nome'), findsOneWidget);
  expect(find.text('Email'), findsOneWidget);
  expect(find.text('Confirmar Password'), findsWidgets);

  expect(find.text('Cadastrar'), findsOneWidget);
  expect(find.text('FAZER LOGIN'), findsOneWidget);
});


    testWidgets('Testa validações básicas do formulário', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(home: RegisterPage()));

      await tester.tap(find.text('Cadastrar'));
      await tester.pumpAndSettle();

      expect(find.text('Por favor insira seu nome'), findsOneWidget);
      expect(find.text('Por favor insira um email válido'), findsOneWidget);
      expect(find.text('Por favor insira uma password'), findsOneWidget);
      expect(find.text('Por favor confirme sua senha'), findsOneWidget);
    });

    testWidgets('Testa preenchimento e validação do formulário', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(home: RegisterPage()));

      // Preencher os campos
      await tester.enterText(find.byType(TextFormField).at(0), 'miguel');
      await tester.enterText(find.byType(TextFormField).at(1), 'miguel@email.com');
      await tester.enterText(find.byType(TextFormField).at(2), '123456');
      await tester.enterText(find.byType(TextFormField).at(3), '123456');

      await tester.tap(find.text('Cadastrar'));
      await tester.pumpAndSettle();

      expect(find.text('Por favor insira seu nome'), findsNothing);
      expect(find.text('Por favor insira um email válido'), findsNothing);
      expect(find.text('Por favor insira uma password'), findsNothing);
      expect(find.text('Por favor confirme sua senha'), findsNothing);
    });

    testWidgets('Verifica mensagem de erro ao confirmar password errada', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(home: RegisterPage()));

      await tester.enterText(find.byType(TextFormField).at(0), 'miguel'); 
      await tester.enterText(find.byType(TextFormField).at(1), 'miguel@email.com');
      await tester.enterText(find.byType(TextFormField).at(2), '123456');
      await tester.enterText(find.byType(TextFormField).at(3), '654321');

      await tester.tap(find.text('Cadastrar'));
      await tester.pumpAndSettle();

      expect(find.text('As passwords não coincidem'), findsOneWidget);
    });

    testWidgets('Verifica funcionalidade do botão de visibilidade da senha', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(home: RegisterPage()));
      expect(find.byIcon(Icons.visibility_off), findsNWidgets(2));

      await tester.tap(find.byIcon(Icons.visibility_off).first);
      await tester.pump();

      expect(find.byIcon(Icons.visibility), findsWidgets);
    });

    testWidgets('Testa navegação para página de login', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(home: RegisterPage()));

      await tester.tap(find.text('FAZER LOGIN'));
      await tester.pumpAndSettle();

      expect(find.byType(MainPage), findsOneWidget);
    });
  });
}
