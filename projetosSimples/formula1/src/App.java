public class App {
    public static void main(String[] args) throws Exception {
        // Criação dos pilotos
        Piloto piloto1 = new Piloto("Max Verstappen", Equipas.Red_Bull);
        Piloto piloto2 = new Piloto("Sergio Perez", Equipas.Red_Bull);
        Piloto piloto3 = new Piloto("Charles Leclerc", Equipas.Ferrari);
        Piloto piloto4 = new Piloto("Lewis Hamilton", Equipas.Mercedes);
        Piloto piloto5 = new Piloto("Carlos Sainz", Equipas.Ferrari);
        Piloto piloto6 = new Piloto("George Russell", Equipas.Mercedes);
        Piloto piloto7 = new Piloto("Esteban Ocon", Equipas.Alpine);
        Piloto piloto8 = new Piloto("Pierre gasly", Equipas.Alpine);
        Piloto piloto9 = new Piloto("Lando Norris", Equipas.Mclaren);
        Piloto piloto10 = new Piloto("Oscar Piastri", Equipas.Mclaren);
        Piloto piloto11 = new Piloto("Bottas", Equipas.Alfa_Romeu);
        Piloto piloto12 = new Piloto("Zhou", Equipas.Alfa_Romeu);
        Piloto piloto13 = new Piloto("Lance Stroll", Equipas.Aston_Martin);
        Piloto piloto14 = new Piloto("Fernado Alonso", Equipas.Aston_Martin);
        Piloto piloto15 = new Piloto("Tsunoda", Equipas.Alpha_Tauri);
        Piloto piloto16 = new Piloto("Daniel Ricciardo", Equipas.Alpha_Tauri);
        Piloto piloto17 = new Piloto("Kevin Magnussen", Equipas.Hass);
        Piloto piloto18 = new Piloto("Nico Hulkenberg", Equipas.Hass);
        Piloto piloto19 = new Piloto("Alexander Albon", Equipas.Williams);
        Piloto piloto20 = new Piloto("Logan Sargeant", Equipas.Williams);


        //Adição dos pilotos
        OrderedList<Piloto> corredores = new OrderedList<>();
        corredores.add(piloto1);
        corredores.add(piloto2);
        corredores.add(piloto3);
        corredores.add(piloto4);
        corredores.add(piloto5);
        corredores.add(piloto6);
        corredores.add(piloto7);
        corredores.add(piloto8);
        corredores.add(piloto9);
        corredores.add(piloto10);
        corredores.add(piloto11);
        corredores.add(piloto12);
        corredores.add(piloto13);
        corredores.add(piloto14);
        corredores.add(piloto15);
        corredores.add(piloto16);
        corredores.add(piloto17);
        corredores.add(piloto18);
        corredores.add(piloto19);
        corredores.add(piloto20);
        System.out.println("Pilotos:");
        System.out.println(corredores.toString());

        //Criação do grandPix
        GrandPix grandPix = new GrandPix(corredores);

        grandPix.corrida();
        grandPix.printclassificacao();

        Piloto vencedor = grandPix.vencedor();

        System.out.println("CAMPEAO:");
        System.out.println(vencedor.getNome());
    }
}
