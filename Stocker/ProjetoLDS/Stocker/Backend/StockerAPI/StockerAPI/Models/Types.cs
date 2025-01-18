using System.ComponentModel;

namespace StockerAPI.Models
{
    /// <summary>
    /// Enumeração que representa os diferentes tipos de produtos disponíveis no sistema.
    /// </summary>
    public enum Types
    {
        /// <summary>
        /// Categoria de produtos de frutas e verduras.
        /// </summary>
        [Description("Frutas e Verduras")]
        Frutas_Verduras,

        /// <summary>
        /// Categoria de produtos de panificação e confeitaria.
        /// </summary>
        [Description("Panificação e Confeitaria")]
        Panificacao_Confeitaria,

        /// <summary>
        /// Categoria de produtos de laticínios.
        /// </summary>
        [Description("Laticínios")]
        Laticinios,

        /// <summary>
        /// Categoria de produtos de carne e peixe.
        /// </summary>
        [Description("Carne e Peixe")]
        Carne_Peixe,

        /// <summary>
        /// Categoria de produtos de ingredientes e temperos.
        /// </summary>
        [Description("Ingredientes e Temperos")]
        Ingredientes_Temperos,

        /// <summary>
        /// Categoria de produtos congelados.
        /// </summary>
        [Description("Congelados")]
        Congelados,

        /// <summary>
        /// Categoria de produtos de cereais e grãos.
        /// </summary>
        [Description("Cereais e Grãos")]
        Cereais_Graos,

        /// <summary>
        /// Categoria de produtos de lanches e doces.
        /// </summary>
        [Description("Lanches e Doces")]
        Lanches_Doces,

        /// <summary>
        /// Categoria de produtos de bebidas.
        /// </summary>
        [Description("Bebidas")]
        Bebidas,

        /// <summary>
        /// Categoria de produtos para casa.
        /// </summary>
        [Description("Casa")]
        Casa,

        /// <summary>
        /// Categoria de produtos de higiene e saúde.
        /// </summary>
        [Description("Higiene e Saude")]
        Higiene_Saude,

        /// <summary>
        /// Categoria de produtos para animais.
        /// </summary>
        [Description("Animais")]
        Animais,

        /// <summary>
        /// Categoria de produtos de artesanato e jardim.
        /// </summary>
        [Description("Artesanato e Jardim")]
        Artesanato_Jardim,

        /// <summary>
        /// Categoria para outros produtos que não se encaixam nas categorias anteriores.
        /// </summary>
        [Description("Outro")]
        Outro
    }
}
