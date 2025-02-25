import { useEffect, useState } from "react"
import styles from './Home.module.scss';
import Post from "components/Post/Post";
import NewPost from "components/NewPost";
import { useApiPost } from "hooks/useApiPost";
import { tPost, aboutPosts } from "types/Post";
import Pagination from "components/Pagination";

interface Props {
  selectedMenu: number,
  setSelectedMenu: React.Dispatch<React.SetStateAction<number>>
}

const LIMIT = 5;

export default function Home(props: Props) {

  const [selectedSection, setSelectedSection] = useState<number>(0);
  const [changeListPost, setChangeListPost] = useState<boolean>(false);
  const [listPost, setListPost] = useState<tPost[]>([]);
  const [total, setTotal] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);


  const apiPost = useApiPost();

  useEffect(() => {
    props.setSelectedMenu(1)
  }, [])

  useEffect(() => {
    setChangeListPost(false);
    effectToPosts();
  }, [changeListPost, offset])

  const effectToPosts = async () => {
    const data: aboutPosts = await apiPost.showPosts(offset, LIMIT);
    setTotal(data.count);
    setListPost(data.list ? data.list : []);
  }

  
  return (
    <div className={styles.Home} id='Home'>
      <div className={styles.Home__newPost}>
        <NewPost change={setChangeListPost}/>
      </div>
      <div className={styles.Home__sections}>
        <div
          className={selectedSection !== 0 ? styles.Home__sections__item : styles.Home__sections__item__selected}
          onClick={() => setSelectedSection(0)}>
          <h3>Publicações</h3>
        </div>
      </div>
      <div className={styles.Home__contentFeed}>
        
      </div>
      <div className={styles.Home__FeedPosts}>
        {listPost.map(e => <Post
          
          id ={ e.postId }
          username={e.postUsername}
          conteudo={e.postContent}
          curtidas={e.postTotalLikes}
          comentario={e.postTotalLikes*5}
          dataPostagem={e.postDate}
          userId={e.postUserId}
          liked={e.userLiked}
          setRefresh={setChangeListPost}
          key={`postHome${e.postId}`}


        ></Post>)}
        
      </div>
      <div className={styles.Home__paginationComponent}>
        <Pagination limit={LIMIT} total ={total} offset={offset} setOffset={setOffset}/>
      </div>
    </div>
  ) 
}
