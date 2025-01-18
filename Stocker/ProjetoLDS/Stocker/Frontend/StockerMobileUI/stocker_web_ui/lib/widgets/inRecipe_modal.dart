import 'package:flutter/material.dart';
import 'package:stocker_web_ui/models/ProductInRecipeDto.dart';
import 'package:stocker_web_ui/models/ProductToRecipeDto.dart';
import 'package:stocker_web_ui/models/RecipeDto.dart';
import 'package:stocker_web_ui/models/product.dart';
import 'package:stocker_web_ui/services/product_service.dart';
import 'package:stocker_web_ui/services/recipe_service.dart';

/// Modal para gerenciar uma receita na aplicacao.
/// Permite adicionar, editar ou remover ingredientes de uma receita.
/// Também é possível editar o nome da receita.
class RecipeModal extends StatefulWidget {
  // Objeto que representa a receita.
  final RecipeDto recipe;

  // Nome da receita exibido no modal.
  final String recipeName;

  // Indica se a receita é nova ou não.
  final bool isNewRecipe;

  // Função chamada ao fechar o modal.
  final VoidCallback onClose;

  const RecipeModal({
    Key? key,
    required this.recipe,
    required this.recipeName,
    required this.isNewRecipe,
    required this.onClose,
  }) : super(key: key);

  @override
  _RecipeModalState createState() => _RecipeModalState();
}

class _RecipeModalState extends State<RecipeModal> {
  // Variáveis de controlo do modal.
  bool isEditingName = false;
  bool isLoading = false;
  bool addIngredient = false;
  bool editIngredient = false;

  // Variáveis de controlo dos ingredientes.
  late num ingredientQuantity;

  // Serviços utilizados.
  late RecipeService recipeService;
  late ProductService productService;

  // Lista de ingredientes da receita.
  List<ProductInRecipeDto> ingredients = [];

  // Controladores de texto.
  late TextEditingController newName;

  // Variáveis de controlo do modal.
  late String recipeName; // Nome da receita.
  late ProductInRecipeDto ingredientToEdit; // Ingrediente a editar.
  late int newQuantity; // Nova quantidade do ingrediente.

  // Lista de produtos disponíveis.
  late List<Product> productsInGroup;

  // Produto selecionado.
  Product? selectedProduct;

  @override
  void initState() {
    super.initState();
    recipeService = RecipeService();
    productService = ProductService();
    recipeName = widget.recipeName;
    newName = TextEditingController(text: recipeName);
    getIngredientsInRecipe(widget.recipe.Id);
    getProductsInGroup();
  }

  @override
  void dispose() {
    newName.dispose();
    super.dispose();
  }

  /// Obtém os ingredientes associados à receita.
  Future<void> getIngredientsInRecipe(int recipeId) async {
    setState(() {
      isLoading = true;
    });
    try {
      final fetchedIngredients =
          await recipeService.getRecipeIngredients(context, recipeId);
      ingredients = fetchedIngredients;
    } catch (e) {
      print("Erro ao remover produto da receita: $e");
      ingredients = [];
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  /// Obtém os produtos disponíveis no grupo.
  Future<void> getProductsInGroup() async {
    setState(() {
      isLoading = true;
    });
    final fetchedProducts = await productService.getProductsByGroup(context);

    setState(() {
      productsInGroup = fetchedProducts;
      isLoading = false;
    });
  }

  /// Adiciona um produto como ingrediente na receita.
  Future<void> addProductToRecipe(ProductToRecipeDto productToAdd) async {
    setState(() {
      isLoading = true;
    });
    try {
      await recipeService.addProductToRecipe(
          context, widget.recipe.Id, productToAdd);

      getIngredientsInRecipe(widget.recipe.Id);
    } catch (e) {
      print("Erro ao adicionar produto à receita: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erro ao adicionar produto à receita.')),
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  /// Remove um ingrediente da receita.
  Future<void> removeIngredient(int ingredientId) async {
    setState(() {
      isLoading = true;
    });
    try {
      await recipeService.removeProductFromRecipe(
          context, widget.recipe.Id, ingredientId);
      getIngredientsInRecipe(widget.recipe.Id);
    } catch (e) {
      print("Erro ao remover produto da receita: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erro ao remover produto da receita.')),
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  /// Edita a quantidade de um ingrediente na receita.
  Future<void> editIngredientInProduct(
      ProductToRecipeDto editedIngredient) async {
    setState(() {
      isLoading = true;
    });
    try {
      await recipeService.editProductInRecipe(
          context, widget.recipe.Id, editedIngredient);
      getIngredientsInRecipe(widget.recipe.Id);
    } catch (e) {
      print("Erro ao editar o produto: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erro ao editar o produto.')),
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  /// Edita o nome da receita.
  editRecipeName(String newName) async {
    setState(() {
      isLoading = true;
    });
    try {
      await recipeService.editRecipeName(widget.recipe.Id, context, newName);
    } catch (e) {
      print("Erro ao editar o nome da receita: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erro ao editar o nome da receita.')),
      );
    } finally {
      setState(() {
        recipeName = newName;
        isEditingName = false;
        isLoading = false;
      });
    }
  }

  /// Alterna o estado para exibir o formulário de adição de ingrediente.
  void addNewIngredient() {
    setState(() {
      addIngredient = !addIngredient;
    });
    if (addIngredient) {
      editIngredient = false;
    }
  }

  /// Abre o modal para edição de um ingrediente.
  void openEditIngredientModal(ProductInRecipeDto ingredient) {
    setState(() {
      ingredientToEdit = ingredient;
      addIngredient = false;
      editIngredient = true;
    });
  }

  /// Fecha o modal de edição de ingrediente.
  void closeEditIngredientModal() {
    setState(() {
      editIngredient = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      backgroundColor: Color(0xFF212F3D),
      child: GestureDetector(
        onTap: () {},
        behavior: HitTestBehavior.opaque,
        child: WillPopScope(
          onWillPop: () async {
            widget.onClose();
            return true; 
          },
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        widget.isNewRecipe
                            ? 'Adicionar Ingredientes'
                            : 'Editar Receita',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      IconButton(
                        icon: Icon(Icons.close, color: Colors.white),
                        onPressed: widget.onClose,
                        tooltip: 'Fechar',
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  if (!widget.isNewRecipe) ...[
                    Text(
                      'Nome da Receita:',
                      style: TextStyle(fontSize: 16, color: Colors.white),
                    ),
                    Row(
                      children: [
                        Expanded(
                          child: isEditingName
                              ? TextField(
                                  controller: newName,
                                  decoration: InputDecoration(
                                    hintText: 'Insira o novo nome da receita',
                                    border: OutlineInputBorder(),
                                    hintStyle: TextStyle(color: Colors.white),
                                  ),
                                  style: TextStyle(color: Colors.white),
                                )
                              : Text(
                                  recipeName,
                                  style: TextStyle(
                                      fontSize: 16, color: Colors.white),
                                ),
                        ),
                        IconButton(
                          icon: Icon(
                            isEditingName ? Icons.check : Icons.edit,
                            color: Colors.white,
                          ),
                          onPressed: () {
                            setState(() {
                              if (isEditingName) {
                                if (newName.text != recipeName) {
                                  editRecipeName(newName.text);
                                }
                              }
                              isEditingName = !isEditingName;
                            });
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                  ],

                  Text(
                    'Ingredientes:',
                    style: TextStyle(fontSize: 16, color: Colors.white),
                  ),
                  if (ingredients.isNotEmpty) ...[
                    ...ingredients.map(
                      (ingredient) => Container(
                        margin: const EdgeInsets.symmetric(vertical: 5),
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white10,
                          borderRadius: BorderRadius.circular(15),
                          border: Border.all(color: Colors.white54),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                '${ingredient.Name}: ${ingredient.Quantity} ${ingredient.Unities.name}',
                                style: TextStyle(color: Colors.white),
                              ),
                            ),
                            Row(
                              children: [
                                IconButton(
                                  icon: Icon(Icons.edit, color: Colors.white),
                                  onPressed: () =>
                                      openEditIngredientModal(ingredient),
                                ),
                                IconButton(
                                    icon: Icon(Icons.delete, color: Colors.red),
                                    onPressed: () => {
                                          removeIngredient(
                                              ingredient.productId),
                                          setState(() {
                                            editIngredient = false;
                                          }),
                                        }),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ] else ...[
                    Text(
                      'Esta receita não tem nenhum ingrediente associado',
                      style: TextStyle(color: Colors.white),
                    ),
                  ],

                  const SizedBox(height: 20),

                  // Botão "Adicionar Ingrediente"
                  Center(
                    child: ElevatedButton(
                      onPressed: addNewIngredient,
                      child: Text(
                        'Adicionar Ingrediente',
                      ),
                    ),
                  ),

                  if (addIngredient) ...[
                    Container(
                      margin: const EdgeInsets.only(top: 15),
                      padding: const EdgeInsets.all(15),
                      decoration: BoxDecoration(
                        color: Color(0xFF183B5F),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Adicionar Ingrediente',
                            style: TextStyle(color: Colors.white, fontSize: 16),
                          ),
                          const SizedBox(height: 10),
                          Center(
                            child: DropdownButton<Product>(
                              value: selectedProduct,
                              hint: Text(
                                'Selecione um ingrediente',
                                style: TextStyle(color: Colors.white),
                              ),
                              dropdownColor: Color(0xFF212F3D),
                              style: TextStyle(color: Colors.white),
                              onChanged: (newValue) {
                                setState(() {
                                  selectedProduct = newValue;
                                });
                              },
                              items: productsInGroup.map((Product product) {
                                return DropdownMenuItem<Product>(
                                  value: product,
                                  child: Text(product.Name),
                                );
                              }).toList(),
                            ),
                          ),
                          const SizedBox(height: 10),
                          if (selectedProduct != null) ...[
                            Text(
                              'Quantidade:',
                              style: TextStyle(color: Colors.white),
                            ),
                            const SizedBox(height: 5),
                            Row(
                              children: [
                                Expanded(
                                  child: TextField(
                                    keyboardType: TextInputType.number,
                                    decoration: InputDecoration(
                                      hintText: 'Digite a quantidade',
                                      hintStyle:
                                          TextStyle(color: Colors.white54),
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      filled: true,
                                      fillColor: Colors.white12,
                                    ),
                                    style: TextStyle(color: Colors.white),
                                    onChanged: (value) {
                                      setState(() {
                                        ingredientQuantity =
                                            int.tryParse(value) ?? 0;
                                      });
                                    },
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Text(
                                  '${selectedProduct?.Unities.name}',
                                  style: TextStyle(color: Colors.white),
                                ),
                              ],
                            ),
                            const SizedBox(height: 15),
                          ],
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.red),
                                onPressed: addNewIngredient,
                                child: Text('Cancelar',
                                    style: TextStyle(color: Colors.white)),
                              ),
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.teal),
                                onPressed: () {
                                  if (selectedProduct != null &&
                                      ingredientQuantity > 0) {
                                    ProductToRecipeDto productToAdd =
                                        ProductToRecipeDto(
                                      Name: selectedProduct!.Name,
                                      Quantity: ingredientQuantity.toInt(),
                                    );
                                    addProductToRecipe(productToAdd);
                                    setState(() {
                                      addIngredient = false;
                                      selectedProduct = null;
                                      ingredientQuantity = 0;
                                    });
                                  }
                                },
                                child: Text('Adicionar',
                                    style: TextStyle(color: Colors.white)),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],

                  if (editIngredient) ...[
                    Container(
                      margin: const EdgeInsets.only(top: 15),
                      padding: const EdgeInsets.all(15),
                      decoration: BoxDecoration(
                        color: Color(0xFF183B5F),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Nome: ${ingredientToEdit.Name}',
                              style:
                                  TextStyle(color: Colors.white, fontSize: 14)),
                          const SizedBox(height: 10),
                          Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  keyboardType: TextInputType.number,
                                  decoration: InputDecoration(
                                    hintText: 'Digite a quantidade',
                                    hintStyle: TextStyle(color: Colors.white54),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    filled: true,
                                    fillColor: Colors.white12,
                                  ),
                                  style: TextStyle(color: Colors.white),
                                  onChanged: (value) {
                                    setState(() {
                                      newQuantity = int.tryParse(value) ?? 0;
                                    });
                                  },
                                ),
                              ),
                              const SizedBox(width: 10),
                              Text(
                                '${ingredientToEdit?.Unities.name}',
                                style: TextStyle(color: Colors.white),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.red),
                                onPressed: closeEditIngredientModal,
                                child: Text('Cancelar',
                                    style: TextStyle(color: Colors.white)),
                              ),
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.teal),
                                onPressed: () {
                                  if (newQuantity !=
                                      ingredientToEdit.Quantity) {
                                    ProductToRecipeDto editedIngredient =
                                        new ProductToRecipeDto(
                                      Name: ingredientToEdit.Name,
                                      Quantity: newQuantity,
                                    );
                                    editIngredientInProduct(editedIngredient);
                                  }
                                  setState(() {
                                    newQuantity = 0;
                                    editIngredient = false;
                                  });
                                },
                                child: Text('Salvar',
                                    style: TextStyle(color: Colors.white)),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
