/// Enum `Unity`
///
/// Representa diferentes unidades de medida para itens, como quilos, unidades,
/// litros e gramas.
enum Unity {
  /// Quilogramas (Kg).
  Kilos,

  /// Unidades (itens contáveis individualmente).
  Unidades,

  /// Litros (L).
  Litros,

  /// Gramas (g).
  Gramas,

  /// Valor padrão usado como unidade genérica.
  DefaultValue,
}

/// Extensão `UnityExtension`
///
/// Adiciona funcionalidades ao enum `Unity`, permitindo a conversão entre
/// as enumerações e descrições legíveis.
extension UnityExtension on Unity {
  String get description {
    switch (this) {
      case Unity.Kilos:
        return 'Kilos';
      case Unity.Unidades:
        return 'Unidades';
      case Unity.Litros:
        return 'Litros';
      case Unity.Gramas:
        return 'Gramas';
      case Unity.DefaultValue:
        return 'Uni';
    }
  }

  /// Retorna um valor de `Unity` com base na descrição fornecida.
  ///
  /// A descrição deve corresponder a uma das unidades disponíveis
  /// no formato legível (por exemplo, `Kilos`, `Unidades`, etc.).
  static Unity fromDescription(String description) {
    switch (description) {
      case 'Kilos':
        return Unity.Kilos;
      case 'Unidades':
        return Unity.Unidades;
      case 'Litros':
        return Unity.Litros;
      case 'Gramas':
        return Unity.Gramas;
      default:
        throw ArgumentError('Invalid unity description: $description');
    }
  }
}
