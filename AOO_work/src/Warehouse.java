/**
 * Classe que representa um armazém no problema UFLP.
 */
public class Warehouse {
    int capacity;
    double fixedCost;
    boolean open;

    /**
     * Construtor para criar uma instância de Warehouse.
     *
     * @param capacity A capacidade do armazém.
     * @param fixedCost O custo fixo associado ao armazém.
     * @param open Estado inicial do armazém (aberto ou fechado).
     */
    public Warehouse(int capacity, double fixedCost, boolean open) {
        this.capacity = capacity;
        this.fixedCost = fixedCost;
        this.open = open;
    }
}
