package Lists;

import java.util.ConcurrentModificationException;
import java.util.Iterator;
import java.util.NoSuchElementException;

import Interfaces.ListADT;

/**
 * Abstract class ArrayList represents the common properties and methods
 * for an array-based list data structure.
 *
 * @param <T> the type of elements stored in the list
 */
public abstract class ArrayList<T> implements ListADT<T> {
    private final String EMPTY_ERROR = "This list is empty";
    private T[] array;
    private final int DEFAULT_CAPACITY = 10;
    private int top;
    private int modCount = 0;

    /**
     * Creates an empty list with the default capacity.
     */
    public ArrayList() {
        array = (T[]) new Object[DEFAULT_CAPACITY];
        top = 0;
    }

    /**
     * Creates an empty list with the specified capacity.
     *
     * @param arraySize the initial capacity of the list
     */
    public ArrayList(int arraySize) {
        array = (T[]) new Object[arraySize];
        top = 0;
    }

    /**
     * Removes and returns the first element in the list.
     *
     * @return the first element in the list
     * @throws IllegalStateException if the list is empty
     */
    @Override
    public T removeFirst() {
        if (isEmpty()) {
            throw new IllegalStateException(EMPTY_ERROR);
        }

        T removedItem = array[0];

        for (int i = 0; i < top; i++) {
            array[i] = array[i + 1];
        }
        top--;
        modCount++;
        return removedItem;
    }

    /**
     * Removes and returns the last element in the list.
     *
     * @return the last element in the list
     * @throws IllegalStateException if the list is empty
     */
    @Override
    public T removeLast() {
        if (isEmpty()) {
            throw new IllegalStateException(EMPTY_ERROR);
        }

        T removedItem = array[top - 1];

        array[top - 1] = null;
        top--;
        modCount++;
        return removedItem;
    }

    /**
     * Removes the specified element from the list.
     *
     * @param element the element to be removed
     * @return the removed element
     * @throws NoSuchElementException if the element is not found in the list
     */
    @Override
    public T remove(T element) {
        int index = indexOf(element);

        if (index == -1) {
            throw new NoSuchElementException("Element not found in the list");
        }

        T removedItem = array[index];

        for (int i = index; i < top - 1; i++) {
            array[i] = array[i + 1];
        }

        array[top - 1] = null;
        top--;
        modCount++;
        return removedItem;
    }

    /**
     * Returns the first element in the list.
     *
     * @return the first element in the list
     * @throws IllegalStateException if the list is empty
     */
    @Override
    public T first() {
        if (isEmpty()) {
            throw new IllegalStateException(EMPTY_ERROR);
        }

        return array[0];
    }

    /**
     * Returns the last element in the list.
     *
     * @return the last element in the list
     * @throws IllegalStateException if the list is empty
     */
    @Override
    public T last() {
        if (isEmpty()) {
            throw new IllegalStateException(EMPTY_ERROR);
        }

        return array[top - 1];
    }

    /**
     * Checks if the list contains the specified element.
     *
     * @param target the element to check for
     * @return true if the element is found, false otherwise
     */
    @Override
    public boolean contains(T target) {
        for(int i = 0; i < top; i++){
            if(target.equals(array[i]) && target != null){
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if the list is empty.
     *
     * @return true if the list is empty, false otherwise
     */
    @Override
    public boolean isEmpty() {
        return top == 0;
    }

    /**
     * Returns the size of the list.
     *
     * @return the size of the list
     */
    @Override
    public int size() {
        return top;
    }

    /**
     * Returns an iterator over the elements in this list.
     *
     * @return an iterator over the elements in this list
     */
    @Override
    public Iterator<T> iterator() {
        return new UnorderedArrayListIterator();
    }

    /**
     * Iterator class for traversing the elements of the list.
     */
    private class UnorderedArrayListIterator implements Iterator<T> {
        private int currentIndex = 0;
        private int expectedModCount = modCount;

        /**
         * Checks if there are more elements in the list.
         *
         * @return true if there are more elements, false otherwise
         * @throws ConcurrentModificationException if modifications are detected
         */
        @Override
        public boolean hasNext() {
            if (expectedModCount != getModCount()) {
                throw new ConcurrentModificationException("Modification detected");
            }
            return currentIndex < getTop() - 1;
        }

        /**
         * Returns the next element in the iteration.
         *
         * @return the next element in the iteration
         * @throws ConcurrentModificationException if modifications are detected
         * @throws NoSuchElementException if there are no more elements
         */
        @Override
        public T next() {
            if (expectedModCount != getModCount()) {
                throw new ConcurrentModificationException("Modification detected");
            }
            if (!hasNext()) {
                throw new NoSuchElementException("There are no more elements on this list");
            }
            return getArray()[currentIndex++];
        }
    }

    /**
     * Returns a string representation of the list.
     *
     * @return a string representation of the list
     */@Override
    public String toString() {
        if (isEmpty()) {
            return "Empty List";
        }
        StringBuilder sb = new StringBuilder();
        sb.append("List: ");
        for (int i = 0; i < top; i++) {
            sb.append(array[i]);
            if (i < top - 1) {
                sb.append(", ");
            }
        }
        return sb.toString();
    }

    /**
     * Finds the index of the specified element in the list.
     *
     * @param element the element to find
     * @return the index of the element, or -1 if not found
     */
    private int indexOf(T element) {
        for (int i = 0; i < top; i++) {
            if (element.equals(array[i])) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Gets the modification count of the list.
     *
     * @return the modification count
     */
    public int getModCount() {
        return modCount;
    }

    /**
     * Gets the top index of the list.
     *
     * @return the top index
     */
    public int getTop() {
        return top;
    }

    /**
     * Gets the array storing the elements of the list.
     *
     * @return the array storing the elements
     */
    public T[] getArray() {
        return array;
    }

    /**
     * Sets the modification count of the list.
     *
     * @param modCount the modification count to set
     */
    public void setModCount(int modCount) {
        this.modCount = modCount;
    }

    /**
     * Sets the top index of the list.
     *
     * @param top the top index to set
     */
    public void setTop(int top) {
        this.top = top;
    }

    /**
     * Sets the array storing the elements of the list.
     *
     * @param array the array to set
     */
    public void setArray(T[] array) {
        this.array = array;
    }
}