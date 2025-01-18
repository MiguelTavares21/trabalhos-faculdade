import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:stocker_web_ui/models/group.dart';
import 'package:stocker_web_ui/pages/addGroup_page.dart';
import 'package:stocker_web_ui/pages/groupDetails_page.dart';
import 'package:stocker_web_ui/services/group_provider.dart';
import 'package:stocker_web_ui/services/group_service.dart';
import 'package:stocker_web_ui/utils/drawer.dart';

/// Página de Grupos.
/// Exibe todos os grupos associados ao utilizador e permite navegar para detalhes ou adicionar novos grupos.
class GroupsPage extends StatefulWidget {
  const GroupsPage({super.key});

  @override
  State<GroupsPage> createState() => _GroupsPageState();
}

class _GroupsPageState extends State<GroupsPage> {
  late GroupService groupService; // Serviço de grupos
  List<Group> groups = []; // Lista de grupos
  bool isLoading = true; // Flag de carregamento

  @override
  void initState() {
    super.initState();
    groupService = GroupService();
    _getUserGroups();
  }

  /// Obtém os grupos do utilizador.
  Future<void> _getUserGroups() async {
    setState(() {
      isLoading = true;
    });
    try {
      final userGroups = await groupService.getUserGroups(context);
      setState(() {
        groups = userGroups;
      });
    } catch (e) {
      print("Erro ao carregar grupos: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erro ao carregar grupos.')),
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  /// Constrói a lista de grupos com navegação para a página de detalhes.
  @override
  Widget build(BuildContext context) {
    final groupProvider = Provider.of<GroupProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF212F3D),
      appBar: AppBar(
        backgroundColor: const Color(0xFF212F3D),
        foregroundColor: Colors.white,
        centerTitle: true,
        title: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              "OS MEUS GRUPOS",
              style: TextStyle(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(width: 8),
            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const AddGroupPage(),
                  ),
                ).then((_) => _getUserGroups());
              },
              child: Image.asset(
                'assets/add.png',
                width: 35,
                height: 35,
              ),
            ),
          ],
        ),
        automaticallyImplyLeading: groupProvider.selectedGroupId != null,
      ),
      drawer:
          groupProvider.selectedGroupId != null ? buildDrawer(context) : null,
      body: isLoading
          ? const Center(
              child: CircularProgressIndicator(
                color: Colors.white,
              ),
            )
          : groups.isEmpty
              ? const Center(
                  child: Text(
                    'Você não pertence a nenhum grupo.',
                    style: TextStyle(color: Colors.white, fontSize: 20),
                  ),
                )
              : ListView.builder(
                  itemCount: groups.length,
                  itemBuilder: (BuildContext context, int index) {
                    final group = groups[index];
                    return GestureDetector(
                      onTap: () {
                        Provider.of<GroupProvider>(context, listen: false)
                            .selectedGroupId = group.id;

                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => GroupDetailsPage(),
                          ),
                        );
                      },
                      child: Card(
                        color: Colors.white,
                        margin: const EdgeInsets.all(8.0),
                        child: Padding(
                          padding: const EdgeInsets.all(12.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Text(
                                group.name,
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontStyle: FontStyle.italic,
                                  fontSize: 28,
                                  decoration: TextDecoration.underline,
                                  color: Color(0xFF212F3D),
                                  shadows: [
                                    Shadow(
                                      offset: Offset(2, 2),
                                      blurRadius: 2.0,
                                      color: Colors.grey,
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                group.description,
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                  fontSize: 16,
                                  color: Colors.black87,
                                ),
                              ),
                              const SizedBox(height: 10),
                              Image.asset(
                                'assets/grupo2.png',
                                width: 80,
                                height: 80,
                              ),
                              const SizedBox(height: 15),
                              const Text(
                                "CÓDIGO PARA ENTRAR NO GRUPO",
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.black87,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    vertical: 5.0, horizontal: 45.0),
                                decoration: BoxDecoration(
                                  color:
                                      const Color.fromARGB(255, 190, 246, 194),
                                  borderRadius: BorderRadius.circular(8.0),
                                  border: Border.all(
                                    color: Colors.black,
                                    width: 1.0,
                                  ),
                                ),
                                child: Text(
                                  group.accessCode,
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    color: Colors.black,
                                    fontWeight: FontWeight.normal,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
