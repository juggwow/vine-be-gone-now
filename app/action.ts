'use server'

import clientPromise from "@/lib/mongodb"
import { redirect } from "next/navigation"

 
export async function findUser(sub:string) {
    try{
        const mongoClient = await clientPromise
    await mongoClient.connect()
    const userInVine = await mongoClient.db("vine-be-gone").collection("user").findOne({sub})
    if(userInVine){
        return {
            status: "success",
            hasUserProfile: true
          }
    }
    const user = await mongoClient.db("user").collection("user").findOne({
        sub
    },{
        projection:{
            _id:0,
            mobileno: 1,
            firstname: 1,
            lastname: 1
        }
    })
    console.log(user)
    if(!user){
        return {
            status: "success",
            hasUserProfile: false
          }
    }
    const resultInsert = await mongoClient.db("vine-be-gone").collection("user").insertOne({
        mobileno: user['mobileno'],
        name: `${user['firstname']} ${user['lastname']}`
    })
    await mongoClient.close()
    if(!resultInsert.acknowledged){
        return {
            status: "success",
            hasUserProfile: false
          }
    }
    return {
        status: "success",
        hasUserProfile: true
      }
    }catch(e){
        return {
            status: "fail",
            hasUserProfile: false
          }
    }

  
}