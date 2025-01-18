/// Representa um grupo com propriedades associadas como ID, 
/// nome, descrição, orçamento e código de acesso.
class Group {
  // Identificador único do grupo
  final int id;

  // Nome do grupo
  final String name;

  // Descrição do grupo
  final String description;

  // Orçamento associado ao grupo
  final double budget;

  // Código de acesso do grupo
  final String accessCode;

  /// Construtor da classe [Group].
  /// 
  /// - [id]: Identificador único do grupo (obrigatório).
  /// - [name]: Nome do grupo (obrigatório).
  /// - [description]: Descrição do grupo (obrigatório).
  /// - [budget]: Orçamento do grupo (obrigatório).
  /// - [accessCode]: Código de acesso do grupo (obrigatório).
  Group({
    required this.id,
    required this.name,
    required this.description,
    required this.budget,
    required this.accessCode,
  });

  // Converte JSON para um objeto Group
  factory Group.fromJson(Map<String, dynamic> json) {
    print(json);
    return Group(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      accessCode: json['access_code'] ?? '',
      budget: (json['budget'] as num).toDouble(),
    );
  }

  // Converte um objeto Group para JSON
  Map<String, dynamic> toJson() {
    return {
      'Id': id,
      'Name': name,
      'Description': description,
      'Budget': budget,
      'Access_code': accessCode,
    };
  }
}
