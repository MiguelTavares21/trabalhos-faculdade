package projeto_ed.MapsManagement;

import projeto_ed.Game.Map;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

/**
 * Class responsible for exporting maps to text files.
 */
public class MapExporter implements Exporter{

    @Override
    public void saveMapToFile(Map map, String fileName) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(fileName))) {

            if(!map.isEmpty()) {
                writer.write(map.size() + "\n");
                for (int i = 0; i < map.size(); i++) {
                    for (int j = 0; j < map.size(); j++) {
                        double weight = map.getAdjMatrix()[i][j];
                        if (weight > 0) {
                            writer.write( (i + 1) + "," + (j + 1) + "," + weight + "\n");
                        }
                    }
                }
            }else{
                throw new IllegalArgumentException("This map is empty");
            }
        } catch (IOException e) {
            System.err.println("Error saving map to file: " + e.getMessage());
        }
    }
}
