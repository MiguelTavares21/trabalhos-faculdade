import 'package:flutter/material.dart';
import 'package:stocker_web_ui/pages/createGroup_page.dart';
import 'package:stocker_web_ui/pages/joinGroup_page.dart';

// Classe que representa a página "Adicionar Grupo"
class AddGroupPage extends StatelessWidget {
  // Construtor da classe, que é um widget sem estado (StatelessWidget)
  const AddGroupPage({super.key}); 

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF212F3D),
      appBar: AppBar(
        foregroundColor: Colors.white,
        backgroundColor: const Color(0xFF212F3D),
        centerTitle: true,
        title: const Text(
          "ADICIONAR GRUPO",
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => CreateGroupPage(),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF212F3D),
                foregroundColor: Colors.white,
                side: const BorderSide(color: Colors.white, width: 2),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8), 
                ),
                padding: const EdgeInsets.symmetric(
                  vertical: 40,
                  horizontal: 70,
                ),
              ),
              child: const Text(
                "Criar um grupo",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 22,
                ),
              ),
            ),
            const SizedBox(height: 30),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const JoinGroupPage(),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF212F3D),
                foregroundColor: Colors.white,
                side: const BorderSide(color: Colors.white, width: 2),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                padding: const EdgeInsets.symmetric(
                  vertical: 40,
                  horizontal: 38,
                ),
              ),
              child: const Text(
                "Juntar-se a um Grupo",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 22,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
