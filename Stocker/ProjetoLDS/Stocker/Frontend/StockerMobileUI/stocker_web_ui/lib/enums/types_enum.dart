/// Enum `Types`
///
/// Representa diferentes categorias de produtos, como frutas e verduras,
/// saúde e higiene, entre outros.
enum Types {
  /// Frutas e verduras.
  Frutas_Verduras,

  /// Produtos de panificação e confeitaria.
  Panificacao_Confeitaria,

  /// Laticínios.
  Laticinios,

  /// Carnes e peixes.
  Carne_Peixe,

  /// Ingredientes e temperos.
  Ingredientes_Temperos,

  /// Produtos congelados.
  Congelados,

  /// Cereais e grãos
  Cereais_Graos,

  /// Lanches e doces.
  Lanches_Doces,

  /// Bebidas.
  Bebidas,

  /// Produtos relacionados à casa, como utensílios domésticos.
  Casa,

  /// Produtos de higiene pessoal e saúde.
  Higiene_Saude,

  /// Produtos para animais de estimação.
  Animais,

  /// Artesanato e produtos para jardinagem.
  Artesanato_Jardim,

  /// Qualquer outro produto que não se encaixe nas categorias acima.
  Outro,
}

/// Extensão `TypesExtension`
///
/// Fornece funcionalidades adicionais para o enum `Types`, como a conversão
/// para descrições legíveis e mapeamento a partir de descrições.
extension TypesExtension on Types {
  String get description {
    switch (this) {
      case Types.Frutas_Verduras:
        return 'Frutas e Verduras';
      case Types.Panificacao_Confeitaria:
        return 'Panificação e Confeitaria';
      case Types.Laticinios:
        return 'Laticínios';
      case Types.Carne_Peixe:
        return 'Carne e Peixe';
      case Types.Ingredientes_Temperos:
        return 'Ingredientes e Temperos';
      case Types.Congelados:
        return 'Congelados';
      case Types.Cereais_Graos:
        return 'Cereais e Grãos';
      case Types.Lanches_Doces:
        return 'Lanches e Doces';
      case Types.Bebidas:
        return 'Bebidas';
      case Types.Casa:
        return 'Casa';
      case Types.Higiene_Saude:
        return 'Higiene e Saúde';
      case Types.Animais:
        return 'Animais';
      case Types.Artesanato_Jardim:
        return 'Artesanato e Jardim';
      case Types.Outro:
        return 'Outro';
    }
  }

  /// Retorna um valor de `Types` com base na descrição fornecida.
  ///
  /// Aceita descrições com ou sem diacríticos.
  static Types fromDescription(String description) {
    switch (description) {
      case 'Frutas_Verduras':
      case 'Frutas e Verduras':
        return Types.Frutas_Verduras;
      case 'Panificacao_Confeitaria':
      case 'Panificação e Confeitaria':
        return Types.Panificacao_Confeitaria;
      case 'Laticinios':
      case 'Laticínios':
        return Types.Laticinios;
      case 'Carne_Peixe':
      case 'Carne e Peixe':
        return Types.Carne_Peixe;
      case "Ingredientes_Temperos":
      case "Ingredientes e Temperos":
        return Types.Ingredientes_Temperos;
      case "Congelados":
        return Types.Congelados;
      case "Cereais_Graos":
      case "Cereais e Grãos":
        return Types.Cereais_Graos;
      case "Lanches_Doces":
      case "Lanches e Doces":
        return Types.Lanches_Doces;
      case "Bebidas":
        return Types.Bebidas;
      case "Casa":
        return Types.Casa;
      case "Higiene_Saude":
      case "Higiene e Saúde":
        return Types.Higiene_Saude;
      case "Animais":
        return Types.Animais;
      case "Artesanato_Jardim":
      case "Artesanato e Jardim":
        return Types.Artesanato_Jardim;
      case "Outro":
        return Types.Outro;
      default:
        throw ArgumentError('Invalid types description: $description');
    }
  }

  /// Retorna a string de descrição técnica para persistência ou uso interno.
  static String getDescription(Types type) {
    switch (type) {
      case Types.Frutas_Verduras:
        return 'Frutas_Verduras';
      case Types.Panificacao_Confeitaria:
        return 'Panificacao_Confeitaria';
      case Types.Laticinios:
        return 'Laticinios';
      case Types.Carne_Peixe:
        return 'Carne_Peixe';
      case Types.Ingredientes_Temperos:
        return 'Ingredientes_Temperos';
      case Types.Congelados:
        return 'Congelados';
      case Types.Cereais_Graos:
        return 'Cereais_Graos';
      case Types.Lanches_Doces:
        return 'Lanches_Doces';
      case Types.Bebidas:
        return 'Bebidas';
      case Types.Casa:
        return 'Casa';
      case Types.Higiene_Saude:
        return 'Higiene_Saude';
      case Types.Animais:
        return 'Animais';
      case Types.Artesanato_Jardim:
        return 'Artesanato_Jardim';
      case Types.Outro:
        return 'Outro';
      default:
        throw ArgumentError('Invalid types description: $type');
    }
  }
}
