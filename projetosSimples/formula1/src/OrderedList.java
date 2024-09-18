import java.util.ConcurrentModificationException;
import java.util.Iterator;
import java.util.NoSuchElementException;

public class OrderedList<T> implements OrderedListADT<T> {
    private No<T> front;
    private No<T> rear;
    private int size;
    private int modCount;

    public OrderedList() {
        front = new No<>(null);
        rear = new No<>(null);
        size = 0;
    }

    public int getModCount(){
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
    public void add(T element) {
        if (!(element instanceof Comparable)) {
            throw new IllegalArgumentException("Element must implement Comparable");
        }
    
        No<T> newNode = new No<>(element);
    
        if (isEmpty()) {
            front = newNode;
            rear = newNode;
        } else if (((Comparable<T>) element).compareTo(front.getElemento()) <= 0) {
            newNode.setProximo(front);
            front.setAnterior(newNode);
            front = newNode;
        } else if (((Comparable<T>) element).compareTo(rear.getElemento()) >= 0) {
            newNode.setAnterior(rear);
            rear.setProximo(newNode);
            rear = newNode;
        } else {
            No<T> current = front;
            while (current != null && ((Comparable<T>) element).compareTo(current.getElemento()) > 0) {
                current = current.getProximo();
            }
            newNode.setAnterior(current.getAnterior());
            newNode.setProximo(current);
            current.getAnterior().setProximo(newNode);
            current.setAnterior(newNode);
        }
        size++;
        modCount++;
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

        public T[] invertElements() {
            T[] elements = (T[]) new Object[size];
    
            No<T> current = rear;
            int index = 0;
    
            while (current != null) {
                elements[index] = current.getElemento();
                current = current.getAnterior();
                index++;
            }
    
            return elements;
        }
    }
