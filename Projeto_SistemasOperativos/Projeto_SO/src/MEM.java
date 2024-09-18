import java.util.concurrent.Semaphore;
import Queue.LinkedQueue;

/**
 * A classe MEM representa a memória de um sistema computacional.
 * Gerencia a alocação, leitura e liberação de tarefas na memória.
 */
public class MEM extends Thread {
    private final int defaultSize = 10;
    private LinkedQueue<Task> memory;
    private int max_size;
    private int size;
    private Semaphore semaphore = new Semaphore(1);

    /**
     * Construtor padrão que inicializa a memória com um tamanho padrão (10).
     */
    public MEM() {
        this.memory = new LinkedQueue<>();
        this.max_size = defaultSize;
        this.size = 0;
    }

    /**
     * Construtor que inicializa a memória com um tamanho especificado.
     *
     * @param memorySize o tamanho da memória a ser inicializado
     */
    public MEM(int memorySize) {
        this.memory = new LinkedQueue<>();
        this.max_size = memorySize;
        this.size = 0;
    }

    /**
     * Método run, parte da interface Runnable, que define o comportamento da thread ao ser iniciada.
     * Aguarda um curto período antes da próxima iteração.
     */
    public void run() {
        System.out.println("MEM iniciada.");

        try {
            while (!Thread.interrupted()) {
                // Aguarde um curto período antes da próxima iteração
                Thread.sleep(1000); // Aguarde por 1 segundo (pode ajustar conforme necessário)
            }
        } catch (InterruptedException e) {
            System.out.println("MEM encerrada");
        }
    }

    /**
     * Aloca uma tarefa na memória, adquirindo um semáforo para controle de acesso.
     *
     * @param task a tarefa a ser alocada na memória
     */
    public void allocateMemory(Task task) {
        try {
            semaphore.acquire(); // Adquire a licença do semáforo

            // Lógica para alocar memória
            if (this.getSize() < this.getMax_size()) {
                memory.enqueue(task);
                System.out.println("Task alocada em memoria");
                size++;
                // Faça algo com os dados, se necessário
            } else {
                System.out.println("Nao existe mais espaco em memoria.");
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            semaphore.release(); // Libera a licença do semáforo
        }
    }

    /**
     * Lê a tarefa mais antiga na memória sem removê-la, adquirindo um semáforo para controle de acesso.
     *
     * @return a tarefa mais antiga na memória, ou null se a memória estiver vazia
     */
    public Task readMemory() {
        try {
            semaphore.acquire(); // Adquire a licença do semáforo
            if (size > 0) {
                Task oldestTask = memory.first();
                return oldestTask;
            } else {
                return null;
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
            return null;
        } finally {
            semaphore.release(); // Libera a licença do semáforo
        }
    }

    /**
     * Libera a memória removendo a tarefa especificada, adquirindo um semáforo para controle de acesso.
     *
     * @param task a tarefa a ser removida da memória
     */
    public void releaseMemory(Task task) {
        try {
            if(task != null) {
                semaphore.acquire(); // Adquire a licença do semáforo
                memory.dequeue();
                size--;
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            semaphore.release(); // Libera a licença do semáforo
        }
    }

    /**
     * Calcula a porcentagem de uso da memória.
     *
     * @return a porcentagem de uso da memória
     */
    public double getMemoryUsagePercentage() {
        double usedPercentage = ((double) size / max_size) * 100;
        return usedPercentage;
    }

    /**
     * Obtém a fila de tarefas armazenadas na memória.
     *
     * @return a fila de tarefas na memória
     */
    public LinkedQueue<Task> getMemory() {
        return memory;
    }

    /**
     * Define a fila de tarefas na memória.
     *
     * @param memory a nova fila de tarefas na memória
     */
    public void setMemory(LinkedQueue<Task> memory) {
        this.memory = memory;
    }

    /**
     * Obtém o tamanho máximo da memória.
     *
     * @return o tamanho máximo da memória
     */
    public int getMax_size() {
        return max_size;
    }

    /**
     * Define o tamanho máximo da memória.
     *
     * @param max_size o novo tamanho máximo da memória
     */
    public void setMax_size(int max_size) {
        this.max_size = max_size;
    }

    /**
     * Obtém o tamanho atual da memória.
     *
     * @return o tamanho atual da memória
     */
    public int getSize() {
        return size;
    }

    /**
     * Define o tamanho atual da memória.
     *
     * @param size o novo tamanho atual da memória
     */
    public void setSize(int size) {
        this.size = size;
    }

    /**
     * Obtém o semáforo utilizado para controle de acesso à memória.
     *
     * @return o semáforo de controle de acesso à memória
     */
    public Semaphore getSemaphore() {
        return semaphore;
    }

    /**
     * Define o semáforo utilizado para controle de acesso à memória.
     *
     * @param semaphore o novo semáforo de controle de acesso à memória
     */
    public void setSemaphore(Semaphore semaphore) {
        this.semaphore = semaphore;
    }
}
