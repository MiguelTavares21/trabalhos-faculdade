/// Representa os dados necessários para a criação de um novo grupo.
///
/// A classe contém apenas as informações essenciais para criar um grupo, 
/// como o nome, a descrição e o orçamento.
class GroupCreate {
  /// Nome do grupo a ser criado.
  final String name;

  /// Descrição detalhada do grupo.
  final String description;

  /// Orçamento associado ao grupo.
  final double budget;

   /// Construtor da classe [GroupCreate].
   /// 
   /// - [name]: Nome do grupo (obrigatório).
   /// - [description]: Descrição do grupo (obrigatório).
   /// - [budget]: Orçamento do grupo (obrigatório).
  GroupCreate({
    required this.name,
    required this.description,
    required this.budget,
  });

  /// Converte a instância de [GroupCreate] para um mapa JSON.
  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'description': description,
      'budget': budget,
    };
  }
}
