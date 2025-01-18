import 'package:flutter/material.dart';

/// [GroupProvider] é um [ChangeNotifier] responsável por gerir o estado
/// de um grupo selecionado. Ele mantém o ID do grupo selecionado e notifica
/// os ouvintes quando esse estado é alterado.
class GroupProvider with ChangeNotifier {
  // Armazena o ID do grupo selecionado, que pode ser nulo caso não haja grupo selecionado.
  int? _selectedGroupId;

  /// Retorna o ID do grupo atualmente selecionado.
  ///
  /// Retorna:
  /// - [int?] o ID do grupo selecionado ou [null] caso não haja nenhum grupo selecionado.
  int? get selectedGroupId => _selectedGroupId;

  /// Define um novo ID para o grupo selecionado.
  ///
  /// Parâmetro:
  /// - [newGroupId]: O novo ID do grupo a ser selecionado. Pode ser [null] para desmarcar o grupo.
  ///
  /// Notifica os ouvintes para atualizar o estado na UI.
  set selectedGroupId(int? newGroupId) {
    _selectedGroupId = newGroupId;
    notifyListeners();
  }

  /// Limpa a seleção do grupo, definindo o ID do grupo selecionado como [null].
  ///
  /// Notifica os ouvintes para que a UI seja atualizada e refleta que nenhum grupo está selecionado.
  void clearSelectedGroupId() {
    _selectedGroupId = null;
    notifyListeners();
  }
}
