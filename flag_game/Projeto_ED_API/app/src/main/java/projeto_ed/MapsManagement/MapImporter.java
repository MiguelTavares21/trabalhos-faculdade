package projeto_ed.MapsManagement;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import projeto_ed.Game.Map;
import projeto_ed.Game.Vertex;

/**
 * Class responsible for importing maps from text files.
 */
public class MapImporter implements Importer{

    @Override
    public Map loadMapFromFile(String fileName) {

        Map map = null;

        try (BufferedReader reader = new BufferedReader(new FileReader(fileName))) {
            String line = reader.readLine();

            if (line != null) {
                int size = Integer.parseInt(line.trim());
                map = new Map(size);
                for(int i = 1; i <= size; i++){
                    Vertex vertex = new Vertex();
                    vertex.setIndex(i);
                    map.addVertex(vertex);
                }

                while ((line = reader.readLine()) != null) {
                    String[] parts = line.split(",");
                    if (parts.length == 3) {
                        int i = Integer.parseInt(parts[0]);
                        int j = Integer.parseInt(parts[1]);
                        double weight = Double.parseDouble(parts[2]);
                        map.addEdge(map.getVertice(i),map.getVertice(j),weight);
                    } else {
                        System.err.println("Invalid line in the file: " + line);
                    }
                }
            } else {
                System.err.println("Empty file");
            }
        } catch (IOException | NumberFormatException e) {
            System.err.println("Error loading map from file: " + e.getMessage());
        }

        return map;
    }
}
