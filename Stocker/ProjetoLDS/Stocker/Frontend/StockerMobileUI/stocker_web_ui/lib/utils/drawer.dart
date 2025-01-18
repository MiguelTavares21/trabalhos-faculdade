import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:stocker_web_ui/models/product.dart';
import 'package:stocker_web_ui/pages/editUserPage.dart';
import 'package:stocker_web_ui/pages/groupDetails_page.dart';
import 'package:stocker_web_ui/pages/groups_page.dart';
import 'package:stocker_web_ui/pages/inventory_page.dart';
import 'package:stocker_web_ui/pages/main_page.dart';
import 'package:stocker_web_ui/pages/productsType_page.dart';
import 'package:stocker_web_ui/pages/purchaseHistory_page.dart';
import 'package:stocker_web_ui/pages/registerPurchase_page.dart';
import 'package:stocker_web_ui/pages/shoppingList_page.dart';
import 'package:stocker_web_ui/pages/spendingStatistics_page.dart';
import 'package:stocker_web_ui/pages/statistics_page.dart';
import 'package:stocker_web_ui/pages/recipeList_page.dart';
import 'package:stocker_web_ui/services/user_service.dart';
import 'package:stocker_web_ui/models/UserDto.dart';

// Barra lateral da aplicação
Drawer buildDrawer(BuildContext context) {
  final userService = UserService();

  return Drawer(
    child: Container(
      color: const Color(0xFF1A2631),
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          FutureBuilder<Userdto>(
            future: userService.getUser(context),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const DrawerHeader(
                  decoration: BoxDecoration(
                    color: Color(0xFF1A2631),
                  ),
                  child: Center(
                    child: CircularProgressIndicator(
                      color: Colors.white,
                    ),
                  ),
                );
              } else if (snapshot.hasError) {
                return const DrawerHeader(
                  decoration: BoxDecoration(
                    color: Color(0xFF1A2631),
                  ),
                  child: Text(
                    'Erro ao carregar utilizador',
                    style: TextStyle(color: Colors.white, fontSize: 16),
                  ),
                );
              } else {
                final user = snapshot.data!;
                return DrawerHeader(
                  decoration: const BoxDecoration(
                    color: Color(0xFF1A2631),
                  ),
                  child: GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const EditUserPage()),
                      );
                    },
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user.Name,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          user.Email,
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }
            },
          ),
          _buildListTile(
            context,
            icon: Icons.add_shopping_cart_outlined,
            title: 'REGISTAR COMPRA',
            onTap: () => Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                  builder: (context) => const RegisterPurchasePage()),
            ),
          ),
          _buildListTile(
            context,
            icon: Icons.home_outlined,
            title: 'INÍCIO',
            onTap: () => Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const GroupDetailsPage()),
            ),
          ),
          _buildListTile(
            context,
            icon: Icons.group_outlined,
            title: 'OS MEUS GRUPOS',
            onTap: () => Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const GroupsPage()),
            ),
          ),
          _buildListTile(context,
              icon: Icons.inventory_outlined,
              title: 'INVENTÁRIO',
              onTap: () => {
                Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => InventoryPage()),
                    )
                  }),
          _buildListTile(
            context,
            icon: Icons.list_outlined,
            title: 'A MINHA LISTA',
            onTap: () => Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const ShoppingListPage()),
            ),
          ),
          _buildListTile(context,
              icon: Icons.restaurant_outlined,
              title: 'AS MINHAS RECEITAS',
              onTap: () => {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const RecipesPage()),
                    )
                  }),
          _buildListTile(context,
              icon: Icons.fastfood_outlined,
              title: 'PRODUTOS',
              onTap: () => {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => ProductsTypePage()),
                    )
                  }),
          _buildListTile(
            context,
            icon: Icons.history_outlined,
            title: 'HISTÓRICO DE COMPRAS',
            onTap: () => Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const PurchasePage()),
            ),
          ),
          _buildListTile(context,
              icon: Icons.bar_chart_outlined,
              title: 'ESTATÍSTICAS',
              onTap: () => {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const StatisticsPage()),
                    )
                  }),
          _buildListTile(context,
              icon: Icons.notifications_outlined,
              title: 'NOTIFICAÇÕES',
              onTap: () => {}),
          _buildListTile(
            context,
            icon: Icons.exit_to_app_outlined,
            title: 'SAIR',
            onTap: () => Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const MainPage()),
            ),
          ),
        ],
      ),
    ),
  );
}

Widget _buildListTile(BuildContext context,
    {required IconData icon,
    required String title,
    required VoidCallback onTap}) {
  return ListTile(
    leading: Icon(icon, color: Colors.white),
    title: Text(
      title,
      style: const TextStyle(color: Colors.white),
    ),
    onTap: onTap,
  );
}
