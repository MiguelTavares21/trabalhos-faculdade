using System.ComponentModel;

namespace StockerAPI.Models
{
    /// <summary>
    /// Enumeração que representa as unidades de medida utilizadas no sistema.
    /// </summary>
    public enum Unities
    {
        /// <summary>
        /// Unidade de medida para kilogramas.
        /// </summary>
        [Description("Kilogramas")]
        Kilos,

        /// <summary>
        /// Unidade de medida para litros.
        /// </summary>
        [Description("Litros")]
        Litros,

        /// <summary>
        /// Unidade de medida para gramas.
        /// </summary>
        [Description("Gramas")]
        Gramas,

        /// <summary>
        /// Unidade de medida para unidades individuais.
        /// </summary>
        [Description("Unidades")]
        Unidades
    }
}
