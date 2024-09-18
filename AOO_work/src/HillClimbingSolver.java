import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Classe que implementa o algoritmo Hill Climbing para resolver o problema UFLP (Uncapacitated Facility Location Problem).
 */
public class HillClimbingSolver {

    /**
     * Resolve o problema UFLP usando o algoritmo Hill Climbing.
     *
     * @param warehouses Lista de armazéns disponíveis.
     * @param customers Lista de clientes com suas demandas e custos de alocação.
     * @return Uma solução ótima encontrada pelo algoritmo Hill Climbing.
     */
    public static OptimalSolution solve(List<Warehouse> warehouses, List<Customer> customers) {
        int numCustomers = customers.size();
        int numWarehouses = warehouses.size();
        Random random = new Random();
        int[] currentSolution = new int[numCustomers];
        for (int i = 0; i < numCustomers; i++) {
            currentSolution[i] = random.nextInt(numWarehouses); // Cliente i atribuído a um armazém aleatório
        }

        double currentCost = calculateCost(currentSolution, warehouses, customers); // Calcula o custo da solução atual

        boolean improvement = true;
        while (improvement) {
            improvement = false;

            // Percorre cada cliente e tenta mover para outro armazém que reduza o custo
            for (int i = 0; i < numCustomers; i++) {
                int currentWarehouse = currentSolution[i];
                for (int j = 0; j < numWarehouses; j++) {
                    if (j != currentWarehouse) { // Evita mover para o mesmo armazém
                        // Testa a solução movendo o cliente i para o armazém j
                        int[] neighborSolution = currentSolution.clone();
                        neighborSolution[i] = j;
                        double neighborCost = calculateCost(neighborSolution, warehouses, customers);

                        // Se o custo do vizinho for menor, atualiza a solução atual
                        if (neighborCost < currentCost) {
                            currentSolution = neighborSolution;
                            currentCost = neighborCost;
                            improvement = true;
                        }
                    }
                }
            }
        }

        // Prepara a solução final para ser retornada
        List<Double> assignments = new ArrayList<>();
        for (int i = 0; i < numCustomers; i++) {
            assignments.add((double) currentSolution[i]);
        }

        return new OptimalSolution(assignments, currentCost);
    }

    /**
     * Calcula o custo total de uma solução.
     *
     * @param solution Array que representa a solução atual, onde cada índice é um cliente e o valor é o armazém atribuído.
     * @param warehouses Lista de armazéns.
     * @param customers Lista de clientes.
     * @return O custo total da solução.
     */
    private static double calculateCost(int[] solution, List<Warehouse> warehouses, List<Customer> customers) {
        int numCustomers = customers.size();
        double totalCost = 0.0;

        // Calcula o custo total da solução atual
        for (int i = 0; i < numCustomers; i++) {
            int assignedWarehouse = solution[i];
            totalCost += customers.get(i).allocationCosts.get(assignedWarehouse);
            if (!warehouses.get(assignedWarehouse).open) {
                totalCost += warehouses.get(assignedWarehouse).fixedCost;
            }
        }

        return totalCost;
    }
}
