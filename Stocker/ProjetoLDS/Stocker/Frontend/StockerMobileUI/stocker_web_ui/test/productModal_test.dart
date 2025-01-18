import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import '../lib/widgets/product_modal.dart';
import '../lib/models/product.dart';
import '../lib/enums/types_enum.dart';
import '../lib/enums/unity_enum.dart';

void main() {
  group('ProductModal Tests', () {
    testWidgets('Verifica se a página é renderizada corretamente', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ProductModal(
              product: Product(
                Id: 1,
                Name: 'Produto Teste',
                Quantity: 10,
                Unities: Unity.Litros,
                OrderPoint: 5,
                IdealPoint: 15,
                Type: Types.Bebidas,
                InList: true,
                GroupId: 1,
              ),
              dontShowQuantity: false,
              onSave: (_) {},
              onClose: () {},
              onDelete: () {},
            ),
          ),
        ),
      );

      expect(find.text('EDITAR PRODUTO'), findsOneWidget);

      expect(find.text('Nome'), findsOneWidget);
      expect(find.text('Quantidade'), findsOneWidget);
      expect(find.text('Ponto de Encomenda'), findsOneWidget);
      expect(find.text('Valor Ideal'), findsOneWidget);
      expect(find.text('Unidade'), findsOneWidget);

      expect(find.text('GUARDAR'), findsOneWidget);
      expect(find.text('CANCELAR'), findsOneWidget);
      expect(find.text('ELIMINAR PRODUTO'), findsOneWidget);
    });


    testWidgets('Validações dos campos obrigatórios', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ProductModal(
              product: null,
              dontShowQuantity: false,
              onSave: (_) {},
              onClose: () {},
              onDelete: () {},
            ),
          ),
        ),
      );

      await tester.tap(find.text('GUARDAR'));
      await tester.pumpAndSettle();

      expect(find.text('O nome é obrigatório.'), findsOneWidget);
      expect(find.text('Quantidade deve ser maior ou igual a 0.'), findsOneWidget);
      expect(find.text('Ponto de encomenda deve ser maior que 0.'), findsOneWidget);
      expect(find.text('Valor ideal deve ser maior que 0.'), findsOneWidget);
    });
  });
}
