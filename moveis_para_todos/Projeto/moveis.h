/*
 * @file   moveis.h
 * @author Grupo 100
 *
 * @date 20 dezembro 2022
 * @brief Ficheiro header de moveis
 *
 *
 *
 * Ficheiro que contém todos os conteúdos necessários à utilização de móveis
 */

#ifndef MOVEIS_H
#define MOVEIS_H

#ifdef __cplusplus
extern "C" {
#endif
#include <stdbool.h>
#include <stdio.h>

#define FICHEIRO_MATERIAIS "materiais.csv"
#define FICHEIRO_MOVEIS "Tabela_Ficha_Tecnica.csv"

#define TAMANHO_CODIGO_MOVEL 7
#define TAMANHO_CODIGO_MATERIAL 6
#define MOVEL_INEXISTENTE "Movel inexistente\n"
#define MATERIAL_INEXISTENTE "Material inexistente\n"
#define OPERACAO_CANCELADA "Operacao cancelada\n"

typedef enum {
    INATIVOM,
    ATIVOM
} EstadoM;

typedef struct material {
    int contador;
    char *nomeMaterial;
    char codigoMaterial[TAMANHO_CODIGO_MATERIAL];
    char *unidade;
} Material;

typedef struct materiais {
    int contador;
    Material *material;
} Materiais;

typedef struct movel {
    char *nome;
    float preco;
    char codigoProduto[TAMANHO_CODIGO_MOVEL];
    float comprimento, largura, altura;
    Material *material;
    int contadorMateriais;
    EstadoM estado;
} Movel;

typedef struct moveis {
    int contador;
    Movel *movel;
} Moveis;

void criarMovel(Moveis *moveis, Materiais materiais, char *nome, float preco, float comprimento, float largura, float altura, char codigoProduto[TAMANHO_CODIGO_MOVEL]);
void editarMovel(Moveis *moveis);
void listarMovel(Moveis moveis);
int verificarMovel(Moveis moveis, char codigoProduto[TAMANHO_CODIGO_MOVEL - 1]);
int verificarMaterial(Moveis moveis, int posicao, char codigoProduto[TAMANHO_CODIGO_MATERIAL]);
void eliminarMovel(Moveis *moveis, char codigoProduto[TAMANHO_CODIGO_MOVEL]);
void eliminarMovel(Moveis *moveis, char codigoProduto[TAMANHO_CODIGO_MOVEL]);
int posMaterial(Materiais materiais, char codigoMaterial[TAMANHO_CODIGO_MATERIAL]);
bool codigoExistenteMovel(Moveis moveis, char codigoProduto[TAMANHO_CODIGO_MOVEL]);
bool codigoExistenteMateriais(Materiais materiais, char codigoMaterial[TAMANHO_CODIGO_MATERIAL]);
void limparMateriais(Materiais *materiais);
void lerFicheiroMateriais(Materiais *materiais, FILE *fMateriais, int nMateriais, char *nomeFicheiro);
void escreverFicheiroMateriais(Materiais materiais, FILE *fMateriais, char *nomeFicheiro);
void escreverFicheiroMovel(Moveis moveis, FILE *fMoveis, char *nomeFicheiro);
void lerFicheiroMoveis(Moveis *moveis, FILE *fMoveis, char *nomeFicheiro);
void editarNomeMovel(char *nome, int resultado, Moveis *moveis);
void editarCodigoMovel(char codigoProduto[TAMANHO_CODIGO_MOVEL], int resultado, Moveis *moveis);
void alterarDimensoesMovel(float comprimento, float largura, float altura, int resultado, Moveis *moveis);
void editarPrecoMovel(float preco, int resultado, Moveis *moveis);
void adicionarMaterialMovel(Moveis *movel, Materiais material, int quantidade, int numMovel, int numMaterial);
int contarMoveis(FILE *fMoveis, char *nomeFicheiro);
void editarQuantidadeMovel(Moveis *movel, int quantidade, int numMovel, int numMaterial);
void eliminarMaterialMovel(Moveis *movel, int numMovel, int numMaterial);
void criarMaterial(Materiais *materiais, char codigoMaterial[TAMANHO_CODIGO_MATERIAL], char *nome, int unidade);
void listarMaterial(Materiais material);
void editarNomeMaterial(Materiais *materiais, int resultado, char *nome);
void editarCodigoMaterial(Materiais *materiais, int resultado, char codigoMaterial[TAMANHO_CODIGO_MATERIAL]);
void alterarTipoUnidade(Materiais *materiais, int resultado);
void removerMaterial(Materiais *materiais, int resultado);
void top5MoveisMaisMateriais(Moveis moveis);
void top5MoveisMaisCaros(Moveis moveis);
void escreverFicheiroMateriaisSemana(Materiais materiais, FILE *ficheiro, char *nomeFicheiro, int dia, int mes, int ano, int dia2, int mes2, int ano2);
void escreverFicheiroFichaTencicaMovel(Moveis moveis, char codigoProduto[TAMANHO_CODIGO_MOVEL]);
void alterarEstadoMovel(Moveis *movel, int pos);

#ifdef __cplusplus
}
#endif

#endif /* MOVEIS_H */
