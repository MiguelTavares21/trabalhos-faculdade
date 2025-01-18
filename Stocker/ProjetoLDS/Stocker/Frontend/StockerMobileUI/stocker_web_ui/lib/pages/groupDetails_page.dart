import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:stocker_web_ui/models/UserDto.dart';
import 'package:stocker_web_ui/models/UserInGroupDto.dart';
import 'package:stocker_web_ui/models/group.dart';
import 'package:stocker_web_ui/pages/editGroup_page.dart';
import 'package:stocker_web_ui/pages/groups_page.dart';
import 'package:stocker_web_ui/services/group_provider.dart';
import 'package:stocker_web_ui/services/group_service.dart';
import 'package:stocker_web_ui/services/user_service.dart';
import 'package:stocker_web_ui/utils/drawer.dart';

/// Página de Detalhes do Grupo.
/// Mostra informações sobre o grupo, membros e o papel do utilizador no grupo.
class GroupDetailsPage extends StatefulWidget {
  const GroupDetailsPage({super.key});

  @override
  State<GroupDetailsPage> createState() => _GroupDetailsPageState();
}

class _GroupDetailsPageState extends State<GroupDetailsPage> {
  // Futuros para carregar os detalhes do grupo, membros e o papel do utilizador.
  late Future<Group> groupDetails;
  late Future<List<UserInGroup>> groupUsers;
  late Future<String> userRole;

  @override
  void initState() {
    super.initState();
    groupDetails = GroupService().getGroupDetails(context);
    groupUsers = GroupService().getGroupUsers(context);
    userRole = GroupService().getUserRole(context);
  }

  /// Função auxiliar para exibir uma lista de membros do grupo.
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF212F3D),
      appBar: AppBar(
        foregroundColor: Colors.white,
        title: const Text('DETALHES DO GRUPO',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24.0,
              fontWeight: FontWeight.bold,
            )),
        centerTitle: true,
        backgroundColor: const Color(0xFF212F3D),
      ),
      drawer: buildDrawer(context),
      body: SingleChildScrollView(
        child: Column(
          children: [
            FutureBuilder<Group>(
              future: groupDetails,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(),
                        Text("A carregar informações do grupo..."),
                      ],
                    ),
                  );
                } else if (snapshot.hasData) {
                  final group = snapshot.data!;
                  return Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Text(
                          group.name.toUpperCase(),
                          style: const TextStyle(
                            fontSize: 35,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          group.description,
                          style: const TextStyle(
                            fontSize: 25,
                            color: Colors.white,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 15),
                        Card(
                          color: const Color(0xFF34495e),
                          margin: const EdgeInsets.symmetric(vertical: 10),
                          child: ListTile(
                            title: const Text(
                              'Código de Acesso',
                              style: TextStyle(color: Colors.white),
                              textAlign: TextAlign.center,
                            ),
                            subtitle: Text(
                              group.accessCode,
                              style: const TextStyle(
                                fontSize: 18,
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ),
                        Card(
                          color: const Color(0xFF34495e),
                          margin: const EdgeInsets.symmetric(vertical: 10),
                          child: ListTile(
                            title: const Text(
                              'Orçamento do Grupo',
                              style: TextStyle(color: Colors.white),
                              textAlign: TextAlign.center,
                            ),
                            subtitle: Text(
                              '${group.budget.toStringAsFixed(2)} €',
                              style: const TextStyle(
                                fontSize: 18,
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ),
                        FutureBuilder<String>(
                          future: userRole,
                          builder: (context, roleSnapshot) {
                            if (roleSnapshot.hasError) {
                              return const Text(
                                'Erro ao carregar a role',
                                style:
                                    TextStyle(fontSize: 16, color: Colors.red),
                                textAlign: TextAlign.center,
                              );
                            } else if (roleSnapshot.hasData) {
                              return Card(
                                color: const Color(0xFF34495e),
                                margin:
                                    const EdgeInsets.symmetric(vertical: 10),
                                child: ListTile(
                                  title: const Text(
                                    'Seu Papel',
                                    style: TextStyle(color: Colors.white),
                                    textAlign: TextAlign.center,
                                  ),
                                  subtitle: Text(
                                    roleSnapshot.data!,
                                    style: const TextStyle(
                                      fontSize: 18,
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ),
                              );
                            } else {
                              return const Text(
                                'Ocorreu um erro',
                                style: TextStyle(
                                    fontSize: 16, color: Colors.white),
                                textAlign: TextAlign.center,
                              );
                            }
                          },
                        ),
                        const Divider(color: Colors.white),
                        FutureBuilder<List<UserInGroup>>(
                          future: groupUsers,
                          builder: (context, userSnapshot) {
                            if (userSnapshot.hasError) {
                              return const Text(
                                "Erro ao carregar os membros do grupo.",
                                style: TextStyle(color: Colors.white),
                                textAlign: TextAlign.center,
                              );
                            } else if (userSnapshot.hasData) {
                              final userCount = userSnapshot.data!.length;
                              return Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    'Total de membros: ',
                                    style: TextStyle(
                                        fontSize: 16, color: Colors.white),
                                  ),
                                  Text(
                                    '$userCount',
                                    style: const TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                ],
                              );
                            } else {
                              return const Text(
                                "Nenhum membro encontrado.",
                                style: TextStyle(color: Colors.white),
                                textAlign: TextAlign.center,
                              );
                            }
                          },
                        ),
                      ],
                    ),
                  );
                } else {
                  return const Center(child: Text('Nenhum dado encontrado.'));
                }
              },
            ),
            FutureBuilder<List<UserInGroup>>(
              future: groupUsers,
              builder: (context, userSnapshot) {
                if (userSnapshot.hasError) {
                  return const Center(
                    child: Text(
                      "Erro ao carregar os membros do grupo.",
                      style: TextStyle(color: Colors.white),
                      textAlign: TextAlign.center,
                    ),
                  );
                } else if (userSnapshot.hasData) {
                  final users = userSnapshot.data!;

                  return FutureBuilder<Userdto>(
                    future: UserService().getUser(context),
                    builder: (context, userCurrentSnapshot) {
                      if (userCurrentSnapshot.hasError) {
                        return const Center(
                          child: Text(
                            'Erro ao carregar os dados do usuário atual.',
                            style: TextStyle(color: Colors.red),
                          ),
                        );
                      } else if (userCurrentSnapshot.hasData) {
                        final currentUser = userCurrentSnapshot.data!;

                        return ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: users.length,
                          itemBuilder: (context, index) {
                            final user = users[index];

                            bool isCurrentUser = currentUser.Id == user.id;

                            return FutureBuilder<String>(
                              future: userRole,
                              builder: (context, roleSnapshot) {
                                if (roleSnapshot.hasError) {
                                  return const Center(
                                    child: Text(
                                      'Erro ao carregar a role.',
                                      style: TextStyle(color: Colors.red),
                                    ),
                                  );
                                } else if (roleSnapshot.hasData &&
                                    roleSnapshot.data == 'Admin') {
                                  return Card(
                                    color: const Color(0xFF34495e),
                                    child: ListTile(
                                      title: Text(user.name,
                                          style: const TextStyle(
                                              color: Colors.white)),
                                      subtitle: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(user.email,
                                              style: const TextStyle(
                                                  color: Colors.white)),
                                          Text(
                                            'Role: ${user.role.toString().split('.').last}',
                                            style: const TextStyle(
                                                color: Colors.grey),
                                          ),
                                        ],
                                      ),
                                      trailing: isCurrentUser
                                          ? null
                                          : Row(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                ElevatedButton(
                                                  style:
                                                      ElevatedButton.styleFrom(
                                                    backgroundColor:
                                                        const Color(0xFF34495e),
                                                    foregroundColor:
                                                        Colors.white,
                                                    padding: const EdgeInsets
                                                        .symmetric(
                                                        horizontal: 10,
                                                        vertical: 5),
                                                  ),
                                                  onPressed: () async {
                                                    final userId = user.id;
                                                    await GroupService()
                                                        .changeUserRole(
                                                            userId, context);
                                                    ScaffoldMessenger.of(
                                                            context)
                                                        .showSnackBar(
                                                      const SnackBar(
                                                          content: Text(
                                                              "Role alterada com sucesso!")),
                                                    );
                                                    Navigator.pushReplacement(
                                                      context,
                                                      MaterialPageRoute(
                                                          builder: (context) =>
                                                              const GroupDetailsPage()),
                                                    );
                                                  },
                                                  child:
                                                      const Text("Mudar Role"),
                                                ),
                                                const SizedBox(width: 10),
                                                ElevatedButton(
                                                  style:
                                                      ElevatedButton.styleFrom(
                                                    backgroundColor: Colors.red,
                                                    foregroundColor:
                                                        Colors.white,
                                                    padding: const EdgeInsets
                                                        .symmetric(
                                                        horizontal: 10,
                                                        vertical: 5),
                                                  ),
                                                  onPressed: () async {
                                                    final userId = user.id;
                                                    await GroupService()
                                                        .removeUserFromGroup(
                                                            userId, context);
                                                    ScaffoldMessenger.of(
                                                            context)
                                                        .showSnackBar(
                                                      const SnackBar(
                                                          content: Text(
                                                              "Membro removido com sucesso!")),
                                                    );
                                                    Navigator.pushReplacement(
                                                      context,
                                                      MaterialPageRoute(
                                                          builder: (context) =>
                                                              const GroupDetailsPage()),
                                                    );
                                                  },
                                                  child: const Text("Remover"),
                                                ),
                                              ],
                                            ),
                                    ),
                                  );
                                } else {
                                  return Card(
                                    color: const Color(0xFF34495e),
                                    child: ListTile(
                                      title: Text(user.name,
                                          style: const TextStyle(
                                              color: Colors.white)),
                                      subtitle: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(user.email,
                                              style: const TextStyle(
                                                  color: Colors.white)),
                                          Text(
                                            'Role: ${user.role.toString().split('.').last}',
                                            style: const TextStyle(
                                                color: Colors.grey),
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                }
                              },
                            );
                          },
                        );
                      } else {
                        return const Center(
                            child: Text(
                                "Erro ao carregar os dados do utilizador atual."));
                      }
                    },
                  );
                } else {
                  return const Center(
                    child: Text(
                      "Nenhum membro encontrado.",
                      style: TextStyle(color: Colors.white),
                      textAlign: TextAlign.center,
                    ),
                  );
                }
              },
            ),
            Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 10),
                        textStyle: const TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      onPressed: () async {
                        try {
                          await GroupService().leaveGroup(context);
                          Provider.of<GroupProvider>(context, listen: false)
                              .clearSelectedGroupId();
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text("Você saiu do grupo com sucesso."),
                              backgroundColor: Colors.green,
                            ),
                          );
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const GroupsPage()),
                          );
                        } catch (e) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text("Erro ao sair do grupo: $e"),
                              backgroundColor: Colors.red,
                            ),
                          );
                        }
                      },
                      child: const Text("Sair do Grupo"),
                    ),
                    const SizedBox(width: 10),
                    FutureBuilder<String>(
                      future: userRole,
                      builder: (context, snapshot) {
                        if (snapshot.hasError) {
                          return const Text(
                            'Erro ao carregar a role.',
                            style: TextStyle(color: Colors.red),
                          );
                        } else if (snapshot.hasData &&
                            snapshot.data == 'Admin') {
                          return Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.red,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 10, vertical: 10),
                                  textStyle: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold),
                                ),
                                onPressed: () {
                                  _showDeleteConfirmationDialog(context);
                                },
                                child: const Text("Apagar Grupo"),
                              ),
                              const SizedBox(width: 10),
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF34495e),
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 10, vertical: 10),
                                  textStyle: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold),
                                ),
                                onPressed: () async {
                                  final group = await GroupService()
                                      .getGroupDetails(context);
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) =>
                                          EditGroupPage(group: group),
                                    ),
                                  );
                                },
                                child: const Text("Editar Grupo"),
                              ),
                            ],
                          );
                        } else {
                          return const SizedBox();
                        }
                      },
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

Future<void> _showDeleteConfirmationDialog(BuildContext context) async {
  final result = await showDialog<bool>(
    context: context,
    builder: (context) {
      return AlertDialog(
        backgroundColor: const Color(0xFF212F3D),
        title: const Text(
          "Confirmar Remoção",
          style: TextStyle(color: Colors.white),
        ),
        content: const Text(
          "Tem certeza de que deseja remover este grupo? Esta ação não pode ser desfeita.",
          style: TextStyle(color: Colors.white),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text(
              "Cancelar",
              style: TextStyle(color: Colors.white),
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text(
              "Remover",
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      );
    },
  );

  if (result == true) {
    try {
      await GroupService().deleteGroup(context);
      Provider.of<GroupProvider>(context, listen: false).clearSelectedGroupId();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Você apagou o grupo com sucesso."),
          backgroundColor: Colors.green,
        ),
      );
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const GroupsPage()),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Erro ao remover o grupo: $e"),
          backgroundColor: Colors.red,
        ),
      );
    }
  }
}
