package Stacks;

import Interfaces.StackADT;

/**
 * ArrayStack represents a stack implementation using an array.
 *
 * @param <T> the type of elements stored in the stack
 */
public class ArrayStack<T> implements StackADT<T> {

    /**
     * Constant to represent the default capacity of the array.
     */
    private final int DEFAULT_CAPACITY = 30;
    /**
     * int that represents both the number of elements and the next available
     * position in the array
     */
    private int top;
    /**
     * array of generic elements to represent the stack
     */
    private T[] stack;

    /**
     * Creates an empty stack using the default capacity.
     */
    public ArrayStack() {
        top = 0;
        stack = (T[]) (new Object[DEFAULT_CAPACITY]);
    }

    /**
     * Creates an empty stack using the specified capacity.
     *
     * @param initialCapacity represents the specified capacity
     */
    public ArrayStack(int initialCapacity) {
        if (initialCapacity <= 0) {
            throw new IllegalArgumentException("Initial capacity must be greater than 0");
        }
        stack = (T[]) new Object[initialCapacity];
        top = 0;
    }

    /**
     * Adds the specified element to the top of this stack, expanding the
     * capacity of the stack array if necessary.
     *
     * @param element generic element to be pushed onto stack
     */
    @Override
    public void push(T element) {
        if (top == stack.length) {
            expandCapacity();
        }
        stack[top] = element;
        top++;
    }

    /**
     * Expands the capacity of the stack array by creating a new array with
     * additional space and copying the elements from the current array.
     * The new array will have 10 more slots than the current capacity.
     */
    private void expandCapacity() {
        T[] newStack = (T[]) (new Object[stack.length + 10]);
        for (int i = 0; i < stack.length; i++) {
            newStack[i] = stack[i];
        }
        stack = newStack;
    }

    /**
     * Removes and returns the element at the top of this stack.
     *
     * @return the element removed from the top of the stack
     */
    @Override
    public T pop() {
        if (isEmpty()) {
            System.out.println("A lista esta vazia");
            return null;
        }
        top--;
        T result = stack[top];
        stack[top] = null;
        return result;
    }

    /**
     * Returns the element at the top of this stack without removing it.
     *
     * @return the element at the top of the stack
     */
    @Override
    public T peek() {
        if (isEmpty()) {
            System.out.println("A lista esta vazia");
            return null;
        }
        return stack[top - 1];
    }

    /**
     * Checks if the stack is empty.
     *
     * @return true if the stack is empty, false otherwise
     */
    @Override
    public boolean isEmpty() {
        return top == 0;
    }

    /**
     * Returns the number of elements in the stack.
     *
     * @return the number of elements in the stack
     */
    @Override
    public int size() {
        return top;
    }

    /**
     * Returns a string representation of the array stack.
     *
     * @return a string representation of the array stack
     */
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("ArrayStack{capacidade=").append(stack.length).append(", stack=[");

        for (int i = top - 1; i >= 0; i--) {
            sb.append(stack[i]);
            if (i > 0) {
                sb.append(", ");
            }
        }

        sb.append("]}");

        return sb.toString();
    }

}
