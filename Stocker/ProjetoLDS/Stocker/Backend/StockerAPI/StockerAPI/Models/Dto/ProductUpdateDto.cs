using System.ComponentModel.DataAnnotations;

namespace StockerAPI.Models.Dto
{
    /// <summary>
    /// Representa os dados para atualização de um produto. Contém informações sobre o nome, quantidade e pontos de encomenda/ideal do produto.
    /// </summary>
    public class ProductUpdateDto
    {
        /// <summary>
        /// Nome do produto.
        /// Este campo é opcional e não pode exceder 100 caracteres.
        /// </summary>
        [StringLength(100, ErrorMessage = "O nome do produto não pode ter mais de 100 caracteres.")]
        public string Name { get; set; }

        /// <summary>
        /// Quantidade do produto.
        /// Este campo é opcional e deve ser maior ou igual a 0.
        /// </summary>
        [Range(0.0f, float.MaxValue, ErrorMessage = "Quantidade deve ser maior ou igual a 0.")]
        public float Quantity { get; set; }

        /// <summary>
        /// Ponto de Encomenda do produto.
        /// Este campo é opcional e deve ser maior que 0, caso fornecido.
        /// </summary>
        [Range(0.01f, float.MaxValue, ErrorMessage = "Ponto de Encomenda deve ser maior que 0.")]
        public float? Order_Point { get; set; }

        /// <summary>
        /// Ponto Ideal do produto.
        /// Este campo é opcional, deve ser maior que o ponto de encomenda, caso fornecido.
        /// </summary>
        [Range(0.01f, float.MaxValue, ErrorMessage = "Ponto de Encomenda deve ser maior que 0.")]
        [IdealPointGreaterThanOrderPoint(ErrorMessage = "Ponto ideal deve ser maior que ponto de encomenda.")]
        public float? Ideal_Point { get; set; }

    }
}
