using System;
using System.ComponentModel.DataAnnotations;
using StockerAPI.Models;

public class IdealPointGreaterThanOrderPointAttribute : ValidationAttribute
{
    /// <summary>
    /// Valida se o valor do ponto ideal é maior que o valor do ponto de encomenda.
    /// </summary>
    /// <param name="value">Valor do ponto ideal.</param>
    /// <param name="validationContext">Contexto da validação que contém informações sobre a instância do objeto sendo validado.</param>
    /// <returns>Retorna um <see cref="ValidationResult"/> indicando se a validação foi bem-sucedida ou se houve um erro de validação.</returns>
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        var orderPointProperty = validationContext.ObjectType.GetProperty("Order_Point");
        var idealPointProperty = validationContext.ObjectType.GetProperty("Ideal_Point");

        if (orderPointProperty != null && idealPointProperty != null)
        {
            var orderPoint = orderPointProperty.GetValue(validationContext.ObjectInstance) as float?;
            var idealPoint = value as float?;

            if (orderPoint.HasValue && idealPoint.HasValue && idealPoint <= orderPoint)
            {
                return new ValidationResult("Ponto ideal deve ser maior que o ponto de encomenda.");
            }
        }

        return ValidationResult.Success;
    }
}