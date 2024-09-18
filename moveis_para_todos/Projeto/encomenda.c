/*
 * @file   encomenda.c
 * @author Grupo 100
 *
 * @date 20 dezembro 2022
 * @brief Ficheiro source de encomendas
 *
 *
 *
 * Ficheiro que contém todos os conteúdos necessários à utilização de encomendas
 */

#include "encomenda.h"

#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#include "input.h"
#include "moveis.h"
#include "perfil.h"

/**
 * Função que cria uma encomenda
 *
 * @param encomendas Struct que contém todas as encomendas (parametro que receberá a encomenda criada)
 * @param materiais Struct que contém todos os materiais
 * @param moveis Struct que contém todos os móveis
 * @param encomendaTemp Struct temporária que contém a informação sobre a encomenda
 * @param clientes Struct que contém todos os clientes
 *
 * Esta função copia para a struct "Encomendas" os dados fornecidos como argumentos, estes dados foram introduzidos previamente na main e guardados na struct encomendaTemp.
 */
void criarEncomenda(Encomendas *encomendas, Materiais *materiais, Moveis moveis, Encomenda encomendaTemp, Clientes *clientes) {
    int pos = (*encomendas).contador, posMov, posMat;
    if (pos == 0) {
        (*encomendas).encomenda = (Encomenda *) malloc((INCREMENTO) * sizeof (Encomenda));
    } else {
        if (pos % 10 == 0) {
            (*encomendas).encomenda = (Encomenda *) realloc((*encomendas).encomenda, (pos + INCREMENTO) * sizeof (Encomenda));
        }
    }

    (*encomendas).encomenda[pos].preco = encomendaTemp.preco;

    int numeroCliente = encomendaTemp.numeroCliente;
    for (int i = 0; i < clientes->contador; i++) {
        if (clientes->cliente[i].numeroCliente == numeroCliente) {
            clientes->cliente[i].dinheiroGasto += encomendaTemp.preco;
            clientes->cliente[i].numeroEncomendas++;
            break;
        }
    }

    (*encomendas).encomenda[pos].contador = encomendaTemp.contador;
    (*encomendas).encomenda[pos].data.dia = encomendaTemp.data.dia;
    (*encomendas).encomenda[pos].data.mes = encomendaTemp.data.mes;
    (*encomendas).encomenda[pos].data.ano = encomendaTemp.data.ano;
    (*encomendas).encomenda[pos].numeroCliente = encomendaTemp.numeroCliente;

    (*encomendas).encomenda[pos].movelEncomenda = (MovelEncomenda *) malloc(encomendaTemp.contador * sizeof (MovelEncomenda));

    for (int i = 0; i < encomendaTemp.contador; i++) {
        strcpy(encomendas->encomenda[pos].movelEncomenda[i].codigoProduto, encomendaTemp.movelEncomenda[i].codigoProduto);
        encomendas->encomenda[pos].movelEncomenda[i].quantidade = encomendaTemp.movelEncomenda[i].quantidade;

        posMov = verificarMovel(moveis, encomendas->encomenda[pos].movelEncomenda[i].codigoProduto);

        for (int j = 0; j < moveis.movel[posMov].contadorMateriais; j++) {
            posMat = posMaterial((*materiais), moveis.movel[posMov].material[j].codigoMaterial);
            materiais->material[posMat].contador += encomendas->encomenda[pos].movelEncomenda[i].quantidade * moveis.movel[posMov].material[j].contador;
        }
    }

    calcularDataEntrega(&(*encomendas), pos);

    (*encomendas).contador++;
}

/**
 * Função que calcula a data de entrega da encomenda
 *
 * @param encomendas Struct que contém todas as encomendas
 * @param pos Variável interia que contém a posição da encomenda na struct Encomendas
 *
 * Esta função vai ao dia da realização da encomenda e calcula a data de entrega somando 3 dias
 */
void calcularDataEntrega(Encomendas *encomendas, int pos) {
    int dia, mes, ano;
    dia = encomendas->encomenda[pos].data.dia;
    mes = encomendas->encomenda[pos].data.mes;
    ano = encomendas->encomenda[pos].data.ano;

    dia += TEMPO_ENTREGA;

    if (mes == 2) {
        if (ano % 4 == 0) {
            if (dia > 29) {
                mes++;
                dia -= 29;
            }
        } else {
            if (dia > 28) {
                mes++;
                dia -= 28;
            }
        }
    } else {
        if (mes <= 7) {
            if (mes % 2 == 0) {
                if (dia > 30) {
                    mes++;
                    dia -= 30;
                }
            } else {
                if (dia > 31) {
                    mes++;
                    dia -= 31;
                }
            }
        } else {
            if (mes % 2 == 0) {
                if (dia > 31) {
                    mes++;
                    dia -= 31;
                }
            } else {
                if (dia > 30) {
                    mes++;
                    dia -= 30;
                }
            }
        }
    }

    if (mes > 12) {
        ano++;
        mes = 1;
    }

    encomendas->encomenda[pos].dataEntrega.dia = dia;
    encomendas->encomenda[pos].dataEntrega.mes = mes;
    encomendas->encomenda[pos].dataEntrega.ano = ano;
}

/**
 * Esta função verifica se o cliente tem encomendas realizadas
 *
 * @param num Variável inteira que contém o número do cliente
 * @param encomendas Struct que contém todas as encomendas
 * @return A função retorna o valor inteiro 1 caso o cliente tenha encomendas, caso não é retornado o valor 0
 *
 * Esta função faz um loop pelas encmendas e caso o número de cliente associado à encomenda seja igual ao "num",
 * variável passada como argumento, o a variável "valor" passa a ser 1, caso a condição não se confirme o valor fica a 0
 */
int checkEncomendas(int num, Encomendas encomendas) {
    int valor = 0;

    for (int i = 0; i < encomendas.contador; i++) {
        if (encomendas.encomenda[i].numeroCliente == num) {
            valor = 1;
        }
    }
    return valor;
}

/**
 * Esta função lista todas as encomendas
 *
 * @param encomendas Struct que contém todas as encomendas
 * @param clientes Struct que contém todos os clientes
 * @param moveis Struct que contém todos os móveis
 *
 * Esta função dá output a todas as encomendas, faz um loop pelas encomendas e apresenta informação sobre a encomenda,
 * o cliente que realizou a mesma e informação sobre os móveis que foram encomendados
 */
void listarEncomendas(Encomendas encomendas, Clientes clientes, Moveis moveis) {
    int tamanho = encomendas.contador;
    int n;

    if (tamanho == 0) {
        printf("Nao existem encomendas\n");
    } else {
        for (int i = 0; i < tamanho; i++) {
            printf("ENCOMENDA NUMERO: %d\n", i + 1);
            n = posCliente(clientes, encomendas.encomenda[i].numeroCliente);
            printf("Informacao do cliente:\n");
            printf("Numero de cliente: %d\n", clientes.cliente[n].numeroCliente);
            printf("Nome: %s %s\n", clientes.cliente[n].nome, clientes.cliente[n].apelido);
            printf("NIF: %s\n", clientes.cliente[n].nif);
            printf("Morada:\n");
            printf("cidade: %s\n", clientes.cliente[n].morada.cidade);
            printf("Rua: %s\n", clientes.cliente[n].morada.rua);
            printf("Codigo postal: %s\n", clientes.cliente[n].morada.codigoPostal);
            printf("Data da realizacao da encomenda: %d-%d-%d\n", encomendas.encomenda[i].data.dia, encomendas.encomenda[i].data.mes, encomendas.encomenda[i].data.ano);
            printf("Data de entrega: %d-%d-%d\n", encomendas.encomenda[i].dataEntrega.dia, encomendas.encomenda[i].dataEntrega.mes, encomendas.encomenda[i].dataEntrega.ano);
            printf("-----\n");
            for (int j = 0; j < encomendas.encomenda[i].contador; j++) {
                printf("Movel %d\n", j + 1);
                n = verificarMovel(moveis, encomendas.encomenda[i].movelEncomenda[j].codigoProduto);
                printf("Nome do movel: %s\n", moveis.movel[n].nome);
                printf("Quantidade: %d\n", encomendas.encomenda[i].movelEncomenda[j].quantidade);
                printf("Codigo do produto: %s\n", encomendas.encomenda[i].movelEncomenda[j].codigoProduto);
            }
            linha();
        }
    }
}

/**
 * Função que lista as encomendas de um determinado cliente
 *
 * @param num Variável inteira que contém o número do cliente
 * @param encomendas Struct que contém todas as encomendas
 * @param moveis Structque contém todos os móveis
 *
 * Esta função dá output apenas às encomendas do cliente a obsrevar.
 * Faz um loop pelas encomendas e caso o número de cliente associado à encomenda seja igual ao "num" passado como argumeto
 * a função dá print da informação sobre a mesma
 * O utilizador ainda tem a opção de puder ver os detalhes da encomenda, caso queira, é listado os materiais precisos para
 * a construção do móvel
 */
void listarEncomendasCliente(int num, Encomendas encomendas, Moveis moveis) {
    int posicao_movel, opcao, cont = 0, n = 0, auxiliar = 0;
    for (int i = 0; i < encomendas.contador; i++) {
        if (encomendas.encomenda[i].numeroCliente == num) {
            cont++;
        }
    }
    int encomenda[cont];

    if (cont == 0) {
        printf("Ainda nao fez encomendas\n");
    } else {
        printf("\n");
        printf("ENCOMENDAS:\n");
        for (int i = 0; i < encomendas.contador; i++) {
            if (encomendas.encomenda[i].numeroCliente == num) {
                printf("ENCOMENDA NUMERO: %d\n", i + 1);
                for (int j = 0; j < encomendas.encomenda[i].contador; j++) {
                    posicao_movel = verificarMovel(moveis, encomendas.encomenda[i].movelEncomenda[j].codigoProduto);
                    printf("%s\n", moveis.movel[posicao_movel].nome);
                    printf("Quantidade: %d\n", encomendas.encomenda[i].movelEncomenda[j].quantidade);
                    printf("Codigo do artigo: %s\n", encomendas.encomenda[i].movelEncomenda[j].codigoProduto);
                    printf("Preco: %.2f\n", moveis.movel[posicao_movel].preco * encomendas.encomenda[i].movelEncomenda[j].quantidade);
                }
                printf("-----\n");
                printf("Preco total da encomenda: %.2f\n", encomendas.encomenda[i].preco);
                printf("Data da encomenda: %d-%d-%d\n", encomendas.encomenda[i].data.dia, encomendas.encomenda[i].data.mes, encomendas.encomenda[i].data.ano);
                printf("Data de entrega: %d-%d-%d\n\n", encomendas.encomenda[i].dataEntrega.dia, encomendas.encomenda[i].dataEntrega.mes, encomendas.encomenda[i].dataEntrega.ano);
                encomenda[n] = i + 1;
                n++;
            }
        }

        printf(
                "Deseja ver detalhes de alguma encomenda:\n"
                "[ 1 ] - Sim\n"
                "[ 2 ] - Nao\n");
        opcao = lerInt(1, 2, "Opcao: ");
        if (opcao == 1) {
            printf("-----\n");
            do {
                printf("Insira o numero da encomenda que deseja ver os detalhes:\n");
                scanf("%d", &opcao);
                for (int i = 0; i < cont; i++) {
                    if (opcao == encomenda[i]) {
                        auxiliar = 1;
                    }
                }
            } while (auxiliar == 0);

            printf("Detalhes da encomenda %d\n", opcao);
            for (int i = 0; i < encomendas.encomenda[opcao - 1].contador; i++) {
                posicao_movel = verificarMovel(moveis, encomendas.encomenda[opcao - 1].movelEncomenda[i].codigoProduto);
                printf("Detalhes do/a %s\n", moveis.movel[posicao_movel].nome);
                printf("Dimensoes:%.1lfx%.1lfx%.1lf\n", moveis.movel[posicao_movel].comprimento,
                        moveis.movel[posicao_movel].largura, moveis.movel[posicao_movel].altura);
                printf("Material:\n");
                for (int m = 0; m < moveis.movel[posicao_movel].contadorMateriais; m++) {
                    printf("-> %s\n", moveis.movel[posicao_movel].material[m].nomeMaterial);
                    printf("codigo: %s\n", moveis.movel[posicao_movel].material[m].codigoMaterial);
                    printf("Quantidade: %d %s\n\n", moveis.movel[posicao_movel].material[m].contador, moveis.movel[posicao_movel].material[m].unidade);
                }
            }
        } else {
            printf("\n");
        }
    }
}

/**
 * Função que verifica se a encomenda a cancelar é de facto do utilizador
 *
 * @param numCliente Variável inteira que contém o número do cliente
 * @param numEncomenda Variável inteira que contém a posição da encomenda na struct Encomendas
 * @param encomendas Structque contém todas as encomendas
 * @return Esta função retorna 1 caso a encoemenda seja de facto do cliente e retorna 0 caso a condição não se verifique
 *
 *
 * Esta função verifica se o "numCliente" variável passada como argumento é igual ao número de cliente
 * presente na struct encomendas na posição "numEncomenda".
 */
int checkEncomendaCancelar(int numCliente, int numEncomenda, Encomendas encomendas) {
    int valor = 0;
    if (numCliente == encomendas.encomenda[numEncomenda - 1].numeroCliente) {
        valor = 1;
    }
    return valor;
}

/**
 * Função que cancela encomendas
 *
 * @param encomenda Struct que contém todas as encomendas
 * @param num Variável que contém o número da encomenda a ser eliminada
 * @param clientes Struct que contém todos os clientes
 *
 * Esta função vai fazer loop pelas encomendas a começar na posição da encomenda a ser eliminada.
 * De seguida vai copiar os dados da encomenda seguinte para a encomenda atual (caso a encomenda nao se encontre na ultima posição), deixando
 * assim a última encomenda com dados descartáveis.
 * Como estamos a eliminar encomendas também retiramos o dinheiro gasto pelos clientes e a quantidade de encomendas realizadas pelos mesmos.
 * Por fim, limpamos a última posição e reduzimos ao contador de encomendas.
 */
void cancelarEncomenda(Encomendas *encomenda, int num, Clientes *clientes, Materiais *materiais, Moveis moveis) {
    int tamanho = encomenda->contador - 1, posMov;
    if ((num - 1) != tamanho) {
        for (int i = num - 1; i < encomenda->contador - 1; i++) {
            encomenda->encomenda[i].contador = encomenda->encomenda[i + 1].contador;
            encomenda->encomenda[i].numeroCliente = encomenda->encomenda[i + 1].numeroCliente;
            encomenda->encomenda[i].preco = encomenda->encomenda[i + 1].preco;
            encomenda->encomenda[i].data.ano = encomenda->encomenda[i + 1].data.ano;
            encomenda->encomenda[i].data.mes = encomenda->encomenda[i + 1].data.mes;
            encomenda->encomenda[i].data.dia = encomenda->encomenda[i + 1].data.dia;
            encomenda->encomenda[i].dataEntrega.dia = encomenda->encomenda[i + 1].dataEntrega.dia;
            encomenda->encomenda[i].dataEntrega.mes = encomenda->encomenda[i + 1].dataEntrega.mes;
            encomenda->encomenda[i].dataEntrega.ano = encomenda->encomenda[i + 1].dataEntrega.ano;
            encomenda->encomenda[i].movelEncomenda = (MovelEncomenda *) realloc(encomenda->encomenda[i].movelEncomenda, (encomenda->encomenda[i + 1].contador) * sizeof (MovelEncomenda));
            for (int j = 0; j < encomenda->encomenda[i].contador; j++) {
                strcpy(encomenda->encomenda[i].movelEncomenda[j].codigoProduto, encomenda->encomenda[i + 1].movelEncomenda[j].codigoProduto);
                encomenda->encomenda[i].movelEncomenda[j].quantidade = encomenda->encomenda[i + 1].movelEncomenda[j].quantidade;
            }
        }
    }

    float preco = encomenda->encomenda[num - 1].preco;
    int numeroCliente = encomenda->encomenda[num - 1].numeroCliente;
    for (int i = 0; i < clientes->contador; i++) {
        if (clientes->cliente[i].numeroCliente == numeroCliente) {
            clientes->cliente[i].dinheiroGasto -= preco;
            clientes->cliente[i].numeroEncomendas--;
            break;
        }
    }

    encomenda->encomenda[tamanho].numeroCliente = -1;
    encomenda->encomenda[tamanho].preco = -1;
    encomenda->encomenda[tamanho].data.dia = -1;
    encomenda->encomenda[tamanho].data.mes = -1;
    encomenda->encomenda[tamanho].data.ano = -1;
    encomenda->encomenda[tamanho].dataEntrega.dia = -1;
    encomenda->encomenda[tamanho].dataEntrega.mes = -1;
    encomenda->encomenda[tamanho].dataEntrega.ano = -1;
    for (int i = 0; i < encomenda->encomenda[tamanho].contador; i++) {
        posMov = verificarMovel(moveis, encomenda->encomenda[tamanho].movelEncomenda[i].codigoProduto);

        for (int j = 0; j < moveis.movel[posMov].contadorMateriais; j++) {
            int posMat = posMaterial((*materiais), moveis.movel[posMov].material[j].codigoMaterial);
            materiais->material[posMat].contador -= encomenda->encomenda[tamanho].movelEncomenda[i].quantidade * moveis.movel[posMov].material[j].contador;
        }

        encomenda->encomenda[tamanho].movelEncomenda[i].quantidade = -1;
        strcpy(encomenda->encomenda[tamanho].movelEncomenda[i].codigoProduto, "000000");
    }
    encomenda->encomenda[tamanho].contador = -1;
    free(encomenda->encomenda[tamanho].movelEncomenda);
    encomenda->contador--;
}

/**
 * Função que lista o material necessário para um determinado tempo
 *
 * @param encomendas Struct que contém todas as encomendas
 * @param movel Struct que contém todos os móveis
 * @param data1 Struct que contem a data que delimita o tempo a ser observado
 * @param data2 Struct que contém a data que delimita o tempo a ser obsrevado
 *
 * Esta função vai precorrer todas as encomendas e caso a data de entrega esteja entre os limites delimitados (data1 e data2)
 * a função vai copiar os dados dos materiais das encomendas para uma struct temporária do tipo materiais,
 *  caso o material já tenha sido adicionado à struct então apenas se adiciona a quantidade.
 */
void materiaisSemana(Encomendas encomendas, Moveis movel, Data data1, Data data2) {
    Materiais materiaisTemp = {.contador = 0};
    FILE *ficheiro;
    int valorData1, valorData2, entrega, len, n = 0;
    int posicao_movel;
    int pos = materiaisTemp.contador;
    valorData1 = (data1.ano * 10000) + (data1.mes * 100) + (data1.dia);
    valorData2 = (data2.ano * 10000) + (data2.mes * 100) + (data2.dia);

    iniciarFicheiro(ficheiro, FICHEIRO_MATERIAIS_SEMANA);

    if (encomendas.contador == 0) {
        printf("Sem encomendas\n");
    } else {
        for (int i = 0; i < encomendas.contador; i++) {
            entrega = (encomendas.encomenda[i].dataEntrega.ano * 10000) + (encomendas.encomenda[i].dataEntrega.mes * 100) + (encomendas.encomenda[i].dataEntrega.dia);
            if ((entrega <= valorData2 && entrega >= valorData1) || (entrega >= valorData2 && entrega <= valorData1)) {
                for (int j = 0; j < encomendas.encomenda[i].contador; j++) {
                    posicao_movel = verificarMovel(movel, encomendas.encomenda[i].movelEncomenda[j].codigoProduto);
                    for (int t = 0; t < movel.movel[posicao_movel].contadorMateriais; t++) {
                        if (materiaisTemp.contador == 0) {
                            materiaisTemp.material = (Material *) malloc((pos + 1) * sizeof (Material));
                            len = strlen(movel.movel[posicao_movel].material[t].nomeMaterial);
                            materiaisTemp.material[pos].nomeMaterial = (char *) malloc(len * sizeof (char));
                            strcpy(materiaisTemp.material[pos].nomeMaterial, movel.movel[posicao_movel].material[t].nomeMaterial);
                            len = strlen(movel.movel[posicao_movel].material[t].unidade);
                            materiaisTemp.material[pos].unidade = (char *) malloc(len * sizeof (char));
                            strcpy(materiaisTemp.material[pos].unidade, movel.movel[posicao_movel].material[t].unidade);
                            strcpy(materiaisTemp.material[pos].codigoMaterial, movel.movel[posicao_movel].material[t].codigoMaterial);
                            materiaisTemp.material[pos].contador = movel.movel[posicao_movel].material[t].contador * encomendas.encomenda[i].movelEncomenda[j].quantidade;
                            materiaisTemp.contador++;

                        } else if (materiaisTemp.contador != 0) {
                            for (int m = 0; m < materiaisTemp.contador; m++) {
                                n = 0;
                                if (strcmp(materiaisTemp.material[m].codigoMaterial, movel.movel[posicao_movel].material[t].codigoMaterial) == 0) {
                                    materiaisTemp.material[m].contador = materiaisTemp.material[m].contador + (movel.movel[posicao_movel].material[t].contador * encomendas.encomenda[i].movelEncomenda[j].quantidade);
                                    n = 1;
                                }
                            }

                            if (n != 1) {
                                materiaisTemp.material = (Material *) realloc(materiaisTemp.material, (materiaisTemp.contador + 1) * sizeof (Material));
                                len = strlen(movel.movel[posicao_movel].material[t].nomeMaterial);
                                materiaisTemp.material[materiaisTemp.contador].nomeMaterial = (char *) malloc(len * sizeof (char));
                                strcpy(materiaisTemp.material[materiaisTemp.contador].nomeMaterial, movel.movel[posicao_movel].material[t].nomeMaterial);
                                len = strlen(movel.movel[posicao_movel].material[t].unidade);
                                materiaisTemp.material[materiaisTemp.contador].unidade = (char *) malloc(len * sizeof (char));
                                strcpy(materiaisTemp.material[materiaisTemp.contador].unidade, movel.movel[posicao_movel].material[t].unidade);
                                strcpy(materiaisTemp.material[materiaisTemp.contador].codigoMaterial, movel.movel[posicao_movel].material[t].codigoMaterial);
                                materiaisTemp.material[materiaisTemp.contador].contador = movel.movel[posicao_movel].material[t].contador * encomendas.encomenda[i].movelEncomenda[j].quantidade;
                                materiaisTemp.contador++;
                            }
                        }
                    }
                }
            }
        }

        escreverFicheiroMateriaisSemana(materiaisTemp, ficheiro, FICHEIRO_MATERIAIS_SEMANA, data1.dia, data1.mes, data1.ano, data2.dia, data2.mes, data2.ano);
    }
    for (int i = 0; i < materiaisTemp.contador; i++) {
        free(materiaisTemp.material[i].nomeMaterial);
        free(materiaisTemp.material[i].unidade);
    }
    free(materiaisTemp.material);
}

/**
 * Esta função limpa a struct auxiliar do tipo Encomenda
 *
 * @param encomendaTemp Struct que contém informação sobre uma encomenda
 *
 * Esta função limpa os dados da struct temporária, libertando assim memoria.
 */
void limparEncomendaTemp(Encomenda *encomendaTemp) {
    encomendaTemp->numeroCliente = -1;
    encomendaTemp->preco = -1;
    encomendaTemp->data.dia = -1;
    encomendaTemp->data.mes = -1;
    encomendaTemp->data.ano = -1;
    for (int i = 0; i < encomendaTemp->contador; i++) {
        strcpy(encomendaTemp->movelEncomenda[i].codigoProduto, "000000");
        encomendaTemp->movelEncomenda[i].quantidade = -1;
    }
    encomendaTemp->contador = 0;
    free(encomendaTemp->movelEncomenda);
}

/**
 * Função que lista o top 5 de materiais mais usados
 *
 * @param materiais Struct que contém todos os materiais
 * @param moveis Struct que contém todos os móveis
 * 
 * Esta função faz um loop pela struct materiais e coloca os 5 materiais mais usados num array
 * De seguida estes são listados.
 */
void top5MateriaisMaisUsados(Materiais materiais) {
    int len;
    int contadorMateriais[5];
    char codigoMateriais[5][TAMANHO_CODIGO_MATERIAL];

    for (int i = 0; i < 5; i++) {
        contadorMateriais[i] = 0;
        strcpy(codigoMateriais[i], "00000");
    }

    for (int i = 0; i < materiais.contador; i++) {
        for (int j = 0; j < 5; j++) {
            if (materiais.material[i].contador > contadorMateriais[j]) {
                for (int n = 4; n > j; n--) {
                    contadorMateriais[n] = contadorMateriais[n - 1];
                    strcpy(codigoMateriais[n], codigoMateriais[n - 1]);
                }
                contadorMateriais[j] = materiais.material[i].contador;
                strcpy(codigoMateriais[j], materiais.material[i].codigoMaterial);
                break;
            }
        }
    }



    printf("Top 5 materiais mais usados:\n");
    for (int i = 0; i < 5; i++) {
        if (strcmp(codigoMateriais[i], "00000") != 0) {
            int pos = posMaterial(materiais, codigoMateriais[i]);
            printf("%d - %s (%s)\n", i + 1, materiais.material[pos].nomeMaterial, materiais.material[pos].codigoMaterial);
        }
    }
}

/**
 * Função que lê o ficheiro das encomendas
 *
 * @param encomendas Struct que vai conter todos as encomendas
 * @param fEncomendas Apontador que aponta para o ficheiro
 * @param nomeFicheiro Variável que contém o nome do ficheiro
 *
 * Esta função vai abrir o ficheiro para leitura, de seguida lê a primeira linha que corresponde ao numero
 * de encomendas que vao ser lidas, possiblitando assim alocar o espaco necessario, e de realcar que a funcao nao aloca
 * apenas o espaco necessario mas sim a dezena mais proxima, por exemplo, ser a funcao ler 24 vai alocar 30 espacos.
 * Continua entao a ler o ficheiro, cada encomenda vai conter na primeira linha os dados da encomenda, e nas linhas abaixo vao estar
 * os codigos dos produtos referentes a respetiva encomenda.
 */
void lerFicheiroEncomendas(Encomendas *encomendas, FILE *fEncomendas, char *nomeFicheiro) {
    int i = 0, tamanho;

    fEncomendas = fopen(nomeFicheiro, "r");

    fscanf(fEncomendas, "%d\n", &encomendas->contador);

    if (encomendas->contador < 10) {
        encomendas->encomenda = (Encomenda *) malloc(INCREMENTO * sizeof (Encomenda));
    } else {
        tamanho = encomendas->contador / 10;
        tamanho++;
        encomendas->encomenda = (Encomenda *) malloc((INCREMENTO * tamanho) * sizeof (Encomenda));
    }

    while (!feof(fEncomendas)) {
        fscanf(fEncomendas, "%d;%d;%f;%d/%d/%d;%d/%d/%d\n", &encomendas->encomenda[i].numeroCliente,
                &encomendas->encomenda[i].contador, &encomendas->encomenda[i].preco,
                &encomendas->encomenda[i].data.dia, &encomendas->encomenda[i].data.mes, &encomendas->encomenda[i].data.ano,
                &encomendas->encomenda[i].dataEntrega.dia, &encomendas->encomenda[i].dataEntrega.mes, &encomendas->encomenda[i].dataEntrega.ano);
        encomendas->encomenda[i].movelEncomenda = (MovelEncomenda *) malloc(encomendas->encomenda[i].contador * sizeof (MovelEncomenda));
        for (int j = 0; j < encomendas->encomenda[i].contador; j++) {
            fscanf(fEncomendas, "%[^;];%d\n", encomendas->encomenda[i].movelEncomenda[j].codigoProduto,
                    &encomendas->encomenda[i].movelEncomenda[j].quantidade);
        }
        i++;
    }

    fclose(fEncomendas);
}

/**
 * Funcao que le o ficheiro das encomendas
 *
 * @param encomendas Struct que contem todos as encomendas
 * @param fEncomendas Apontador que aponta para o ficheiro
 * @param nomeFicheiro Variável que contém o nome do ficheiro
 *
 * Esta funcao vai abrir o ficheiro para escrita, de seguida escreve a primeira linha que corresponde ao numero
 * de encomendas existentes.
 * Continua entao a escrever no ficheiro, cada encomenda vai conter na primeira linha os dados da encomenda, e nas linhas abaixo vao estar
 * os codigos dos produtos referentes a respetiva encomenda.
 */
void escreverFicheiroEncomendas(Encomendas encomendas, FILE *fEncomendas, char *nomeFicheiro) {
    fEncomendas = fopen(nomeFicheiro, "w");

    fprintf(fEncomendas, "%d\n", encomendas.contador);

    for (int i = 0; i < encomendas.contador; i++) {
        fprintf(fEncomendas, "%d;%d;%.2f;%d/%d/%d;%d/%d/%d\n", encomendas.encomenda[i].numeroCliente,
                encomendas.encomenda[i].contador, encomendas.encomenda[i].preco,
                encomendas.encomenda[i].data.dia, encomendas.encomenda[i].data.mes, encomendas.encomenda[i].data.ano,
                encomendas.encomenda[i].dataEntrega.dia, encomendas.encomenda[i].dataEntrega.mes, encomendas.encomenda[i].dataEntrega.ano);
        for (int j = 0; j < encomendas.encomenda[i].contador; j++) {
            fprintf(fEncomendas, "%s;%d\n", encomendas.encomenda[i].movelEncomenda[j].codigoProduto,
                    encomendas.encomenda[i].movelEncomenda[j].quantidade);
        }
    }

    fclose(fEncomendas);
}

/**
 * Função que verifica se o móvel já foi encomendado
 *
 * @param encomenda Struct que contém todas as encomendas
 * @param movel Struct que contém todos os móveis
 * @param posMovel Variável que guarda a posição do móvel na struct móveis
 * @return Retorna 1 caso o móvel tenha sido encomendado e retorna 0 caso contrário
 *
 * Esta função faz um loop por todas as encomendas e caso o código do móvel a obsrevar seja igual ao código do móvel associado à encomenda
 * retorna-se o valor 1, dizendo assim que a condição se confirmou
 */
int verificarEncomendasMovel(Encomendas encomenda, Moveis movel, int posMovel) {
    int valor = 0;
    for (int i = 0; i < encomenda.contador; i++) {
        for (int j = 0; j < encomenda.encomenda[i].contador; j++) {
            if (strcmp(movel.movel[posMovel].codigoProduto, encomenda.encomenda[i].movelEncomenda[j].codigoProduto) == 0) {
                valor = 1;
            }
        }
    }
    return valor;
}
