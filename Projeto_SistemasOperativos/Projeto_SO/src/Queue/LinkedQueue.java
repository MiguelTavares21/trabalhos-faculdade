package Queue;

import java.util.Iterator;

/**
 * LinkedQueue é uma implementação da interface QueueADT usando uma lista encadeada.
 *
 * @param <T> o tipo de elementos armazenados na fila
 */
public class LinkedQueue<T> implements QueueADT<T> {
    private final String EMPTY_ERROR = "This queue is empty";
    private Node<T> head;
    private Node<T> tail;
    private int size;

    /**
     * Constrói uma LinkedQueue vazia.
     */
    public LinkedQueue() {
        head = null;
        tail = null;
        size = 0;
    }


    /**
     * Adiciona o elemento especificado ao final da fila.
     *
     * @param element o elemento a ser adicionado à fila
     */
    @Override
    public void enqueue(T element) {
        Node<T> newNode = new Node<>(element);
        if (isEmpty()) {
            head = newNode;
            tail = newNode;
        } else {
            tail.setNext(newNode);
            tail = newNode;
        }
        size++;
    }

    /**
     * Remove e retorna o elemento na frente da fila.
     *
     * @return o elemento removido da frente da fila
     * @throws IllegalStateException se a fila estiver vazia
     */
    @Override
    public T dequeue() {
        if (isEmpty()) {
            throw new IllegalStateException(EMPTY_ERROR);
        }
        T removed = head.getData();
        head = head.getNext();
        size--;
        return removed;
    }

    /**
     * Retorna o elemento na frente da fila sem removê-lo.
     *
     * @return o elemento na frente da fila
     * @throws IllegalStateException se a fila estiver vazia
     */
    @Override
    public T first() {
        if (isEmpty()) {
            throw new IllegalStateException(EMPTY_ERROR);
        }
        return head.getData();
    }

    /**
     * Verifica se a fila está vazia.
     *
     * @return true se a fila estiver vazia, false caso contrário
     */
    @Override
    public boolean isEmpty() {
        return size == 0;
    }

    /**
     * Retorna o número de elementos na fila.
     *
     * @return o número de elementos na fila
     */
    @Override
    public int size() {
        return size;
    }

    /**
     * Retorna uma representação em string da fila.
     *
     * @return uma representação em string da fila
     * @throws IllegalStateException se a fila estiver vazia
     */
    @Override
    public String toString() {
        if (isEmpty()) {
            throw new IllegalStateException(EMPTY_ERROR);
        }
        StringBuilder sb = new StringBuilder();
        sb.append("Queue:\n");
        Node<T> current = head;
        while (current != null) {
            sb.append(current.getData());
            if (current.getNext() != null) {
                sb.append("\n");
            }
            current = current.getNext();
        }
        return sb.toString();
    }

    /**
     * Retorna um iterador sobre os elementos na fila.
     *
     * @return um iterador sobre os elementos na fila
     */
    public Iterator<T> iterator() {
        return new QueueIterator();
    }

    /**
     * Classe interna que representa um iterador para a fila.
     */
    private class QueueIterator implements Iterator<T> {
        private Node<T> current = head;

        /**
         * Verifica se há mais elementos na fila.
         *
         * @return true se houver mais elementos, false caso contrário
         */
        @Override
        public boolean hasNext() {
            return current != null;
        }

        /**
         * Retorna o próximo elemento na fila.
         *
         * @return o próximo elemento na fila
         * @throws IllegalStateException se não houver mais elementos na fila
         */
        @Override
        public T next() {
            if (!hasNext()) {
                throw new IllegalStateException("No more elements in the queue");
            }

            T data = current.getData();
            current = current.getNext();
            return data;
        }
    }
}