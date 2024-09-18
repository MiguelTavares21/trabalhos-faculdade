import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * Classe responsável por carregar dados de arquivos.
 */
public class DataLoader {

    /**
     * Classe interna que encapsula os dados carregados: armazéns e clientes.
     */
    public static class Data {
        /**
         * Lista de armazéns.
         */
        public List<Warehouse> warehouses;

        /**
         * Lista de clientes.
         */
        public List<Customer> customers;

        /**
         * Construtor para inicializar os dados com listas de armazéns e clientes.
         *
         * @param warehouses Lista de armazéns.
         * @param customers Lista de clientes.
         */
        public Data(List<Warehouse> warehouses, List<Customer> customers) {
            this.warehouses = warehouses;
            this.customers = customers;
        }
    }

    /**
     * Carrega os dados de capacidade de um arquivo especificado.
     *
     * @param fileName O nome do arquivo a ser carregado.
     * @return Um objeto Data contendo listas de armazéns e clientes, ou null se houver um erro.
     */
    public static Data loadCapData(String fileName) {
        InputStream dataStream;
        try {
            dataStream = DataLoader.class.getClassLoader().getResourceAsStream(fileName);
            if (dataStream == null) {
                return null;
            }
        } catch (Exception e) {
            return null;
        }

        try (BufferedReader dataReader = new BufferedReader(new InputStreamReader(dataStream))) {
            String line = dataReader.readLine();
            Scanner scanner = new Scanner(line);

            int facilitiesCount = scanner.hasNextInt() ? scanner.nextInt() : 0;
            int customersCount = scanner.hasNextInt() ? scanner.nextInt() : 0;

            System.out.println("Facilities: " + facilitiesCount);
            System.out.println("Customers: " + customersCount);

            List<Warehouse> warehouses = FileReaderUtility.readWarehouses(dataReader, facilitiesCount);
            List<Customer> customers = FileReaderUtility.readCustomers(dataReader, facilitiesCount);

            return new Data(warehouses, customers);
        } catch (IOException e) {
            return null;
        }
    }

    /**
     * Carrega os dados de solução ótima de um arquivo especificado.
     *
     * @param fileName O nome do arquivo a ser carregado.
     * @return Um objeto OptimalSolution contendo a lista de atribuições e o custo.
     * @throws IOException Se ocorrer um erro de leitura do arquivo.
     */
    public static OptimalSolution loadCapOptData(String fileName) throws IOException {
        InputStream dataStream = DataLoader.class.getClassLoader().getResourceAsStream(fileName);
        BufferedReader dataReader = new BufferedReader(new InputStreamReader(dataStream));

        List<Double> assignments = new ArrayList<>();
        double cost = 0.0;

        String line;
        while ((line = dataReader.readLine()) != null) {
            String[] parts = line.split("\\s+");
            cost = Double.parseDouble(parts[parts.length - 1]);

            for (int i = 0; i < parts.length - 1; i++) {
                assignments.add(Double.parseDouble(parts[i]));
            }
        }
        dataReader.close();
        return new OptimalSolution(assignments, cost);
    }
}
