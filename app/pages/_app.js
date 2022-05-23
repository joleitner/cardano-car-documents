import Layout from '../components/Layout'
import '../styles/scss/globals.scss'
import '../styles/globals.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
