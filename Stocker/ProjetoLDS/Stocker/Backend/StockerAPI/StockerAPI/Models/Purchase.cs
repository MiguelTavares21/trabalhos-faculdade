using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StockerAPI.Models
{
    /// <summary>
    /// Representa uma compra realizada por um grupo, incluindo informações sobre o preço total e a data da compra.
    /// </summary>
    public class Purchase
    {
        /// <summary>
        /// Identificador único da compra. A chave primária é gerada automaticamente.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>
        /// Identificador do grupo que realizou a compra. Este campo é obrigatório e estabelece a relação com o grupo na tabela `Group`.
        /// </summary>
        [Required]
        [ForeignKey("Group")]
        public int Group_Id { get; set; }

        /// <summary>
        /// Data da compra. Este campo é obrigatório e é gerado automaticamente pelo banco de dados quando a compra é registrada.
        /// </summary>
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Date { get; set; }

        /// <summary>
        /// Preço total da compra. Este campo é obrigatório e deve ser maior ou igual a 0.
        /// </summary>
        [Required]
        [Range(0.0f, float.MaxValue, ErrorMessage = "Preço deve ser maior ou igual a 0.")]
        public float Price { get; set; }

        /// <summary>
        /// Navegação para o objeto `Group` associado a esta compra. Representa o grupo que realizou a compra.
        /// </summary>
        public virtual Group Group { get; set; }
    }
}
