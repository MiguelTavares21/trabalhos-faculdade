const Funcionario = require("../models/funcionarioModel");
const bcrypt = require("bcryptjs");
const Doador = require("../models/doadorModel");
const fs = require("fs");
const path = require("path");
const EntidadeBeneficiadora = require("../models/entidadeBeneficiadoraModel");


exports.displayForm = async function(req, res) {
    try {
        const userId = req.user._id;
        const existingFuncionario = await Funcionario.findOne({ _id: userId });

        if (!existingFuncionario) {
            res.status(404).render("error", {
                message: "Funcionario não encontrado",
                error: "Funcionario não encontrado",
            });
        }

        const userRole = req.user.role;
        res.render('initialPage', { userRole: userRole, funcionario: existingFuncionario });
    } catch (error) {
        console.error('Erro ao buscar funcionário:', error);
        res.status(500).send('Erro ao buscar funcionário');
    }
};

exports.editData = async function(req, res) {
    const { nome, apelido, email, contacto, morada, senhaAtual, novaSenha } = req.body;

try {
    const funcionario = await Funcionario.findById(req.user._id);
    if (!funcionario) {
        return res.status(404).json({ message: 'Funcionário não encontrado' });
    }

    if (senhaAtual && novaSenha) {
        const isPasswordValid = await bcrypt.compare(senhaAtual, funcionario.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha atual incorreta' });
        }
        const hashedNewPassword = await bcrypt.hash(novaSenha, 10);
        funcionario.password = hashedNewPassword;
    }

    funcionario.nome = nome;
    funcionario.apelido = apelido;
    funcionario.email = email;
    funcionario.contacto = contacto;
    funcionario.morada = morada;

    await funcionario.save();

    res.json({ message: 'Dados do funcionário atualizados com sucesso' });
} catch (error) {
    console.error('Erro ao editar dados do funcionário:', error);
    res.status(500).json({ message: 'Erro ao editar dados do funcionário' });
}

};

exports.editDoador = async function(req, res) {
    try {
        const userEmail = req.user.email;
        console.log(userEmail);

        const { nome, apelido, nif, morada, contacto, passwordAtual, passwordNova } = req.body;
        let novaFotoPerfil;

        const doadorNif = await Doador.findOne({ nif: nif });
        if (doadorNif && doadorNif.email !== userEmail) {
            return res.status(400).json({ message: "O NIF já está em uso." });
        }

        const doador = await Doador.findOne({ email: userEmail });

        if (passwordAtual && passwordNova) {
            const isPasswordValid = await bcrypt.compare(passwordAtual, doador.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Password atual incorreta' });
            }
            const hashedNewPassword = await bcrypt.hash(passwordNova, 10);
            doador.password = hashedNewPassword;
            await doador.save();
        }

        if (req.files && req.files["fotoPerfil"]) {
            novaFotoPerfil = req.files["fotoPerfil"][0].path;

            if (doador.fotoPerfil !== "uploads/images.png") {
                fs.unlinkSync(
                    path.join(__dirname, "..", doador.fotoPerfil)
                );
            }
        }

        const updateData = {
            nome,
            apelido,
            nif,
            morada,
            contacto,
        };

        if (novaFotoPerfil) {
            updateData.fotoPerfil = novaFotoPerfil;
        }

        await Doador.findOneAndUpdate({ email: userEmail }, updateData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ message: "Doador editado com sucesso." });
    } catch (error) {
        console.error("Erro ao editar doador:", error);
        res.status(500).json({
            message: "Ocorreu um erro ao editar o doador.",
        });
    }
};


exports.editEntidade = async function (req, res) {
    try {
        const userEmail = req.user.email;
        console.log(userEmail);

        const { nome, descricao, morada, contacto, passwordAtual, passwordNova, removedImages } = req.body;
        let novaFotoPerfil;

        
        const entidade = await EntidadeBeneficiadora.findOne({ email: userEmail });

        // Atualizar senha se fornecida
        if (passwordAtual && passwordNova) {
            const isPasswordValid = await bcrypt.compare(passwordAtual, entidade.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Password atual incorreta' });
            }
            const hashedNewPassword = await bcrypt.hash(passwordNova, 10);
            entidade.password = hashedNewPassword;
            await entidade.save();
        }

        // Atualizar foto de perfil
        if (req.files && req.files["fotoPerfil"]) {
            novaFotoPerfil = req.files["fotoPerfil"][0].path;

            if (entidade.fotoPerfil !== "uploads/images.png") {
                fs.unlinkSync(
                    path.join(__dirname, "..", entidade.fotoPerfil)
                );
            }
        }

        const fotosAdicionais = req.files["outrasFotos"];
        const fotos = [];


        // Processar novas fotos adicionais
        if (fotosAdicionais && fotosAdicionais.length > 0) {
            fotosAdicionais.forEach(foto => {
                const fotoPath = foto.path;
                fotos.push(fotoPath);
            });
          }

        const updateData = {
            nome,
      descricao,
      contacto,
      morada,
        };

        if (novaFotoPerfil) {
            updateData.fotoPerfil = novaFotoPerfil;
        }

        if (fotos.length > 0) {
            updateData.$push = { fotos: { $each: fotos } };
          }


          if (typeof removedImages === 'string'  && removedImages.trim() !== '') {
            // Converter fotosRemovidas para array
            const fotosRemovidasArray = JSON.parse(removedImages);

            if (fotosRemovidasArray.length > 0) {
                const caminhosRelativos = fotosRemovidasArray.map(url => url.split('/').pop());
              await EntidadeBeneficiadora.findOneAndUpdate({ email: userEmail }, {
                $pull: { fotos: { $in: caminhosRelativos } }
              });
          
              // Remover fotos da pasta de uploads
              caminhosRelativos.forEach(foto => {
                const fotoPath = path.join(__dirname, '..', foto);
                fs.unlinkSync(fotoPath);
              });
            }
          }


          await EntidadeBeneficiadora.findOneAndUpdate({ email: userEmail }, updateData, {
            new: true,
            runValidators: true,
          });

        res.status(200).json({ message: "Entidade editado com sucesso." });
    } catch (error) {
        console.error("Erro ao editar entidade:", error);
        res.status(500).json({
            message: "Ocorreu um erro ao editar a entidade.",
        });
    }
};
