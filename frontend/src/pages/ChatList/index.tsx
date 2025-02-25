import styles from './ChatList.module.scss'
import Menu from '../../components/Menu'
import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useApiMessage } from 'hooks/useApiMessage'


interface Props {
  selectedMenu: number,
  setSelectedMenu: React.Dispatch<React.SetStateAction<number>>
}

interface lastMessage {
  id: string,
  sender_id: string,
  receiver_id: string,
  message: string,
  timestamp: string,
  updatedAt: string,
  createdAt: string
}

interface Contact {
  username: string,
  userId: string,
  lastMessage: lastMessage
}

export default function ContactList(props: Props){
  const [search, setSearch] = useState('')
  const [list, setList] = useState<Array<Contact>>([]);

  const lowerSearch = search.toLowerCase()

  const contactsFilter = list.filter((item: Contact) => item.username.toLowerCase().includes(lowerSearch));
  
    /*const apiUser = useApiUser();
    const auth = useContext(AuthContext);*/
  
    const [selectedSection, setSelectedSection] = useState<number>(0)
  
    //const [contactname, setContactname] = useState<string | null >('')

    useEffect(() => {
      props.setSelectedMenu(3)

      async function getContacts(){
        const contact = await useApiMessage().getConversation()
        console.log(contact);
        
        setList(contact);
      }
      getContacts()
    }, [])

    

  
    /*const getContact = async () => {
      
    }*/ 

    const navigate = useNavigate();


    return( 
    
    <div className={styles.chatListPrincipal}>
        <div className={styles.chatListPrincipal__page}>
          <div className={styles.chatListPrincipal__title}> 
            <h1>Mensagens</h1>
          </div> 
        
          <div className={styles.chatListPrincipal__top}>
            <div className={styles.chatListPrincipal__sections}>
              <div className={styles.chatListPrincipal__sections__item__selected}>
                <a>Conversas</a>
              </div>
              
              <div className={styles.chatListPrincipal__sections__item}>
                <a onClick={() => navigate('/contactList')}>Lista de contatos</a>
              </div>
            </div>

            <div className={styles.chatListPrincipal__inputBox}>
              <input  
              type="text" 
              placeholder='Buscar conversa' 
              className={styles.chatListPrincipal__input}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              />
              <FiSearch size="20px" className={styles.chatListPrincipal__searchButton}/>
            </div>

          </div>
          
          <div className={styles.chatListPrincipal__contactList}>
            <ul className={styles.chatListPrincipal__contactList__list}>
              {contactsFilter.map((item) => 
                <li key={`chatList:${item.userId}`}
                  className={styles.chatListPrincipal__contactList__contact}>
                
                  
                  <div className={styles.chatListPrincipal__contactList__contactPhoto}>

                    <img src={`https://avatar.uimaterial.com/?setId=0496UVJDTqyd2eCIAa46&name=${item.username}`}/>
                  </div>
                  <div className={styles.chatListPrincipal__contactList__contactText}>
                    <h2 className={styles.chatListPrincipal__contactList__userName}>{item.username}</h2>
                    <p className={styles.chatListPrincipal__contactList__userMsg}>{item.lastMessage.message}</p>
                  </div>
                </li>
                )}
            </ul>
          </div>

        </div>
      </div>//Principal
  
    )
}