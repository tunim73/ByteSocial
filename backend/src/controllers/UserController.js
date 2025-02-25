const database = require ("../database/models");
const Users = database.Users;
const Posts = database.Posts;
const Connections = database.Connections;
const Messages = database.Messages;
const Likes = database.Likes;
const userService = require("../services/userService.js");
const postService = require("../services/postService");
const { Op } = require("sequelize");

class UserController {

    static async criaUsuario (req,res){

        const {username,password,email} = req.body;
             
        try{ 
          
            if(username.length<2) return res.status(300).json({msg:"Insira um nome válido", status:false});
                
            if(!username || !email || !password) return res.status(203).json({msg:"Preencha todos os campos!",status:false});
            
            let emailExists = await userService.findEmail(email);
            
            if(emailExists) return res.status(203).json({msg:"Email já cadastrado!", status:false});
    
            if(password.length<6) return res.status(203).json({msg:"A sua senha precisa ter no mínimo 6 caracteres", status:false});
            
        const hash = userService.hashDaSenha(password);
    
        const novoUsuario = await Users.findOrCreate({where:{email},
            defaults: {
                    username, email, password:hash
                }
            });

        return res.status(201).json(novoUsuario);

        } catch (error){
            return res.status(500).json(error.message);
        }
    }

    static async getMyProfile (req,res){

        const id  = req.user_id;
        const { offset, limit } = req.params;
        
        try {
            const user = await Users.findOne({ where: {id} })

            const { count, rows } = await postService.findUsersPosts(offset, limit, id)

            const countConnections = await Connections.count({
                where:{
                    [Op.or]:[
                        {   user1_id: id    },
                        {   user2_id: id    }
                    ],
                    isStatus: true
                }
            })

            const countRequests = await Connections.count({
                where: { 
                    user2_id:id,
                    isStatus: false
                }
            })

            const normalizationPosts = await postService.normalizationPosts(rows, id); 
            
            return res.status(200).json({
                user_id:user.id,
                username: user.username,
                count, // qtd posts
                list: normalizationPosts,
                connections: countConnections,
                requests: countRequests
            });


            //return res.status(404).json({msg:"Usuario não encontrado"}); 
        } catch (error){
            return res.status(500).json(error.message)
        }
    }

    

    static async pegaProfile(req,res){
        try {

            const userId = req.user_id;
            const { offset, id } = req.params;
            const limit = 8;
            let status;
            
            /*
            0 - Não é amigo
            1 - Enviei Solicitação
            2 - Recebi Solicitação
            3 - Amigos
            */

            const userReq = await Users.findOne({where:{id}});
            if(!userReq) return res.status(404).json({msg:"Usuário não existe"})
            if(userReq.id==userId) return res.status(400).json({msg:"Ooops, parece que você se equivocou..."}) 


            const connection1 = await Connections.findOne({
                where: {
                    user1_id: userId,
                    user2_id: id
                }
            })

            const connection2 = await Connections.findOne({
                where: {
                    user1_id: id,
                    user2_id: userId
                }
            })

            if(!connection1 && !connection2) {
                status = 0;
            }

            if(connection1 && !connection1.isStatus) {
                status = 1;
            }

            if(connection2 && !connection2.isStatus) {
                status = 2;
            }

            if(connection1 && connection1.isStatus || connection2 && connection2.isStatus) {
                status = 3;
            }

            const { count, rows } = await postService.findUsersPosts(offset, limit, id)
            
            const normalizationPosts = postService.normalizationPosts(rows, userId);
            
            const { username } = await Users.findOne({ where: { id } });
            
            const connections = await Connections.count({
                where:{
                    [Op.or]:[
                        {   user1_id: id    },
                        {   user2_id: id    }
                    ],
                    isStatus: true
                }
            })

            const requests = await Connections.count({
                where:{
                    [Op.or]:[
                        {   user1_id: id    },
                        {   user2_id: id    }
                    ],
                    isStatus: false
                }
            })

            return res.status(200).json({
                user_id: id,
                username,
                count,
                list: normalizationPosts,
                connections,
                requests,
                statusFriendship: status
            });

        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    }

    static async pegaTodosUsuarios (req,res){
        
        try{
            const usuarios = await Users.findAll({
                attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
            });
            return res.status(200).json(usuarios);

        } catch (errors){
            return res.status(500).json(errors.message)
        }
    }
    
    static async alteraUsername(req,res){
        const {username} = req.body;
        const id = req.user_id;
        
        try{
            const yourUser = await Users.findOne({where:{id}});
            if(username.trim().toLowerCase() === yourUser.username.trim().toLowerCase()) 
                return res.status(203).json({status:false, msg:"Esse já é o seu username"});
            
            const atualizaUser = await Users.update({username},{where:{id}});
            const usuarioAtualizado = await Users.findOne({where:{id}});   

            //const likes = await Likes.findAll({where:{user_id:id}});
            //const atualizaEmLike = await Likes.update({username},{where:{user_id:id}});

            return res.status(200).json({
                status:true, 
                msg:"Nome atualizado ! ", })

        } catch (error){
            return res.status(500).json(error.message)
        }
    }

    static async alteraEmail (req,res){
    
        const {email} = req.body;
        const id = req.user_id;
        
        try{
            const yourUser = await Users.findOne({where:{id}});
            if(email==yourUser.email) return res.status(203).json({status:false, msg:"Esse já é o seu email"});
            
            const userExists = await Users.findOne({where:{email}});
            if(userExists) return res.status(203).json({status:false, msg:"E mail já utilizado!"});

            
            const atualizaUser = await Users.update({email},{where:{id}});

            //const atualizaEmLike = await Likes.update({email},{where:{user_id:id}});

            return res.status(200).json({
                status:true, 
                msg:"E mail atualizado! ", 
            })

        } catch (error){
            return res.status(500).json(error.message)
        }
    }
    static async alteraSenha (req, res){ 

        const {newPassword} = req.body;
        const id = req.user_id;

        try{
           
            /*
            const usuario = await Users.findOne({ where: { id } });
            const verificaSenha = bcrypt.compareSync(password,usuario.password);  
            
            if(!verificaSenha)
                return res.status(300).json({status:false, msg:"Senha atual incorreta", verificaSenha});
            */
            
            const hash = userService.hashDaSenha(newPassword);
            const atualizou = await Users.update({password:hash},{where:{id}});

            const usuarioAtualizado = await Users.findOne({where:{id}});   

            return res.status(200).json({status:true,msg:"Senha atualizada ", usuarioAtualizado, atualizou})

        } catch (errors){
            return res.status(500).json(errors.message)
        }
    }

    static async deletaUsuario (req,res) {

        const id = req.user_id ;
        try {
            
            await Likes.destroy({
                where: {
                    user_id: id
                }
            })
            
            const todosPostUser = await Posts.findAll({where:{user_id:id}})

            await todosPostUser.map(e => {

                Likes.destroy({
                    where: {
                        post_id: e.id
                    }
                })

            })

            await Posts.destroy({
                where: {
                    user_id: id
                }
            })

            await Connections.destroy({
                where: {
                    [Op.or]:[
                        {   user1_id: id    },
                        {   user2_id: id    }
                    ]
                }
            })
            /*
            await Messages.destroy({
                where: {
                    [Op.or]:[
                        {   sender_id: id    },
                        {   receiver_id: id    }
                    ]
                }
            })
            */
            await Users.destroy({ where: { id } } );
            return res.status(200).json({msg:`id ${id} removido`});

        } catch (errors){
            return res.status(500).json(errors.message)
        }
    }

}

module.exports = UserController;


