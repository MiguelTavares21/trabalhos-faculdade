import java.util.ArrayList;
import java.util.List;

/**
 * Representa um cliente com uma demanda específica e uma lista de custos de alocação.
 */
public class Customer {
    /**
     * A demanda do cliente.
     */
    int demand;

    /**
     * Lista de custos de alocação associados ao cliente.
     */
    List<Double> allocationCosts;

    /**
     * Construtor da classe Customer.
     * Inicializa um novo cliente com demanda zero e uma lista vazia de custos de alocação.
     */
    public Customer() {
        demand = 0;
        allocationCosts = new ArrayList<>();
    }

    /**
     * Adiciona um custo de alocação à lista de custos de alocação do cliente.
     *
     * @param allocationCost O custo de alocação a ser adicionado.
     */
    public void addAllocationCosts(Double allocationCost) {
        this.allocationCosts.add(allocationCost);
    }

    /**
     * Define a demanda do cliente.
     *
     * @param demand A demanda a ser definida para o cliente.
     */
    public void addDemand(int demand) {
        this.demand = demand;
    }
}
