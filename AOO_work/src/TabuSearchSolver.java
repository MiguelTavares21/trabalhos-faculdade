import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Classe responsável por resolver o problema UFLP usando o algoritmo de Tabu Search.
 */
public class TabuSearchSolver {

    private static final int MAX_ITERATIONS = 1000;
    private static final int TABU_TENURE = 10;

    /**
     * Resolve o problema UFLP usando o algoritmo de Tabu Search.
     *
     * @param warehouses Lista de armazéns disponíveis.
     * @param customers Lista de clientes com suas demandas e custos de alocação.
     * @return A solução ótima encontrada pelo algoritmo de Tabu Search.
     */
    public static OptimalSolution solve(List<Warehouse> warehouses, List<Customer> customers) {
        int numCustomers = customers.size();
        int numWarehouses = warehouses.size();
        Random random = new Random();

        // Inicializa uma solução aleatória
        int[] currentSolution = new int[numCustomers];
        for (int i = 0; i < numCustomers; i++) {
            currentSolution[i] = random.nextInt(numWarehouses);
        }

        double currentCost = calculateCost(currentSolution, warehouses, customers);
        int[] bestSolution = currentSolution.clone();
        double bestCost = currentCost;

        // Lista tabu para armazenar movimentos proibidos
        int[][] tabuList = new int[numCustomers][numWarehouses];

        for (int iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
            int[] bestNeighbor = null;
            double bestNeighborCost = Double.MAX_VALUE;

            for (int i = 0; i < numCustomers; i++) {
                for (int j = 0; j < numWarehouses; j++) {
                    if (j != currentSolution[i]) {
                        int[] neighbor = currentSolution.clone();
                        neighbor[i] = j;
                        double neighborCost = calculateCost(neighbor, warehouses, customers);

                        // Verifica se a solução vizinha é melhor e não está na lista tabu
                        if (neighborCost < bestNeighborCost && tabuList[i][j] == 0) {
                            bestNeighbor = neighbor;
                            bestNeighborCost = neighborCost;
                        }
                    }
                }
            }

            // Atualiza a solução atual para a melhor vizinha
            if (bestNeighbor != null) {
                currentSolution = bestNeighbor;
                currentCost = bestNeighborCost;

                // Atualiza a lista tabu
                for (int i = 0; i < numCustomers; i++) {
                    if (currentSolution[i] != bestSolution[i]) {
                        tabuList[i][currentSolution[i]] = TABU_TENURE;
                    }
                }

                // Reduz a tenacidade dos movimentos na lista tabu
                for (int i = 0; i < numCustomers; i++) {
                    for (int j = 0; j < numWarehouses; j++) {
                        if (tabuList[i][j] > 0) {
                            tabuList[i][j]--;
                        }
                    }
                }

                // Atualiza a melhor solução encontrada
                if (currentCost < bestCost) {
                    bestSolution = currentSolution.clone();
                    bestCost = currentCost;
                }
            }
        }

        // Prepara a solução final para ser retornada
        List<Double> assignments = new ArrayList<>();
        for (int i = 0; i < numCustomers; i++) {
            assignments.add((double) bestSolution[i]);
        }

        return new OptimalSolution(assignments, bestCost);
    }

    /**
     * Calcula o custo total de uma solução.
     *
     * @param solution Array de inteiros representando a alocação de clientes para armazéns.
     * @param warehouses Lista de armazéns disponíveis.
     * @param customers Lista de clientes com suas demandas e custos de alocação.
     * @return O custo total da solução.
     */
    private static double calculateCost(int[] solution, List<Warehouse> warehouses, List<Customer> customers) {
        int numCustomers = customers.size();
        int numWarehouses = warehouses.size();
        double totalCost = 0.0;
        boolean[] warehouseOpened = new boolean[numWarehouses];

        // Calcula o custo total da solução atual
        for (int i = 0; i < numCustomers; i++) {
            int assignedWarehouse = solution[i];
            totalCost += customers.get(i).allocationCosts.get(assignedWarehouse);
            if (!warehouseOpened[assignedWarehouse]) {
                totalCost += warehouses.get(assignedWarehouse).fixedCost;
                warehouseOpened[assignedWarehouse] = true;
            }
        }

        return totalCost;
    }
}
