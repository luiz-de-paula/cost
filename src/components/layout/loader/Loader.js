import styles from '../../layout/loader/loader.module.css'
import loading from  '../../../img/loading.svg'


function Loader(){
  return (
    <div className={styles.container}>
      <img className={styles.loader} src={loading} alt="Carregamento dos projetos" />
    </div>
  )
}
export default Loader