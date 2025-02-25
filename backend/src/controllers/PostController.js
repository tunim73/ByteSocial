const database = require ("../database/models");
const Posts = database.Posts;
const Likes = database.Likes;
const Users = database.Users;
const postService = require("../services/postService")
class PostController
{
    static async createPost(req,res)
    {
      try {
        const id = req.user_id;
        const {content} = req.body;

        if(!content) return res.status(400).json({msg:"Digite alguma coisa antes de postar"});
        const addPost = await Posts.create({content, user_id:id});
        return res.status(201).json(addPost);

      } catch (error) {
        return res.status(500).json({msg:error.message})
      }
    }

    static async deletePost(req,res)
    {
      try {
        const{post_id} = req.params;
        const id = req.user_id;

        const postProc = await Posts.findOne({where:{id:Number(post_id)}});
        if(!postProc) return res.status(404).json({msg:"Esse post não existe!"});

        if(postProc.user_id!=id) return res.status(401).json({msg:"Você não pode apagar um post que não é seu!"});
        await Likes.destroy({ where: { post_id } });
        await Posts.destroy({where:{id:post_id}});
        return res.status(200).json({msg:"Post deletado com sucesso!"});
      } catch (error) {
        return res.status(500).json({msg:error.message});
      }
    }

    static async showPost(req,res)
    {
      try {
        const{post_id} = req.params;
        const likesInPost = await Likes.findAll({where:{post_id}});
        const post = await Posts.findOne({where:{id:post_id}});
        if(!post)return res.status(404).json({msg:"Post não encontrado, talvez esse post não exista!"});

        return res.status(200).json({post, likes:likesInPost.length});

      } catch (error) {
        return res.status(500).json({msg:error.message});
      }
    }
  
    static async showPosts(req, res)
    {
      try {
        const { offset, limit } = req.params;
        const id = req.user_id;

        const {count, rows} = await postService.findPosts(offset, limit)

        const normalizationPosts = await postService.normalizationPosts(rows, id);  

        return res.status(200).json({
          count,
          list:normalizationPosts
        });
        

      } catch (error) {
        return res.status(500).json({msg:error.message});
      }
    }
    
}


module.exports = PostController;