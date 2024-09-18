package Lists;

import java.util.NoSuchElementException;

import Interfaces.UnorderedListADT;

/**
 * The ArrayUnorderedList class represents an unordered list implemented using an array.
 * Elements can be added to the front, rear, or after a specified target element.
 *
 * @param <T> the type of elements stored in the list
 */
public class ArrayUnorderedList<T> extends ArrayList<T> implements UnorderedListADT<T> {

    /**
     * Creates an empty unordered list with the default capacity.
     */
    public ArrayUnorderedList() {
        super();
    }

    /**
     * Expands the capacity of the underlying array when needed.
     */
    private void expandCapacity() {
        T[] newArray = (T[]) new Object[super.getArray().length * 2];
        System.arraycopy(super.getArray(), 0, newArray, 0, super.getTop());
        super.setArray(newArray);
    }

    /**
     * Adds the specified element to the front of the unordered list.
     *
     * @param element the element to be added to the front of the list
     */
    @Override
    public void addToFront(T element) {
        if (super.getArray().length == super.getTop()) {
            expandCapacity();
        }
        for (int i = super.getTop() + 1; i > 0; i--) {
            super.getArray()[i] = super.getArray()[i - 1];
        }
        super.getArray()[0] = element;
        super.setTop(super.getTop() + 1);
        super.setModCount(super.getModCount() + 1);
    }

    /**
     * Adds the specified element to the rear of the unordered list.
     *
     * @param element the element to be added to the rear of the list
     */
    @Override
    public void addToRear(T element) {
        if (super.getArray().length == super.getTop()) {
            expandCapacity();
        }
        super.getArray()[super.getTop()] = element;

        super.setTop(super.getTop() + 1);
        super.setModCount(super.getModCount() + 1);
    }

    /**
     * Adds the specified element after the target element in the unordered list.
     *
     * @param element the element to be added
     * @param target  the target element after which the new element will be added
     * @throws NoSuchElementException if the target element is not found in the list
     */
    @Override
    public void addAfter(T element, T target) {
        if (super.getArray().length == super.getTop()) {
            expandCapacity();
        }

        int index = 0;

        while (index < super.getTop() && !target.equals(super.getArray()[index])) {
            index++;
        }

        if (index == super.getTop()) {
            throw new NoSuchElementException("The target element is not in this list");
        }

        for (int i = super.getTop() - 1; i >= index; i--) {
            super.getArray()[i + 1] = super.getArray()[i];
        }

        super.getArray()[index + 1] = element;

        super.setTop(super.getTop() + 1);
        super.setModCount(super.getModCount() + 1);
    }

    /**
     * Returns a string representation of the unordered list.
     *
     * @return a string representation of the unordered list
     */
    @Override
    public String toString() {
        return super.toString();
    }
}