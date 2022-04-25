import {useNavigate } from 'react-router-dom'
import ProjectForm from '../../project/projectForm/ProjectForm'
import styles from './NewProject.module.css'

function NewProject(){
  const navigate = useNavigate()
// 
  function createPost(project){
    // iniaciando o cost e e services 
    project.cost = 0
    project.services = []

    fetch ('http://localhost:5000/projects',{
      method: 'POST', 
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data)
        // redirect
        navigate('/projects', {state: {message: 'Projeto criado com sucesso'}})
      
      })
      .catch((err) => console.log(err))
  }


  return(
    <div className={styles.container} >
      <h1>Criar projeto</h1>
      <p>Crie seu projeto para depois adicionar serviços</p>
      <ProjectForm  handleSubmit={createPost} btnText="Criar Projeto"/>
    </div>

  )
}
export default NewProject