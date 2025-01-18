using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os dados de um produto utilizado em uma receita. Contém informações sobre o produto, a receita associada, quantidade e unidade.
    /// </summary>
    public class ProductRecipeDto
    {
        /// <summary>
        /// Identificador do produto.
        /// </summary>
        public int ProductId { get; set; }

        /// <summary>
        /// Identificador da receita associada ao produto.
        /// </summary>
        public int RecipeId { get; set; }

        /// <summary>
        /// Nome do produto utilizado na receita.
        /// Este campo é opcional e não pode exceder 100 caracteres.
        /// </summary>
        [StringLength(100, ErrorMessage = "O nome do produto não pode ter mais de 100 caracteres.")]
        public string Name { get; set; }

        /// <summary>
        /// Quantidade do produto utilizada na receita.
        /// Este campo deve ser maior ou igual a 0.
        /// </summary>
        [Range(0.0f, float.MaxValue, ErrorMessage = "Quantidade deve ser maior ou igual a 0.")]
        public float Quantity { get; set; }

        /// <summary>
        /// Unidade de medida do produto utilizado na receita.
        /// Este campo deve ser um valor válido da enumeração 'Kilos', 'Unidades', 'Litros' ou 'Gramas'.
        /// </summary>
        [EnumDataType(typeof(Unities), ErrorMessage = "Unidade deve ser: 'Kilos', 'Unidades', 'Litros' ou 'Gramas'.")]
        public string Unity { get; set; }
    }
}

