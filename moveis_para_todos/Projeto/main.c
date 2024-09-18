/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * File:   main.c
 * Author: bruno
 *
 * Created on 16 de dezembro de 2022, 17:23
 */

#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#include "encomenda.h"
#include "input.h"
#include "moveis.h"
#include "perfil.h"

#define ACESSO_GARANTIDO "Acesso garantido\n"
#define ACESSO_NEGADO "Acesso negado\n"
#define CONTA_ACESSADA "Entrou\n"
#define CONTA_INEXISTENTE "Conta inexistente\n"
#define CONTA_CRIADA "Conta criada com sucesso\n"

enum menuInicio {
    ENTRAR = 1,
    CRIAR_CONTA,
    SAIR
};

enum menuEntrar_CriarConta {
    SAIR1 = -1,
    RETROCEDER,
    ADMIN,
    CLIENTE,

};

enum menuAdmin {
    SAIR2 = -1,
    RETROCEDER1,
    CLIENTES,
    MOVEIS,
    PRODUCAO,
    GERIR,
    OUTROS
};

enum gerirCliente {
    SAIR3 = -1,
    RETROCEDER2,
    CRIAR,
    EDITAR,
    REMOVER_DESATIVAR,
    PROCURAR,
    LISTAR,
    EXPORTAR
};

enum gerirConta {
    SAIR4 = -1,
    RETROCEDER3,
    EDITAR1,
    APAGAR
};

enum menuCliente {
    SAIR5 = -1,
    RETROCEDER4,
    REGISTAR,
    MODIFICAR,
    CONSULTAR,
    DEFINICOES,
    EXTRAS
};

enum {
    NOME = 1,
    NIF,
    PAIS,
    PASSWORD,
    DATA,
    MORADA
};

enum escolha {
    NOMEa = 1,
    PASSWORDa
};

int main(int argc, char **argv) {
    Clientes clientes = {.contador = 0};
    Admins admins = {.contador = 0};
    Encomendas encomendas = {.contador = 0};
    Moveis moveis = {.contador = 0};
    Materiais materiais = {.contador = 0};
    Materiais materiaisTemp = {.contador = 0};
    Encomenda encomendaTemp = {.contador = 0};

    FILE *fClientes, *fMateriais, *fAdmins, *fMoveis, *fEncomendas;



    char *nomeCriarC, *apelidoCriarC, *nifCriarC, *paisCriarC, *passwordCriarC1, *passwordCriarC2, *cidadeCriarC, *ruaCriarC, *portaCriarC, *cPostalCriarC;
    int diaNascimentoCriarC, mesNascimentoCriarC, anoNascimentoCriarC, nClienteCriarC = 0;
    bool nifRepetido = false;



    char *nomeCriarA, *apelidoCriarA, *passwordCriarA1, *passwordCriarA2;
    int nAdminCriarA = 0;

    Data data1, data2;
    int opcao, opcao1, numeroAdmin, escolha, pos_admin, check, num, dAc, diaNascimento, mesNascimento, anoNascimento;
    int numEncomenda, resultadoCheckEncomenda;
    int nClientes, nMateriais, nAdmins, nMoveis, nEncomendas;
    int posicaoCliente;
    int dia, mes, ano;

    char *nome2, codigoProduto[TAMANHO_CODIGO_MOVEL];
    int pos, opcao3, quantidade, len;
    float comprimento, largura, altura, preco;
    bool codigoExistente, run3 = true;

    int auxiliar = 0;
    int opcao4, posicao_material;

    char codigo[TAMANHO_CODIGO_MOVEL], codigo_produto[TAMANHO_CODIGO_MOVEL];
    int resultadoEMoveis = 0;

    char *codigoAdmin, *password, cMovel[TAMANHO_CODIGO_MOVEL], *nif, *nifNovo, resposta, *nome, *apelido, *pais, *password1, *password2, *cidade, *rua, *cPostal, *nPorta, *password1A, *password2A;
    bool admin, run = true, resultado;

    bool run2 = true, novaEncomenda = true;
    int opcao2, posMovelEncomenda, diaAtual, mesAtual, anoAtual, opcaoEstado, checkEncomendasMovel;

    int valor;

    int len2;

    char *nome3;
    char codigoMaterial[TAMANHO_CODIGO_MATERIAL];
    int unidade;
    char *nomeMaterial;

    time_t data_ano;
    time(&data_ano);
    struct tm *data = localtime(&data_ano);
    anoAtual = (*data).tm_year + 1900;

    iniciarFicheiro(fClientes, FICHEIRO_CLIENTES);
    iniciarFicheiro(fMateriais, FICHEIRO_MATERIAIS);
    iniciarFicheiro(fAdmins, FICHEIRO_ADMINS);
    iniciarFicheiro(fMoveis, FICHEIRO_MOVEIS);
    iniciarFicheiro(fEncomendas, FICHEIRO_ENCOMENDAS);

    nClientes = contarLinhas(fClientes, FICHEIRO_CLIENTES);
    nMateriais = contarLinhas(fMateriais, FICHEIRO_MATERIAIS);
    nAdmins = contarLinhas(fAdmins, FICHEIRO_ADMINS);
    nMoveis = contarLinhas(fMoveis, FICHEIRO_MOVEIS);
    nEncomendas = contarLinhas(fEncomendas, FICHEIRO_ENCOMENDAS);

    if (nClientes > 0) {
        clientes.contador = nClientes;
        lerFicheiroClientes(&clientes, fClientes, nClientes, FICHEIRO_CLIENTES);
    }

    if (nMateriais > 0) {
        materiais.contador = nMateriais;
        lerFicheiroMateriais(&materiais, fMateriais, nMateriais, FICHEIRO_MATERIAIS);
    }

    if (nAdmins > 0) {
        admins.contador = nAdmins;
        lerFicheiroAdmins(&admins, fAdmins, nAdmins, FICHEIRO_ADMINS);
    }

    if (nMoveis > 0) {
        nMoveis = contarMoveis(fMoveis, FICHEIRO_MOVEIS);
        moveis.contador = nMoveis;
        lerFicheiroMoveis(&moveis, fMoveis, FICHEIRO_MOVEIS);
    }

    if (nEncomendas > 0) {
        lerFicheiroEncomendas(&encomendas, fEncomendas, FICHEIRO_ENCOMENDAS);
    }

    while (run) {
ponto1:
        linha();
        printf("MOVEIS PARA TODOS\n");
        linha();

        printf(
                "[ 1 ] - Entrar\n"
                "[ 2 ] - Criar conta\n"
                "[ 3 ] - Sair\n");
        printf("\n");
        opcao = lerInt(1, 3, DIGITE_OPCAO);
        linha();
        switch (opcao) {
            case ENTRAR:

                ponto2 :
                        printf("Deseja entrar como: \n");
                printf("\n");
                printf(
                        "[ 1 ] - Admin\n"
                        "[ 2 ] - Cliente\n"
                        "[ 0 ] - Retroceder\n"
                        "[ -1 ] - Fechar\n");
                printf("\n");

                opcao = lerInt(-1, 2, DIGITE_OPCAO);

                switch (opcao) {
                    case ADMIN:
                        linha();

                        numeroAdmin = lerIntSemLimite("Digite o seu numero de admin: ");

                        lerStringDinamica(&password, LER_PASSWORD);
                        linha();

                        resultado = verificarAdmins(admins, numeroAdmin, password);

                        if (resultado) {
                            printf(CONTA_ACESSADA);
                            linha();
                            pos_admin = posAdmin(admins, numeroAdmin);

                            admin = true;
                        } else {
                            printf("Nao foi possivel acessar a sua conta\n");
                            linha();
                            admin = false;
                            goto ponto2;
                            continue;
                        }

                        break;

                    case CLIENTE:
                        linha();
                        lerStringDinamica(&nif, LER_NIF);
                        lerStringDinamica(&password, LER_PASSWORD);

                        resultado = verificarCliente(clientes, nif, password);


                        if (resultado) {

                            for (int j = 0; j < clientes.contador; j++) {
                                if (strcmp(clientes.cliente[j].nif, nif) == 0) {
                                    num = clientes.cliente[j].numeroCliente;
                                    if (clientes.cliente[j].estado == INATIVO) {
                                        linha();
                                        printf("A sua conta esta desativa, contacte um administrador para ativa la\n");
                                        goto ponto1;
                                    }
                                }
                            }

                            linha();
                            printf(CONTA_ACESSADA);
                            admin = false;
                        } else {
                            linha();
                            printf(CONTA_INEXISTENTE);
                            linha();
                            goto ponto2;
                        }
                        break;
                    case RETROCEDER:
                        goto ponto1;
                    case SAIR1:
                        run = false;
                        continue;
                        break;
                }
                break;
            case CRIAR_CONTA:

                ponto3 :
                        printf("Deseja criar conta como\n");
                printf("\n");
                printf(
                        "[ 1 ] - Admin\n"
                        "[ 2 ] - Cliente\n"
                        "[ 0 ] - Retroceder\n"
                        "[ -1 ] - Fechar\n");
                printf("\n");
                opcao = lerInt(-1, 2, DIGITE_OPCAO);


                switch (opcao) {
                    case ADMIN:
                        linha();
                        lerStringDinamica(&codigoAdmin, "Digite a password de admin: ");
                        linha();
                        if (strcmp(codigoAdmin, PASS_ADMIN) == 0) {
                            printf(ACESSO_GARANTIDO);
                            linha();

                            lerStringDinamica(&nomeCriarA, LER_NOME);
                            lerStringDinamica(&apelidoCriarA, LER_APELIDO);

                            do {
                                lerStringDinamica(&passwordCriarA1, LER_PASSWORD);
                                lerStringDinamica(&passwordCriarA2, CONFIRMAR_PASSWORD);

                                if (strcmp(passwordCriarA1, passwordCriarA2) != 0) {
                                    printf(PASSWORD_INCORRETA);
                                }
                            } while (strcmp(passwordCriarA1, passwordCriarA2) != 0);

                            criarAdmin(&admins, nomeCriarA, apelidoCriarA, passwordCriarA2, &nAdminCriarA);

                            printf("O seu numedo de admin e: %d\n", nAdminCriarA);
                            linha();
                            printf(CONTA_CRIADA);
                            free(codigoAdmin);
                            goto ponto1;
                        } else {
                            printf(ACESSO_NEGADO);
                            linha();
                            goto ponto3;
                        }

                        continue;
                        break;

                    case CLIENTE:
                        linha();

                        lerStringDinamica(&paisCriarC, LER_PAIS);
                        do {
                            lerStringDinamica(&nifCriarC, LER_NIF);
                            nifRepetido = false;
                            for (int k = 0; k < clientes.contador; k++) {
                                if (strcmp(nifCriarC, clientes.cliente[k].nif) == 0) {
                                    printf("Impossivel criar conta\nIntroduza um NIF valido\n");
                                    nifRepetido = true;
                                }
                            }
                        } while (nifRepetido == true);
                        lerStringDinamica(&nomeCriarC, LER_NOME);
                        lerStringDinamica(&apelidoCriarC, LER_APELIDO);

                        anoNascimentoCriarC = lerInt(1940, anoAtual, DIGITE_ANO_NASCIMENTO);
                        mesNascimentoCriarC = lerInt(1, 12, DIGITE_MES_NASCIMENTO);

                        if (mesNascimentoCriarC == 2) {
                            if (anoNascimentoCriarC % 4 == 0) {
                                diaNascimentoCriarC = lerInt(1, 29, DIGITE_DIA_NASCIMENTO);
                            } else {
                                diaNascimentoCriarC = lerInt(1, 28, DIGITE_DIA_NASCIMENTO);
                            }
                        } else {
                            if (mesNascimentoCriarC <= 7) {
                                if (mesNascimentoCriarC % 2 == 0) {
                                    diaNascimentoCriarC = lerInt(1, 30, DIGITE_DIA_NASCIMENTO);
                                } else {
                                    diaNascimentoCriarC = lerInt(1, 31, DIGITE_DIA_NASCIMENTO);
                                }
                            } else {
                                if (mesNascimentoCriarC % 2 == 0) {
                                    diaNascimentoCriarC = lerInt(1, 31, DIGITE_DIA_NASCIMENTO);
                                } else {
                                    diaNascimentoCriarC = lerInt(1, 30, DIGITE_DIA_NASCIMENTO);
                                }
                            }
                        }

                        lerStringDinamica(&cidadeCriarC, "Digite a sua cidade: ");
                        lerStringDinamica(&ruaCriarC, "Digite a sua rua: ");
                        lerStringDinamica(&portaCriarC, "Digite a sua porta e|ou numero de andar: ");
                        lerStringDinamica(&cPostalCriarC, "Digite o seu codigo postal: ");

                        do {
                            lerStringDinamica(&passwordCriarC1, "Digite a sua password [maximo 100 caracteres]: ");
                            lerStringDinamica(&passwordCriarC2, "Confirme a sua password: ");

                            if (strcmp(passwordCriarC1, passwordCriarC2) != 0) {
                                printf(PASSWORD_INCORRETA);
                            }
                        } while (strcmp(passwordCriarC1, passwordCriarC2) != 0);

                        criarCliente(&clientes, paisCriarC, nifCriarC, nomeCriarC, apelidoCriarC, diaNascimentoCriarC, mesNascimentoCriarC, anoNascimentoCriarC, cidadeCriarC, ruaCriarC, portaCriarC, cPostalCriarC, passwordCriarC2, &nClienteCriarC);

                        printf("O seu numero de cliente: %d\n", nClienteCriarC);

                        printf(CONTA_CRIADA);
                        goto ponto1;
                        continue;
                        break;

                    case RETROCEDER:
                        goto ponto1;
                        break;

                    case SAIR1:
                        run = false;
                        continue;
                        break;
                }
                break;
            case SAIR:
                run = false;
                continue;
                break;
        }

        if (admin == true) {
ponto4:
            printf("             MENU ADMIN                      \n");
            linha();
            printf(
                    "[ 1 ] - Gestao de clientes\n"
                    "[ 2 ] - Gestao dos moveis\n"
                    "[ 3 ] - Gestao de producao\n"
                    "[ 4 ] - Definicoes da conta\n"
                    "[ 5 ] - Extras\n"
                    "[ 0 ] - Retroceder\n"
                    "[ -1 ] - Fechar\n");
            printf("\n");
            opcao = lerInt(-1, 5, DIGITE_OPCAO);

            switch (opcao) {
                case CLIENTES:
                    linha();
ponto5:
                    printf("             GESTAO DE CLIENTES                      \n");
                    linha();
                    printf(
                            "[ 1 ] - Criar cliente\n"
                            "[ 2 ] - Editar cliente\n"
                            "[ 3 ] - Remover ou desativar/ativar cliente\n"
                            "[ 4 ] - Procurar dados do cliente\n"
                            "[ 5 ] - Listar todos os dados dos clientes\n"
                            "[ 0 ] - Retroceder\n"
                            "[ -1 ] - Fechar\n");
                    linha();
                    opcao1 = lerInt(-1, 5, DIGITE_OPCAO);
                    linha();

                    switch (opcao1) {
                        case CRIAR:
                            lerStringDinamica(&paisCriarC, LER_PAIS);
                            do {
                                lerStringDinamica(&nifCriarC, LER_NIF);
                                nifRepetido = false;
                                for (int k = 0; k < clientes.contador; k++) {
                                    if (strcmp(nifCriarC, clientes.cliente[k].nif) == 0) {
                                        printf("Impossivel criar conta\nIntroduza um NIF valido\n");
                                        nifRepetido = true;
                                    }
                                }
                            } while (nifRepetido == true);
                            lerStringDinamica(&nomeCriarC, LER_NOME);
                            lerStringDinamica(&apelidoCriarC, LER_APELIDO);

                            anoNascimentoCriarC = lerInt(1940, anoAtual, DIGITE_ANO_NASCIMENTO);
                            mesNascimentoCriarC = lerInt(1, 12, DIGITE_MES_NASCIMENTO);

                            if (mesNascimentoCriarC == 2) {
                                if (anoNascimentoCriarC % 4 == 0) {
                                    diaNascimentoCriarC = lerInt(1, 29, DIGITE_DIA_NASCIMENTO);
                                } else {
                                    diaNascimentoCriarC = lerInt(1, 28, DIGITE_DIA_NASCIMENTO);
                                }
                            } else {
                                if (mesNascimentoCriarC <= 7) {
                                    if (mesNascimentoCriarC % 2 == 0) {
                                        diaNascimentoCriarC = lerInt(1, 30, DIGITE_DIA_NASCIMENTO);
                                    } else {
                                        diaNascimentoCriarC = lerInt(1, 31, DIGITE_DIA_NASCIMENTO);
                                    }
                                } else {
                                    if (mesNascimentoCriarC % 2 == 0) {
                                        diaNascimentoCriarC = lerInt(1, 31, DIGITE_DIA_NASCIMENTO);
                                    } else {
                                        diaNascimentoCriarC = lerInt(1, 30, DIGITE_DIA_NASCIMENTO);
                                    }
                                }
                            }

                            lerStringDinamica(&cidadeCriarC, "Digite a sua cidade: ");
                            lerStringDinamica(&ruaCriarC, "Digite a sua rua: ");
                            lerStringDinamica(&portaCriarC, "Digite a sua porta e|ou numero de andar: ");
                            lerStringDinamica(&cPostalCriarC, "Digite o seu codigo postal: ");

                            do {
                                lerStringDinamica(&passwordCriarC1, "Digite a sua password [maximo 100 caracteres]: ");
                                lerStringDinamica(&passwordCriarC2, "Confirme a sua password: ");

                                if (strcmp(passwordCriarC1, passwordCriarC2) != 0) {
                                    printf(PASSWORD_INCORRETA);
                                }
                            } while (strcmp(passwordCriarC1, passwordCriarC2) != 0);

                            criarCliente(&clientes, paisCriarC, nifCriarC, nomeCriarC, apelidoCriarC, diaNascimentoCriarC, mesNascimentoCriarC, anoNascimentoCriarC, cidadeCriarC, ruaCriarC, portaCriarC, cPostalCriarC, passwordCriarC2, &nClienteCriarC);

                            printf("O numero de cliente: %d\n", nClienteCriarC);

                            printf(CONTA_CRIADA);
                            linha();
                            goto ponto5;
                            break;

                        case EDITAR:
                            num = lerInt(0, 120000, "Introduza o numero do cliente que deseja alterar: ");
                            for (int i = 0; i < clientes.contador; i++) {
                                if (num == clientes.cliente[i].numeroCliente) {
                                    check = 1;
                                } else {
                                    check = 0;
                                }
                            }
                            if (check == 0 || clientes.contador == 0) {
                                printf(CLIENTE_NAO_EXISTENTE);
                            } else {
                                do {
                                    linha();
                                    printf("Escolha o que deseja alterar: \n");
                                    printf("\n");
                                    printf(
                                            "[ 1 ] - Nome e apelido\n"
                                            "[ 2 ] - NIF\n"
                                            "[ 3 ] - Pais\n"
                                            "[ 4 ] - Password\n"
                                            "[ 5 ] - Data de nascimento\n"
                                            "[ 6 ] - Morada\n");
                                    printf("\n");
                                    opcao = lerInt(1, 6, DIGITE_OPCAO);
                                    linha();

                                    posicaoCliente = posCliente(clientes, num);

                                    switch (opcao) {
                                        case NOME:
                                            lerStringDinamica(&nome, LER_NOME);
                                            len2 = strlen(nome);
                                            if (len2 == 0) {
                                                len2 = strlen(clientes.cliente[posicaoCliente].nome);
                                                nome = (char *) realloc(nome, (len2 + 1) * sizeof (char));
                                                strcpy(nome, clientes.cliente[posicaoCliente].nome);
                                            }

                                            lerStringDinamica(&apelido, LER_APELIDO);
                                            len2 = strlen(apelido);
                                            if (len2 == 0) {
                                                len2 = strlen(clientes.cliente[posicaoCliente].apelido);
                                                apelido = (char *) realloc(apelido, (len2 + 1) * sizeof (char));
                                                strcpy(apelido, clientes.cliente[posicaoCliente].apelido);
                                            }

                                            editarNomeClientes(&clientes, num, nome, apelido);
                                            linha();
                                            break;
                                        case NIF:
                                            lerStringDinamica(&nifNovo, LER_NIF);
                                            len2 = strlen(nifNovo);
                                            if (len2 == 0) {
                                                len2 = strlen(clientes.cliente[posicaoCliente].nif);
                                                nifNovo = (char *) realloc(nifNovo, (len2 + 1) * sizeof (char));
                                                strcpy(nifNovo, clientes.cliente[posicaoCliente].nif);
                                            }

                                            editarNIFClientes(&clientes, num, nifNovo);
                                            linha();
                                            break;
                                        case PAIS:

                                            lerStringDinamica(&pais, LER_PAIS);
                                            len2 = strlen(pais);
                                            if (len2 == 0) {
                                                len2 = strlen(clientes.cliente[posicaoCliente].pais);
                                                pais = (char *) realloc(pais, (len2 + 1) * sizeof (char));
                                                strcpy(pais, clientes.cliente[posicaoCliente].pais);
                                            }

                                            editarPaisClientes(&clientes, num, pais);
                                            linha();
                                            break;
                                        case PASSWORD:
                                            do {
                                                lerStringDinamica(&password1, "Digite a sua nova password [maximo 100 caracteres]: ");
                                                lerStringDinamica(&password2, "Confirme a nova password: ");

                                                if (strcmp(password1, password2) != 0) {
                                                    printf(PASSWORD_INCORRETA);
                                                }
                                            } while (strcmp(password1, password2) != 0);

                                            editarPasswordClientes(&clientes, num, password);
                                            linha();
                                            break;
                                        case DATA:

                                            anoNascimento = lerInt(1900, anoAtual - 18, DIGITE_ANO_NASCIMENTO);
                                            mesNascimento = lerInt(1, 12, DIGITE_MES_NASCIMENTO);

                                            if (mesNascimento == 2) {
                                                if (anoNascimento % 4 == 0) {
                                                    lerInt(1, 29, DIGITE_DIA_NASCIMENTO);
                                                } else {
                                                    lerInt(1, 28, DIGITE_DIA_NASCIMENTO);
                                                }
                                            } else {
                                                if (mesNascimento <= 7) {
                                                    if (mesNascimento % 2 == 0) {
                                                        diaNascimento = lerInt(1, 30, DIGITE_DIA_NASCIMENTO);
                                                    } else {
                                                        diaNascimento = lerInt(1, 31, DIGITE_DIA_NASCIMENTO);
                                                    }
                                                } else {
                                                    if (mesNascimento % 2 == 0) {
                                                        diaNascimento = lerInt(1, 31, DIGITE_DIA_NASCIMENTO);
                                                    } else {
                                                        diaNascimento = lerInt(1, 30, DIGITE_DIA_NASCIMENTO);
                                                    }
                                                }
                                            }

                                            editarDataClientes(&clientes, num, diaNascimento, mesNascimento, anoNascimento);
                                            linha();
                                            break;
                                        case MORADA:

                                            lerStringDinamica(&cidade, "Digite a sua cidade: ");
                                            len2 = strlen(cidade);
                                            if (len2 == 0) {
                                                len2 = strlen(clientes.cliente[posicaoCliente].morada.cidade);
                                                cidade = (char *) realloc(cidade, (len2 + 1) * sizeof (char));
                                                strcpy(cidade, clientes.cliente[posicaoCliente].morada.cidade);
                                            }
                                            lerStringDinamica(&rua, "Digite a sua rua:");
                                            len2 = strlen(rua);
                                            if (len2 == 0) {
                                                len2 = strlen(clientes.cliente[posicaoCliente].morada.rua);
                                                rua = (char *) realloc(rua, (len2 + 1) * sizeof (char));
                                                strcpy(rua, clientes.cliente[posicaoCliente].morada.rua);
                                            }
                                            lerStringDinamica(&nPorta, "Digite a sua porta e|ou numero de andar: ");
                                            len2 = strlen(nPorta);
                                            if (len2 == 0) {
                                                len2 = strlen(clientes.cliente[posicaoCliente].morada.numeroPorta);
                                                nPorta = (char *) realloc(nPorta, (len2 + 1) * sizeof (char));
                                                strcpy(nPorta, clientes.cliente[posicaoCliente].morada.numeroPorta);
                                            }
                                            lerStringDinamica(&cPostal, "Digite o seu codigo postal: ");
                                            len2 = strlen(cPostal);
                                            if (len2 == 0) {
                                                len2 = strlen(clientes.cliente[posicaoCliente].morada.codigoPostal);
                                                cPostal = (char *) realloc(cPostal, (len2 + 1) * sizeof (char));
                                                strcpy(cPostal, clientes.cliente[posicaoCliente].morada.codigoPostal);
                                            }

                                            editarMoradaClientes(&clientes, num, cidade, rua, cPostal, nPorta);
                                            linha();
                                            break;
                                    }
                                    do {
                                        resposta = lerChar("Deseja alterar mais algo (s/S)(n/N)\n");
                                    } while (resposta != 's' && resposta != 'S' && resposta != 'n' && resposta != 'N');
                                } while (resposta == 'S' || resposta == 's');
                                printf("Conta atualizada com sucesso\n");
                            }
                            linha();
                            goto ponto5;
                            break;
                        case REMOVER_DESATIVAR:
                            ponto6 :
                                    printf("Deseja remover, desativar ou ativar o cliente?\n");
                            printf(
                                    "[ 1 ] - Remover\n"
                                    "[ 2 ] - Ativar\n"
                                    "[ 3 ] - Desativar\n"
                                    "[ 0 ] - Retroceder\n"
                                    "[ -1 ] - Fechar\n");
                            opcao = lerInt(-1, 3, DIGITE_OPCAO);
                            linha();

                            switch (opcao) {
                                case -1:
                                    run = false;
                                    break;
                                case 0:
                                    goto ponto5;
                                    break;
                                case 1:
                                    posicaoCliente = lerInt(0, 120000, "Introduza o numero do cliente que deseja remover: ");
                                    check = posCliente(clientes, posicaoCliente);
                                    if (check == -1) {
                                        printf(CLIENTE_NAO_EXISTENTE);
                                        printf("\n");
                                    } else if ((checkEncomendas(posicaoCliente, encomendas)) == 1) {
                                        printf("O cliente tem encomendas em registo apenas sera possivel mudar o estado do seu perfil\n");
                                        linha();
                                        goto ponto6;
                                    } else {
                                        printf("\n");
                                        linha();
                                        removerCliente(&clientes, posicaoCliente);
                                        printf("Cliente removido com sucesso\n");
                                        linha();
                                        goto ponto6;
                                    }
                                    break;
                                case 2:
                                    posicaoCliente = lerInt(0, 120000, "Introduza o numero do cliente que deseja ativar: ");
                                    printf("\n");
                                    linha();
                                    dAc = desativarAtivarCliente(&clientes, posicaoCliente, ATIVO);
                                    if (dAc == -1) {
                                        printf(CLIENTE_NAO_EXISTENTE);
                                        printf("\n");
                                    } else if (dAc == 0) {
                                        printf("O cliente ja se encontra no estado atual\n");
                                        linha();
                                    } else if (dAc == 1) {
                                        printf("Alteracao de estado feita com sucesso\n");
                                        linha();
                                    }
                                    goto ponto6;
                                    break;

                                case 3:
                                    posicaoCliente = lerInt(0, 120000, "Introduza o numero do cliente que deseja desativar: ");
                                    printf("\n");
                                    linha();
                                    dAc = desativarAtivarCliente(&clientes, posicaoCliente, INATIVO);
                                    if (dAc == -1) {
                                        printf(CLIENTE_NAO_EXISTENTE);
                                        printf("\n");
                                        linha();
                                    } else if (dAc == 0) {
                                        printf("O cliente ja se encontra no estado atual\n");
                                        linha();
                                    } else if (dAc == 1) {
                                        printf("Alteracao de estado feita com sucesso\n");
                                        linha();
                                    }
                                    goto ponto6;
                                    break;
                            }

                            break;
                        case PROCURAR:

                            escolha = lerInt(0, 120000, "Introduza o numero do cliente que deseja procurar: ");
                            linha();
                            posicaoCliente = posCliente(clientes, escolha);
                            if (posicaoCliente == -1) {
                                printf("Cliente nao encontrado\n");
                            } else {
                                printf("Cliente encontrado\n");
                                printf("\n");
                                printf("Nome: %s     Apelido: %s    \n", clientes.cliente[posicaoCliente].nome, clientes.cliente[posicaoCliente].apelido);
                                printf("Numero de cliente: %d \n", clientes.cliente[posicaoCliente].numeroCliente);
                                printf("NIF: %s   \n", clientes.cliente[posicaoCliente].nif);
                                printf("Nascido a: %d/%d/%d  \n", clientes.cliente[posicaoCliente].data.dia,
                                        clientes.cliente[posicaoCliente].data.mes,
                                        clientes.cliente[posicaoCliente].data.ano);
                                printf("Morada: \n    Rua: %s \n    Codigo postal: %s \n    Cidade: %s     Pais: %s \n",
                                        clientes.cliente[posicaoCliente].morada.rua,
                                        clientes.cliente[posicaoCliente].morada.codigoPostal, clientes.cliente[posicaoCliente].morada.cidade, clientes.cliente[posicaoCliente].pais);
                            }
                            linha();
                            goto ponto5;
                            break;
                        case LISTAR:
                            listarClientes(clientes);
                            goto ponto5;
                            break;
                        case RETROCEDER2:
                            goto ponto4;
                            break;
                        case SAIR3:
                            run = false;
                            break;
                    }
                    break;

                case MOVEIS:
                    linha();
ponto7:
                    printf("             GESTAO DOS MOVEIS                      \n");
                    linha();
                    printf(
                            "[ 1 ] - Adicionar movel\n"
                            "[ 2 ] - Editar movel\n"
                            "[ 3 ] - Remover movel\n"
                            "[ 4 ] - Listar dados dos moveis\n"
                            "[ 5 ] - Exportar ficha tecnica de um movel\n"
                            "[ 0 ] - Retroceder\n"
                            "[ -1 ] - Fechar\n");
                    linha();
                    opcao1 = lerInt(-1, 5, DIGITE_OPCAO);

                    switch (opcao1) {
                        case CRIAR:
                            linha();

                            run3 = true;

                            do {
                                lerString(codigoProduto, TAMANHO_CODIGO_MOVEL - 1, "Digite o codigo do produto: ");
                                codigoExistente = codigoExistenteMovel(moveis, codigoProduto);
                            } while (codigoExistente);

                            lerStringDinamica(&nome2, "Digite o nome do movel: ");

                            comprimento = lerFloatSemLimite("Digite o comprimento: ");

                            largura = lerFloatSemLimite("Digite a largura: ");

                            altura = lerFloatSemLimite("Digite a altura: ");

                            preco = lerFloatSemLimite("Digite o preco: ");

                            materiaisTemp.contador = 0;
                            while (run3) {
                                if (materiaisTemp.contador == 0) {
                                    materiaisTemp.material = (Material *) malloc(INCREMENTO * sizeof (Material));
                                } else {
                                    if (materiaisTemp.contador % 10 == 0) {
                                        materiaisTemp.material = (Material *) realloc(materiaisTemp.material, (materiaisTemp.contador + INCREMENTO) * sizeof (Material));
                                    }
                                }

                                pos = materiaisTemp.contador;
                                for (int i = 0; i < materiais.contador; i++) {
                                    printf("[ %d ] - %s\n", i, materiais.material[i].nomeMaterial);
                                }
                                printf("[ %d ] - Finalizar\n", materiais.contador);

                                opcao3 = lerInt(0, materiais.contador, "Digite a sua opcao: ");

                                if (opcao3 != materiais.contador) {
                                    quantidade = lerIntSemLimite("Digite a quantidede desejada: ");
                                    materiaisTemp.material[pos].contador = quantidade;
                                    len = strlen(materiais.material[opcao3].nomeMaterial);
                                    materiaisTemp.material[pos].nomeMaterial = (char *) malloc(len * sizeof (char));
                                    len = strlen(materiais.material[opcao3].unidade);
                                    materiaisTemp.material[pos].unidade = (char *) malloc((len + 1) * sizeof (char));

                                    strcpy(materiaisTemp.material[pos].nomeMaterial, materiais.material[opcao3].nomeMaterial);
                                    strcpy(materiaisTemp.material[pos].codigoMaterial, materiais.material[opcao3].codigoMaterial);
                                    strcpy(materiaisTemp.material[pos].unidade, materiais.material[opcao3].unidade);
                                    materiaisTemp.contador++;
                                } else {
                                    run3 = false;
                                }
                            }
                            if (materiaisTemp.contador != 0) {
                                criarMovel(&moveis, materiaisTemp, nome2, preco, comprimento, largura, altura, codigoProduto);
                                printf("Movel adicionado\n");
                            }
                            limparMateriais(&materiaisTemp);

                            linha();
                            goto ponto7;
                            break;

                        case EDITAR:
                            linha();
                            lerString(codigo_produto, TAMANHO_CODIGO_MOVEL - 1, "Insira o codigo do movel que deseja editar:");
                            resultadoEMoveis = verificarMovel(moveis, codigo_produto);
                            do {
                                if (resultadoEMoveis == -1) {
                                    printf(MOVEL_INEXISTENTE);
                                } else {
                                    printf(
                                            "[ 1 ] - Nome\n"
                                            "[ 2 ] - Codigo produto\n"
                                            "[ 3 ] - Dimensoes\n"
                                            "[ 4 ] - Preco\n"
                                            "[ 5 ] - Estado\n"
                                            "[ 6 ] - Material\n");
                                    resposta = lerInt(1, 6, "Digite a opcao que pertende editar:");
                                    printf("\n");
                                    switch (resposta) {
                                        case 1:
                                            lerStringDinamica(&nome, "Digite o nome do movel");
                                            editarNomeMovel(nome, resultadoEMoveis, &moveis);
                                            break;
                                        case 2:
                                            codigoExistente = true;
                                            do {
                                                lerString(codigo, TAMANHO_CODIGO_MOVEL - 1, "Insira o novo codigo do produto:");
                                                codigoExistente = codigoExistenteMovel(moveis, codigo);
                                            } while (codigoExistente);
                                            editarCodigoMovel(codigo, resultadoEMoveis, &moveis);
                                            break;
                                        case 3:
                                            printf("Novas dimensoes:\n");
                                            comprimento = lerFloatSemLimite("Digite o comprimento: ");
                                            largura = lerFloatSemLimite("Digite a largura: ");
                                            altura = lerFloatSemLimite("Digite a altura: ");
                                            alterarDimensoesMovel(comprimento, largura, altura, resultadoEMoveis, &moveis);
                                            break;
                                        case 4:
                                            preco = lerFloatSemLimite("Digite o preco: ");
                                            editarPrecoMovel(preco, resultadoEMoveis, &moveis);
                                            break;
                                        case 5:
                                            if (moveis.movel[resultadoEMoveis].estado == 1) {
                                                printf("Estado atual: Ativo\n");
                                            } else {
                                                printf("Estado atual: Inativo\n");
                                            }
                                            printf("Deseja alterar o estado\n[ 1 ] - Sim\n[ 2 ] - Nao\n");
                                            opcaoEstado = lerInt(1, 2, "Opcao:");
                                            if (opcaoEstado == 1) {
                                                alterarEstadoMovel(&moveis, resultadoEMoveis);
                                                printf("Estado alterado com sucesso\n");
                                                linha();
                                            }
                                            break;
                                        case 6:
                                            printf(
                                                    "[ 1 ] - Adicionar material\n"
                                                    "[ 2 ] - Remover material\n"
                                                    "[ 3 ] - Alterar a quantidade de material\n"
                                                    "[ 4 ] - Retroceder\n");
                                            resposta = lerInt(1, 4, "Opcao:");
                                            switch (resposta) {
                                                case 1:
                                                    printf("Material disponivel:\n");
                                                    for (int i = 0; i < materiais.contador; i++) {
                                                        printf("[ %d ] - %s\n", i, materiais.material[i].nomeMaterial);
                                                    }
                                                    printf("[ %d ] - Cancelar\n", materiais.contador);

                                                    opcao4 = lerInt(0, materiais.contador, "Digite a sua opcao: ");
                                                    for (int i = 0; i < moveis.movel[resultadoEMoveis].contadorMateriais; i++) {
                                                        if (strcmp(moveis.movel[resultadoEMoveis].material[i].codigoMaterial, materiais.material[opcao4].codigoMaterial) == 0) {
                                                            printf("Esse material ja faz parte do movel\nApenas pode remover ou alterar a quantidade\n");
                                                            auxiliar++;
                                                        }
                                                    }
                                                    if (auxiliar == 0) {
                                                        quantidade = lerIntSemLimite("Quantidade: ");
                                                        adicionarMaterialMovel(&moveis, materiais, quantidade, resultadoEMoveis, opcao4);
                                                        auxiliar = 0;
                                                    }

                                                    break;
                                                case 2:
                                                    opcao4 = 0;
                                                    quantidade = 0;
                                                    printf("Material do movel:\n");
                                                    for (int i = 0; i < moveis.movel[resultadoEMoveis].contadorMateriais; i++) {
                                                        printf("[ %d ] - %s\n", i, moveis.movel[resultadoEMoveis].material[i].nomeMaterial);
                                                    }
                                                    printf("[ %d ] - Cancelar\n", moveis.movel[resultadoEMoveis].contadorMateriais);
                                                    opcao4 = lerInt(0, moveis.movel[resultadoEMoveis].contadorMateriais, "Digite o material que quero remover: ");
                                                    if (opcao4 != moveis.movel[resultadoEMoveis].contadorMateriais) {
                                                        eliminarMaterialMovel(&moveis, resultadoEMoveis, opcao4);
                                                    }
                                                    break;
                                                case 3:
                                                    opcao4 = 0;
                                                    quantidade = 0;
                                                    printf("Material do movel:\n");
                                                    for (int i = 0; i < moveis.movel[resultadoEMoveis].contadorMateriais; i++) {
                                                        printf("[ %d ] - %s\n", i, moveis.movel[resultadoEMoveis].material[i].nomeMaterial);
                                                    }
                                                    printf("[ %d ] - Cancelar\n", moveis.movel[resultadoEMoveis].contadorMateriais);
                                                    opcao4 = lerInt(0, moveis.movel[resultadoEMoveis].contadorMateriais, "Digite a sua opcao: ");
                                                    if (opcao4 != moveis.movel[resultadoEMoveis].contadorMateriais) {
                                                        quantidade = lerIntSemLimite("Insira a nova quantidade:");
                                                    }
                                                    editarQuantidadeMovel(&moveis, quantidade, resultadoEMoveis, opcao4);
                                                    break;
                                            }
                                    }
                                }
                                do {
                                    resposta = lerChar("Deseja alterar mais algo (s/S)(n/N)\n");
                                } while (resposta != 's' && resposta != 'S' && resposta != 'n' && resposta != 'N');
                            } while (resposta == 'S' || resposta == 's');
                            printf("Movel atualizado com sucesso\n");
                            linha();
                            goto ponto7;
                            break;

                        case REMOVER_DESATIVAR:
                            linha();
                            lerString(cMovel, TAMANHO_CODIGO_MOVEL - 1, "Insira o codigo do movel que deseja remover:");
                            resultadoEMoveis = verificarMovel(moveis, cMovel);
                            checkEncomendasMovel = verificarEncomendasMovel(encomendas, moveis, resultadoEMoveis);
                            if (resultadoEMoveis == -1) {
                                printf(MOVEL_INEXISTENTE);
                            } else if (checkEncomendasMovel == 1) {
                                printf("O mÃƒÂ³vel jÃƒÂ¡ foi encomendado.\nApenas pode alterar o seu estado\n");
                            } else if (resultadoEMoveis != -1 && checkEncomendasMovel == 0) {
                                eliminarMovel(&moveis, cMovel);
                                printf("Movel eliminado com sucesso\n");
                                linha();
                            }
                            goto ponto7;
                            break;
                        case PROCURAR:
                            listarMovel(moveis);
                            goto ponto7;
                            break;
                        case EXPORTAR - 1:
                            listarMovel(moveis);
                            lerString(codigo_produto, TAMANHO_CODIGO_MOVEL - 1, "Digite o codigo do movel que quer exportar: ");
                            linha();
                            check = verificarMovel(moveis, codigo_produto);
                            if (check != -1) {
                                escreverFicheiroFichaTencicaMovel(moveis, codigo_produto);
                                printf("Ficheiro exportado com sucesso\n");
                            } else {
                                printf(MOVEL_INEXISTENTE);
                            }
                            linha();
                            goto ponto7;
                            break;
                        case RETROCEDER2:
                            goto ponto4;
                            break;
                        case SAIR3:
                            run = false;
                            break;

                    }
                    break;
                case PRODUCAO:
                    linha();
ponto8:

                    printf("             GESTAO DE PRODUCAO                      \n");
                    linha();
                    printf(
                            "[ 1 ] - Ver todas as encomendas\n"
                            "[ 2 ] - Criar material\n"
                            "[ 3 ] - Editar material\n"
                            "[ 4 ] - Remover material\n"
                            "[ 5 ] - Ver material necessario para uma semana\n"
                            "[ 6 ] - Ver encomendas de um determinado cliente\n"
                            "[ 0 ] - Retroceder\n"
                            "[ -1 ] - Fechar\n");
                    opcao1 = lerInt(-1, 6, DIGITE_OPCAO);
                    switch (opcao1) {
                        case -1:
                            run = false;
                            break;
                        case 0:
                            linha();
                            goto ponto4;
                            break;
                        case 1:
                            linha();
                            listarEncomendas(encomendas, clientes, moveis);
                            goto ponto8;
                            break;
                        case 2:
                            linha();
                            pos = materiais.contador;
                            lerStringDinamica(&nome3, "Nome do material: ");
                            do {
                                lerString(codigoMaterial, TAMANHO_CODIGO_MATERIAL - 1, "Codigo do material: ");
                                codigoExistente = codigoExistenteMateriais(materiais, codigoMaterial);
                            } while (codigoExistente);
                            printf("Insira a unidade do produto:\n");
                            printf("[ 0 ] - Par\n"
                                    "[ 1 ] - Unidade\n");
                            unidade = lerInt(0, 1, "Unidade:");
                            criarMaterial(&materiais, codigoMaterial, nome3, unidade);
                            printf("Material adicionado\n");
                            linha();
                            goto ponto8;
                            break;
                        case 3:
                            linha();
                            lerString(codigoMaterial, TAMANHO_CODIGO_MATERIAL - 1, "Inira o codigo do material que deseja editar\n");
                            posicao_material = posMaterial(materiais, codigoMaterial);
                            if (posicao_material == 0) {
                                printf("Material nao encontrado\n");
                            } else {
                                printf("[ 1 ] - Nome\n"
                                        "[ 2 ] - Codigo do produto\n"
                                        "[ 3 ] - unidade\n");
                                opcao4 = lerInt(1, 3, "opcao:");
                                switch (opcao4) {
                                    case 1:
                                        lerStringDinamica(&nomeMaterial, "Novo mome:");
                                        editarNomeMaterial(&materiais, posicao_material, nomeMaterial);
                                        printf("Nome editado com sucesso\n");
                                        goto ponto8;
                                        break;
                                    case 2:
                                        do {
                                            lerString(codigoMaterial, TAMANHO_CODIGO_MATERIAL - 1, "Inira o novo codigo do material:");
                                            codigoExistente = codigoExistenteMateriais(materiais, codigoMaterial);
                                        } while (codigoExistente);
                                        editarCodigoMaterial(&materiais, posicao_material, codigoMaterial);
                                        printf("Codigo editado com sucesso\n");
                                        goto ponto8;
                                        break;
                                    case 3:
                                        printf("Tipo de unidade atual: %s\n", materiais.material[posicao_material].unidade);
                                        do {
                                            resposta = lerChar("Deseja alterar mais algo (s/S)(n/N)\n");
                                        } while (resposta != 's' && resposta != 'S' && resposta != 'n' && resposta != 'N');
                                        if (resposta == 's' || 'S') {
                                            alterarTipoUnidade(&materiais, posicao_material);
                                            printf("Unidade alterada com sucesso\n");
                                        }
                                        goto ponto8;
                                        break;
                                }
                            }
                        case 4:
                            linha();
                            listarMaterial(materiais);
                            lerString(codigoMaterial, TAMANHO_CODIGO_MATERIAL - 1, "Inira o codigo do produto que deseja remover:");
                            posicao_material = posMaterial(materiais, codigoMaterial);
                            if (posicao_material == -1) {
                                printf("Material nao encontrado\n");
                            } else {
                                removerMaterial(&materiais, posicao_material);
                            }
                            goto ponto8;
                            break;
                        case 5:
                            linha();
                            printf("Deseja ver o material preciso entre que datas:\n");
                            printf("Data 1:\n");
                            ano = lerInt(2000, 2023, "Ano:");
                            mes = lerInt(1, 12, "Mes:");
                            if (mes == 2) {
                                if (ano % 4 == 0) {
                                    dia = lerInt(1, 29, "Dia:");
                                } else {
                                    dia = lerInt(1, 28, "Dia:");
                                }
                            } else {
                                if (mes <= 7) {
                                    if (mes % 2 == 0) {
                                        dia = lerInt(1, 30, "Dia:");
                                    } else {
                                        dia = lerInt(1, 31, "Dia:");
                                    }
                                } else {
                                    if (mes % 2 == 0) {
                                        dia = lerInt(1, 31, "Dia:");
                                    } else {
                                        dia = lerInt(1, 30, "Dia:");
                                    }
                                }
                            }

                            data1.dia = dia;
                            data1.mes = mes;
                            data1.ano = ano;

                            printf("Data 2:\n");
                            ano = lerInt(2000, 2023, "Ano:");
                            mes = lerInt(1, 12, "Mes:");
                            if (mes == 2) {
                                if (ano % 4 == 0) {
                                    dia = lerInt(1, 29, "Dia:");
                                } else {
                                    dia = lerInt(1, 28, "Dia:");
                                }
                            } else {
                                if (mes <= 7) {
                                    if (mes % 2 == 0) {
                                        dia = lerInt(1, 30, "Dia:");
                                    } else {
                                        dia = lerInt(1, 31, "Dia:");
                                    }
                                } else {
                                    if (mes % 2 == 0) {
                                        dia = lerInt(1, 31, "Dia:");
                                    } else {
                                        dia = lerInt(1, 30, "Dia:");
                                    }
                                }
                            }

                            data2.dia = dia;
                            data2.mes = mes;
                            data2.ano = ano;

                            materiaisSemana(encomendas, moveis, data1, data2);
                            linha();
                            goto ponto8;
                            break;
                        case 6:
                            posicaoCliente = lerInt(0, 120000, "Introduza o numero do cliente que pretende verificar as encomendas em registo: ");
                            for (int i = 0; i < clientes.contador; i++) {
                                if (posicaoCliente == clientes.cliente[i].numeroCliente) {
                                    check = 1;
                                } else {
                                    check = 0;
                                }
                            }
                            if (check == 0 || clientes.contador == 0) {
                                printf(CLIENTE_NAO_EXISTENTE);
                            } else {
                                listarEncomendasCliente(posicaoCliente, encomendas, moveis);
                            }
                            linha();
                            goto ponto8;
                            break;
                    }
                    break;
                case GERIR:
                    linha();
ponto9:
                    printf("             DEFINICOES DA CONTA                      \n");
                    linha();

                    printf(
                            "[ 1 ] - Editar conta\n"
                            "[ 2 ] - Apagar conta\n"
                            "[ 0 ] - Retroceder\n"
                            "[ -1 ] - Fechar\n");
                    linha();
                    opcao1 = lerInt(-1, 2, DIGITE_OPCAO);

                    switch (opcao1) {
                        case EDITAR1:
                            linha();

                            printf("Dados atuais:\n");
                            printf("Numero de admin: %d\n", admins.admin[pos_admin].numeroAdmin);
                            printf("Nome:%s\n", admins.admin[pos_admin].nome);
                            printf("Apelido:%s\n", admins.admin[pos_admin].apelido);
                            printf("Password:%s\n", admins.admin[pos_admin].password);
                            linha();

                            do {
                                printf("Escolha o que deseja alterar: \n");
                                printf(
                                        "[ 1 ] - Nome e apelido\n"
                                        "[ 2 ] - Password\n");
                                linha();
                                opcao = lerInt(1, 2, DIGITE_OPCAO);
                                linha();

                                switch (opcao) {
                                    case NOMEa:
                                        lerStringDinamica(&nome, LER_NOME);
                                        lerStringDinamica(&apelido, LER_APELIDO);

                                        editarDadosPessoaisAdminNome(pos_admin, &admins, nome, apelido);
                                        break;
                                    case PASSWORDa:

                                        do {
                                            lerStringDinamica(&password1A, "Digite a sua nova password [maximo 100 caracteres]: ");
                                            lerStringDinamica(&password2A, "Confirme a nova password: ");

                                            if (strcmp(password1A, password2A) != 0) {
                                                printf(PASSWORD_INCORRETA);
                                            }
                                        } while (strcmp(password1A, password2A) != 0);

                                        editarDadosPessoaisAdminPassword(pos_admin, &admins, password2A);
                                        break;
                                }
                                do {
                                    resposta = lerChar("Deseja alterar mais algo (s/S)(n/N)\n");
                                } while (resposta != 's' && resposta != 'S' && resposta != 'n' && resposta != 'N');
                            } while (resposta == 'S' || resposta == 's');
                            printf("Conta atualizada com sucesso\n");
                            linha();
                            goto ponto9;
                            break;

                        case APAGAR:
                            removerAdmin(&admins, pos_admin);
                            goto ponto1;
                            break;

                        case RETROCEDER3:
                            linha();
                            goto ponto4;
                            break;

                        case SAIR4:
                            run = false;
                            break;
                    }
                    break;
                case OUTROS:
                    linha();
pontoExtra:
                    printf("---------------Extras---------------\n"
                            "[ 1 ] - Clientes que mais gastaram\n"
                            "[ 2 ] - Clientes com mais encomendas feitas\n"
                            "[ 3 ] - Material mais usado\n"
                            "[ 4 ] - Moveis com mais materiais\n"
                            "[ 5 ] - Moveis mais caros\n"
                            "[ 0 ] - Retroceder\n"
                            "[ -1 ] - Fechar\n");
                    printf("\n");
                    opcao = lerInt(-1, 5, DIGITE_OPCAO);
                    linha();

                    switch (opcao) {
                        case -1:
                            run = false;
                            break;
                        case 0:
                            goto ponto4;
                            break;
                        case 1:
                            if (clientes.contador == 0) {
                                printf("Nao existem clientes para fazer a listagem\n");
                            } else {
                                printf("        Clientes que mais gastaram      \n"
                                        "\n");
                                linha();
                                encontrarMaioresCompradores(&clientes);
                            }
                            goto pontoExtra;
                            break;
                        case 2:
                            if (clientes.contador == 0) {
                                printf("Nao existem clientes para fazer a listagem\n");
                            } else {
                                printf("        Clientes com mais encomendas feitas      \n"
                                        "\n");
                                linha();
                                encontrarClientesMaisEncomendas(&clientes);
                            }
                            goto pontoExtra;
                            break;
                        case 3:
                            if (materiais.contador == 0) {
                                printf("Nao existem materiais para fazer a listagem\n");
                            } else {
                                top5MateriaisMaisUsados(materiais);
                            }
                            goto pontoExtra;
                            break;
                        case 4:
                            if (moveis.contador == 0) {
                                printf("Nao existem moveis para fazer a listagem\n");
                            } else {
                                top5MoveisMaisMateriais(moveis);
                            }
                            goto pontoExtra;
                            break;
                        case 5:
                            if (moveis.contador == 0) {
                                printf("Nao existem moveis para fazer a listagem\n");
                            } else {
                                top5MoveisMaisCaros(moveis);
                            }
                            goto pontoExtra;
                            break;
                    }

                    break;
                case RETROCEDER1:
                    goto ponto1;
                    break;

                case SAIR2:
                    run = false;
                    break;
            }
        } else {
            linha();
ponto10:
            printf("             MENU CLIENTE                      \n");

            linha();
            printf(
                    "[ 1 ] - Registar encomendas\n"
                    "[ 2 ] - Eliminar encomendas\n"
                    "[ 3 ] - Consultar informacoes acerca de encomendas\n"
                    "[ 4 ] - Definicoes da conta\n"
                    "[ 5 ] - Extras\n"
                    "[ 0 ] - Retroceder\n"
                    "[ -1 ] - Fechar\n");
            printf("\n");
            opcao = lerInt(-1, 5, DIGITE_OPCAO);


            switch (opcao) {
                case REGISTAR:
                    linha();
                    run2 = true;
                    encomendaTemp.contador = 0;
                    while (run2) {
                        do {
                            for (int i = 0; i < moveis.contador; i++) {
                                if (moveis.movel[i].estado == 1) {
                                    printf("[ %d ] - %s\n", i, moveis.movel[i].nome);
                                }
                            }
                            printf("[ %d ] - Cancelar\n", moveis.contador);

                            opcao = lerInt(0, moveis.contador, "Digite a sua opcao: ");
                            if (moveis.movel[opcao].estado == 0) {
                                printf(INPUT_INVALIDO);
                                linha();
                                opcao = -1;
                            }
                        } while (opcao == -1);
                        if (opcao != moveis.contador) {
                            if (novaEncomenda) {
                                encomendaTemp.contador = 0;
                            }

                            posMovelEncomenda = encomendaTemp.contador;

                            if (posMovelEncomenda == 0) {
                                encomendaTemp.movelEncomenda = (MovelEncomenda *) malloc((posMovelEncomenda + 1) * sizeof (MovelEncomenda));
                            } else {
                                encomendaTemp.movelEncomenda = (MovelEncomenda *) realloc(encomendaTemp.movelEncomenda, (posMovelEncomenda + 1) * sizeof (MovelEncomenda));
                            }

                            strcpy(encomendaTemp.movelEncomenda[posMovelEncomenda].codigoProduto, moveis.movel[opcao].codigoProduto);

                            quantidade = lerInt(0, 1000, "Digite a quantidade que deseja: ");

                            encomendaTemp.movelEncomenda[posMovelEncomenda].quantidade = quantidade;
                            encomendaTemp.preco += moveis.movel[opcao].preco * quantidade;
                            encomendaTemp.numeroCliente = num;

                            diaAtual = (*data).tm_mday;
                            mesAtual = (*data).tm_mon + 1;
                            anoAtual = (*data).tm_year + 1900;

                            encomendaTemp.data.dia = diaAtual;
                            encomendaTemp.data.mes = mesAtual;
                            encomendaTemp.data.ano = anoAtual;

                            encomendaTemp.contador++;

                            printf(
                                    "[ 1 ] - Adicionar movel a encomenda\n"
                                    "[ 2 ] - Confirmar encomenda\n");
                            opcao2 = lerInt(1, 2, "Digite a sua opcao: ");

                            if (opcao2 == 1) {
                                novaEncomenda = false;
                                continue;
                            } else {
                                printf("O custo da encomenda e: %.2f\n", encomendaTemp.preco);
                                printf(
                                        "[ 1 ] - Confirmar pagamento\n"
                                        "[ 2 ] - Cancelar encomenda\n");
                                opcao2 = lerInt(1, 2, "Digite a sua opcao: ");
                                if (opcao2 == 1) {
                                    run2 = false;
                                    criarEncomenda(&encomendas, &materiais, moveis, encomendaTemp, &clientes);
                                } else {
                                    printf(OPERACAO_CANCELADA);
                                }
                            }
                        } else {
                            run2 = false;
                        }
                    }

                    limparEncomendaTemp(&encomendaTemp);

                    linha();
                    goto ponto10;
                    break;
                case MODIFICAR:
                    linha();
                    if (encomendas.contador > 0) {
                        listarEncomendasCliente(num, encomendas, moveis);
                        numEncomenda = lerIntSemLimite("Numero da encomenda que deseja cancelar:");
                        printf("%d\n", num);
                        printf("%d\n", numEncomenda);
                        resultadoCheckEncomenda = checkEncomendaCancelar(num, numEncomenda, encomendas);
                        if (resultadoCheckEncomenda == 0) {
                            printf("Encomenda nao existe\nImpossivel de cancelar\n");
                        } else {
                            printf("Tem a certeza que quer cancelar a encomenda\n");
                            printf("[ 1 ] - Sim\n[ 2 ] - Nao\n");
                            opcao = lerInt(1, 2, "Opcao:");
                            if (opcao == 1) {
                                cancelarEncomenda(&encomendas, numEncomenda, &clientes, &materiais, moveis);
                                printf("Encomenda cancelada\n");
                            }
                        }
                        linha();
                    } else {
                        printf("Nao existem encomendas\n");
                    }
                    linha();
                    goto ponto10;
                    break;
                case CONSULTAR:
                    linha();
                    if (encomendas.contador > 0) {
                        listarEncomendasCliente(num, encomendas, moveis);
                    } else {
                        printf("Nao existem encomendas\n");
                    }
                    linha();
                    goto ponto10;
                    break;
                case DEFINICOES:
                    linha();
ponto11:
                    printf("             DEFINICOES DA CONTA                      \n");
                    linha();
                    printf(
                            "[ 1 ] - Editar perfil\n"
                            "[ 2 ] - Remover perfil\n"
                            "[ 0 ] - Retroceder\n"
                            "[ -1 ] - Fechar\n");
                    printf("\n");
                    opcao1 = lerInt(-1, 4, DIGITE_OPCAO);
                    linha();
                    switch (opcao1) {
                        case 1:
                            do {
                                printf("Escolha o que deseja alterar: \n");
                                printf("\n");
                                printf(
                                        "[ 1 ] - Nome e apelido\n"
                                        "[ 2 ] - NIF\n"
                                        "[ 3 ] - Pais\n"
                                        "[ 4 ] - Password\n"
                                        "[ 5 ] - Data de nascimento\n"
                                        "[ 6 ] - Morada\n");
                                printf("\n");
                                opcao = lerInt(1, 6, DIGITE_OPCAO);
                                linha();
                                posicaoCliente = posCliente(clientes, num);

                                switch (opcao) {
                                    case NOME:
                                        lerStringDinamica(&nome, LER_NOME);
                                        len2 = strlen(nome);
                                        if (len2 == 0) {
                                            len2 = strlen(clientes.cliente[posicaoCliente].nome);
                                            nome = (char *) realloc(nome, (len2 + 1) * sizeof (char));
                                            strcpy(nome, clientes.cliente[posicaoCliente].nome);
                                        }

                                        lerStringDinamica(&apelido, LER_APELIDO);
                                        len2 = strlen(apelido);
                                        if (len2 == 0) {
                                            len2 = strlen(clientes.cliente[posicaoCliente].apelido);
                                            apelido = (char *) realloc(apelido, (len2 + 1) * sizeof (char));
                                            strcpy(apelido, clientes.cliente[posicaoCliente].apelido);
                                        }

                                        editarNomeClientes(&clientes, num, nome, apelido);
                                        linha();
                                        break;
                                    case NIF:
                                        lerStringDinamica(&nifNovo, LER_NIF);
                                        len2 = strlen(nifNovo);
                                        if (len2 == 0) {
                                            len2 = strlen(clientes.cliente[posicaoCliente].nif);
                                            nifNovo = (char *) realloc(nifNovo, (len2 + 1) * sizeof (char));
                                            strcpy(nifNovo, clientes.cliente[posicaoCliente].nif);
                                        }

                                        editarNIFClientes(&clientes, num, nifNovo);
                                        linha();
                                        break;
                                    case PAIS:

                                        lerStringDinamica(&pais, LER_PAIS);
                                        len2 = strlen(pais);
                                        if (len2 == 0) {
                                            len2 = strlen(clientes.cliente[posicaoCliente].pais);
                                            pais = (char *) realloc(pais, (len2 + 1) * sizeof (char));
                                            strcpy(pais, clientes.cliente[posicaoCliente].pais);
                                        }

                                        editarPaisClientes(&clientes, num, pais);
                                        linha();
                                        break;
                                    case PASSWORD:
                                        do {
                                            lerStringDinamica(&password1, "Digite a sua nova password [maximo 100 caracteres]: ");
                                            lerStringDinamica(&password2, "Confirme a nova password: ");

                                            if (strcmp(password1, password2) != 0) {
                                                printf(PASSWORD_INCORRETA);
                                            }
                                        } while (strcmp(password1, password2) != 0);

                                        editarPasswordClientes(&clientes, num, password);
                                        linha();
                                        break;
                                    case DATA:

                                        anoNascimento = lerInt(1900, anoAtual - 18, DIGITE_ANO_NASCIMENTO);
                                        mesNascimento = lerInt(1, 12, DIGITE_MES_NASCIMENTO);

                                        if (mesNascimento == 2) {
                                            if (anoNascimento % 4 == 0) {
                                                lerInt(1, 29, DIGITE_DIA_NASCIMENTO);
                                            } else {
                                                lerInt(1, 28, DIGITE_DIA_NASCIMENTO);
                                            }
                                        } else {
                                            if (mesNascimento <= 7) {
                                                if (mesNascimento % 2 == 0) {
                                                    diaNascimento = lerInt(1, 30, DIGITE_DIA_NASCIMENTO);
                                                } else {
                                                    diaNascimento = lerInt(1, 31, DIGITE_DIA_NASCIMENTO);
                                                }
                                            } else {
                                                if (mesNascimento % 2 == 0) {
                                                    diaNascimento = lerInt(1, 31, DIGITE_DIA_NASCIMENTO);
                                                } else {
                                                    diaNascimento = lerInt(1, 30, DIGITE_DIA_NASCIMENTO);
                                                }
                                            }
                                        }

                                        editarDataClientes(&clientes, num, diaNascimento, mesNascimento, anoNascimento);
                                        linha();
                                        break;
                                    case MORADA:

                                        lerStringDinamica(&cidade, "Digite a sua cidade: ");
                                        len2 = strlen(cidade);
                                        if (len2 == 0) {
                                            len2 = strlen(clientes.cliente[posicaoCliente].morada.cidade);
                                            cidade = (char *) realloc(cidade, (len2 + 1) * sizeof (char));
                                            strcpy(cidade, clientes.cliente[posicaoCliente].morada.cidade);
                                        }
                                        lerStringDinamica(&rua, "Digite a sua rua:");
                                        len2 = strlen(rua);
                                        if (len2 == 0) {
                                            len2 = strlen(clientes.cliente[posicaoCliente].morada.rua);
                                            rua = (char *) realloc(rua, (len2 + 1) * sizeof (char));
                                            strcpy(rua, clientes.cliente[posicaoCliente].morada.rua);
                                        }
                                        lerStringDinamica(&nPorta, "Digite a sua porta e|ou numero de andar: ");
                                        len2 = strlen(nPorta);
                                        if (len2 == 0) {
                                            len2 = strlen(clientes.cliente[posicaoCliente].morada.numeroPorta);
                                            nPorta = (char *) realloc(nPorta, (len2 + 1) * sizeof (char));
                                            strcpy(nPorta, clientes.cliente[posicaoCliente].morada.numeroPorta);
                                        }
                                        lerStringDinamica(&cPostal, "Digite o seu codigo postal: ");
                                        len2 = strlen(cPostal);
                                        if (len2 == 0) {
                                            len2 = strlen(clientes.cliente[posicaoCliente].morada.codigoPostal);
                                            cPostal = (char *) realloc(cPostal, (len2 + 1) * sizeof (char));
                                            strcpy(cPostal, clientes.cliente[posicaoCliente].morada.codigoPostal);
                                        }

                                        editarMoradaClientes(&clientes, num, cidade, rua, cPostal, nPorta);
                                        linha();
                                        break;
                                }
                                do {
                                    resposta = lerChar("Deseja alterar mais algo (s/S)(n/N)\n");
                                } while (resposta != 's' && resposta != 'S' && resposta != 'n' && resposta != 'N');
                            } while (resposta == 'S' || resposta == 's');
                            printf("Conta atualizada com sucesso\n");
                            linha();
                            goto ponto11;
                            break;
                        case 2:
                            if ((checkEncomendas(num, encomendas)) == 1) {
                                printf("Tem encomendas em registo apenas sera possivel mudar o estado do seu perfil, contacte um administrador\n");
                                linha();
                                goto ponto11;
                            } else {
                                removerCliente(&clientes, num);
                                goto ponto1;
                            }
                            break;

                        case 0:
                            goto ponto10;
                            break;
                        case -1:
                            run = false;
                            break;
                    }

                    break;
                case EXTRAS:
                    linha();
pontoExtraC:
                    printf("---------------Extras---------------\n"
                            "[ 1 ] - Clientes que mais gastaram\n"
                            "[ 2 ] - Clientes com mais encomendas feitas\n"
                            "[ 3 ] - Material mais usado\n"
                            "[ 4 ] - Moveis com mais materiais\n"
                            "[ 5 ] - Moveis mais caros\n"
                            "[ 0 ] - Retroceder\n"
                            "[ -1 ] - Fechar\n");
                    printf("\n");
                    opcao = lerInt(-1, 5, DIGITE_OPCAO);
                    linha();

                    switch (opcao) {
                        case -1:
                            run = false;
                            break;
                        case 0:
                            goto ponto10;
                            break;
                        case 1:
                            if (clientes.contador == 0) {
                                printf("Nao existem clientes para fazer a listagem\n");
                            } else {
                                printf("        Clientes que mais gastaram      \n"
                                        "\n");
                                linha();
                                encontrarMaioresCompradores(&clientes);
                            }
                            goto pontoExtraC;
                            break;
                        case 2:
                            if (clientes.contador == 0) {
                                printf("Nao existem clientes para fazer a listagem\n");
                            } else {
                                printf("        Clientes com mais encomendas feitas      \n"
                                        "\n");
                                linha();
                                encontrarClientesMaisEncomendas(&clientes);
                            }
                            goto pontoExtraC;
                            break;
                        case 3:
                            if (materiais.contador == 0) {
                                printf("Nao existem materiais para fazer a listagem\n");
                            } else {
                                top5MateriaisMaisUsados(materiais);
                            }
                            goto pontoExtraC;
                            break;
                        case 4:
                            if (moveis.contador == 0) {
                                printf("Nao existem moveis para fazer a listagem\n");
                            } else {
                                top5MoveisMaisMateriais(moveis);
                            }
                            goto pontoExtraC;
                            break;
                        case 5:
                            if (moveis.contador == 0) {
                                printf("Nao existem moveis para fazer a listagem\n");
                            } else {
                                top5MoveisMaisCaros(moveis);
                            }
                            goto pontoExtraC;
                            break;
                    }

                    break;

                case RETROCEDER4:
                    goto ponto1;
                    break;
                case SAIR5:
                    run = false;
                    break;
            }
        }
    }
    linha();
    printf("Deseja guardar os dados?\n");
    printf(
            "[ 0 ] - Guardar\n"
            "[ 1 ] - Nao Guardar\n");
    opcao = lerInt(0, 1, "Digite a sua opcao: ");
    if (opcao == 0) {
        escreverFicheiroClientes(clientes, fClientes, FICHEIRO_CLIENTES);
        escreverFicheiroMateriais(materiais, fAdmins, FICHEIRO_MATERIAIS);
        escreverFicheiroAdmins(admins, fAdmins, FICHEIRO_ADMINS);
        escreverFicheiroMovel(moveis, fMoveis, FICHEIRO_MOVEIS);
        escreverFicheiroEncomendas(encomendas, fEncomendas, FICHEIRO_ENCOMENDAS);
        linha();
        printf("Dados guardados\n");
    }
    linha();

    for (int i = 0; i < clientes.contador; i++) {
        free(clientes.cliente[i].nome);
        free(clientes.cliente[i].apelido);
        free(clientes.cliente[i].nif);
        free(clientes.cliente[i].pais);
        free(clientes.cliente[i].password);
        free(clientes.cliente[i].morada.cidade);
        free(clientes.cliente[i].morada.rua);
        free(clientes.cliente[i].morada.numeroPorta);
    }
    free(clientes.cliente);

    for (int i = 0; i < admins.contador; i++) {
        free(admins.admin[i].nome);
        free(admins.admin[i].apelido);
        free(admins.admin[i].password);
    }
    free(admins.admin);

    for (int i = 0; i < moveis.contador; i++) {
        free(moveis.movel[i].nome);
        for (int j = 0; j < moveis.movel[i].contadorMateriais; j++) {
            free(moveis.movel[i].material[j].nomeMaterial);
            free(moveis.movel[i].material[j].unidade);
        }
        free(moveis.movel[i].material);
    }
    free(moveis.movel);

    for (int i = 0; i < materiais.contador; i++) {
        free(materiais.material[i].nomeMaterial);
        free(materiais.material[i].unidade);
    }
    free(materiais.material);

    for (int i = 0; i < encomendas.contador; i++) {
        free(encomendas.encomenda[i].movelEncomenda);
    }
    free(encomendas.encomenda);

    return (EXIT_SUCCESS);
}
