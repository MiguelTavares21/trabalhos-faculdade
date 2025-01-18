using System;
/// <summary>
/// Este atributo é utilizado para marcar métodos ou classes que requerem que o usuário seja membro de um grupo ou organização
/// para acessar a funcionalidade associada.
/// Ele serve como uma indicação de que o acesso ao recurso é restrito a utilizadores que fazem parte de um grupo.
/// </summary>
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false)]
public class IsMemberAttribute : Attribute
{
}
