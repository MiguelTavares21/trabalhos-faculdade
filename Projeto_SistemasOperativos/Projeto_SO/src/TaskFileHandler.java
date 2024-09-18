import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.BufferedReader;
import java.io.FileReader;
import Queue.LinkedQueue;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Classe responsável por lidar com a leitura e escrita de tarefas em arquivos.
 */
public class TaskFileHandler {
    /**
     * Lê tarefas de um arquivo e as adiciona à memória.
     *
     * @param filename O nome do arquivo a ser lido.
     * @param memory   A memória onde as tarefas serão armazenadas.
     */
    public static void readTasksFromFile(String filename, MEM memory) {
        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            String line;
            while ((line = reader.readLine()) != null && memory.getSize() < memory.getMax_size()) {

                String[] parts = line.split(";");
                String taskName = parts[0];
                String description = parts[1];
                long randomTime = ThreadLocalRandom.current().nextLong(1000, 10000);
                Task task = new Task(taskName, description, randomTime);
                memory.allocateMemory(task);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Salva tarefas de uma fila em um arquivo.
     *
     * @param filename O nome do arquivo onde as tarefas serão salvas.
     * @param tasks    A fila de tarefas a serem salvas.
     */
    public static void saveTasksToFile(String filename, LinkedQueue<Task> tasks) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filename, false))) {
            while (!tasks.isEmpty()) {
                Task task = tasks.dequeue();
                writer.write(task.getTaskName() + ";" + task.getDescription());
                writer.newLine();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
