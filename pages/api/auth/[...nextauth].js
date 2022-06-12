import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import YandexProvider from 'next-auth/providers/yandex'
import CredentialsProvider from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@lowfront/firebase-adapter"
import { db } from "../../../firebase"

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        YandexProvider({
            clientId: process.env.YANDEX_CLIENT_ID,
            clientSecret: process.env.YANDEX_CLIENT_SECRET
        })
        // CredentialsProvider({
        //     name: 'Using Email & Password',
        //     credentials: {
        //         username: { label: "Username or Email", type: "text", placeholder: "user or user@mail.com" },
        //         password: { label: "Password", type: "password" }
        //     },
        //     async authorize(credentials, req) {
        //         try {
        //             const res = await getDocFromServer(db, 'credentialsUser', 'email')
        //             console.log(res)
        //             const user = ''
        //             // If no error and we have user data, return it
        //             if (res.ok && user) {
        //                 return user
        //             }
        //             // Return null if user data could not be retrieved
        //             return null
        //         } catch (err) {

        //             return null
        //         }
        //     }
        // })
    ],
    adapter: FirestoreAdapter(db)
})