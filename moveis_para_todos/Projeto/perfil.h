
/* 
 * @file   perfil.h
 * @author Grupo 100
 *
 * @date 16 dezembro 2022
 * @brief Ficheiro header de perfis
 * 
 * 
 * 
 * Ficheiro que contém todos os conteúdos necessários à utilização de perfis
 * 
 */

#ifndef PERFIL_H
#define PERFIL_H

#ifdef __cplusplus
extern "C" {
#endif

#include <stdbool.h>
#include <stdio.h>

#include "input.h"
#include "moveis.h"

#define FICHEIRO_CLIENTES "clientes.csv"
#define FICHEIRO_ADMINS "admins.csv"

#define PASS_ADMIN "12345678"


#define PASSWORD_INCORRETA "Password incorreta\n"
#define DIGITE_DIA_NASCIMENTO "Digite o seu dia de nascimento: "
#define DIGITE_MES_NASCIMENTO "Digite o seu mes de nascimento: "
#define DIGITE_ANO_NASCIMENTO "Digite o seu ano de nascimento: "
#define LER_NOME "Digite o seu nome: "
#define LER_APELIDO "Digite o seu apelido: "
#define LER_PASSWORD "Digite a sua password [maximo 100 caracteres]: "
#define CONFIRMAR_PASSWORD "Confirme a sua password: "
#define LER_CODIGO_POSTAL "Digite o seu codigo postal: "
#define LER_RUA "Digite a sua rua: "
#define LER_PORTA "Digite a porta e|ou andar: "
#define LER_CIDADE "Digite a sua cidade: "
#define LER_NIF "Digite o seu nif: "
#define LER_PAIS "Digite o seu pais: "
#define CLIENTE_NAO_EXISTENTE "O cliente nao existe\n"
#define ADMIN_NAO_EXISTENTE "O admin nao existe\n"
#define INCREMENTO 10

    typedef enum {
        INATIVO,
        ATIVO
    } Estado;

    typedef struct data {
        int dia, mes, ano;
    } Data;

    typedef struct morada {
        char *cidade;
        char *rua;
        char *codigoPostal;
        char *numeroPorta;
    } Morada;

    typedef struct cliente {
        int numeroCliente;
        int numeroEncomendas;
        char *nif;
        char *pais;
        char *password;
        char *nome;
        char *apelido;
        Data data;
        Morada morada;
        Estado estado;
        float dinheiroGasto;
    } Cliente;

    typedef struct clientes {
        int contador;
        Cliente *cliente;
    } Clientes;

    typedef struct admin {
        int numeroAdmin;
        char *password;
        char *nome;
        char *apelido;
    } Admin;

    typedef struct admins {
        int contador;
        Admin *admin;
    } Admins;

    void criarCliente(Clientes *clientes, char *pais, char *nif, char *nome, char *apelido, int diaNascimento, int mesNascimento, int anoNascimento, char *cidade, char *rua, char *numeroPorta, char *cPostal, char *password, int *nCliente);
    bool verificarCliente(Clientes cliente, char nif[9], char *password);
    bool verificarAdmins(Admins admin, int numeroAdmin, char *password);
    void criarAdmin(Admins *admin, char *nome, char *apelido, char *password, int *nAdmin);
    void listarClientes(Clientes clientes);
    void listarAdmins(Admins admins);
    void removerCliente(Clientes *clientes, int numeroCliente);
    void removerAdmin(Admins *admins, int numeroAdmin);
    int posCliente(Clientes clientes, int numeroCliente);
    int posAdmin(Admins admins, int numAdmins);
    void editarNomeClientes(Clientes *clientes, int nCliente, char *nome, char *apelido);
    void editarNIFClientes(Clientes *clientes, int nCliente, char *NIF);
    void editarPaisClientes(Clientes *clientes, int nCliente, char *pais);
    void editarPasswordClientes(Clientes *clientes, int nCliente, char *password);
    void editarDataClientes(Clientes *clientes, int nCliente, int diaNascimento, int mesNascimento, int anoNascimento);
    void editarMoradaClientes(Clientes *clientes, int nCliente, char *cidade, char *rua, char *codigoPostal, char *porta);
    void editarDadosPessoaisAdminNome(int num, Admins *admin, char *nome, char *apelido);
    void editarDadosPessoaisAdminPassword(int num, Admins *admin, char *password);
    int desativarAtivarCliente(Clientes *clientes, int nCliente, Estado estado);
    void iniciarFicheiro(FILE *ficheiro, char *nomeFicheiro);
    int contarLinhas(FILE *fClientes, char *nomeFicheiro);
    void lerFicheiroClientes(Clientes *clientes, FILE *fClientes, int nClientes, char *nomeFicheiro);
    void escreverFicheiroClientes(Clientes clientes, FILE *fClientes, char *nomeFicheiro);
    void lerFicheiroAdmins(Admins *admins, FILE *fAdmins, int nAdmins, char *nomeFicheiro);
    void escreverFicheiroAdmins(Admins admins, FILE *fAdmins, char *nomeFicheiro);
    void encontrarMaioresCompradores(Clientes *clientes);
    void encontrarClientesMaisEncomendas(Clientes *clientes);

#ifdef __cplusplus
}
#endif

#endif /* PERFIL_H */
