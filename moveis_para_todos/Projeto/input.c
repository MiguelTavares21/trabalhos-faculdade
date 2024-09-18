
/* 
 * @file   input.c
 * @author Grupo 100
 *
 * @date 16 dezembro 2022
 * @brief Ficheiro source de inputs
 * 
 * 
 * 
 * Ficheiro que contém todos os conteúdos necessários à utilização de inputs
 * 
 */

#include "input.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/**
 * Esta função dá output de uma linha no terminal
 */
void linha() {
    for (int i = 0; i < TAMANHO_LINHA - 1; i++) {
        printf("-");
    }
    printf("-\n");
}

/**
 * Esta função limpa o buffer
 */
void limparBuffer() {
    char ch;
    while ((ch = getchar()) != '\n' && ch != EOF)
        ;
}

/**
 * Função que lê um valor inteiro (variável do tipo int) depois de estabelecidos os seus limites
 * 
 * @param minValor O primeiro argumento da função, estabelece um limite minímo na leitura de uma variável do tipo int
 * @param maxValor O segundo argumento da função, estabelece um limite máximo na leitura de uma variável do tipo int
 * @param msg O terceiro argumento da função, a mensagem que pede ao utilizador pelo seu input
 * @return O valor, inserido pelo utilizador, que obedece aos argumentos anteriores e a todas as limitações impostas
 */
int lerInt(int minValor, int maxValor, char *msg) {
    int num;

    printf(msg);

    while (scanf("%d", &num) != 1 || num < minValor || num > maxValor) {
        limparBuffer();
        linha();
        printf(INPUT_INVALIDO);
        linha();
        printf(msg);
    }

    limparBuffer();

    return num;
}

/**
 * Função que lê um valor decimal (variável do tipo float) depois de estabelecidos os seus limites
 * 
 * @param minValor O primeiro argumento da função, estabelece um limite minímo na leitura de uma variável do tipo float
 * @param maxValor O segundo argumento da função, estabelece um limite máximo na leitura de uma variável do tipo float
 * @param msg O terceiro argumento da função, a mensagem que pede ao utilizador pelo seu input
 * @return O valor, inserido pelo utilizador, que obedece aos argumentos anteriores e a todas as limitações impostas
 */
float lerFloat(float minValor, float maxValor, char *msg) {
    float num;

    printf(msg);

    while (scanf("%f", &num) != 1 || num < minValor || num > maxValor) {
        limparBuffer();
        linha();
        printf(INPUT_INVALIDO);
        linha();
        printf(msg);
    }

    limparBuffer();

    return num;
}

/**
 * Função que lê um valor inteiro (variável do tipo double) depois de estabelecidos os seus limites
 * 
 * @param minValor O primeiro argumento da função, estabelece um limite minímo na leitura de uma variável do tipo double
 * @param maxValor O segundo argumento da função, estabelece um limite máximo na leitura de uma variável do tipo double
 * @param msg O terceiro argumento da função, a mensagem que pede ao utilizador pelo seu input
 * @return O valor, inserido pelo utilizador, que obedece aos argumentos anteriores e a todas as limitações impostas
 */
double lerDouble(double minValor, double maxValor, char *msg) {
    double num;

    printf(msg);

    while (scanf("%d", &num) != 1 || num < minValor || num > maxValor) {
        limparBuffer();
        linha();
        printf(INPUT_INVALIDO);
        linha();
        printf(msg);
    }

    limparBuffer();
    return num;
}

/**
 * Função que lê um caracter (variável do tipo char)
 * 
 * @param msg O único argumento da função, a mensagem que pede ao utilizador pelo seu input
 * @return O caracter, inserido pelo utilizador
 */
char lerChar(char *msg) {
    char ch;
    printf(msg);
    scanf(" %c", &ch);
    limparBuffer();
    linha();
    return ch;
}

/**
 * Função que lê uma string dinâmica (variável do tipo char)
 * 
 * @param str O primeiro argumento da função, variável que vai receber a string introduzida
 * @param msg O segundo argumento da função, a mensagem que pede ao utilizador pelo seu input
 * 
 * 
 * Esta função lê uma string dada pelo utilizador para um buffer limitado a 1000 caracteres, de seguida, lê 
 * quantos desses caracteres foram utilizados alocando assim apenas o espaço necessário para o armazenamento do input na string dada como o primeiro parâmetro
 */
void lerStringDinamica(char **str, char *msg) {
    int tamanho;
    char buffer[1000];

    printf(msg);
    scanf("%[^\n]", buffer);
    limparBuffer();
    tamanho = strlen(buffer);

    *str = (char *) malloc(tamanho * sizeof (char *));
    strcpy(*str, buffer);
}

/**
 * Função que lê uma string (variável do tipo char)
 * 
 * @param str O primeiro argumento da função, variável que vai receber a string introduzida
 * @param tamanho O segundo argumento da função, variável que define o tamanho da string a introduzir
 * @param msg O terceiro argumento da função, a mensagem que pede ao utilizador pelo seu input
 * 
 * Esta função lê uma string dada pelo utilizador para um buffer limitado a 1000 caracteres(este processo repete-se enquanto esta não obedecer ao tamanho definido no segundo argumento da função),
 *  de seguida, copia o input dado pelo utilizador para a string dada como o primeiro parâmetro
 */
void lerString(char *str, int tamanho, char *msg) {
    char buffer[1000];
    int len = 0;

    while (len != tamanho) {
        printf(msg);
        scanf("%[^\n]", buffer);
        len = strlen(buffer);
        limparBuffer();
    }
    strcpy(str, buffer);
}

/**
 * Função que lê um valor decimal positivo (variável do tipo float)
 *  
 * @param msg O único argumento da função, a mensagem que pede ao utilizador pelo seu input
 * @return O valor, inserido pelo utilizador
 * 
 */
float lerFloatSemLimite(char *msg) {
    float num;

    printf(msg);

    while (scanf("%f", &num) != 1 || num <= 0) {
        limparBuffer();
        linha();
        printf(INPUT_INVALIDO);
        linha();
        printf(msg);
    }

    limparBuffer();

    return num;
}

/**
 * Função que lê um valor inteiro positivo (variável do tipo int)
 *  
 * @param msg O único argumento da função, a mensagem que pede ao utilizador pelo seu input
 * @return O valor, inserido pelo utilizador
 * 
 */
int lerIntSemLimite(char *msg) {
    int num;

    printf(msg);

    while (scanf("%d", &num) != 1 || num <= 0) {
        limparBuffer();
        linha();
        printf(INPUT_INVALIDO);
        linha();
        printf(msg);
    }

    limparBuffer();

    return num;
}
