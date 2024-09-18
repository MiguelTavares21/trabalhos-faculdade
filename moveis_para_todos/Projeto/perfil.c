/* 
 * @file   perfil.c
 * @author Grupo 100
 *
 * @date 16 dezembro 2022
 * @brief Ficheiro source de perfis
 * 
 * 
 * 
 * Ficheiro que contém todos os conteúdos necessários à utilização de perfis
 * 
 */

#include "perfil.h"

#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#include "input.h"

/**
 * Função que cria um cliente
 * 
 * @param clientes  Variável da struct que armazena os clientes (parâmetro que receberá o cliente criado)
 * @param pais Variável que contém o país do cliente
 * @param nif Variável que contém o nif do cliente
 * @param nome Variável que contém o nome do cliente
 * @param apelido Variável que contém o apelido do cliente
 * @param diaNascimento Variável que contém o dia de nascimento do cliente
 * @param mesNascimento Variável que contém o mês de nascimento do cliente
 * @param anoNascimento Variável que contém o ano de nascimento do cliente
 * @param cidade Variável que contém a cidade do cliente
 * @param rua Variável que contém a rua do cliente
 * @param numeroPorta Variável que contém o número da porta do cliente
 * @param cPostal Variável que contém o código postal do cliente
 * @param password Variável que contém a password do cliente
 * @param nCliente Variável que vai receber o número de cliente
 * 
 * Esta função irá copiar para a struct "Cliente" os dados fornecidos como argumentos, estes dados foram introduzidos previamente na main
 */
void criarCliente(Clientes *clientes, char *pais, char *nif, char *nome, char *apelido, int diaNascimento, int mesNascimento, int anoNascimento, char *cidade, char *rua, char *numeroPorta, char *cPostal, char *password, int *nCliente) {

    int pos = (*clientes).contador;



    if (pos == 0) {
        (*clientes).cliente = (Cliente *) malloc((pos + 1) * sizeof (Cliente));
    } else {
        (*clientes).cliente = (Cliente *) realloc((*clientes).cliente, (pos + 1) * sizeof (Cliente));
    }



    
    (*clientes).cliente[pos].pais = (char *) malloc((strlen(pais) + 1) * sizeof (char));
    strcpy((*clientes).cliente[pos].pais, pais);

    
    (*clientes).cliente[pos].nif = (char *) malloc((strlen(nif) + 1) * sizeof (char));
    strcpy((*clientes).cliente[pos].nif, nif);

    
    (*clientes).cliente[pos].nome = (char *) malloc(strlen(nome) + 1);
    (*clientes).cliente[pos].apelido = (char *) malloc(strlen(apelido) + 1);
    strcpy((*clientes).cliente[pos].nome, nome);
    strcpy((*clientes).cliente[pos].apelido, apelido);

    

    (*clientes).cliente[pos].data.dia = diaNascimento;
    (*clientes).cliente[pos].data.mes = mesNascimento;
    (*clientes).cliente[pos].data.ano = anoNascimento;

    
    (*clientes).cliente[pos].morada.cidade = (char *) malloc((strlen(cidade) + 1) * sizeof (char));
    (*clientes).cliente[pos].morada.rua = (char *) malloc((strlen(rua) + 1) * sizeof (char));
    (*clientes).cliente[pos].morada.numeroPorta = (char *) malloc((strlen(numeroPorta) + 1) * sizeof (char));
    (*clientes).cliente[pos].morada.codigoPostal = (char *) malloc((strlen(cPostal) + 1) * sizeof (char));

    strcpy((*clientes).cliente[pos].morada.cidade, cidade);
    strcpy((*clientes).cliente[pos].morada.rua, rua);
    strcpy((*clientes).cliente[pos].morada.numeroPorta, numeroPorta);
    strcpy((*clientes).cliente[pos].morada.codigoPostal, cPostal);

    

    (*clientes).cliente[pos].password = (char *) malloc((strlen(password) + 1) * sizeof (char));

    strcpy((*clientes).cliente[pos].password, password);


    (*clientes).cliente[pos].estado = ATIVO;

    if (pos == 0) {
        *nCliente = rand() % 32767;
        (*clientes).cliente[pos].numeroCliente = *nCliente;
    } else {
        do {
            *nCliente = rand() % 32767;
            (*clientes).cliente[pos].numeroCliente = *nCliente;
            for (int i = 0; i < clientes->contador; i++) {
                if ((*clientes).cliente[pos].numeroCliente == (*clientes).cliente[i].numeroCliente) {
                    *nCliente = 0;
                }
            }
        } while (*nCliente == 0);
        (*clientes).cliente[pos].numeroCliente = *nCliente;
    }
    
    
    (*clientes).cliente[pos].dinheiroGasto = 0;
    (*clientes).cliente[pos].numeroEncomendas = 0;
    (*clientes).contador++;
}

/**
 * Função que lista todos os clientes armazenados
 * 
 * @param clientes Variável da struct que armazena os clientes
 * 
 * Esta função irá ler da struct "Clientes" os dados dos clientes listando-os
 */
void listarClientes(Clientes clientes) {
    int i;
    for (i = 0; i < clientes.contador; i++) {
        linha();
        printf("CLIENTE NUMERO: %d\n", clientes.cliente[i].numeroCliente);
        printf("NOME:%s\n", clientes.cliente[i].nome);
        printf("APELIDO:%s\n", clientes.cliente[i].apelido);
        printf("PAIS:%s\n", clientes.cliente[i].pais);
        printf("NIF:%s\n", clientes.cliente[i].nif);
        printf("DATA DE NASCIMENTO (DIA-MES-ANO):%d-%d-%d\n", clientes.cliente[i].data.dia,
                clientes.cliente[i].data.mes,
                clientes.cliente[i].data.ano);
        printf("CIDADE:%s\n", clientes.cliente[i].morada.cidade);
        printf("RUA:%s\n", clientes.cliente[i].morada.rua);
        printf("CODIGO POSTAL:%s\n", clientes.cliente[i].morada.codigoPostal);
        linha();
    }
}

/**
 * Função que lista todos os admins armazenados
 * 
 * @param admins Variável da struct que armazena os admins
 * 
 * Esta função irá ler da struct "Admins" os dados dos admins listando-os
 */
void listarAdmins(Admins admins) {
    int i;
    for (i = 0; i < admins.contador; i++) {
        printf("ADMIN NUMERO: %d\n", admins.admin[i].numeroAdmin);
        printf("NOME:%s\n", admins.admin[i].nome);
        printf("APELIDO:%s\n", admins.admin[i].apelido);
        linha();
    }
}

/**
 * Função que verifica se o perfil de cliente existe
 * 
 * @param cliente Variável da struct que armazena os clientes
 * @param nif Variável que contém o nif do cliente 
 * @param password Variável que contém a password do cliente 
 * @return Valor boleano que representa se o cliente existe ou não
 * 
 * Esta função percorre todos os clientes criados. Caso encontre o seu perfil a função retorna o valor boleano "true",
 *  caso não encontre (o que significa que o cliente não existe), esta retorna o valor boleano "false" 
 */
bool verificarCliente(Clientes cliente, char nif[9], char *password) {
    int numeroClientes = cliente.contador;
    for (int i = 0; i < numeroClientes; i++) {
        if (strcmp(cliente.cliente[i].nif, nif) == 0 && strcmp(cliente.cliente[i].password, password) == 0) {
            return true;
        }
    }
    return false;
}

/**
 * Função que verifica se o perfil de admin existe
 * 
 * @param admin Variável da struct que armazena os admins
 * @param numeroAdmin Variável que contém o numero do cliente 
 * @param password Variável que contém a password do admin 
 * @return Valor boleano que representa se o admin existe ou não
 * 
 * Esta função percorre todos os admins criados. Caso encontre o seu perfil a função retorna o valor boleano "true",
 *  caso não encontre (o que significa que o admin não existe), esta retorna o valor boleano "false" 
 */
bool verificarAdmins(Admins admin, int numeroAdmin, char *password) {
    int numeroAdmins = admin.contador;

    for (int i = 0; i < numeroAdmins; i++) {
        if (admin.admin[i].numeroAdmin == numeroAdmin && strcmp(admin.admin[i].password, password) == 0) {
            return true;
        }
    }
    return false;
}

/**
 * Função que cria um admin
 * 
 * @param admin Variável da struct que armazena os admins (parâmetro que receberá o admin criado)
 * @param nome Variável que contém o nome do admin
 * @param apelido Variável que contém o apelido do admin
 * @param password Variável que contém a password do admin
 * @param nAdmin Variável que vai receber o número de admin
 * 
 * Esta função irá copiar para a struct "Admin" os dados fornecidos como argumentos, estes dados foram introduzidos previamente na main
 */
void criarAdmin(Admins *admin, char *nome, char *apelido, char *password, int *nAdmin) {

    int pos = (*admin).contador;

    if (pos == 0) {
        (*admin).admin = (Admin *) malloc((pos + 1) * sizeof (Admin));
    } else {
        (*admin).admin = (Admin *) realloc((*admin).admin, (pos + 1) * sizeof (Admin));
    }

    (*admin).admin[pos].nome = (char *) malloc((strlen(nome) + 1) * sizeof (char));
    strcpy((*admin).admin[pos].nome, nome);
    (*admin).admin[pos].apelido = (char *) malloc((strlen(apelido) + 1) * sizeof (char));
    strcpy((*admin).admin[pos].apelido, apelido);
    (*admin).admin[pos].password = (char *) malloc((strlen(password) + 1) * sizeof (char));
    strcpy((*admin).admin[pos].password, password);

    if (pos == 0) {
        *nAdmin = rand() % 100;
        (*admin).admin[pos].numeroAdmin = *nAdmin;
    } else {
        do {
            *nAdmin = rand() % 100;
            (*admin).admin[pos].numeroAdmin = *nAdmin;
            for (int i = 0; i < admin->contador; i++) {
                if ((*admin).admin[pos].numeroAdmin == (*admin).admin[i].numeroAdmin) {
                    *nAdmin = 0;
                }
            }
        } while (*nAdmin == 0);
        (*admin).admin[pos].numeroAdmin = *nAdmin;
    }
    (*admin).contador++;
}


/**
 * Função que procura o cliente na struct que armazena todo este tipo de perfis
 * 
 * @param clientes Variável da struct que armazena os clientes
 * @param nCliente Número do cliente a procurar
 * @return A posição do cliente no array
 * 
 * Esta função compara o número de cliente dado como argumento com os números de cliente no array,
 *  caso eles coincidam a função retorna a posição do cliente no array, caso contrário ela retorna o valor -1
 */
int posCliente(Clientes clientes, int numeroCliente) {
    for (int i = 0; i < clientes.contador; i++) {
        if (clientes.cliente[i].numeroCliente == numeroCliente) {

            return i;
        }
    }

    return -1;
}

/**
 * Função que procura o admin na struct que armazena todo este tipo de perfis
 * 
 * @param admins Variável da struct que armazena os admins
 * @param nAdmin Número do admin a procurar
 * @return A posição do admin no array
 * 
 * Esta função compara o número de admin dado como argumento com os números de admin no array,
 *  caso eles coincidam a função retorna a posição do admin no array, caso contrário ela retorna o valor -1
 */
int posAdmin(Admins admins, int numAdmins) {
    for (int i = 0; i < admins.contador; i++) {
        if (admins.admin[i].numeroAdmin == numAdmins) {

            return i;
        }
    }

    return -1;
}

/**
 * Função que elimina um admin
 * 
 * @param admins Variável da struct que armazena os admins
 * @param numeroAdmin Número do admin a eliminar
 * 
 * Esta função remove o perfil de admin em questão e substitui a sua posição no array pelo administrador seguinte
 */
void removerAdmin(Admins *admins, int numeroAdmin) {
    int pos = posAdmin((*admins), numeroAdmin);
    int len;
    int tamanho = admins->contador - 1;
    int valor;

    if (pos != tamanho) {
        for (int i = pos; i < tamanho; i++) {

            admins->admin[i].numeroAdmin = admins->admin[i + 1].numeroAdmin;

            len = strlen(admins->admin[i + 1].password);
            admins->admin[i].password = (char *) realloc(admins->admin[i].password, len * sizeof (char));
            strcpy(admins->admin[i].password, admins->admin[i + 1].password);

            len = strlen(admins->admin[i + 1].nome);
            admins->admin[i].nome = (char *) realloc(admins->admin[i].nome, len * sizeof (char));
            strcpy(admins->admin[i].nome, admins->admin[i + 1].nome);

            len = strlen(admins->admin[i + 1].apelido);
            admins->admin[i].apelido = (char *) realloc(admins->admin[i].apelido, len * sizeof (char));
            strcpy(admins->admin[i].apelido, admins->admin[i + 1].apelido);
        }
    }

    free(admins->admin[tamanho].password);
    free(admins->admin[tamanho].nome);
    free(admins->admin[tamanho].apelido);

    admins->admin[tamanho].numeroAdmin = -1;

    admins->contador--;

    valor = 0;
}

/**
 * Função que elimina um cliente
 * 
 * @param admins Variável da struct que armazena os clientes
 * @param numeroAdmin Número do cliente a eliminar
 * 
 * Esta função remove o perfil de cliente em questão e substitui a sua posição no array pelo cliente seguinte
 */
void removerCliente(Clientes *clientes, int numeroCliente) {
    int pos = posCliente((*clientes), numeroCliente);
    int len;
    int tamanho = clientes->contador - 1;
    int valor;

    if (pos != tamanho) {
        for (int i = pos; i < tamanho; i++) {

            clientes->cliente[i].numeroCliente = clientes->cliente[i + 1].numeroCliente;
            clientes->cliente[i].data.dia = clientes->cliente[i + 1].data.dia;
            clientes->cliente[i].data.mes = clientes->cliente[i + 1].data.mes;
            clientes->cliente[i].data.ano = clientes->cliente[i + 1].data.ano;
            clientes->cliente[i].estado = clientes->cliente[i + 1].estado;

            len = strlen(clientes->cliente[i + 1].pais);
            clientes->cliente[i].pais = (char *) realloc(clientes->cliente[i].pais, len * sizeof (char));
            strcpy(clientes->cliente[i].pais, clientes->cliente[i + 1].pais);

            len = strlen(clientes->cliente[i + 1].password);
            clientes->cliente[i].password = (char *) realloc(clientes->cliente[i].password, len * sizeof (char));
            strcpy(clientes->cliente[i].password, clientes->cliente[i + 1].password);

            len = strlen(clientes->cliente[i + 1].nome);
            clientes->cliente[i].nome = (char *) realloc(clientes->cliente[i].nome, len * sizeof (char));
            strcpy(clientes->cliente[i].nome, clientes->cliente[i + 1].nome);

            len = strlen(clientes->cliente[i + 1].apelido);
            clientes->cliente[i].apelido = (char *) realloc(clientes->cliente[i].apelido, len * sizeof (char));
            strcpy(clientes->cliente[i].apelido, clientes->cliente[i + 1].apelido);

            len = strlen(clientes->cliente[i + 1].morada.cidade);
            clientes->cliente[i].morada.cidade = (char *) realloc(clientes->cliente[i].morada.cidade, len * sizeof (char));
            strcpy(clientes->cliente[i].morada.cidade, clientes->cliente[i + 1].morada.cidade);

            len = strlen(clientes->cliente[i + 1].morada.rua);
            clientes->cliente[i].morada.rua = (char *) realloc(clientes->cliente[i].morada.rua, len * sizeof (char));
            strcpy(clientes->cliente[i].morada.rua, clientes->cliente[i + 1].morada.rua);

            strcpy(clientes->cliente[i].nif, clientes->cliente[i + 1].nif);

            strcpy(clientes->cliente[i].morada.codigoPostal, clientes->cliente[i + 1].morada.codigoPostal);
        }
    }

    free(clientes->cliente[tamanho].pais);
    free(clientes->cliente[tamanho].password);
    free(clientes->cliente[tamanho].nome);
    free(clientes->cliente[tamanho].apelido);
    free(clientes->cliente[tamanho].morada.cidade);
    free(clientes->cliente[tamanho].morada.rua);

    clientes->cliente[tamanho].numeroCliente = -1;
    clientes->cliente[tamanho].data.dia = -1;
    clientes->cliente[tamanho].data.mes = -1;
    clientes->cliente[tamanho].data.ano = -1;
    clientes->cliente[tamanho].estado = INATIVO;

    clientes->contador--;

    valor = 0;
}

/**
 * Função que edita o nome e o apelido do cliente
 * 
 * @param clientes Variável da struct que armazena os clientes
 * @param nCliente Número do cliente a editar
 * @param nome Variável com o novo nome do cliente
 * @param apelido Variável com o novo apelido do cliente
 * 
 * Esta função copia para a struct "Cliente" o novo nome e apelido
 */
void editarNomeClientes(Clientes *clientes, int nCliente, char *nome, char *apelido) {

    int check;
    int lenN, lenA;

    lenN = strlen(nome);
    lenA = strlen(apelido);

    check = posCliente(*clientes, nCliente);

    (*clientes).cliente[check].nome = (char*) realloc((*clientes).cliente[check].nome, (lenN + 1) * sizeof (char));
    strcpy((*clientes).cliente[check].nome, nome);
    (*clientes).cliente[check].apelido = (char*) realloc((*clientes).cliente[check].apelido, (lenA + 1) * sizeof (char));
    strcpy((*clientes).cliente[check].apelido, apelido);
}

/**
 * Função que edita o nif do cliente
 * 
 * @param clientes Variável da struct que armazena os clientes
 * @param nCliente Número do cliente a editar
 * @param NIF Variável com o novo nif do cliente
 * 
 * Esta função copia para a struct "Cliente" o novo nif
 */
void editarNIFClientes(Clientes *clientes, int nCliente, char *NIF) {
    int check;
    int lenN;

    lenN = strlen(NIF);
    check = posCliente(*clientes, nCliente);


    (*clientes).cliente[check].nif = (char*) realloc((*clientes).cliente[check].nif, (lenN + 1) * sizeof (char));
    strcpy((*clientes).cliente[check].nif, NIF);
}

/**
 * Função que edita o país do cliente
 * 
 * @param clientes Variável da struct que armazena os clientes
 * @param nCliente Número do cliente a editar
 * @param pais Variável com o novo país do cliente
 * 
 * Esta função copia para a struct "Cliente" o novo país
 */
void editarPaisClientes(Clientes *clientes, int nCliente, char *pais) {

    int check;
    int lenP;

    lenP = strlen(pais);

    check = posCliente(*clientes, nCliente);

    (*clientes).cliente[check].pais = (char*) realloc((*clientes).cliente[check].pais, (lenP + 1) * sizeof (char));
    strcpy((*clientes).cliente[check].pais, pais);
}

/**
 * Função que edita a password do cliente
 * 
 * @param clientes Variável da struct que armazena os clientes
 * @param nCliente Número do cliente a editar
 * @param password Variável com a nova password do cliente
 * 
 * Esta função copia para a struct "Cliente" a nova password
 */
void editarPasswordClientes(Clientes *clientes, int nCliente, char *password) {

    int check;
    int lenP;

    lenP = strlen(password);
    
    check = posCliente(*clientes, nCliente);

    (*clientes).cliente[check].password = (char*) realloc((*clientes).cliente[check].password, (lenP + 1) * sizeof (char));
    strcpy((*clientes).cliente[check].password, password);
}

/**
 * Função que edita a data de nascimento do cliente
 * 
 * @param clientes Variável da struct que armazena os clientes
 * @param nCliente Número do cliente a editar
 * @param diaNascimento Variável com o novo dia de nascimento do cliente
 * @param mesNascimento Variável com o novo mês de nascimento do cliente
 * @param anoNascimento Variável com o novo ano de nascimento do cliente
 * 
 * Esta função copia para a struct "Cliente" a nova data de nascimento
 */
void editarDataClientes(Clientes *clientes, int nCliente, int diaNascimento, int mesNascimento, int anoNascimento) {

    int check;

    check = posCliente(*clientes, nCliente);

    (*clientes).cliente[check].data.dia = diaNascimento;
    (*clientes).cliente[check].data.mes = mesNascimento;
    (*clientes).cliente[check].data.ano = anoNascimento;
}

/**
 * Função que edita a morada do cliente
 * 
 * @param clientes Variável da struct que armazena os clientes
 * @param nCliente Número do cliente a editar
 * @param cidade Variável com a nova cidade do cliente
 * @param rua Variável com a nova rua do cliente
 * @param codigoPostal Variável com o novo código postal do cliente
 * @param porta Variável com o novo número de porta do cliente
 * 
 * Esta função copia para a struct "Cliente" a nova morada
 */
void editarMoradaClientes(Clientes *clientes, int nCliente, char *cidade, char *rua, char *codigoPostal, char *porta) {

    int check;
    int lenC, lenR, lenCP, lenP;

    lenC = strlen(cidade);
    lenR = strlen(rua);
    lenCP = strlen(codigoPostal);
    lenP = strlen(porta);

    check = posCliente(*clientes, nCliente);

    (*clientes).cliente[check].morada.cidade = (char*) realloc((*clientes).cliente[check].morada.cidade, (lenC + 1) * sizeof (char));
    strcpy((*clientes).cliente[check].morada.cidade, cidade);
    (*clientes).cliente[check].morada.rua = (char*) realloc((*clientes).cliente[check].morada.rua, (lenR + 1) * sizeof (char));
    strcpy((*clientes).cliente[check].morada.rua, rua);
    (*clientes).cliente[check].morada.codigoPostal = (char*) realloc((*clientes).cliente[check].morada.codigoPostal, (lenCP + 1) * sizeof (char));
    strcpy((*clientes).cliente[check].morada.codigoPostal, codigoPostal);
    (*clientes).cliente[check].morada.numeroPorta = (char*) realloc((*clientes).cliente[check].morada.numeroPorta, (lenP + 1) * sizeof (char));
    strcpy((*clientes).cliente[check].morada.numeroPorta, porta);
}

/**
 * Função que edita o nome e o apelido do admin
 * 
 * @param num Número do admin a editar
 * @param admin Variável da struct que armazena os admins
 * @param nome Variável com o novo nome do admin
 * @param apelido Variável com o novo apelido do admin
 * 
 * Esta função copia para a struct "Admin" o novo nome e apelido
 */
void editarDadosPessoaisAdminNome(int num, Admins *admin, char *nome, char *apelido) {
    int lenN, lenA;

    lenN = strlen(nome);
    lenA = strlen(apelido);

    (*admin).admin[num].nome = (char*) realloc((*admin).admin[num].nome, (lenN + 1) * sizeof (char));
    strcpy((*admin).admin[num].nome, nome);
    (*admin).admin[num].apelido = (char*) realloc((*admin).admin[num].apelido, (lenA + 1) * sizeof (char));
    strcpy((*admin).admin[num].apelido, apelido);
}

/**
 * Função que edita a password do admin
 * 
 * @param num Número do admin a editar
 * @param admin Variável da struct que armazena os admins
 * @param password Variável com a nova password do admin
 * 
 * Esta função copia para a struct "Admin" a nova password
 */
void editarDadosPessoaisAdminPassword(int num, Admins *admin, char *password) {
    int lenP;
    lenP = strlen(password);
    (*admin).admin[num].password = (char*) realloc((*admin).admin[num].password, (lenP + 1) * sizeof (char));
    strcpy((*admin).admin[num].password, password);
}

/**
 * Função que açtera o estado de perfil do cliente
 * 
 * @param clientes Variável da struct que armazena os clientes
 * @param nCliente Número do cliente a alterar
 * @param estado Estado a querer ser aplicado no cliente
 * @return Valor que representa se: (= 0) - o cliente já se encontrava naquele estato,
 *  (= 1) - a alteração foi feita com sucesso. Este valor permite nos dar print alteração feita na main
 * 
 * Esta função verifica se o cliente existe e o estado em que se encontra, alterando-o depois conformr solicitado
 */
int desativarAtivarCliente(Clientes *clientes, int nCliente, Estado estado) {
    int check;
    int valor;
    check = posCliente(*clientes, nCliente);
    if (check == -1) {
        valor = -1;
    } else if ((*clientes).cliente[check].estado == estado) {
        valor = 0;
    } else {

        valor = 1;
        (*clientes).cliente[check].estado = estado;
    }
    return valor;
}


/**
 * Função que inicia os ficheiros
 *
 * @param ficheiro Apontador que aponta para o ficheiro
 * @param nomeFicheiro Variável que contém o nome do ficheiro
 *
 * Esta função vai tentar abrir o ficheiro para leitura, se nao conseguir significa que o ficheiro nao existe, logo,
 * abre para escrita, o que automaticamente vai criar um ficheiro, e por fim fecha.
 */
void iniciarFicheiro(FILE *ficheiro, char *nomeFicheiro) {
    ficheiro = fopen(nomeFicheiro, "r");

    if (ficheiro == NULL) {
        fclose(ficheiro);
        ficheiro = fopen(nomeFicheiro, "w");
    }

    fclose(ficheiro);
}

/**
 * Função que conta o número de linhas de um ficheiro
 *
 * @param ficheiro Apontador que aponta para o ficheiro
 * @param nomeFicheiro Variável que contém o nome do ficheiro
 *
 * Esta função vai contar todas as linhas do ficheiro ate chegar ao fim do mesmo
 */
int contarLinhas(FILE *ficheiro, char *nomeFicheiro) {
    ficheiro = fopen(nomeFicheiro, "r");

    char conta;
    int cont = 0;

    while (!feof(ficheiro)) {
        conta = fgetc(ficheiro);
        if (conta == '\n') {
            cont++;
        }
    }

    fclose(ficheiro);

    return cont;
}

/**
 * Função que le o ficheiro dos perfis dos clientes
 *
 * @param clientes Struct que vai conter todos os clientes
 * @param fClientes Apontador que aponta para o ficheiro
 * @param nClientes Variável que contém o número de clientes a serem lidos
 * @param nomeFicheiro Variável que contém o nome do ficheiro
 *
 * Esta função vai ler todas as linhas do ficheiro e copiar o campo respetivo a cada cliente para a Struct Clientes
 */
void lerFicheiroClientes(Clientes *clientes, FILE *fClientes, int nClientes, char *nomeFicheiro) {
    int i = 0, len;
    int tamanhoBuffer = 1000;

    fClientes = fopen(nomeFicheiro, "r");

    clientes->cliente = (Cliente *)malloc(nClientes * sizeof(Cliente));

    while (!feof(fClientes)) {
        clientes->cliente[i].pais = (char *)malloc(tamanhoBuffer * sizeof(char));
        clientes->cliente[i].nif = (char *)malloc(tamanhoBuffer * sizeof(char));
        clientes->cliente[i].morada.codigoPostal = (char *)malloc(tamanhoBuffer * sizeof(char));
        clientes->cliente[i].password = (char *)malloc(tamanhoBuffer * sizeof(char));
        clientes->cliente[i].nome = (char *)malloc(tamanhoBuffer * sizeof(char));
        clientes->cliente[i].apelido = (char *)malloc(tamanhoBuffer * sizeof(char));
        clientes->cliente[i].morada.cidade = (char *)malloc(tamanhoBuffer * sizeof(char));
        clientes->cliente[i].morada.rua = (char *)malloc(tamanhoBuffer * sizeof(char));
        clientes->cliente[i].morada.numeroPorta = (char *)malloc(tamanhoBuffer * sizeof(char));

        fscanf(fClientes, "%[^;];%[^;];%[^;];%[^;];%[^;];%[^;];%[^;];%[^;];%[^;];%d;%d;%d;%d;%d;%f;%d\n",
               clientes->cliente[i].nif, clientes->cliente[i].pais, clientes->cliente[i].password, clientes->cliente[i].nome,
               clientes->cliente[i].apelido, clientes->cliente[i].morada.cidade, clientes->cliente[i].morada.rua,
               clientes->cliente[i].morada.numeroPorta, clientes->cliente[i].morada.codigoPostal,
               &clientes->cliente[i].estado, &clientes->cliente[i].numeroCliente, &clientes->cliente[i].data.dia,
               &clientes->cliente[i].data.mes, &clientes->cliente[i].data.ano, &clientes->cliente[i].dinheiroGasto, &clientes->cliente[i].numeroEncomendas);

        len = strlen(clientes->cliente[i].pais);
        clientes->cliente[i].pais = (char *)realloc(clientes->cliente[i].pais, (len + 1) * sizeof(char));

        len = strlen(clientes->cliente[i].password);
        clientes->cliente[i].password = (char *)realloc(clientes->cliente[i].password, (len + 1) * sizeof(char));

        len = strlen(clientes->cliente[i].nome);
        clientes->cliente[i].nome = (char *)realloc(clientes->cliente[i].nome, (len + 1) * sizeof(char));

        len = strlen(clientes->cliente[i].apelido);
        clientes->cliente[i].apelido = (char *)realloc(clientes->cliente[i].apelido, (len + 1) * sizeof(char));

        len = strlen(clientes->cliente[i].morada.cidade);
        clientes->cliente[i].morada.cidade = (char *)realloc(clientes->cliente[i].morada.cidade, (len + 1) * sizeof(char));

        len = strlen(clientes->cliente[i].morada.rua);
        clientes->cliente[i].morada.rua = (char *)realloc(clientes->cliente[i].morada.rua, (len + 1) * sizeof(char));

        len = strlen(clientes->cliente[i].morada.numeroPorta);
        clientes->cliente[i].morada.numeroPorta = (char *)realloc(clientes->cliente[i].morada.numeroPorta, (len + 1) * sizeof(char));

        len = strlen(clientes->cliente[i].morada.codigoPostal);
        clientes->cliente[i].morada.codigoPostal = (char *)realloc(clientes->cliente[i].morada.codigoPostal, (len + 1) * sizeof(char));

        len = strlen(clientes->cliente[i].nif);
        clientes->cliente[i].nif = (char *)realloc(clientes->cliente[i].nif, (len + 1) * sizeof(char));

        i++;
    }
    fclose(fClientes);
}

/**
 * Função que escreve no ficheiros dos perfis dos clientes
 *
 * @param clientes Struct que contém todos os clientes
 * @param fClientes Apontador que aponta para o ficheiro
 * @param nomeFicheiro Variável que contém o nome do ficheiro
 *
 * Esta função vai escrever todos as informações respetivas a cada Cliente (um em cada linha, campos separados por ;).
 */
void escreverFicheiroClientes(Clientes clientes, FILE *fClientes, char *nomeFicheiro) {
    fClientes = fopen(nomeFicheiro, "w");

    for (int i = 0; i < clientes.contador; i++) {
        fprintf(fClientes, "%s;%s;%s;%s;%s;%s;%s;%s;%s;%d;%d;%d;%d;%d;%.2f;%d\n", clientes.cliente[i].nif, clientes.cliente[i].pais, clientes.cliente[i].password,
                clientes.cliente[i].nome, clientes.cliente[i].apelido, clientes.cliente[i].morada.cidade, clientes.cliente[i].morada.rua, clientes.cliente[i].morada.numeroPorta,
                clientes.cliente[i].morada.codigoPostal, clientes.cliente[i].estado, clientes.cliente[i].numeroCliente, clientes.cliente[i].data.dia,
                clientes.cliente[i].data.mes, clientes.cliente[i].data.ano, clientes.cliente[i].dinheiroGasto, clientes.cliente[i].numeroEncomendas);
    }

    fclose(fClientes);
}

/**
 * Função que lê o ficheiro dos perfis dos admins
 *
 * @param admins Struct que vai conter todos os admins
 * @param fAdmins Apontador que aponta para o ficheiro
 * @param nAdmins Variável que contém o número de admins a serem lidos
 * @param nomeFicheiro Variável que contém o nome do ficheiro
 *
 * Esta função vai ler todas as linhas do ficheiro e copiar o campo respetivo a cada admin para a Struct Admins
 */
void lerFicheiroAdmins(Admins *admins, FILE *fAdmins, int nAdmins, char *nomeFicheiro) {
    int len, i = 0;
    int tamanhoBuffer = 1000;

    fAdmins = fopen(nomeFicheiro, "r");

    admins->admin = (Admin *)malloc(nAdmins * sizeof(Admin));

    while (!feof(fAdmins)) {
        admins->admin[i].nome = (char *)malloc(tamanhoBuffer * sizeof(char));
        admins->admin[i].apelido = (char *)malloc(tamanhoBuffer * sizeof(char));
        admins->admin[i].password = (char *)malloc(tamanhoBuffer * sizeof(char));

        fscanf(fAdmins, "%[^;];%[^;];%[^;];%d\n", admins->admin[i].nome, admins->admin[i].apelido, admins->admin[i].password, &admins->admin[i].numeroAdmin);

        len = strlen(admins->admin[i].nome);
        admins->admin[i].nome = (char *)realloc(admins->admin[i].nome, (len + 1) * sizeof(char));

        len = strlen(admins->admin[i].apelido);
        admins->admin[i].apelido = (char *)realloc(admins->admin[i].apelido, (len + 1) * sizeof(char));

        len = strlen(admins->admin[i].password);
        admins->admin[i].password = (char *)realloc(admins->admin[i].password, (len + 1) * sizeof(char));

        i++;
    }
    fclose(fAdmins);
}

/**
 * Função que escreve no ficheiros dos perfis dos admins
 *
 * @param admins Struct que contém todos os admins
 * @param fAdmins Apontador que aponta para o ficheiro
 * @param nomeFicheiro Variável que contém o nome do ficheiro
 *
 * Esta função vai escrever todos as informações respetivas a cada Admin (um em cada linha, campos separados por ;).
 */
void escreverFicheiroAdmins(Admins admins, FILE *fAdmins, char *nomeFicheiro) {
    fAdmins = fopen(nomeFicheiro, "w");

    for (int i = 0; i < admins.contador; i++) {
        fprintf(fAdmins, "%s;%s;%s;%d\n", admins.admin[i].nome, admins.admin[i].apelido, admins.admin[i].password, admins.admin[i].numeroAdmin);
    }

    fclose(fAdmins);
}

/**
 * Função que enumera os clientes que mais dinheiro gastaram na empresa
 * 
 * @param clientes Variável da struct que armazena os clientes
 * 
 * Esta função percorre dois loops que verificam quais os clientes que mais gastaram na empresa. Existe um terceiro loop que dá print aos top 5 clientes que mais o fizeram
 */
void encontrarMaioresCompradores(Clientes *clientes) {


    float valores[5] = {-1, -1, -1, -1, -1};
    int clientesMaiores[5] = {-1, -1, -1, -1, -1};
    for (int i = 0; i < clientes->contador; i++) {
        for (int j = 0; j < 5; j++) {
            if (clientes->cliente[i].dinheiroGasto > valores[j]) {
                for (int k = 4; k > j; k--) {
                    valores[k] = valores[k - 1];
                    clientesMaiores[k] = clientesMaiores[k - 1];
                }
                valores[j] = clientes->cliente[i].dinheiroGasto;
                clientesMaiores[j] = i;
                break;
            }
        }
    }

    printf("Os 5 maiores compradores sao:\n");
    for (int i = 0; i < 5; i++) {
        if (clientes->cliente[clientesMaiores[i]].nome != NULL && clientes->cliente[clientesMaiores[i]].apelido != NULL && clientesMaiores[i] != -1) {
            printf("Cliente numero: %d - %s %s com valor total comprado: %.2f\n", clientes->cliente[clientesMaiores[i]].numeroCliente, clientes->cliente[clientesMaiores[i]].nome, clientes->cliente[clientesMaiores[i]].apelido, clientes->cliente[clientesMaiores[i]].dinheiroGasto);
        }
    }
}

/**
 * Função que enumera os clientes que mais encomendas fizeram na empresa
 * 
 * @param clientes Variável da struct que armazena os clientes
 * 
 * Esta função percorre três loops que verificam quais os clientes que mais encomendas fizeram na empresa. Existe um quarto loop que dá print aos top 5 clientes que mais o fizeram
 */
void encontrarClientesMaisEncomendas(Clientes *clientes) {
    
    int valores[5] = {-1, -1, -1, -1, -1};
    int clientesMaiores[5] = {-1, -1, -1, -1, -1};
    for (int i = 0; i < clientes->contador; i++) {
        for (int j = 0; j < 5; j++) {
            if (clientes->cliente[i].numeroEncomendas > valores[j]) {
                for (int k = 4; k > j; k--) {
                    valores[k] = valores[k - 1];
                    clientesMaiores[k] = clientesMaiores[k - 1];
                }
                valores[j] = clientes->cliente[i].numeroEncomendas;
                clientesMaiores[j] = i;
                break;
            }
        }
    }

    printf("Os 5 clientes com mais encomendas feitas sao:\n");
    for (int i = 0; i < 5; i++) {
        if (clientes->cliente[clientesMaiores[i]].nome != NULL && clientes->cliente[clientesMaiores[i]].apelido != NULL && clientesMaiores[i] != -1) {
            printf("Cliente numero: %d - %s %s com numero de encomendas: %d\n", clientes->cliente[clientesMaiores[i]].numeroCliente, clientes->cliente[clientesMaiores[i]].nome, clientes->cliente[clientesMaiores[i]].apelido, clientes->cliente[clientesMaiores[i]].numeroEncomendas);
        }
    }
}
