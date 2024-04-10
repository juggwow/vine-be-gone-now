import { auth } from "@/auth"

export default async function Unauthorization() {
    console.log(await auth())
    return(
        <div>
            <p>คุณไม่สามารถใช้งานได้</p>
        </div>
    )
    
}