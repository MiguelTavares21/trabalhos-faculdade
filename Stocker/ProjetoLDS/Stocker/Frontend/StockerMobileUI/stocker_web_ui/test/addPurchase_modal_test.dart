import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:stocker_web_ui/enums/types_enum.dart';
import 'package:stocker_web_ui/enums/unity_enum.dart';
import 'package:stocker_web_ui/models/PurchaseProductsCreatedto.dart';
import 'package:stocker_web_ui/models/product.dart';
import 'package:stocker_web_ui/widgets/addPurchase_modal.dart';

void main() {
  group('AddPurchaseModal Tests', () {
    late Product testProduct;
    late PurchaseproductsCreatedto? savedProduct;

    setUp(() {
            testProduct = Product(
        Id: 1,
        Name: "Produto Teste",
        Unities: Unity.Gramas,
        Type: Types.Carne_Peixe, Quantity: 10, OrderPoint: 5, IdealPoint: 10, InList: true, GroupId: 7,
      );
      savedProduct = null;
    });


    Widget buildModal() {
      return MaterialApp(
        home: Scaffold(
          body: AddPurchaseModal(
            product: testProduct,
            onSave: (dto) {
              savedProduct = dto;
            },
            onClose: () {
            },
          ),
        ),
      );
    }

    testWidgets('Carrega todos os elementos corretamente',
        (WidgetTester tester) async {
      await tester.pumpWidget(buildModal());

      expect(find.text('CRIAR PRODUTO'), findsOneWidget);
      expect(find.text('Quantidade'), findsOneWidget);
      expect(find.text('Preço'), findsOneWidget);
      expect(find.text('GUARDAR'), findsOneWidget);
      expect(find.text('CANCELAR'), findsOneWidget);
    });


    testWidgets('Valida o campo de "Quantidade" corretamente',
        (WidgetTester tester) async {
      await tester.pumpWidget(buildModal());
      await tester.enterText(find.byType(TextFormField).first, '-1');
      await tester.tap(find.text('GUARDAR'));
      await tester.pump();

      expect(find.text('Quantidade deve ser maior a 0.'), findsOneWidget);

      await tester.enterText(find.byType(TextFormField).first, '5');
      await tester.tap(find.text('GUARDAR'));
      await tester.pump();

      expect(find.text('Quantidade deve ser maior a 0.'), findsNothing);
    });

    testWidgets('Valida o campo de "Preço" corretamente',
        (WidgetTester tester) async {
      await tester.pumpWidget(buildModal());

      await tester.enterText(find.byType(TextFormField).last, '-10');
      await tester.tap(find.text('GUARDAR'));
      await tester.pump();

      expect(find.text('Preço deve ser maior ou igual a 0.'), findsOneWidget);

      await tester.enterText(find.byType(TextFormField).last, '100');
      await tester.tap(find.text('GUARDAR'));
      await tester.pump();

      expect(find.text('Preço deve ser maior ou igual a 0.'), findsNothing);
    });

    testWidgets('Guarda o produto corretamente ao pressionar "GUARDAR"',
        (WidgetTester tester) async {
      await tester.pumpWidget(buildModal());

      await tester.enterText(find.byType(TextFormField).first, '5'); 
      await tester.enterText(find.byType(TextFormField).last, '10');
      await tester.tap(find.text('GUARDAR'));
      await tester.pumpAndSettle();

      expect(savedProduct, isNotNull);
      expect(savedProduct!.Quantity, equals(5));
      expect(savedProduct!.Price, equals(10));
      expect(savedProduct!.Product_Id, equals(testProduct.Id));
      expect(savedProduct!.Name, equals(testProduct.Name));
    });
  });
}
