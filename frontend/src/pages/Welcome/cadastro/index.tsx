import styles from '../Welcome.module.scss'
import { useNavigate } from 'react-router-dom'
import { useApiUser } from 'hooks/useApiUser'
import { SubmitHandler, useForm } from 'react-hook-form'


type Inputs = {
  username: string,
  email: string,
  password: string,
  password2: string
}

export default function Cadastro() {

  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>()
  
  const navigate = useNavigate()
  const apiUser = useApiUser();

  const realizaCadastro: SubmitHandler<Inputs> = async data => {
    
    if (data.password !== data.password2) {
      alert("As senhas precisam ser iguais!")
      return
    }
    else {
      const newUser = await apiUser.novoUsuario(data.username, data.email, data.password); 
      
      if(newUser.status === false)
        alert(`ERRO: ${newUser.msg}`);
      else {
        alert("Cadastro realizado com sucesso !");
        navigate('/login');
      }
    }
    
  }

  return(
      <form onSubmit={handleSubmit(realizaCadastro)} className={styles.formulario}>
        <h1 className={styles.formulario__title}>Faça seu cadastro</h1>
        <p className={styles.formulario__texto}>Para entrar na maior comunidade dev do Ramo</p>
      <input
        type="text"
        className={styles.formulario__input__filho}
        id="username" 
        placeholder='Digite seu nome de usuário' required
        {...register('username')}
        />
      <input
        type="email"
        className={styles.formulario__input__filho}
        id="email" required
        placeholder='Digite seu email'
        {...register('email')}
      />
      <input
        type="password"
        className={styles.formulario__input__filho}
        placeholder='Digite sua senha' 
        id='password' required minLength={6}
        {...register('password')}
      />
      <input
        type="password"
        className={styles.formulario__input__filho}
        id="password2" required minLength={6}
        placeholder='Confirme sua senha'
        {...register('password2')}
      />
        <button type='reset' className={styles.formulario__botoes__register} onClick={() => navigate('/login')}>
          Cancelar
        </button>
        <button type="submit" className={styles.formulario__botoes__submit} >
          Cadastre-se
        </button>
      </form>
  )
}
