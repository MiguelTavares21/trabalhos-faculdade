import Queue.LinkedQueue;

import java.util.concurrent.Semaphore;
import java.util.Random;
import java.io.*;

/**
 * A classe Middleware atua como um intermediário entre o Kernel e o Satellite, gerenciando tarefas e mensagens.
 */
public class Middleware {
    private Kernel kernel;
    private Semaphore semaphore;
    private LinkedQueue<Mensagem> messageQueue;

    /**
     * Construtor que inicializa uma instância de Middleware com um Kernel associado.
     *
     * @param kernel o Kernel associado ao Middleware
     */
    public Middleware(Kernel kernel) {
        this.kernel = kernel;
        this.semaphore = new Semaphore(1);
        this.messageQueue = new LinkedQueue<>();
    }

    /**
     * Envia uma tarefa para o Kernel alocar na memória.
     *
     * @param task a tarefa a ser enviada
     */
    public void sendTaskMessage(Task task) {
        try {
            semaphore.acquire();
            kernel.getMemory().allocateMemory(task);
            System.out.println("Middleware: Tarefa enviada para MEM.");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            semaphore.release();
        }
    }

    /**
     * Recebe uma tarefa da memória do Kernel.
     *
     * @return a tarefa recebida
     */
    public Task receiveTaskMessage() {
        try {
            semaphore.acquire();
            Task task = kernel.getMemory().readMemory();
            if (task != null) {
                System.out.println("Middleware: Tarefa recebida da MEM.");
            } else {
                System.out.println("Middleware: A MEM está vazia. Não há tarefas para executar.");
            }
            return task;
        } catch (InterruptedException e) {
            e.printStackTrace();
            return null;
        } finally {
            semaphore.release();
        }
    }

    /**
     * Envia uma mensagem para o Satellite.
     *
     * @param message a mensagem a ser enviada
     */
    public void sendMessageToSatellite(Mensagem message) {
        try {
            semaphore.acquire();
            if (messageQueue.size() < 5) {
                messageQueue.enqueue(message);

                // Exibir janela
                MensagemWindow janelaMensagem = new MensagemWindow(message, 5000);
                janelaMensagem.start();

                System.out.println("Middleware: Mensagem enviada para o " + message.getDestinatario() + " : " + message.getConteudo());
            } else {
                System.out.println("Middleware: A fila de mensagens está cheia. Não é possível enviar a mensagem: " + message.getConteudo());
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            semaphore.release();
        }
    }


    /**
     * Recebe uma mensagem do Satellite.
     *
     * @return a mensagem recebida
     */
    public Mensagem receiveMessageFromSatellite() {
        try {
            semaphore.acquire();
            if (!messageQueue.isEmpty()) {
                Mensagem receivedMessage = messageQueue.dequeue();
                return receivedMessage;
            } else {
                System.out.println("Middleware: A fila de mensagens do satélite está vazia. Não há mensagens para receber.");
                return null;
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
            return null;
        } finally {
            semaphore.release();
        }
    }

    /**
     * Fornece a localização aleatória do Satellite.
     */
    public void provideSatelliteLocation() {
        double latitude = generateRandomCoordinate(-90, 90);
        double longitude = generateRandomCoordinate(-180, 180);

        String location = "(" + latitude + ", " + longitude + ")";
        System.out.println("Middleware: Localizacao do satelite disponibilizada -> " + location);
    }

    /**
     * Gera uma coordenada aleatória dentro de um intervalo especificado.
     *
     * @param min o valor mínimo da coordenada
     * @param max o valor máximo da coordenada
     * @return a coordenada aleatória gerada
     */
    private double generateRandomCoordinate(double min, double max) {
        Random random = new Random();
        return min + (max - min) * random.nextDouble();
    }


    /**
     * Lê mensagens de um arquivo e as enfileira.
     *
     * @param filename     o nome do arquivo contendo as mensagens
     * @param messageQueue a fila de mensagens onde as mensagens serão enfileiradas
     */
    public static void readMessagesFromFile(String filename, LinkedQueue<Mensagem> messageQueue) {
        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            String line;
            while ((line = reader.readLine()) != null && messageQueue.size() < 5) {
                String[] parts = line.split(";");
                if (parts.length == 3) {
                    String remetente = parts[0];
                    String destinatario = parts[1];
                    String conteudo = parts[2];
                    Mensagem mensagem = new Mensagem(remetente, destinatario, conteudo);
                    messageQueue.enqueue(mensagem);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Salva as mensagens da fila em um arquivo.
     *
     * @param filename     o nome do arquivo onde as mensagens serão salvas
     * @param messageQueue a fila de mensagens a ser salva
     */
    public static void saveMessagesToFile(String filename, LinkedQueue<Mensagem> messageQueue) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filename, false))) {
            while (!messageQueue.isEmpty()) {
                Mensagem mensagem = messageQueue.dequeue();
                writer.write(mensagem.getRemetente() + ";" + mensagem.getDestinatario() + ";" + mensagem.getConteudo());
                writer.newLine();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Obtém a fila de mensagens do Middleware.
     *
     * @return a fila de mensagens
     */
    public LinkedQueue<Mensagem> getMessageQueue() {
        return messageQueue;
    }
}
