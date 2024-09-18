/*
 * @file   moveis.c
 * @author Grupo 100
 *
 * @date 16 dezembro 2022
 * @brief Ficheiro source de moveis
 *
 *
 *
 * Ficheiro que contém todos os conteúdos necessários à utilização de moveis
 *
 */

#include "moveis.h"

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "encomenda.h"
#include "input.h"
#include "perfil.h"

/**
 * Função que verifica se o material existe ou não
 *
 * @param materiais  Struct que contém todos os materiais
 * @param codigoMaterial Variável que contém o codigo de material a ser comparado
 * @return true se encontar uma correspondência, false se nao encontrar
 *
 * Esta função irá fazer um loop pela Struct Materiais ate encontrar, se encontrar, uma correspondência com o codigo
 * de material fornecido
 */
bool codigoExistenteMateriais(Materiais materiais, char codigoMaterial[TAMANHO_CODIGO_MATERIAL]) {
    int pos = materiais.contador;

    for (int i = 0; i < pos; i++) {
        if (strcmp(materiais.material[i].codigoMaterial, codigoMaterial) == 0) {
            return true;
        }
    }

    return false;
}

/**
 * Função que verifica se o material existe ou não
 *
 * @param moveis  Struct que contém todos os moveis
 * @param codigoProduto Variável que contém o codigo do movel a ser comparado
 * @return true se encontar uma correspondência, false se nao encontrar
 *
 * Esta função irá fazer um loop pela Struct Moveis ate encontrar, se encontrar, uma correspondência com o codigo
 * do Movel.
 */
bool codigoExistenteMovel(Moveis moveis, char codigoProduto[TAMANHO_CODIGO_MOVEL]) {
    int pos = moveis.contador;

    for (int i = 0; i < pos; i++) {
        if (strcmp(moveis.movel[i].codigoProduto, codigoProduto) == 0) {
            return true;
        }
    }

    return false;
}

/**
 * Função que cria um movel
 *
 * @param moveis  Struct que contém todos os móveis (parâmetro que receberá o móvel criado)
 * @param materiais Struct que contém todos os materiais
 * @param nome Variável que contém o nome do móvel
 * @param preco Variável que contém comprimento do móvel
 * @param largura Variável que contém a largura do móvel
 * @param altura Variável que contém a altura do móvel
 * @param codigoProduto Variável que contém o código do produto do móvel
 *
 * Esta função irá copiar para a struct "Moveis" os dados fornecidos como argumentos, estes dados foram introduzidos previamente na main.
 */
void criarMovel(Moveis *moveis, Materiais materiais, char *nome, float preco, float comprimento, float largura, float altura, char codigoProduto[TAMANHO_CODIGO_MOVEL]) {
    int pos = moveis->contador, len;

    if (pos == 0) {
        moveis->movel = (Movel *) malloc((INCREMENTO) * sizeof (Movel));
    } else {
        if (pos % 10 == 0) {
            moveis->movel = (Movel *) realloc(moveis->movel, (pos + INCREMENTO) * sizeof (Movel));
        }
    }

    moveis->movel[pos].comprimento = comprimento;
    moveis->movel[pos].largura = largura;
    moveis->movel[pos].altura = altura;
    moveis->movel[pos].preco = preco;
    moveis->movel[pos].contadorMateriais = materiais.contador;
    moveis->movel[pos].estado = ATIVO;

    strcpy(moveis->movel[pos].codigoProduto, codigoProduto);
    len = strlen(nome);
    moveis->movel[pos].nome = (char *) malloc((len + 1) * sizeof (char));
    strcpy(moveis->movel[pos].nome, nome);
    moveis->movel[pos].material = (Material *) malloc(materiais.contador * sizeof (Material));
    for (int i = 0; i < materiais.contador; i++) {
        moveis->movel[pos].material[i].contador = materiais.material[i].contador;
        strcpy(moveis->movel[pos].material[i].codigoMaterial, materiais.material[i].codigoMaterial);
        len = strlen(materiais.material[i].nomeMaterial);
        moveis->movel[pos].material[i].nomeMaterial = (char *) malloc(len * sizeof (char));
        strcpy(moveis->movel[pos].material[i].nomeMaterial, materiais.material[i].nomeMaterial);
        len = strlen(materiais.material[i].unidade);
        moveis->movel[pos].material[i].unidade = (char *) malloc(len * sizeof (char));
        strcpy(moveis->movel[pos].material[i].unidade, materiais.material[i].unidade);
    }
    moveis->contador++;
}

/**
 * Função que limpa os materiais
 *
 * @param materiais Struct do tipo Materiais que o utilizador quer limpar
 *
 * Esta função limpa a Struct materiais dada pelo utilizador como parametro.
 */
void limparMateriais(Materiais *materiais) {
    int tamanho = materiais->contador;

    for (int i = 0; i < tamanho; i++) {
        free(materiais->material[i].nomeMaterial);
        free(materiais->material[i].unidade);
        materiais->material[i].contador = -1;
        strcpy(materiais->material[i].codigoMaterial, "00000");
    }

    materiais->contador = -1;
}

/**
 * Função que retorna a posição de um material
 *
 * @param materiais Struct que contém todos os materiais
 * @param codigoMateriais Variável que contém o código de material a ser comparado
 * @return A posição do material com o codigo de produto dado, caso existente, caso contrario retorna -1
 *
 * Esta função faz um loop pelos materiais ate encontrar uma correspondência de codigo de produto.
 */
int posMaterial(Materiais materiais, char codigoMaterial[TAMANHO_CODIGO_MATERIAL]) {
    int tamanho = materiais.contador;
    for (int i = 0; i < tamanho; i++) {
        if (strcmp(materiais.material[i].codigoMaterial, codigoMaterial) == 0) {
            return i;
        }
    }
    return -1;
}

/**
 * Função que lista os moveis
 *
 * @param moveis Struct que contém todos os moveis
 *
 * Esta função da output a todos os moveis.
 */
void listarMovel(Moveis moveis) {
    int i, j;
    linha();
    for (i = 0; i < moveis.contador; i++) {
        printf("Movel %d\n", i + 1);
        printf("Nome movel: %s\n", moveis.movel[i].nome);
        printf("codigo prduto: %s\n", moveis.movel[i].codigoProduto);
        printf("Dimensoes:%.1lfx%.1lfx%.1lf\n", moveis.movel[i].comprimento, moveis.movel[i].largura,
                moveis.movel[i].altura);
        printf("Preco: %.2f\n", moveis.movel[i].preco);
        printf("Material:\n");
        for (j = 0; j < moveis.movel[i].contadorMateriais; j++) {
            printf("%s\n", moveis.movel[i].material[j].nomeMaterial);
            printf("Codigo material:%s\n", moveis.movel[i].material[j].codigoMaterial);
            printf("Quantidade: %d %s\n", moveis.movel[i].material[j].contador, moveis.movel[i].material[j].unidade);
        }
        linha();
    }
}

/**
 * Função que encontra a posição do móvel
 *
 * @param moveis Struct que contém todos os moveis
 * @param codigoProduto Variável que contém o codigo de produto a ser comparado
 * @return A posição do movel com o codigo de produto dado, caso existente, caso contrario retorna -1
 *
 * Esta função faz um loop pelos moveis ate encontrar uma correspondência de codigo de produto.
 */
int verificarMovel(Moveis moveis, char codigoProduto[TAMANHO_CODIGO_MOVEL]) {
    for (int i = 0; i < moveis.contador; i++) {
        if (strcmp(moveis.movel[i].codigoProduto, codigoProduto) == 0) {
            return i;
        }
    }
    return -1;
}

/**
 * Função que encontra a posição do material no móvel
 *
 * @param moveis Struct que contém todos os moveis
 * @param posicao Variável que contém a posição do movel
 * @param codigoProduto Variável que contém o codigo de produto a ser comparado
 * @return A posição do mateiral com o codigo de produto dado, caso existente, caso contrario retorna -1
 *
 * Esta função faz um loop pelos materiais do móvel na posição dada como parametro ate encontrar uma correspondência
 * de codigo de produto.
 */
int verificarMaterial(Moveis moveis, int posicao, char codigoProduto[TAMANHO_CODIGO_MATERIAL]) {
    int numero_materiais = moveis.movel[posicao].contadorMateriais, i;
    for (i = 0; i < numero_materiais; i++) {
        if (strcmp(moveis.movel[posicao].material[i].codigoMaterial, codigoProduto) == 0) {
            return i;
        }
    }
    return -1;
}

/**
 * Função que elimina um móvel
 *
 * @param moveis Struct que contém todos os moveis
 * @param codigoProduto Variável que contém o codigo de produto a ser eliminado
 *
 * Esta função vai fazer loop pelos materiais a começar na posição do material a ser eliminado.
 * De seguida vai copiar os dados do movel seguinte para o movel atual (caso o movel nao se encontre na ultima posição), deixando
 * assim o último material com dados descartáveis.
 * Por fim, limpamos a última posição e reduzimos ao contador de móveis.
 */
void eliminarMovel(Moveis *moveis, char codigoProduto[TAMANHO_CODIGO_MOVEL]) {
    int pos = verificarMovel((*moveis), codigoProduto);
    int tamanho = (*moveis).contador - 1;
    int tamanho_nome;
    int len;

    if (pos == -1) {
        printf(MOVEL_INEXISTENTE);
    } else {
        if (pos != tamanho) {
            for (int i = pos; i < tamanho; i++) {
                len = strlen((*moveis).movel[i + 1].nome);
                (*moveis).movel[i].nome = (char *) realloc((*moveis).movel[i].nome, len * sizeof (char));
                strcpy((*moveis).movel[i].nome, (*moveis).movel[i + 1].nome);
                (*moveis).movel[i].preco = (*moveis).movel[i + 1].preco;
                strcpy((*moveis).movel[i].codigoProduto, (*moveis).movel[i + 1].codigoProduto);
                (*moveis).movel[i].comprimento = (*moveis).movel[i + 1].comprimento;
                (*moveis).movel[i].largura = (*moveis).movel[i + 1].largura;
                (*moveis).movel[i].altura = (*moveis).movel[i + 1].altura;
                (*moveis).movel[i].estado = (*moveis).movel[i + 1].estado;
                (*moveis).movel[i].contadorMateriais = (*moveis).movel[i + 1].contadorMateriais;
                len = (*moveis).movel[i + 1].contadorMateriais;
                (*moveis).movel[i].material = (Material *) realloc((*moveis).movel[i].material, len * sizeof (Material));
                for (int j = 0; j < len; j++) {
                    tamanho_nome = strlen((*moveis).movel[i + 1].material[j].nomeMaterial);
                    (*moveis).movel[i].material[j].nomeMaterial = (char *) realloc((*moveis).movel[i].material[j].nomeMaterial, tamanho_nome * sizeof (char));
                    strcpy((*moveis).movel[i].material[j].nomeMaterial, (*moveis).movel[i + 1].material[j].nomeMaterial);
                    len = strlen(moveis->movel[i + 1].material[j].unidade);
                    moveis->movel[i].material[j].unidade = (char *) realloc(moveis->movel[i].material[j].unidade, (len + 1) * sizeof (char));
                    strcpy(moveis->movel[i].material[j].unidade, moveis->movel[i].material[j].unidade);
                    strcpy((*moveis).movel[i].material[j].codigoMaterial, (*moveis).movel[i + 1].material[j].codigoMaterial);
                    (*moveis).movel[i].material[j].contador = (*moveis).movel[i + 1].material[j].contador;
                }
            }
        }
        free((*moveis).movel[tamanho].nome);
        len = (*moveis).movel[tamanho].contadorMateriais;
        for (int j = 0; j < len; j++) {
            free((*moveis).movel[tamanho].material[j].nomeMaterial);
            free(moveis->movel[tamanho].material[j].unidade);
            (*moveis).movel[tamanho].material[j].contador = -1;
            strcpy((*moveis).movel[tamanho].material[j].codigoMaterial, "000000");
        }
        free((*moveis).movel[tamanho].material);
        (*moveis).movel[tamanho].preco = -1;
        (*moveis).movel[tamanho].comprimento = -1;
        (*moveis).movel[tamanho].largura = -1;
        (*moveis).movel[tamanho].altura = -1;
        (*moveis).movel[tamanho].estado = -1;
        (*moveis).movel[tamanho].contadorMateriais = 0;
        strcpy((*moveis).movel[tamanho].codigoProduto, "00000");
        (*moveis).contador--;
    }
}

/**
 * Função que lê o ficheiro dos materiais
 *
 * @param materiais Struct que vai conter todos os materiais
 * @param fMateriais Apontador que aponta para o ficheiro
 * @param nMateriais Variável que contém o numero de materiais que vao ser lidos
 * @param nomeFicheiro Variável que contém o nome do ficheiro
 *
 * Esta função vai abrir o ficheiro para leitura, de seguida vai ler os campos dos de todos os materiais para dentro da struct
 * Materiais (cada campo é separado por ";" e cada linha corresponde a um material) ate chegar ao fim do ficheiro.
 */
void lerFicheiroMateriais(Materiais *materiais, FILE *fMateriais, int nMateriais, char *nomeFicheiro) {
    int i = 0, len;
    int tamanhoBuffer = 1000;

    fMateriais = fopen(nomeFicheiro, "r");

    materiais->material = (Material *) malloc(nMateriais * sizeof (Material));

    while (!feof(fMateriais)) {
        materiais->material[i].nomeMaterial = (char *) malloc(tamanhoBuffer * sizeof (char));
        materiais->material[i].unidade = (char *) malloc(tamanhoBuffer * sizeof (char));
        fscanf(fMateriais, "%[^;];%[^;];%d;%[^\n]\n", materiais->material[i].codigoMaterial, materiais->material[i].nomeMaterial, &materiais->material[i].contador, materiais->material[i].unidade);
        len = strlen(materiais->material[i].nomeMaterial);
        materiais->material[i].nomeMaterial = (char *) realloc(materiais->material[i].nomeMaterial, (len + 1) * sizeof (char));

        len = strlen(materiais->material[i].unidade);
        materiais->material[i].unidade = (char *) realloc(materiais->material[i].unidade, (len + 1) * sizeof (char));

        i++;
    }

    fclose(fMateriais);
}

/**
 * Função que le o ficheiro dos materiais
 *
 * @param materiais Struct que contém todos os materiais
 * @param fMateriais Apontador que aponta para o ficheiro em que vamos escrever
 * @param nomeFicheiro Variável que contém o nome do ficheiro
 *
 * Esta função vai abrir o ficheiro para escrita e vai escrever todos os campos de todos os materiais da Struct Materiais
 * para dentro do ficheiro (cada campo é separado por ";" e cada linha corresponde a um material).
 */
void escreverFicheiroMateriais(Materiais materiais, FILE *fMateriais, char *nomeFicheiro) {
    fMateriais = fopen(nomeFicheiro, "w");

    for (int i = 0; i < materiais.contador; i++) {
        fprintf(fMateriais, "%s;%s;%d;%s\n", materiais.material[i].codigoMaterial, materiais.material[i].nomeMaterial, materiais.material[i].contador, materiais.material[i].unidade);
    }

    fclose(fMateriais);
}

/**
 * Função que edita o nome do movel
 *
 * @param nome Variável que contém o nome do móvel
 * @param resultado Variável que contém a posição do móvel
 * @param moveis Struct que contém todos os móveis
 *
 * Esta função recebe os dados da main e copia para a Struct "moveis"
 */
void editarNomeMovel(char *nome, int resultado, Moveis *moveis) {
    int len;
    len = strlen(nome);
    moveis->movel[resultado].nome = (char *) realloc(moveis->movel[resultado].nome, len * sizeof (char));
    strcpy(moveis->movel[resultado].nome, nome);
}

/**
 * Função que edita o código do móvel
 *
 * @param codigoProduto Variável que contém o código do móvel
 * @param resultado Variável que contém a posição do móvel
 * @param moveis Struct que contém todos os móveis
 *
 * Esta função recebe os dados da main e copia para a Struct "moveis"
 */
void editarCodigoMovel(char codigoProduto[TAMANHO_CODIGO_MOVEL], int resultado, Moveis *moveis) {
    strcpy(moveis->movel[resultado].codigoProduto, codigoProduto);
}

/**
 * Função que edita as dimensoes do móvel
 *
 * @param comprimento Variável que contém o comprimento do móvel
 * @param largura Variável que contém a largura do móvel
 * @param altura Variável que contém a altura do móvel
 * @param resultado Variável que contém a posição do móvel
 * @param moveis Struct que contém todos os móveis
 *
 * Esta função recebe os dados da main e copia para a Struct "moveis"
 */
void alterarDimensoesMovel(float comprimento, float largura, float altura, int resultado, Moveis *moveis) {
    moveis->movel[resultado].comprimento = comprimento;
    moveis->movel[resultado].largura = largura;
    moveis->movel[resultado].altura = altura;
}

/**
 * Função que edita o preço do móvel
 *
 * @param preco Variável que contém o preço do móvel
 * @param resultado Variável que contém a posição do móvel
 * @param moveis Struct que contém todos os móveis
 *
 * Esta função recebe os dados da main e copia para a Struct "moveis"
 */
void editarPrecoMovel(float preco, int resultado, Moveis *moveis) {
    moveis->movel[resultado].preco = preco;
}

/**
 * Função que adiciona um material ao móvel
 *
 * @param movel Struct que contém todos os móveis
 * @param material Struct que contém todos os materiais
 * @param quantidade Variável que recebe quantidade nova do novo móvel
 * @param numMovel Variável que contém a posição do móvel na Struct Moveis
 * @param numMaterial Variável que contém a posição do material na Struct Materiais
 *
 * Esta função começa por aumentar o espaço de memória dos materiais e de seguida copia todos os detalhes
 * do mateirla da Struct Materiais para dentro do material específico ao móvel dentro da Struct Moveis.
 */
void adicionarMaterialMovel(Moveis *movel, Materiais material, int quantidade, int numMovel, int numMaterial) {
    int len;
    int num = movel->movel[numMovel].contadorMateriais;
    movel->movel[numMovel].material = (Material *) realloc(movel->movel[numMovel].material, (num + 1) * sizeof (Material));
    movel->movel[numMovel].material[num].contador = quantidade;
    strcpy(movel->movel[numMovel].material[num].codigoMaterial, material.material[numMaterial].codigoMaterial);

    len = strlen(material.material[numMaterial].nomeMaterial);
    movel->movel[numMovel].material[num].nomeMaterial = (char *) malloc(len * sizeof (char));
    strcpy(movel->movel[numMovel].material[num].nomeMaterial, material.material[numMaterial].nomeMaterial);
    len = strlen(material.material[numMaterial].unidade);
    movel->movel[numMovel].material[num].unidade = (char *) malloc(len * sizeof (char));
    strcpy(movel->movel[numMovel].material[num].unidade, material.material[numMaterial].unidade);
    movel->movel[numMovel].contadorMateriais++;
}

/**
 * Função que conta os móveis escritos no ficheiro
 *
 * @param fMoveis Apontador que aponta para o ficheiro
 * @param nomeFicheiro Variável que contém o nome do ficheiro
 * @return A quantidade de móveis a ler do ficheiro
 *
 * Esta função abre o ficheiro para leitura.
 * Começa por passar a frente a primeira linha do ficheiro, visto que é apenas a ordem dos conteúdos presentes nos ficheiros.
 * De seguida a função vai adicionar a um contador o número de vezes que uma linha que não começa por ";" aparece,
 * indicador que é a linha de um novo móvel.
 */
int contarMoveis(FILE *fMoveis, char *nomeFicheiro) {
    fMoveis = fopen(nomeFicheiro, "r");

    char conta;
    int nMoveis = 0;

    fscanf(fMoveis, "%*[^\n]\n");

    while (!feof(fMoveis)) {
        char linha[1000];
        fscanf(fMoveis, "%[^\n]\n", linha);
        conta = linha[0];

        if (conta != ';') {
            nMoveis++;
        }
    }

    fclose(fMoveis);

    return nMoveis;
}

/**
 * Função que lê o ficheiro dos móveis
 *
 * @param moveis Struct que vai conter todos os móveis
 * @param fMoveis Apontador que aponta para o ficheiro
 * @param nomeFicheiro Variável que contém o nome do ficheiro
 *
 * Esta função vai abrir o ficheiro para leitura (ignorando a primeira linha), de seguida vai ler os campos do móvel para dentro da struct
 * Móveis (cada campo é separado por ";" e cada linha corresponde a um móvel), de seguida faz um loop pelos
 * materiais do móvel (cada campo é separado por ";" e cada linha corresponde a um material), realiza depois todas
 * estas ações em loop até ao fim do ficheiro.
 */
void lerFicheiroMoveis(Moveis *moveis, FILE *fMoveis, char *nomeFicheiro) {
    int i = 0, len, tamanho;
    int tamanhoBuffer = 1000;

    fMoveis = fopen(nomeFicheiro, "r");

    fscanf(fMoveis, "%*[^\n]\n");

    if (moveis->contador < 10) {
        moveis->movel = (Movel *) malloc(INCREMENTO * sizeof (Movel));
    } else {
        tamanho = moveis->contador / 10;
        tamanho++;
        moveis->movel = (Movel *) malloc((INCREMENTO * tamanho) * sizeof (Movel));
    }

    while (!feof(fMoveis)) {
        moveis->movel[i].material = (Material *) malloc(1 * sizeof (Material));

        moveis->movel[i].nome = (char *) malloc(tamanhoBuffer * sizeof (char));
        moveis->movel[i].material[0].nomeMaterial = (char *) malloc(tamanhoBuffer * sizeof (char));
        moveis->movel[i].material[0].unidade = (char *) malloc(tamanhoBuffer * sizeof (char));

        fscanf(fMoveis, "%[^;];%[^;];%fx%fx%f;%f;%d;%d;%[^;];%[^;];%d;%[^\n]\n", moveis->movel[i].codigoProduto,
                moveis->movel[i].nome, &moveis->movel[i].comprimento, &moveis->movel[i].largura, &moveis->movel[i].altura,
                &moveis->movel[i].preco, &moveis->movel[i].contadorMateriais, &moveis->movel[i].estado, moveis->movel[i].material[0].codigoMaterial, moveis->movel[i].material[0].nomeMaterial,
                &moveis->movel[i].material[0].contador, moveis->movel[i].material[0].unidade);

        len = strlen(moveis->movel[i].nome);
        moveis->movel[i].nome = (char *) realloc(moveis->movel[i].nome, (len + 1) * sizeof (char));

        len = strlen(moveis->movel[i].material[0].nomeMaterial);
        moveis->movel[i].material[0].nomeMaterial = (char *) realloc(moveis->movel[i].material[0].nomeMaterial, (len + 1) * sizeof (char));

        len = strlen(moveis->movel[i].material[0].unidade);
        moveis->movel[i].material[0].unidade = (char *) realloc(moveis->movel[i].material[0].unidade, (len + 1) * sizeof (char));

        moveis->movel[i].material = (Material *) realloc(moveis->movel[i].material, moveis->movel[i].contadorMateriais * sizeof (Material));

        for (int j = 1; j < moveis->movel[i].contadorMateriais; j++) {
            moveis->movel[i].material[j].nomeMaterial = (char *) malloc(tamanhoBuffer * sizeof (char));
            moveis->movel[i].material[j].unidade = (char *) malloc(tamanhoBuffer * sizeof (char));

            fscanf(fMoveis, ";;;;%[^;];%[^;];%d;%[^\n]\n", moveis->movel[i].material[j].codigoMaterial,
                    moveis->movel[i].material[j].nomeMaterial, &moveis->movel[i].material[j].contador, moveis->movel[i].material[j].unidade);

            len = strlen(moveis->movel[i].material[j].nomeMaterial);
            moveis->movel[i].material[j].nomeMaterial = (char *) realloc(moveis->movel[i].material[j].nomeMaterial, (len + 1) * sizeof (char));

            len = strlen(moveis->movel[i].material[j].unidade);
            moveis->movel[i].material[j].unidade = (char *) realloc(moveis->movel[i].material[j].unidade, (len + 1) * sizeof (char));
        }

        i++;
    }

    fclose(fMoveis);
}

/**
 * Função que escreve no ficheiro móveis
 *
 * @param moveis Struct que contém todos os móveis
 * @param fMoveis Apontador que aponta para o ficheiro
 * @param nomeFicheiro Variável que contém o nome do ficheiro
 *
 * Esta função começa por escrever na primeira linha a ordem dos conteúdos escritos no ficheiro.
 * De seguida escreve todos os campos do móvel pela ordem descrita na primeira linha (cada campo é separado por ";" e cada linha corresponde a um móvel),
 * após isso faz um loop pelo número de materiais do móvel e escreve-os (cada campo é separado por ";" e cada linha corresponde a um móvel).
 * Realiza depois estas operações em loop.
 */
void escreverFicheiroMovel(Moveis moveis, FILE *fMoveis, char *nomeFicheiro) {
    fMoveis = fopen(nomeFicheiro, "w");

    fprintf(fMoveis, "Cod_Produto;Produto;Dimensoes;Preco;Cont_Materiais;Estado;Cod_Material;Descricao;Quantidade;Unidade\n");
    for (int i = 0; i < moveis.contador; i++) {
        fprintf(fMoveis, "%s;%s;%.2fx%.2fx%.2f;%.2f;%d;%d;%s;%s;%d;%s\n", moveis.movel[i].codigoProduto, moveis.movel[i].nome,
                moveis.movel[i].comprimento, moveis.movel[i].largura, moveis.movel[i].altura, moveis.movel[i].preco, moveis.movel[i].contadorMateriais, moveis.movel[i].estado,
                moveis.movel[i].material[0].codigoMaterial, moveis.movel[i].material[0].nomeMaterial, moveis.movel[i].material[0].contador, moveis.movel[i].material[0].unidade);

        for (int j = 1; j < moveis.movel[i].contadorMateriais; j++) {
            fprintf(fMoveis, ";;;;%s;%s;%d;%s\n", moveis.movel[i].material[j].codigoMaterial, moveis.movel[i].material[j].nomeMaterial,
                    moveis.movel[i].material[j].contador, moveis.movel[i].material[j].unidade);
        }
    }
    fclose(fMoveis);
}

/**
 * Função que cria um material
 *
 * @param materiais  Struct que contém todos os materiais (parâmetro que receberá o material criado)
 * @param nome Variável que contém o nome do aterial
 * @param codigoMaterial Variável que contém o código do produto do material
 *
 * Esta função irá copiar para a struct "materaiis" os dados fornecidos como argumentos, estes dados foram introduzidos previamente na main.
 */
void criarMaterial(Materiais *materiais, char codigoMaterial[TAMANHO_CODIGO_MATERIAL], char *nome, int unidade) {
    int pos = materiais->contador;
    int len;

    if (pos == 0) {
        materiais->material = (Material *) malloc(INCREMENTO * sizeof (Material));
    } else {
        if (pos % 10 == 0) {
            materiais->material = (Material *) realloc(materiais->material, (pos + INCREMENTO) * sizeof (Material));
        }
    }
    strcpy(materiais->material[pos].codigoMaterial, codigoMaterial);
    len = strlen(nome);
    materiais->material[pos].nomeMaterial = (char *) malloc((len + 1) * sizeof (char));
    strcpy(materiais->material[pos].nomeMaterial, nome);

    if (unidade == 0) {
        materiais->material[pos].unidade = (char *) malloc(3 * sizeof (char));
        strcpy(materiais->material[pos].unidade, "PAR");
    } else {
        materiais->material[pos].unidade = (char *) malloc(2 * sizeof (char));
        strcpy(materiais->material[pos].unidade, "UN");
    }

    materiais->material[pos].contador = 0;
    materiais->contador++;
}

/**
 * Função que edita a quantidade
 *
 * @param movel Struct que contém todos os móveis
 * @param quantidade Variável que contém a quantidade nova do mateiral
 * @param numMovel Variável que contém a posição do móvel ao qual vamos alterar a quantidade do material
 * @param numMaterial Variável que contém a posição do material do móvel que vamos alterar
 *
 * Esta função recebe os dados da main e copia para a Struct "movel"
 */
void editarQuantidadeMovel(Moveis *movel, int quantidade, int numMovel, int numMaterial) {
    movel->movel[numMovel].material[numMaterial].contador = quantidade;
}

/**
 * Função que elimina um material de um móvel específico
 *
 * @param movel Struct que contém todos os móveis
 * @param numMovel Variável que contém a posição do móvel ao qual vamos eliminar um material
 * @param numMaterial Variável que contém a posição do material do móvel que vamos eliminar
 *
 * Esta função faz um loop dentro dos materiais do móvel na posição "numMovel" começando pela posição
 * do material a ser eliminado "numMaterial" e copia o material seguinte para o material atual,
 * deixando assim a ultima posição livre para ser "descartada", removemos depois 1 ao contador dos materiais
 * do móvel em questão
 */
void eliminarMaterialMovel(Moveis *movel, int numMovel, int numMaterial) {
    int len;
    int totalMateriais = movel->movel[numMovel].contadorMateriais - 1;
    if (numMaterial != movel->movel[numMovel].contadorMateriais) {
        for (int i = numMaterial; i < movel->movel[numMovel].contadorMateriais - 1; i++) {
            strcpy(movel->movel[numMovel].material[i].codigoMaterial, movel->movel[numMovel].material[i + 1].codigoMaterial);
            movel->movel[numMovel].material[i].contador = movel->movel[numMovel].material[i + 1].contador;
            len = strlen(movel->movel[numMovel].material[i + 1].nomeMaterial);
            movel->movel[numMovel].material[i].nomeMaterial = (char *) realloc(movel->movel[numMovel].material[i].nomeMaterial, (len + 1) * sizeof (char));
            len = strlen(movel->movel[numMovel].material[i + 1].unidade);
            movel->movel[numMovel].material[i].unidade = (char *) realloc(movel->movel[numMovel].material[i].unidade, (len + 1) * sizeof (char));
            strcpy(movel->movel[numMovel].material[i].unidade, movel->movel[numMovel].material[i + 1].unidade);
            strcpy(movel->movel[numMovel].material[i].nomeMaterial, movel->movel[numMovel].material[i + 1].nomeMaterial);
        }
    }
    strcpy(movel->movel[numMovel].material[totalMateriais].codigoMaterial, "00000");
    movel->movel[numMovel].material[totalMateriais].contador = 0;
    free(movel->movel[numMovel].material[totalMateriais].nomeMaterial);
    free(movel->movel[numMovel].material[totalMateriais].unidade);
    movel->movel[numMovel].contadorMateriais--;
}

/**
 * Função que lista todos os materiais
 *
 * @param material Struct que contém todos os materiais
 */
void listarMaterial(Materiais material) {
    for (int i = 0; i < material.contador; i++) {
        printf("%s - %s - %d - %s\n", material.material[i].nomeMaterial, material.material[i].codigoMaterial, material.material[i].contador, material.material[i].unidade);
    }
}

/**
 * Função que edita o nome do material
 *
 * @param material Struct que contém todos os materiais
 * @param resultado Variável que contém a posição do material a ser alterado
 * @param nome Variável que contém o novo nome do material
 *
 * Esta função recebe os dados da main e copia para a Struct "materiais"
 */
void editarNomeMaterial(Materiais *materiais, int resultado, char *nome) {
    int len;
    len = strlen(nome);
    materiais->material[resultado].nomeMaterial = (char *) realloc(materiais->material[resultado].nomeMaterial, len * sizeof (char));
    strcpy(materiais->material[resultado].nomeMaterial, nome);
}

/**
 * Função que edita o codigo de material
 *
 * @param material Struct que contém todos os materiais
 * @param resultado Variável que contém a posição do material a ser alterado
 * @param codigoMaterial Variável que contém o novo codigo de material
 *
 * Esta função recebe os dados da main e copia para a Struct "materiais"
 */
void editarCodigoMaterial(Materiais *materiais, int resultado, char codigoMaterial[TAMANHO_CODIGO_MATERIAL]) {
    strcpy(materiais->material[resultado].codigoMaterial, codigoMaterial);
}

/**
 * Função que edita o tipo de unidade do material
 *
 * @param material Struct que contém todos os materiais
 * @param resultado Variável que contém a posição do material a ser alterado
 *
 * Esta função troca a unidade para a única opção para além da selecionada, funciona como um interruptor
 */
void alterarTipoUnidade(Materiais *materiais, int resultado) {
    if (strcmp(materiais->material[resultado].unidade, "UN") == 0) {
        materiais->material[resultado].unidade = (char *) realloc(materiais->material[resultado].unidade, 4 * sizeof (char));
        strcpy(materiais->material[resultado].unidade, "PAR");
    } else {
        materiais->material[resultado].unidade = (char *) realloc(materiais->material[resultado].unidade, 3 * sizeof (char));
        strcpy(materiais->material[resultado].unidade, "UN");
    }
}

/**
 * Função que elimina um material
 *
 * @param materiais Struct que contém todos os materaiis
 * @param resultado Variável que contém a posição do material a ser eliminado
 *
 * Esta função faz um loop dentro dos materiais começando pela posição
 * do material a ser eliminado "resultado" e copia o material seguinte para o material atual,
 * deixando assim a ultima posição livre para ser "descartada", removemos depois 1 ao contador dos materiais
 */
void removerMaterial(Materiais *materiais, int resultado) {
    int tamanho = (*materiais).contador - 1;
    int len;

    if (resultado != tamanho) {
        for (int i = resultado; i < tamanho - 1; i++) {
            len = strlen((*materiais).material[i + 1].nomeMaterial);
            (*materiais).material[i].nomeMaterial = (char *) realloc((*materiais).material[i].nomeMaterial, (len + 1) * sizeof (char));
            strcpy((*materiais).material[i].nomeMaterial, (*materiais).material[i + 1].nomeMaterial);
            len = strlen((*materiais).material[i + 1].unidade);
            (*materiais).material[i].unidade = (char *) realloc((*materiais).material[i].unidade, (len + 1) * sizeof (char));
            strcpy((*materiais).material[i].unidade, (*materiais).material[i + 1].unidade);
            (*materiais).material[i].contador = (*materiais).material[i + 1].contador;
        }
    }
    free((*materiais).material[tamanho].unidade);
    free((*materiais).material[tamanho].nomeMaterial);
    (*materiais).material[tamanho].unidade = 0;
    strcpy(materiais->material[tamanho].codigoMaterial, "00000");
    (*materiais).contador--;
}

/**
 * Função que faz o top5 moveis com mais materiais distintos
 *
 * @param moveis Struct que contém todos os móveis
 *
 * A função percorre um loop por todos os móveis existentes, dentro desse loop é percorrido outro loop que passa os móveis com mais materiais diferentes para o array valores, de seguida estas são ordenados
 * de material mais usado para material menos usado. Por fim é dado um loop para dar print ao top 5
 */
void top5MoveisMaisMateriais(Moveis moveis) {
    int posicao_movel[5] = {-1, -1, -1, -1, -1};
    int valores[5] = {-1, -1, -1, -1, -1};

    for (int i = 0; i < moveis.contador; i++) {
        for (int j = 0; j < 5; j++) {
            if (moveis.movel[i].contadorMateriais > valores[j]) {
                for (int k = 4; k > j; k--) {
                    valores[k] = valores[k - 1];
                    posicao_movel[k] = posicao_movel[k - 1];
                }
                valores[j] = moveis.movel[i].contadorMateriais;
                posicao_movel[j] = i;
                break;
            }
        }
    }

    printf("Os 5 moveis com mais materiais sao:\n");
    for (int i = 0; i < 5; i++) {
        if (moveis.movel[posicao_movel[i]].nome != NULL && posicao_movel[i] != -1) {
            printf("%d. - %s (%s) com %d materiais\n", i + 1, moveis.movel[posicao_movel[i]].nome, moveis.movel[posicao_movel[i]].codigoProduto, valores[i]);
        }
    }
}

/**
 * Função que faz o top5 moveis mais caros
 *
 * @param moveis Struct que contém todos os móveis
 *
 * Esta função coloca os primeiros 5 móveis no array top 5 de seguida ela verifica todos os outros móveis para comparar o seu preço e assim descobrir os mais caros. Por fim os móveis
 * são ordenados do mais caro para o mais barato para depois o top 5 ser escrito por ordem
 */
void top5MoveisMaisCaros(Moveis moveis) {
    Movel top5[5];

    for (int i = 0; i < 5; i++) {
        top5[i].nome = NULL;
    }

    int contador = 0;

    for (int i = 0; i < moveis.contador; i++) {
        if (contador < 5) {
            top5[contador++] = moveis.movel[i];
        } else {
            for (int j = 0; j < 5; j++) {
                if (moveis.movel[i].preco > top5[j].preco) {
                    for (int k = 4; k > j; k--) {
                        top5[k] = top5[k - 1];
                    }
                    top5[j] = moveis.movel[i];
                    break;
                }
            }
        }
    }

    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < 4 - 1; j++) {
            if (top5[j].preco < top5[j + 1].preco) {
                Movel temp = top5[j];
                top5[j] = top5[j + 1];
                top5[j + 1] = temp;
            }
        }
    }
    printf("Os 5 moveis mais caros sao:\n");
    for (int i = 0; i < 5; i++) {
        if (top5[i].nome != NULL) {
            printf("%d. %s - %.2f\n", i + 1, top5[i].nome, top5[i].preco);
        }
    }
}

/**
 * Função que cria a ficha tecnica de um móvel
 *
 * @param moveis Struct que contém todos os móveis
 * @param codigoProduto Variável que contem o código do movel a exportar
 *
 * Esta função vai escrever no ficheiro o móvel e todos os materiais necessários a sua construção de modo a exportar
 * para um arquivo, preferencialmente, de texto
 */
void escreverFicheiroFichaTencicaMovel(Moveis moveis, char codigoProduto[TAMANHO_CODIGO_MOVEL]) {
    int pos;
    FILE *ficheiro;

    ficheiro = fopen(FICHEIRO_MOVEIS_FICHA_TECNICA, "w");

    pos = verificarMovel(moveis, codigoProduto);

    fprintf(ficheiro, "Ficha tecnica do movel: %s\n", moveis.movel[pos].nome);
    fprintf(ficheiro, "\n");
    fprintf(ficheiro, "Codigo de produto: %s\n", moveis.movel[pos].codigoProduto);
    fprintf(ficheiro, "Preco: %.2f\n", moveis.movel[pos].preco);
    fprintf(ficheiro, "Dimensoes: %.2f x %.2f x %.2f\n", moveis.movel[pos].comprimento, moveis.movel[pos].largura, moveis.movel[pos].altura);
    fprintf(ficheiro, "Estado [1 - Ativo; 0 - Inativo]: %d\n", moveis.movel[pos].estado);
    fprintf(ficheiro, "--------------Materiais--------------\n");
    for (int i = 0; i < moveis.movel[pos].contadorMateriais; i++) {
        fprintf(ficheiro, "Nome do material: %s\n", moveis.movel[pos].material[i].nomeMaterial);
        fprintf(ficheiro, "Codigo de Produto: %s\n", moveis.movel[pos].material[i].codigoMaterial);
        fprintf(ficheiro, "Quantidade: %d\n", moveis.movel[pos].material[i].contador);
        fprintf(ficheiro, "Unidade: %s\n", moveis.movel[pos].material[i].unidade);
        fprintf(ficheiro, "\n");
    }

    fclose(ficheiro);
}

/**
 * Função que cria a ficha técnica dos materais necessário a um dado intervalo de tempo
 *
 * @param materiais Struct que contém todos os materiais
 * @param fMoveis Apontador que aponta para o ficheiro
 * @param nomeFicheiro Variável que contém o nome do ficheiro
 * @param dia Dia do intervalo menor
 * @param mes Mes do intervalo manor
 * @param ano Ano do intervalo menor
 * @param dia2 Dia do intervalo maior
 * @param mes2 Mes do intervalo maior
 * @param ano2 Ano do intervalo maior
 *
 * Esta função vai escrever no ficheiro todos os materiais e a respectiva quantidade para um determinado intervalo de tempo
 */
void escreverFicheiroMateriaisSemana(Materiais materiais, FILE *ficheiro, char *nomeFicheiro, int dia, int mes, int ano, int dia2, int mes2, int ano2) {
    ficheiro = fopen(nomeFicheiro, "w");

    fprintf(ficheiro, "Materiais necessarios entre %d/%d/%d e %d/%d/%d\n", dia, mes, ano, dia2, mes2, ano2);
    fprintf(ficheiro, "\n");
    for (int i = 0; i < materiais.contador; i++) {
        fprintf(ficheiro, "Nome: %s\n", materiais.material[i].nomeMaterial);
        fprintf(ficheiro, "Codigo Produto: %s\n", materiais.material[i].codigoMaterial);
        fprintf(ficheiro, "Quantidade: %d\n", materiais.material[i].contador);
        fprintf(ficheiro, "Unidade: %s\n", materiais.material[i].unidade);
        fprintf(ficheiro, "\n");
    }

    fclose(ficheiro);
}

/**
 * Função que altera o estado do móvel
 * 
 * @param movel Struct que contém todos os móveis
 * @param pos Variável que contém a posição so móvel a ser alterado
 * 
 * Esta função troca o estado do móvel caso a condição se confirme
 */
void alterarEstadoMovel(Moveis *movel, int pos) {
    if (movel->movel[pos].estado == 1) {
        movel->movel[pos].estado = 0;
    } else {
        movel->movel[pos].estado = 1;
    }

}
