import java.util.ConcurrentModificationException;
import java.util.Iterator;
import java.util.NoSuchElementException;

public class UnorderedList<T> implements UnorderedListADT<T> {
    private No<T> front;
    private No<T> rear;
    private int size;
    private int modCount;

    public UnorderedList() {
        front = new No<>(null);
        rear = new No<>(null);
        size = 0;
    }

    public int getModCount() {
        return modCount;
    }

    @Override
    public T removeFirst() {
        if (isEmpty()) {
            throw new IllegalStateException("A lista está vazia");
        }
        T elemento = front.getElemento();
        if (size == 1) {
            front = null;
            rear = null;
            size--;
        } else {
            front = front.getProximo();
            front.setAnterior(null);
            size--;
        }
        modCount++;
        return elemento;
    }

    @Override
    public T removeLast() {
        T elemento = rear.getElemento();
        if (size == 1) {
            front = null;
            rear = null;
            size--;
        } else {
            rear = rear.getAnterior();
            rear.setProximo(null);
            size--;
        }
        modCount++;
        return elemento;
    }

    @Override
    public T remove(T element) {
        if (isEmpty()) {
            throw new IllegalStateException("A lista está vazia");
        }
        if (!contains(element)) {
            throw new NoSuchElementException("A lista não contém esse elemento");
        }

        No<T> current = front;
        while (current != null) {
            if (current.getElemento().equals(element)) {
                if (current == front) {
                    return removeFirst();
                } else if (current == rear) {
                    return removeLast();
                } else {
                    current.getAnterior().setProximo(current.getProximo());
                    current.getProximo().setAnterior(current.getAnterior());
                    size--;
                    modCount++;
                    return current.getElemento();
                }
            }
            current = current.getProximo();
        }

        return null;
    }

    @Override
    public T first() {
        if (isEmpty()) {
            throw new IllegalStateException("A lista está vazia");
        }
        return front.getElemento();
    }

    @Override
    public T last() {
        if (isEmpty()) {
            throw new IllegalStateException("A lista está vazia");
        }
        return rear.getElemento();
    }

    @Override
    public boolean contains(T target) {
        No<T> elemento = front;
        while (elemento != null) {
            if (elemento.getElemento().equals(target)) {
                return true;
            }
            elemento = elemento.getProximo();
        }
        return false;
    }

    @Override
    public boolean isEmpty() {
        return size == 0;
    }

    @Override
    public int size() {
        return size;
    }

    @Override
    public Iterator<T> iterator() {
        return new OrderedListIterator();
    }

    @Override
    public void addToFront(T element) {
        No<T> novo = new No<>(element);
        if (size == 0) {
            front = novo;
            rear = novo;
            size++;
        } else {
            novo.setProximo(front);
            front.setAnterior(novo);
            front = novo;
            size++;
        }
    }

    @Override
    public void addToRear(T element) {
        No<T> novo = new No<>(element);
        if (size == 0) {
            front = novo;
            rear = novo;
            size++;
        } else {
            rear.setProximo(novo);
            novo.setAnterior(rear);
            novo.setProximo(null);
            rear = novo;
            size++;
        }
    }

    @Override
    public void addAfter(T element, T target) {
        if (isEmpty()) {
            throw new IllegalStateException("A lista está vazia");
        }
        No<T> current = front;
        while (current != null) {
            if (target.equals(current.getElemento())) {
                No<T> newNode = new No<>(element);
                newNode.setAnterior(current);
                newNode.setProximo(current.getProximo());
                if (current == rear) {
                    rear = newNode;
                } else {
                    current.getProximo().setAnterior(newNode);
                }
                current.setProximo(newNode);
                size++;
                modCount++;
                return;
            }
            current = current.getProximo();
        }
        throw new NoSuchElementException("O elemento de destino não foi encontrado na lista");
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();

        No<T> current = front;
        while (current != null) {
            sb.append(current.getElemento());
            if (current.getProximo() != null) {
                sb.append("\n");
            }
            current = current.getProximo();
        }
        return sb.toString();
    }

    private class OrderedListIterator implements Iterator<T> {
        private No<T> current = front;
        private int expectedModCount = modCount;

        @Override
        public boolean hasNext() {
            if (expectedModCount != modCount) {
                throw new ConcurrentModificationException("A lista foi modificada durante a iteração");
            }
            return current != null;
        }

        @Override
        public T next() {
            if (!hasNext()) {
                throw new NoSuchElementException("Não há mais elementos na lista");
            }
            T element = current.getElemento();
            current = current.getProximo();
            return element;
        }
    }
}