package Queue;


/**
 * A interface QueueADT define as operações básicas para uma fila genérica.
 *
 * @param <T> o tipo de elementos armazenados na fila
 */
public interface QueueADT<T> {
    /**
     * Adiciona um elemento ao final desta fila.
     *
     * @param element o elemento a ser adicionado ao
     * final desta fila
     */
    public void enqueue(T element);
    /**
     * Remove e retorna o elemento na frente
     * desta fila.
     *
     * @return o elemento na frente desta fila
     */
    public T dequeue();
    /**
     * Retorna, sem remover, o elemento na frente
     * desta fila.
     *
     * @return o primeiro elemento nesta fila
     */
    public T first();
    /**
     * Retorna verdadeiro se esta fila não contiver elementos.
     *
     * @return verdadeiro se esta fila estiver vazia
     */
    public boolean isEmpty();
    /**
     * Retorna o número de elementos nesta fila.
     *
     * @return a representação inteira do tamanho
     * desta fila
     */
    public int size();
    /**
     * Retorna uma representação em string desta fila.
     *
     * @return a representação em string desta fila
     */
    public String toString();
}