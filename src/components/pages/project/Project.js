import {v4 as uuidv4} from 'uuid'

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Loader from "../../layout/loader/Loader"
import Container from "../../layout/container/Container"
import styles from "./Projects.module.css"
import ProjectForm from "../../project/projectForm/ProjectForm"
import Message from "../../layout/message/Message"
import ServiceForm from "../../project/projectForm/serviceForm/ServiceForm"
import ServiceCard from "../../project/projectForm/serviceForm/ServiceCard"


function Project() {
  const { id } = useParams() 
  const [project, setProject] = useState([])
  const [services, setServices] = useState([])
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [message, setMessage] = useState()
  const [type, setType] = useState()

  useEffect(() => {
    setTimeout(() => {
      fetch(`http://localhost:5000/projects/${id}`, {
        method: "GET",
        headers: {
          "Content-Type" : "application/json"
        }
      })
        .then((resp) => resp.json())
        .then((data) => {
          setProject(data)
          setServices(data.services)


        })
        .catch((err) => console.log())
    }, 1500)
  }, [id])
  function editPost(project) {
    setMessage("")
    if (project.budget < project.cost) {
      setMessage("O orçamento não pode ser menor que o custo do projeto")
      setType("error")
      return false
    }
    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(project)
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data)
        setShowProjectForm(false)
        setMessage("Projeto atualizado")
        setType("sucess")
      })
      .catch((err) => console.log(err))
  }
  function createService(project) {
    setMessage('')
    // last service 
    const lastService = project.services[project.services.length - 1]
    lastService.id = uuidv4()
    const lastServiceCost = lastService.cost
    const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

    // maximum value validation 
    if (newCost > parseFloat(project.budget)) {
      
      setMessage('Valor não permitido, verifique o valor do serviço')
      setType('error')
      project.services.pop()
      return false
    }
    // add  service cost to project total cost 
    project.cost = newCost

    // update project 
    fetch(`http://localhost:5000/projects/${project.id}`,{
      method:'PATCH',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify(project),
    }).then((resp) => resp.json())
      .then((data) => {

      //  exibir os serviços
      console.log(data)
     })
     .catch((err) => console.log(err))
  }
  function removeService(id, cost) {
    const servicesUpdated = project.services.filter(
      (service) => service.id !== id
    )
    const projectUpdated = project

    projectUpdated.services = servicesUpdated
    projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

    fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(projectUpdated)
    })
    .then((resp) => resp.json())
    .then((data) => {
      setProject(projectUpdated)
      setServices(servicesUpdated)
      setMessage('Serviço removido com sucesso!')
      type('sucess')
    })
    .catch((err) => console.log(err))

  }
  function toggleProjectForm() {
    setShowProjectForm(!showProjectForm)
  }
  function toggleServiceForm() {
    setShowServiceForm(!showServiceForm)
  }
  return (
    <>
      {project.name ? (
        <div className={styles.details}>
          <Container customClass="column">
            {message && <Message type={type} msg={message} />}
            <div className={styles.details_container}>
              <h1>Projeto: {project.name}</h1>
              <button className={styles.btn} onClick={toggleProjectForm}>
                {!showProjectForm ? "Editar Projeto" : "fechar"}
              </button>
              {!showProjectForm ? (
                <div className={styles.info}>
                  <p>
                    <span>Categoria: </span> {project.category.name}
                  </p>
                  <p>
                    <span>Total de orçamento: </span> R$ {project.budget}
                  </p>
                  <p>
                    <span>Total utilizado: </span> R$ {project.cost}
                  </p>
                </div>
              ) : (
                <div className={styles.info}>
                  <ProjectForm
                    handleSubmit={editPost}
                    btnText="Concluir Edição"
                    projectData={project}
                  />
                </div>
              )}
            </div>
            <Container customClass="column">
              <div className={styles.service_form_container}>
                <h2>Adicione um serviço: </h2>
                <button className={styles.btn} onClick={toggleServiceForm}>
                  {!showServiceForm ? "Adicionar serviço" : "fechar"}
                </button>
                <div className={styles.info}>
                  {showServiceForm && (
                    <ServiceForm
                      handleSubmit={createService}
                      btnText="Adicionar serviço"
                      projectData={project}
                    />
                  )}
                </div>
              </div>
            </Container>

            <h2>Serviços</h2>
            <Container customClass="start">
              {services.length > 0 &&
                  services.map((service) => (
                    
                    <ServiceCard
                      id={service.id}
                      name={service.name}
                      cost={service.cost}
                      description={service.description}
                      key={service.id}
                      handleRemove={removeService}
                    />
                  ))
              }
              {services.length === 0 && <p>Não há serviços cadastrados.</p>}
            </Container>
          </Container>
        </div>
      ) : (
        <Loader />
      )}
    </>
  )
}
export default Project
