using System;
/// <summary>
/// Este atributo é utilizado para marcar métodos ou classes que exigem privilégios de administrador para acesso.
/// Ele é utilizado como uma maneira de identificar e controlar o acesso a funcionalidades administrativas em uma aplicação.
/// </summary>
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false)]
public class IsAdminAttribute : Attribute
{
}