import 'package:flutter/material.dart';
import 'package:stocker_web_ui/models/RecipeDto.dart';
import 'package:stocker_web_ui/services/recipe_service.dart';
import 'package:stocker_web_ui/utils/drawer.dart';
import 'package:stocker_web_ui/widgets/createRecipe_modal.dart';
import 'package:stocker_web_ui/widgets/inRecipe_modal.dart';

// Página que exibe e gere as receitas
class RecipesPage extends StatefulWidget {
  const RecipesPage({Key? key}) : super(key: key);

  @override
  _RecipesPageState createState() => _RecipesPageState();
}

class _RecipesPageState extends State<RecipesPage> {
  late List<RecipeDto> recipesInGroup = []; // Lista de receitas no grupo

  bool isLoading = true; // Flag para indicar se a página está carregando
  late RecipeService recipeService; // Serviço para gerir as receitas
  List<RecipeDto> filteredRecipes = []; // Lista de receitas filtradas
  String searchQuery = ''; // Query de pesquisa

  bool isPopupOpen = false; // Flag para indicar se o modal está aberto
  bool isPopupCreateOpen =
      false; // Flag para indicar se o modal de criação está aberto
  RecipeDto? selectedRecipe; // Receita selecionada

  // Controller para o campo de nome da receita
  final TextEditingController _nameController = TextEditingController();

  @override
  void initState() {
    super.initState();
    recipeService = RecipeService();
    getRecipesInGroup();
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  // Função para ir buscar receitas do grupo
  Future<void> getRecipesInGroup() async {
    setState(() {
      isLoading = true;
    });
    try {
      final fetchedRecipes = await recipeService.getGroupRecipes(context);
      recipesInGroup = fetchedRecipes;
      filteredRecipes = recipesInGroup;
    } catch (e) {
      print("Erro ao procurar as receitas no grupo: $e");
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  // Função para filtrar receitas pelo nome
  void filterRecipes(String query) {
    setState(() {
      searchQuery = query;
      filteredRecipes = recipesInGroup
          .where((recipe) =>
              recipe.Name.toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
  }

  // Abrir modal de detalhes da receita
  void openPopup(RecipeDto recipe, bool isNewRecipe) {
    setState(() {
      selectedRecipe = recipe;
      isPopupOpen = true;
    });

    showDialog(
      context: context,
      builder: (_) {
        return RecipeModal(
          recipe: recipe,
          recipeName: recipe.Name,
          isNewRecipe: isNewRecipe,
          onClose: () {
            closePopup();
            Navigator.of(context).pop();
          },
        );
      },
    );
  }

  // Fechar o modal e atualizar as receitas
  void closePopup() async {
    setState(() {
      isPopupOpen = false;
    });
    try {
      await getRecipesInGroup();
    } catch (e) {
      print("Erro ao carregar receitas: $e");
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  // Eliminar uma receita
  void deleteRecipe(int recipeId) async {
    setState(() {
      isLoading = true;
    });
    try {
      await recipeService.deleteRecipe(recipeId, context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Receita apagada.')),
      );
      await getRecipesInGroup();
      if (filteredRecipes.isEmpty) {
        setState(() {
          recipesInGroup = [];
          filteredRecipes = recipesInGroup;
        });
      }
    } catch (e) {
      print("Erro ao remover produto da receita: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erro ao remover receita.')),
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  // Consumir uma receita
  void consumeRecipe(int recipeId) async {
    setState(() {
      isLoading = true;
    });
    await recipeService.consumeRecipe(recipeId, context);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Receita consumida.')),
    );

    setState(() {
      isLoading = false;
    });
  }

  // Abrir modal de criação de receita
  void openCreatePopup() {
    setState(() {
      isPopupCreateOpen = true;
    });
    _showCreateRecipeModal(context);
  }

  // Fechar modal de criação
  void closeCreatePopup() {
    setState(() {
      isPopupCreateOpen = false;
    });
  }

  // Criar uma nova receita
  void _createRecipe() async {
    final name = _nameController.text.trim();
    if (name.isNotEmpty) {
      setState(() {
        isLoading = true;
      });

      try {
        RecipeDto createdRecipe =
            await recipeService.createRecipe(context, name);

        setState(() {
          getRecipesInGroup();
          isLoading = false;
        });

        _nameController.clear();
        Navigator.of(context).pop();

        openPopup(createdRecipe, true);
      } catch (e) {
        print('Erro ao criar a receita: $e');
        setState(() {
          isLoading = false;
        });
      }
    } else {
      print('O campo Nome da receita está vazio.');
    }
  }

  // Exibir o modal de criação de receita
  void _showCreateRecipeModal(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) {
        return CreateRecipeModal(
          onClose: () {
            closeCreatePopup();
            Navigator.of(context).pop();
          },
          onSubmit: _createRecipe,
          nameController: _nameController,
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF212F3D),
      appBar: AppBar(
        title: Text(
          "MINHAS RECEITAS",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(Icons.add),
            color: Colors.white,
            onPressed: openCreatePopup,
            tooltip: 'Criar receita',
          ),
        ],
        backgroundColor: Color(0xFF212F3D),
        foregroundColor: Colors.white,
      ),
      drawer: buildDrawer(context),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              onChanged: filterRecipes,
              decoration: InputDecoration(
                hintText: 'Pesquisar receita...',
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
                prefixIcon: Icon(Icons.search),
              ),
            ),
          ),
          Expanded(
            child: filteredRecipes.isEmpty
                ? Center(
                    child: Text(
                      'Nenhuma receita encontrada',
                      style: TextStyle(color: Colors.white),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    itemCount: filteredRecipes.length,
                    itemBuilder: (context, index) {
                      final recipe = filteredRecipes[index];
                      return GestureDetector(
                        onTap: () => openPopup(recipe, false),
                        child: Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  recipe.Name,
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.end,
                                  children: [
                                    IconButton(
                                      icon: Icon(Icons.local_dining),
                                      onPressed: () => consumeRecipe(recipe.Id),
                                      tooltip: 'Consumir receita',
                                    ),
                                    IconButton(
                                      icon: Icon(Icons.delete),
                                      onPressed: () => deleteRecipe(recipe.Id),
                                      tooltip: 'Apagar receita',
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
