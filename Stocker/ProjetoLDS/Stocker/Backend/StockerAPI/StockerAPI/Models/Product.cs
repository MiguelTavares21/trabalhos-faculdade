using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StockerAPI.Models
{
    /// <summary>
    /// Representa um produto no sistema, contendo informações como nome, quantidade disponível, unidade de medida, tipo e pontos de encomenda.
    /// </summary>
    public class Product
    {
        /// <summary>
        /// Identificador único do produto. A chave primária é gerada automaticamente.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>
        /// Nome do produto. Este campo é obrigatório e nao deve exceder os 100 caracteres.
        /// </summary>
        [Required]
        [StringLength(100, ErrorMessage = "O nome do produto não pode ter mais de 100 caracteres.")]
        public string Name { get; set; }

        /// <summary>
        /// Quantidade disponível do produto. Este campo é obrigatório e deve ser maior ou igual a 0.
        /// </summary>
        [Required]
        [Range(0.0f, float.MaxValue, ErrorMessage = "Quantidade deve ser maior ou igual a 0.")]
        public float Quantity { get; set; }

        /// <summary>
        /// Unidade de medida do produto (ex.: "Kilos", "Unidades", "Litros", "Gramas"). Este campo é obrigatório e deve ser um valor válido.
        /// </summary>
        [Required]
        [EnumDataType(typeof(Unities), ErrorMessage = "Unidade deve ser: 'Kilos', 'Unidades', 'Litros' ou 'Gramas'.")]
        public string Unity { get; set; }

        /// <summary>
        /// Ponto de encomenda do produto, ou seja, a quantidade mínima em estoque para fazer uma nova encomenda. 
        /// Este campo é opcional, mas quando preenchido deve ser maior que 0.
        /// </summary>
        [Range(0.01f, float.MaxValue, ErrorMessage = "Ponto de Encomenda deve ser maior que 0.")]
        public float? Order_Point { get; set; }

        /// <summary>
        /// Ponto ideal de estoque, que é a quantidade recomendada para manter em estoque. 
        /// Este campo é opcional, mas quando preenchido deve ser maior que o ponto de encomenda.
        /// </summary>
        [Range(0.01f, float.MaxValue, ErrorMessage = "Ponto de Encomenda deve ser maior que 0.")]
        [IdealPointGreaterThanOrderPoint(ErrorMessage = "Ponto ideal deve ser maior que ponto de encomenda.")]
        public float? Ideal_Point { get; set; }

        /// <summary>
        /// Indica se o produto está na lista de compras. Este campo é obrigatório.
        /// </summary>
        [Required]
        public bool In_List { get; set; }

        /// <summary>
        /// Tipo do produto (ex.: "Frutas e Verduras", "Panificação e Confeitaria", etc.). Este campo é obrigatório e deve ser um valor válido.
        /// </summary>
        [Required]
        [EnumDataType(typeof(Types), ErrorMessage = "Tipo deve ser válido.")]
        public string Type { get; set; }

        /// <summary>
        /// Identificador do grupo ao qual o produto pertence. Este campo é obrigatório e estabelece a relação com a tabela `Group`.
        /// </summary>
        [Required]
        [ForeignKey("Group")]
        public int Group_Id { get; set; }

        /// <summary>
        /// Navegação para o objeto `Group` associado a este produto. Representa o grupo ao qual o produto pertence.
        /// </summary>
        public virtual Group Group { get; set; }
    }
}
