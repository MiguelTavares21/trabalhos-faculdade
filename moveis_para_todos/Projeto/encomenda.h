/*
 * @file   encomenda.h
 * @author Grupo 100
 *
 * @date 20 dezembro 2022
 * @brief Ficheiro header de encomendas
 *
 *
 *
 * Ficheiro que contém todos os conteúdos necessários à utilização de encomendas
 */

#ifndef ENCOMENDA_H
#define ENCOMENDA_H

#ifdef __cplusplus
extern "C" {
#endif

#include "input.h"
#include "moveis.h"
#include "perfil.h"

#define FICHEIRO_ENCOMENDAS "encomendas.csv"
#define FICHEIRO_MATERIAIS_SEMANA "materiais_semana.txt"
#define FICHEIRO_MOVEIS_FICHA_TECNICA "fichaTenicaMoveis.txt"
#define OPERACAO_CANCELADA "Operacao cancelada\n"
#define TEMPO_ENTREGA 3;

typedef struct movelEncomenda {
    char codigoProduto[TAMANHO_CODIGO_MOVEL];
    int quantidade;
} MovelEncomenda;

typedef struct encomenda {
    int numeroCliente;
    int contador;
    Data data;
    Data dataEntrega;
    float preco;
    MovelEncomenda *movelEncomenda;
} Encomenda;

typedef struct encomendas {
    int contador;
    Encomenda *encomenda;
} Encomendas;

int checkEncomendas(int num, Encomendas encomendas);
void criarEncomenda(Encomendas *encomendas, Materiais *materiais, Moveis moveis, Encomenda encomendaTemp, Clientes *clientes);
void listarEncomendas(Encomendas encomendas, Clientes clientes, Moveis moveis);
void listarEncomendasCliente(int num, Encomendas encomendas, Moveis moveis);
void cancelarEncomenda(Encomendas *encomenda, int num, Clientes *clientes, Materiais *materiais, Moveis moveis);
void calcularDataEntrega(Encomendas *encomendas, int pos);
void materiaisSemana(Encomendas encomendas, Moveis movel, Data data1, Data data2);
int checkEncomendaCancelar(int numCliente, int numEncomenda, Encomendas encomendas);
void limparEncomendaTemp(Encomenda *encomendaTemp);
void top5MateriaisMaisUsados(Materiais materiais);
void lerFicheiroEncomendas(Encomendas *encomendas, FILE *fEncomendas, char *nomeFicheiro);
void escreverFicheiroEncomendas(Encomendas encomendas, FILE *fEncomendas, char *nomeFicheiro);
int verificarEncomendasMovel(Encomendas encomenda, Moveis movel, int posMovel);

#ifdef __cplusplus
}
#endif

#endif /* ENCOMENDA_H */
