import { auth } from '@/auth'
import ClientButton from './client'

export default async function SignIn() {
  const session = await auth()
  if(session){
    return(
      <div className="flex h-screen items-center justify-center">
        <p>ล็อกอินสำเร็จ</p>
      </div>
    )
  }
  

  return (
    <div className="flex h-screen items-center justify-center">
      <ClientButton />
    </div>
  )
}