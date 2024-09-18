package Queue;

/**
 * Um nó genérico que contém um elemento de dados.
 * @param <T> o tipo de dados armazenado no nó
 */
public class Node<T>{
    private Node<T> next;
    private T data;

    /**
     * A classe Node representa um nó em uma estrutura de lista encadeada.
     *
     * @param element T o tipo de dados armazenado no nó
     */
    public Node(T element){
        data = element;
        next = null;
    }

    /**
     * Construtor que cria um nó com um elemento específico.
     *
     * @param node o elemento a ser armazenado no nó
     */
    public Node(Node<T> node){
        data = null;
        next = node;
    }

    /**
     * Construtor que cria um nó com um elemento específico e uma referência para o próximo nó.
     *
     * @param element o elemento a ser armazenado no nó
     * @param node o próximo nó na lista encadeada
     */
    public Node(T element, Node<T> node){
        data = element;
        next = node;
    }

    /**
     * Define o valor de dados armazenado no nó.
     *
     * @param data o novo valor de dados
     */
    public void setData(T data) {
        this.data = data;
    }

    /**
     * Define a referência para o próximo nó na lista encadeada.
     *
     * @param next o próximo nó na lista encadeada
     */
    public void setNext(Node<T> next) {
        this.next = next;
    }

    /**
     * Retorna o valor de dados armazenado no nó.
     *
     * @return o valor de dados armazenado no nó
     */
    public T getData() {
        return data;
    }

    /**
     * Retorna a referência para o próximo nó na lista encadeada.
     *
     * @return o próximo nó na lista encadeada
     */
    public Node<T> getNext() {
        return next;
    }


}