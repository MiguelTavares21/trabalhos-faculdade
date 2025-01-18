import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:stocker_web_ui/widgets/createRecipe_modal.dart';

void main() {
  group('CreateRecipeModal Widget Tests', () {
    late TextEditingController nameController;
    late bool wasClosed;
    late bool wasSubmitted;

    setUp(() {
      nameController = TextEditingController();
      wasClosed = false;
      wasSubmitted = false;
    });

    Widget buildModal() {
      return MaterialApp(
        home: Scaffold(
          body: CreateRecipeModal(
            nameController: nameController,
            onClose: () {
              wasClosed = true;
            },
            onSubmit: () {
              wasSubmitted = true;
            },
          ),
        ),
      );
    }

    testWidgets('Exibe os elementos do modal corretamente',
        (WidgetTester tester) async {
      await tester.pumpWidget(buildModal());

      expect(find.text('Criar receita'), findsOneWidget);
      expect(find.text('Nome da receita'), findsOneWidget);
      expect(find.text('Cancelar'), findsOneWidget);
      expect(find.text('Criar Receita'), findsOneWidget);
    });

    testWidgets('O botão "Cancelar" chama o callback onClose',
        (WidgetTester tester) async {
      await tester.pumpWidget(buildModal());
      await tester.tap(find.text('Cancelar'));
      await tester.pump();
      expect(wasClosed, isTrue);
    });

    testWidgets('O botão "Criar Receita" chama o callback onSubmit',
        (WidgetTester tester) async {
      await tester.pumpWidget(buildModal());

      await tester.tap(find.text('Criar Receita'));
      await tester.pump();

      expect(wasSubmitted, isTrue);
    });

    testWidgets('O campo de texto atualiza o controlador corretamente',
        (WidgetTester tester) async {
      await tester.pumpWidget(buildModal());

      const testText = 'Receita Teste';
      await tester.enterText(find.byType(TextField), testText);

      expect(nameController.text, equals(testText));
    });

    testWidgets('Pressionar "done" no teclado chama o onSubmit',
        (WidgetTester tester) async {
      await tester.pumpWidget(buildModal());

      await tester.enterText(find.byType(TextField), 'Receita Teste');
      await tester.testTextInput.receiveAction(TextInputAction.done);

      expect(wasSubmitted, isTrue);
    });
  });
}
