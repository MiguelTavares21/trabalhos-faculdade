import java.util.Iterator;

import Exceptions.EmptyCollectionException;
import Graphs.Network;
import Heaps.ArrayHeap;
import Heaps.PriorityQueue;
import Trees.*;
import TreesAVL.LinkedBinarySearchTreeAVL;

public class Main {
    public static void main(String[] args) {

        Network<String> graph = new Network<>();

        // Adicione vértices
        graph.addVertex("A");
        graph.addVertex("B");
        graph.addVertex("C");
        graph.addVertex("D");
        graph.addVertex("E");
        graph.addVertex("F");
        graph.addVertex("G");
        graph.addVertex("H");
        graph.addVertex("I");

        // Adicione arestas
        graph.addEdge("A", "B", 1.0);
        graph.addEdge("A", "C", 2.0);
        graph.addEdge("A", "D", 1.0);
        graph.addEdge("A", "E", 4.0);
        graph.addEdge("B", "F", 2.0);
        graph.addEdge("F", "H", 1.0);
        graph.addEdge("D", "G", 7.0);
        graph.addEdge("G", "I", 8.0);
        graph.addEdge("H", "I", 1.0);
        graph.addEdge("B", "A", 1.0);
        graph.addEdge("C", "A", 2.0);
        graph.addEdge("D", "A", 1.0);
        graph.addEdge("E", "A", 4.0);
        graph.addEdge("F", "B", 2.0);
        graph.addEdge("H", "F", 1.0);
        graph.addEdge("G", "D", 7.0);
        graph.addEdge("I", "G", 8.0);
        graph.addEdge("I", "H", 1.0);
        System.out.println(graph.isConnected());
        double shortestPathWeight = graph.shortestPathWeight("A", "I");

        System.out.println("Shortest path weight from " + "A" + " to " + "I" + ": " + shortestPathWeight);
        Iterator<String> shortestPath = graph.iteratorShortestPath("A", "I");

        // Imprima o caminho mais curto
        System.out.println("Caminho mais curto de D para I:");

        while (shortestPath.hasNext()) {
            System.out.print(shortestPath.next());

            if (shortestPath.hasNext()) {
                System.out.print(" -> ");
            }
        }

        // Imprima o grafo
        System.out.println("\nGraph:");

        // Execute BFS a partir de um vértice
        System.out.println("DFS from A:");
        Iterator<String> bfsIterator = graph.iteratorDFS("A");
        while (bfsIterator.hasNext()) {
            System.out.print(bfsIterator.next() + " ");
        }
        System.out.println();

        System.out.println("BFS from B:");
        Iterator<String> bfsIterator2 = graph.iteratorBFS("B");
        while (bfsIterator2.hasNext()) {
            System.out.print(bfsIterator2.next() + " ");
        }
        System.out.println();

        System.out.println("BFS from C:");
        Iterator<String> bfsIterator3 = graph.iteratorBFS("C");
        while (bfsIterator3.hasNext()) {
            System.out.print(bfsIterator3.next() + " ");
        }
        System.out.println();

        // Execute DFS a partir de um vértice
        System.out.println("DFS from D:");
        Iterator<String> dfsIterator4 = graph.iteratorBFS("D");
        while (dfsIterator4.hasNext()) {
            System.out.print(dfsIterator4.next() + " ");
        }
        System.out.println();

        // Remova um vértice
        graph.removeVertex("B");

        // Imprima o grafo após a remoção
        System.out.println("Graph after removing vertex B:");

        System.out.println("--------------------------------------------------------------");

        // Crie uma instância da sua árvore binária de busca
        ArrayBinarySearchTree<Integer> binarySearchTree = new ArrayBinarySearchTree<>();
        LinkedBinarySearchTreeAVL<Integer> tree = new LinkedBinarySearchTreeAVL<>();

        // Adicione alguns elementos
        binarySearchTree.addElement(50);
        binarySearchTree.addElement(30);
        binarySearchTree.addElement(70);
        binarySearchTree.addElement(20);
        binarySearchTree.addElement(40);
        binarySearchTree.addElement(60);
        binarySearchTree.addElement(80);

        tree.addElement(20);
        tree.addElement(30);
        tree.addElement(40);
        tree.addElement(50);
        tree.addElement(60);
        tree.addElement(70);
        tree.addElement(80);

        // Imprima a árvore em ordem
        Iterator<Integer> inOrderIterator = binarySearchTree.iteratorInOrder();
        Iterator<Integer> iterator1 = tree.iteratorInOrder();

        // Use um loop para percorrer os elementos
        System.out.println("In-order traversal:");
        while (inOrderIterator.hasNext()) {
            Integer element = inOrderIterator.next();
            System.out.println(element);
        }

        System.out.println("In-order traversal:");
        while (iterator1.hasNext()) {
            Integer element = iterator1.next();
            System.out.println(element);
        }

        System.out.println("Pre-order traversal:");
        binarySearchTree.iteratorPreOrder().forEachRemaining(System.out::println);

        System.out.println("Pre-order traversal:");
        tree.iteratorPreOrder().forEachRemaining(System.out::println);

        System.out.println("Post-order traversal:");
        binarySearchTree.iteratorPostOrder().forEachRemaining(System.out::println);

        System.out.println("Post-order traversal:");
        tree.iteratorPostOrder().forEachRemaining(System.out::println);

        System.out.println("Level-order traversal:");
        binarySearchTree.iteratorLevelOrder().forEachRemaining(System.out::println);

        System.out.println("Level-order traversal:");
        tree.iteratorLevelOrder().forEachRemaining(System.out::println);

        System.out.println("Pre-order traversal:");
        tree.iteratorPreOrder().forEachRemaining(System.out::println);

        tree.removeElement(50);
        System.out.println("Pre-order traversal:");
        tree.iteratorPreOrder().forEachRemaining(System.out::println);

        // Teste os métodos findMin e findMax
        System.out.println("Min: " + tree.findMin());
        System.out.println("Max: " + tree.findMax());

        // Teste os métodos removeMin e removeMax
        System.out.println("Removing min: " + tree.removeMin());
        System.out.println("Removing max: " + tree.removeMax());

        // Imprima a árvore após remoções
        System.out.println("In-order traversal after removals:");
        tree.iteratorInOrder().forEachRemaining(System.out::println);

        // Teste o método removeAllOccurrences
        tree.addElement(30); // Adiciona um elemento repetido
        tree.addElement(30); // Adiciona outro elemento repetido
        System.out.println("In-order traversal after removals:");
        tree.iteratorInOrder().forEachRemaining(System.out::println);

        tree.removeAllOccurrences(30);
        System.out.println("After removal of all occurrences:");
        tree.iteratorInOrder().forEachRemaining(System.out::println);

        ArrayHeap<Integer> heap = new ArrayHeap<>();

        // Adiciona elementos à heap
        heap.addElement(5);
        heap.addElement(3);
        heap.addElement(8);
        heap.addElement(1);

        // Encontrar o menor elemento
        System.out.println("Min Element: " + heap.findMin());

        // Remove o menor elemento
        try {
            System.out.println("Removed Min Element: " + heap.removeMin());
        } catch (EmptyCollectionException e) {
            System.out.println("Heap is empty.");
        }

        // Cria uma PriorityQueue de Inteiros
        PriorityQueue<Integer> intPriorityQueue = new PriorityQueue<>();

        // Adiciona elementos à PriorityQueue
        intPriorityQueue.addElement(10, 2);
        intPriorityQueue.addElement(5, 1);
        intPriorityQueue.addElement(20, 3);

        // Remove e imprime os elementos da PriorityQueue
        while (!intPriorityQueue.isEmpty()) {
            System.out.println("Next Element: " + intPriorityQueue.removeNext());
        }

        // Cria uma PriorityQueue de Strings
        PriorityQueue<String> stringPriorityQueue = new PriorityQueue<>();

        // Adiciona elementos à PriorityQueue
        stringPriorityQueue.addElement("Apple", 3);
        stringPriorityQueue.addElement("Banana", 1);
        stringPriorityQueue.addElement("Orange", 2);

        // Remove e imprime os elementos da PriorityQueue
        while (!stringPriorityQueue.isEmpty()) {
            System.out.println("Next Element: " + stringPriorityQueue.removeNext());
        }
    }

}
