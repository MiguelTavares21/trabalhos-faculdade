import Queue.*;

import java.util.Iterator;
import java.util.Scanner;
import java.util.InputMismatchException;
import java.util.concurrent.ThreadLocalRandom;

public class App {

    /**
     * Este método protege o sistema de inputs inválidos.
     * @param read Scanner que lê o valor a introduzir.
     * @param min Valor mínimo que o input pode ter.
     * @param max Valor máximo que o input pode ter.
     * @return O método devolve o valor lido, caso este não seja válido o método retorna 0.
     */
    public static int readIntWithLimit(Scanner read, int min, int max) {
        boolean valid = false;
        int option = 0;
        while (!valid) {
            try {
                option = read.nextInt();
            } catch (InputMismatchException e) {
                read.nextLine();
                continue;
            }
            if (option >= min && option <= max) {
                valid = true;
            }
            read.nextLine();
        }
        return option;
    }
    public static void main(String[] args) {
        Kernel kernel = new Kernel(20);
        kernel.start();
        int resposta = 1;

        Middleware middleware = new Middleware(kernel);

        if(args.length != 0){
            middleware.readMessagesFromFile(args[0], middleware.getMessageQueue());
            TaskFileHandler.readTasksFromFile(args[1], kernel.getMemory());
        }else{
            middleware.readMessagesFromFile("messages.txt", middleware.getMessageQueue());
            TaskFileHandler.readTasksFromFile("tasks.txt", kernel.getMemory());
        }

        Scanner scanner = new Scanner(System.in);

        int escolha;
        do {
            // Exiba o menu
            System.out.println("==== Menu ====");
            System.out.println("1. Enviar Mensagem para o Satélite");
            System.out.println("2. Receber Mensagem do Satélite");
            System.out.println("3. Adicionar Tarefa para o Satélite");
            System.out.println("4. Executar Tarefa do Satélite");
            System.out.println("5. Ver tarefas em memoria (tarefas nao executadas)");
            System.out.println("6. Fornecer Coordenadas do Satélite");
            System.out.println("7. Ver percentagem de memoria usada");
            System.out.println("8. Definições");
            System.out.println("9. Encerrar Programa");
            System.out.print("Escolha: ");

            escolha = readIntWithLimit(scanner, 1, 9);

            switch (escolha) {
                case 1:
                    System.out.print("Digite a mensagem para o satélite: ");
                    String mensagemSatelite = scanner.nextLine();
                    Mensagem mensagem = new Mensagem("Usuario", "Satelite", mensagemSatelite);
                    middleware.sendMessageToSatellite(mensagem);
                    break;
                case 2:
                    Mensagem mensagemRecebida = middleware.receiveMessageFromSatellite();
                    if (mensagemRecebida != null) {
                        System.out.println("Mensagem Recebida do Satélite: " + mensagemRecebida.getConteudo());
                        System.out.println("Data: " + mensagemRecebida.getDataEnvio());
                    }else{
                        System.out.println("Nao existe mensagens");
                    }
                    break;
                case 3:
                    System.out.print("Digite o nome da tarefa: ");
                    String nomeTarefa = scanner.nextLine();
                    System.out.print("Digite a descrição da tarefa: ");
                    String descricaoTarefa = scanner.nextLine();
                    long randomTime = ThreadLocalRandom.current().nextLong(1000, 10000); // Tempo aleatório entre 1000 e 10000 milissegundos
                    Task task = new Task(nomeTarefa, descricaoTarefa, randomTime);
                    middleware.sendTaskMessage(task);
                    break;
                case 4:
                    Task tarefaParaExecutar = middleware.receiveTaskMessage();
                    if (tarefaParaExecutar != null) {
                        kernel.getCpu().executeTask(tarefaParaExecutar);
                        kernel.getMemory().releaseMemory(tarefaParaExecutar);

                    }
                    break;
                case 5:
                    LinkedQueue<Task> lista = kernel.getMemory().getMemory();
                    if (!lista.isEmpty()) {
                        System.out.println("==== Tarefas Pendentes ====");
                        Iterator<Task> iterator = lista.iterator();
                        while (iterator.hasNext()) {
                            Task pendingTask = iterator.next();
                            System.out.println("Nome: " + pendingTask.getTaskName() + ", Descrição: " + pendingTask.getDescription() + ", tempo:" + pendingTask.getTime());
                        }
                    } else {
                        System.out.println("Não há tarefas pendentes.");
                    }
                    break;

                case 6:
                    middleware.provideSatelliteLocation();
                    break;
                case 7:
                    double num = kernel.getMemory().getMemoryUsagePercentage();
                    JanelaMemoria janelaMemoria = new JanelaMemoria("Memoria usada", 10000, (int)num);
                    Thread threadMemoria = new Thread(janelaMemoria);
                    threadMemoria.start();
                    break;

                case 8:
                    System.out.println("==== Configurações ====");
                    System.out.println("1. Alterar Tamanho da Memória");
                    System.out.println("2. Voltar ao Menu Principal");
                    System.out.print("Escolha: ");

                    int escolhaConfiguracoes = readIntWithLimit(scanner, 1, 2);

                    switch (escolhaConfiguracoes) {
                        case 1:
                            System.out.println("Tem de selecionar um valor entre " + kernel.getMemory().getSize() + " e entre " + 50);
                            System.out.print("Digite o novo tamanho da memória: ");
                            int novoTamanhoMemoria = readIntWithLimit(scanner, kernel.getMemory().getSize(), 50);
                            kernel.getMemory().setMax_size(novoTamanhoMemoria);
                            System.out.println("Tamanho da memória alterado para: " + novoTamanhoMemoria);
                            break;
                        case 2:
                            break;
                        default:
                            System.out.println("Opção inválida. Tente novamente.");
                    }
                    break;

                case 9:
                    System.out.println("Deseja gravar as alterações que fez?");
                    System.out.println("0. Nao\n1. Sim");
                    resposta = readIntWithLimit(scanner, 0 ,1);
                    kernel.stop();
                    break;
                default:
                    System.out.println("Opção inválida. Tente novamente.");
            }
        } while (escolha != 9);
        if(resposta == 1) {
            if(args.length != 0){
                middleware.saveMessagesToFile(args[0], middleware.getMessageQueue());
                TaskFileHandler.saveTasksToFile(args[1], kernel.getMemory().getMemory());
            }else{
                middleware.saveMessagesToFile("messages.txt", middleware.getMessageQueue());
                TaskFileHandler.saveTasksToFile("tasks.txt", kernel.getMemory().getMemory());
            }
        }
        System.out.println("Programa encerrado.");
    }
}
