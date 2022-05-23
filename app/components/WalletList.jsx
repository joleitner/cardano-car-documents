import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'
import WalletItem from './WalletItem'

export default function WalletList({wallets}) {

  return (
     <Container className='p-0'>
         {wallets.map((wallet, number) => (
            <WalletItem 
             key={wallet.name} 
             walletName={wallet.name} 
             number={number}/>
        ))}
     </Container>
  )
}