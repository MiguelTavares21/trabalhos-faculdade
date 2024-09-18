import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * Utilitário para ler dados de arquivos.
 */
public class FileReaderUtility {

    /**
     * Lê e retorna uma lista de armazéns a partir de um BufferedReader.
     *
     * @param dataReader BufferedReader para ler os dados.
     * @param m Número de armazéns a serem lidos.
     * @return Lista de armazéns.
     * @throws IOException Se ocorrer um erro de leitura do arquivo.
     */
    public static List<Warehouse> readWarehouses(BufferedReader dataReader, int m) throws IOException {
        List<Warehouse> warehouses = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            String line = dataReader.readLine();
            line = line.replace(".", ",");
            Scanner lineScanner = new Scanner(line);
            while (lineScanner.hasNextInt()) {
                int capacity = lineScanner.nextInt();
                double fixedCost = lineScanner.nextDouble();
                warehouses.add(new Warehouse(capacity, fixedCost, false));
            }
            lineScanner.close();
        }
        return warehouses;
    }

    /**
     * Lê e retorna uma lista de clientes a partir de um BufferedReader.
     *
     * @param reader BufferedReader para ler os dados.
     * @param m Número de armazéns (não utilizado diretamente no método, mas pode ser relevante no contexto).
     * @return Lista de clientes.
     * @throws IOException Se ocorrer um erro de leitura do arquivo.
     */
    public static List<Customer> readCustomers(BufferedReader reader, int m) throws IOException {
        List<Customer> customers = new ArrayList<>();
        String line;

        while ((line = reader.readLine()) != null) {
            Scanner lineScanner = new Scanner(line);

            if (lineScanner.hasNextInt()) {
                int demand = lineScanner.nextInt();
                Customer customer = new Customer();
                customer.addDemand(demand);

                reader.mark(1000);

                while ((line = reader.readLine()) != null) {
                    lineScanner = new Scanner(line);

                    if (lineScanner.hasNextInt()) {
                        reader.reset();
                        break;
                    }

                    processAllocationCosts(lineScanner, customer);
                    reader.mark(1000);
                }

                customers.add(customer);
            }
        }

        return customers;
    }

    /**
     * Processa e adiciona os custos de alocação a um cliente a partir de um Scanner.
     *
     * @param scanner Scanner para ler os custos de alocação.
     * @param customer Cliente ao qual os custos de alocação serão adicionados.
     */
    private static void processAllocationCosts(Scanner scanner, Customer customer) {
        while (scanner.hasNext()) {
            String cost = scanner.next();
            customer.addAllocationCosts(Double.parseDouble(cost));
        }
    }
}
