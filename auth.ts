import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "./lib/mongodb"
import { MongoDBAdapter } from "@auth/mongodb-adapter";

const adapter = MongoDBAdapter(clientPromise,{
  databaseName: "vine-be-gone-now",
})

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
    unstable_update,
  } = NextAuth({
    adapter: adapter,
    providers: [
      GoogleProvider({
        name: "google",
        clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
      }),
      
    ],
    session: {
      strategy: 'database',
    },
    pages:{
      error:"/unauthorization"
    },
    callbacks: {      
      session: async ({ session,trigger,newSession }) => {
        if(trigger && newSession.name && adapter.updateUser){
          await adapter.updateUser({id:session.user.id,name:newSession.name})
          return session
        }

        if(session.user.role){
          return session
        }

        if(!adapter.getUser || !adapter.updateUser){
          return session
        }

        const result = await adapter.getUser(session.userId)
        if(!result){
          session.user.role = "user"
          return session
        }
        if(!result.role){
          const updatedUser = await adapter.updateUser({role:"user",id:session.userId})
          session.user.role = "user"
        }
        session.user.role = result.role
        return session
      },
      // signIn:async ({user}) => {
      //   return user.email?user.email.includes("peas3.tree.vine@gmail.com"):"/unauthorization"
      // }
    },
  });


  // if (session.user) {
        //   session.user.id = token.id
        //   session.user.role = token.role
        //   session.sub = token.sub
        //   session.provider = token.provider
        // }

  // jwt: async ({ token, user, account,trigger,session }) => {
      //   // if(trigger == "update" && session?.name && token.id && token.name && await updateUser(token.id,session.name)){
      //   //   token.name = session.name
      //   // }
      //   console.log(token)
      //   if (user) {
      //     token.id = user.id
      //     // token.role = user.role
      //     account ? (token.provider = account.provider) : undefined;
      //   }
      //   return token
      // },

  


  

