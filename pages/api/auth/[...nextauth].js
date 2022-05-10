import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { FirestoreAdapter } from "@lowfront/firebase-adapter";
import { db } from "../../../firebase"

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    adapter: FirestoreAdapter(db)
})