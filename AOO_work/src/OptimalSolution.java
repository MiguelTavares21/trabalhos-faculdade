import java.util.List;

/**
 * Representa uma solução ótima para o problema UFLP, incluindo as atribuições e o custo total.
 */
public class OptimalSolution {
    private List<Double> assignments;
    private Double cost;

    /**
     * Construtor para criar uma instância de OptimalSolution.
     *
     * @param assignments Lista de alocações de clientes para armazéns.
     * @param cost Custo total da solução.
     */
    public OptimalSolution(List<Double> assignments, Double cost) {
        this.assignments = assignments;
        this.cost = cost;
    }

    /**
     * Imprime uma tabela das atribuições de clientes para armazéns e o custo total da solução.
     */
    public void printTable() {
        System.out.println("+-----------+---------------------+");
        System.out.println("| Customer  | Allocated Warehouse |");
        System.out.println("+-----------+---------------------+");
        for (int i = 0; i < assignments.size(); i++) {
            System.out.printf("| %-9d | %-19.2f |%n", i, assignments.get(i));
            System.out.println("+-----------+---------------------+");
        }
        System.out.println("Total Cost: " + cost);
    }

    /**
     * Retorna o custo total da solução.
     *
     * @return O custo total da solução.
     */
    public Double getCost() {
        return cost;
    }
}
