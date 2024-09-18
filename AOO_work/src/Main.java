import java.io.IOException;
import java.util.Scanner;

/**
 * Classe principal que executa o programa para resolver o problema UFLP usando Hill Climbing e Tabu Search.
 */
public class Main {
    /**
     * Método principal que é o ponto de entrada do programa.
     *
     * @param args Argumentos da linha de comando (não utilizados).
     */
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Insira o nome do ficheiro de dados (e.g., cap101.txt): ");
        String dataFileName = scanner.nextLine().trim();

        // Verificar se o nome do ficheiro começa com 'K'
        boolean fileStartsWithK = dataFileName.startsWith("K") || dataFileName.startsWith("k");

        String optimalSolutionFileName = "";
        OptimalSolution optimalSolution = null;

        // Se o ficheiro não começar com 'K', solicitar o nome do ficheiro de soluções ótimas
        if (!fileStartsWithK) {
            System.out.println("Insira o nome do ficheiro de soluções ótimas (e.g., cap.opt.txt): ");
            optimalSolutionFileName = scanner.nextLine().trim();

            try {
                optimalSolution = DataLoader.loadCapOptData(optimalSolutionFileName);
            } catch (IOException e) {
                System.err.println("Erro ao carregar a solução ótima do ficheiro " + optimalSolutionFileName);
                return;
            }
        }

        DataLoader.Data data = DataLoader.loadCapData(dataFileName);

        if (data == null) {
            System.err.println("Erro ao carregar os dados do ficheiro " + dataFileName);
            return;
        }

        long hillStart = System.nanoTime();
        // Resolver o problema usando Hill Climbing
        OptimalSolution hillClimbingSolution = HillClimbingSolver.solve(data.warehouses, data.customers);
        long hillEnd = System.nanoTime();

        long tabuStart = System.nanoTime();
        // Resolver o problema usando Tabu Search
        OptimalSolution tabuSearchSolution = TabuSearchSolver.solve(data.warehouses, data.customers);
        long tabuEnd = System.nanoTime();

        // Exibir os resultados dependendo se começou com 'K' ou não
        if (fileStartsWithK) {
            System.out.println("Resultados da Hill Climbing:");
            hillClimbingSolution.printTable();

            System.out.println("Resultados da Tabu Search:");
            tabuSearchSolution.printTable();

            System.out.println("Custo da Solução Hill Climbing: " + hillClimbingSolution.getCost());
            System.out.println("Custo da solução tabu: " + tabuSearchSolution.getCost());
        } else {
            // Caso contrário, exibir os resultados completos
            try {
                System.out.println("-----------------------------------------");
                System.out.println("Resultados da Solução Ótima:");
                optimalSolution.printTable();

                System.out.println("Resultados da Hill Climbing:");
                hillClimbingSolution.printTable();

                System.out.println("Resultados da Tabu Search:");
                tabuSearchSolution.printTable();

                System.out.println("-----------------------------------------");
                System.out.println("Custo da Solução Ótima: " + optimalSolution.getCost());
                System.out.println("Custo da Solução Hill Climbing: " + hillClimbingSolution.getCost());
                System.out.println("Diferença (Hill Climbing): " + (hillClimbingSolution.getCost() - optimalSolution.getCost()));
                System.out.println("Custo da Solução Tabu Search: " + tabuSearchSolution.getCost());
                System.out.println("Diferença (Tabu Search): " + (tabuSearchSolution.getCost() - optimalSolution.getCost()));

            } catch (NullPointerException e) {
                System.err.println("Erro: Não foi possível carregar a solução ótima.");
            }
        }
        System.out.println("Tempo de execução hillClimbing: " + ((hillEnd - hillStart)/1000000000.0) + " segundos");
        System.out.println("Tempo de execução tabuSearch: " + ((tabuEnd - tabuStart)/1000000000.0) + " segundos");
    }
}
