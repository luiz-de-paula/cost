import { useLocation } from "react-router-dom"
import Message from "../../layout/message/Message"
import styles from './Projects.module.css'
import Container  from '../../layout/container/Container'
import LinkButton from "../../layout/botton/LinkButton"
import ProjectCard from "../../project/projectCard/ProjectCard"
import { useEffect, useState } from "react"
import Loader from "../../layout/loader/Loader"

function Projects(){
  const [projects, setProjects] = useState([])
  const [loader, setLoader] = useState(false)
  const [projectMessage, setProjectMessage] = useState('')


  const location = useLocation()
  let message = ''
  if (location.state){
    message = location.state.message
  }

  useEffect(() => {
    setTimeout(() => {
      fetch('http://localhost:5000/projects', {
      method: 'GET', 
      headers: {
        'Content-type':'application/json'
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data)
        setProjects(data)
        setLoader(true)
      }).catch((err) => console.log(err))


    }, 300)
  }, [])

  function removeProject(id){
    fetch(`http://localhost:5000/projects/${id}`,{
      method: 'DELETE',
      headers:{
        'Content-Type':'application/json'
      },

    }).then(resp => resp.json())
      .then(data => {
        setProjects(projects.filter((project) => project.id !== id))
        setProjectMessage('Projeto removido com sucesso!')
      }).catch((err) => console.log(err))
  }

  return(
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/newproject" text="Criar projeto"/>
      </div>

      {message && <Message type="sucess" msg={message}/>}
      {projectMessage && <Message type="error" msg={projectMessage}/>}
      <Container customClass="start">
        {projects.length > 0 && 
          projects.map((project) => 
            <ProjectCard
              id={project.id} 
              name={project.name}
              budget={project.budget}
              category={project.category.name}
              key={project.id}
              handleRemove={removeProject}

            />)
        }
        {!loader && <Loader/>}
        {loader && projects.length === 0 &&(
          <p>Não há projetos cadastrados!</p>
        )}
      </Container>

    </div>
  )
}
export default Projects