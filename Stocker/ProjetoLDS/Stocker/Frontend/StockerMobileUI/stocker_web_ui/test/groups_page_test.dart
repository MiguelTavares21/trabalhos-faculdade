import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:stocker_web_ui/pages/groups_page.dart';
import 'package:stocker_web_ui/services/group_provider.dart';

void main() {
testWidgets('A página renderiza corretamente', (WidgetTester tester) async {
  await tester.pumpWidget(
    ChangeNotifierProvider(
      create: (_) => GroupProvider(),
      child: MaterialApp(
        home: GroupsPage(),
      ),
    ),
  );

  await tester.pumpAndSettle();

  expect(find.text('OS MEUS GRUPOS'), findsOneWidget);

  expect(find.byType(GestureDetector), findsWidgets);
  expect(find.byWidgetPredicate((widget) {
    if (widget is GestureDetector) {
      final child = widget.child;
      if (child is Image && child.image is AssetImage) {
        return (child.image as AssetImage).assetName == 'assets/add.png';
      }
    }
    return false;
  }), findsOneWidget);
});

  testWidgets('Exibe mensagem quando não houver grupos', (WidgetTester tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => GroupProvider(),
        child: MaterialApp(
          home: GroupsPage(),
        ),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.text('Você não pertence a nenhum grupo.'), findsOneWidget);
  });
}
