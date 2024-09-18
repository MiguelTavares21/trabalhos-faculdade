import javax.swing.*;
import java.awt.*;
import java.util.concurrent.TimeUnit;

/**
 * A classe Task representa uma tarefa que pode ser executada em uma thread separada.
 */
public class Task extends Thread {
    private String taskName;
    private String description;
    private long time;
    private TaskWindow taskWindow;

    /**
     * Construtor para criar uma instância de Task com um nome, descrição e tempo de execução especificados.
     *
     * @param taskName    o nome da tarefa
     * @param description a descrição da tarefa
     * @param time        o tempo de execução da tarefa em milissegundos
     */
    public Task(String taskName, String description, long time) {
        this.taskName = taskName;
        this.description = description;
        this.time = time;
        this.taskWindow = new TaskWindow(taskName, time);
    }

    /**
     * Método run() que contém a lógica da execução da tarefa.
     * Este método é chamado quando a thread da tarefa é iniciada.
     */
    @Override
    public void run() {
        SwingUtilities.invokeLater(() -> {
            taskWindow.show();
        });

        taskWindow.appendText("A executar Task ");
        taskWindow.appendText("Nome: " + taskName);
        taskWindow.appendText("Descrição: " + description);

        for (int seconds = 1; seconds <= getTimeInSeconds(); seconds++) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            taskWindow.appendText("Executando... " + seconds + "s");
        }

        taskWindow.appendText("Tarefa concluída");

        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        SwingUtilities.invokeLater(() -> {
            taskWindow.updateStatus("Tarefa concluída");
            taskWindow.close();
        });
    }

    /**
     * Obtém o nome da tarefa.
     *
     * @return o nome da tarefa
     */
    public String getTaskName() {
        return taskName;
    }

    /**
     * Define o nome da tarefa.
     *
     * @param taskName o novo nome da tarefa
     */
    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    /**
     * Obtém a descrição da tarefa.
     *
     * @return a descrição da tarefa
     */
    public String getDescription() {
        return description;
    }

    /**
     * Define a descrição da tarefa.
     *
     * @param description a nova descrição da tarefa
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Obtém o tempo de execução da tarefa em milissegundos.
     *
     * @return o tempo de execução da tarefa em milissegundos
     */
    public long getTime() {
        return time;
    }

    /**
     * Define o tempo de execução da tarefa em milissegundos.
     *
     * @param time o novo tempo de execução da tarefa em milissegundos
     */
    public void setTime(long time) {
        this.time = time;
    }

    /**
     * Converte o tempo de execução da tarefa para segundos.
     *
     * @return o tempo de execução da tarefa em segundos
     */
    private int getTimeInSeconds() {
        return (int) TimeUnit.MILLISECONDS.toSeconds(time);
    }
}
