import java.util.concurrent.Semaphore;

/**
 * A classe CPU representa uma unidade central de processamento que executa tarefas.
 */
public class CPU extends Thread {
    private Semaphore semaphore = new Semaphore(1);

    /**
     * Construtor que recebe uma instância de MEM (memória) como parâmetro.
     *
     * @param memory a instância de MEM associada à CPU
     */
    public CPU(MEM memory) {
    }

    /**
     * Método run que representa a execução contínua da CPU.
     */
    public void run() {
        System.out.println("CPU iniciada.");

        try {
            while (!Thread.interrupted()) {
                Thread.sleep(1000);
            }
        } catch (InterruptedException e) {
            System.out.println("CPU encerrada");
        }
    }

    /**
     * Executa uma tarefa na CPU adquirindo um semáforo para controle de acesso.
     *
     * @param task a tarefa a ser executada
     */
    public void executeTask(Task task) {
        try {
            semaphore.acquire();

            if (task != null) {
                task.start();
            } else {
                System.out.println("Nenhuma tarefa disponível para execução.");
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            semaphore.release();
        }
    }
}
