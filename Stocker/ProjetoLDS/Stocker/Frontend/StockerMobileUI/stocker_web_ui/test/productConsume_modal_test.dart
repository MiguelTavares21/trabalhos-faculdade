import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:stocker_web_ui/enums/types_enum.dart';
import 'package:stocker_web_ui/enums/unity_enum.dart';
import 'package:stocker_web_ui/models/product.dart';
import 'package:stocker_web_ui/widgets/productConsume_modal.dart';

void main() {
  final testProduct = Product(
    Id: 1,
    Name: 'Produto Teste',
    Quantity: 10,
    Unities: Unity.Gramas,
    OrderPoint: 5,
    IdealPoint: 15,
    Type: Types.Animais,
    InList: false,
    GroupId: 1,
  );

  testWidgets('Renderiza os elementos corretamente', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ProductModalConsume(
            product: testProduct,
            onSave: (product) {},
            onClose: () {},
          ),
        ),
      ),
    );

    expect(find.text('Alterar Quantidade'), findsOneWidget);
    expect(find.text('Quantidade:'), findsOneWidget);
    expect(find.text('Guardar'), findsOneWidget);
    expect(find.text('Cancelar'), findsOneWidget);

    final quantityField = find.byType(TextFormField);
    expect(quantityField, findsOneWidget);
  });

  testWidgets('Atualiza o valor da quantidade no TextField', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ProductModalConsume(
            product: testProduct,
            onSave: (product) {},
            onClose: () {},
          ),
        ),
      ),
    );

    final quantityField = find.byType(TextFormField);
    await tester.enterText(quantityField, '20');
    await tester.pump();

    expect(find.text('20'), findsOneWidget);
  });

  testWidgets('Exibe alerta ao submeter quantidade inválida', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ProductModalConsume(
            product: testProduct,
            onSave: (product) {},
            onClose: () {},
          ),
        ),
      ),
    );
    final quantityField = find.byType(TextFormField);
    await tester.enterText(quantityField, '-5');
    await tester.pump();

    final saveButton = find.text('Guardar');
    await tester.tap(saveButton);
    await tester.pumpAndSettle();

    expect(find.text('Quantidade inválida'), findsOneWidget);
  });

  testWidgets('Fecha o modal ao clicar em Cancelar', (WidgetTester tester) async {
    bool modalClosed = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ProductModalConsume(
            product: testProduct,
            onSave: (product) {},
            onClose: () {
              modalClosed = true;
            },
          ),
        ),
      ),
    );

    final cancelButton = find.text('Cancelar');
    await tester.tap(cancelButton);
    await tester.pumpAndSettle();

    expect(modalClosed, true);
  });
}
