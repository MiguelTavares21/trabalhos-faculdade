/**
 * A classe Kernel representa o núcleo de um sistema computacional, composto por uma memória (MEM) e uma CPU.
 * Controla o início e término do sistema.
 */
public class Kernel {
    private MEM memory;
    private CPU cpu;
    private boolean isRunning;

    /**
     * Construtor que inicializa o kernel com uma memória de tamanho especificado.
     *
     * @param memorySize o tamanho da memória a ser inicializada
     */
    public Kernel(int memorySize) {
        this.memory = new MEM(memorySize);
        this.cpu = new CPU(memory);
        this.isRunning = false;
    }

    /**
     * Construtor padrão que inicializa o kernel com uma memória de tamanho padrão (5).
     */
    public Kernel() {
        this.memory = new MEM(5);
        this.cpu = new CPU(memory);
        this.isRunning = false;
    }

    /**
     * Inicia o kernel, iniciando as threads da memória e da CPU.
     */
    public void start() {
        if (!isRunning) {
            memory.start();
            cpu.start();
            isRunning = true;
            System.out.println("Kernel iniciado.");
        } else {
            System.out.println("O kernel já está em execução.");
        }
    }

    /**
     * Interrompe o kernel, interrompendo as threads da memória e da CPU.
     */
    public void stop() {
        if (isRunning) {
            memory.interrupt();
            cpu.interrupt();
            try {
                memory.join();
                cpu.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            isRunning = false;
            System.out.println("Kernel encerrado.");
        } else {
            System.out.println("O kernel não está em execução.");
        }
    }


    /**
     * Obtém a instância da memória associada ao kernel.
     *
     * @return a instância da classe MEM
     */
    public MEM getMemory() {
        return memory;
    }

    /**
     * Define a instância da memória associada ao kernel.
     *
     * @param memory a nova instância da classe MEM
     */
    public void setMemory(MEM memory) {
        this.memory = memory;
    }

    /**
     * Obtém a instância da CPU associada ao kernel.
     *
     * @return a instância da classe CPU
     */
    public CPU getCpu() {
        return cpu;
    }

    /**
     * Define a instância da CPU associada ao kernel.
     *
     * @param cpu a nova instância da classe CPU
     */
    public void setCpu(CPU cpu) {
        this.cpu = cpu;
    }

    /**
     * Verifica se o kernel está em execução.
     *
     * @return true se o kernel estiver em execução, false caso contrário
     */
    public boolean isRunning() {
        return isRunning;
    }

    /**
     * Define o estado de execução do kernel.
     *
     * @param running o novo estado de execução do kernel
     */
    public void setRunning(boolean running) {
        isRunning = running;
    }
}
