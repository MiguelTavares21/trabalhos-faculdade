using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StockerAPI.Models
{
    /// <summary>
    /// Representa o registro de uso de um produto em um grupo, incluindo informações sobre a quantidade utilizada e a data do uso.
    /// </summary>
    public class Product_Use_Log
    {
        /// <summary>
        /// Identificador único do registro de uso do produto. A chave primária é gerada automaticamente.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>
        /// Identificador do produto utilizado. Este campo é obrigatório e estabelece a relação com o produto na tabela `Product`.
        /// </summary>
        [Required]
        [ForeignKey("Product")]
        public int Product_Id { get; set; }

        /// <summary>
        /// Identificador do grupo que utilizou o produto. Este campo é obrigatório e estabelece a relação com o grupo na tabela `Group`.
        /// </summary>
        [Required]
        [ForeignKey("Group")]
        public int Group_Id { get; set; }

        /// <summary>
        /// Quantidade do produto utilizada. Este campo é obrigatório e deve ser maior que 0.
        /// </summary>
        [Required]
        [Range(0.01f, float.MaxValue, ErrorMessage = "Quantidade deve ser maior que 0.")]
        public float Quantity { get; set; }

        /// <summary>
        /// Data em que o produto foi utilizado. Este campo é obrigatório e é gerado automaticamente pelo banco de dados quando o registro é criado.
        /// </summary>
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Date { get; set; }

        /// <summary>
        /// Navegação para o objeto `Product` associado a este registro de uso. Representa o produto utilizado.
        /// </summary>
        public virtual Product Product { get; set; }

        /// <summary>
        /// Navegação para o objeto `Group` associado a este registro de uso. Representa o grupo que utilizou o produto.
        /// </summary>
        public virtual Group Group { get; set; }
    }
}
