import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import YandexProvider from 'next-auth/providers/yandex'
import CredentialsProvider from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@lowfront/firebase-adapter"
import { db, auth } from "../../../firebase"

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
        }),
        CredentialsProvider({
            name: 'Using Email & Password',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Your Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, _req) {
                try {
                    const { email, password } = credentials
                    const credentialUser = await auth.signInWithEmailAndPassword(email, password)
                    const { user } = credentialUser

                    return {
                        email: user.email,
                        emailVerified: user.emailVerified,
                        image: user.photoURL,
                        name: user.displayName,
                        id: user.uid,
                        isCredentials: true
                    }

                } catch (error) {
                    if (error.hasOwnProperty('code')) {
                        throw new Error(error.code)
                    }
                    throw error
                }

            }
        })
    ],
    callbacks: {
        async sigIn(props) {
            if (props.user) return true
            return false
        },
        async jwt({ token, user }) {
            if (user?.id) {
                token.user = user
            }

            return token
        },
        async session({ session, token }) {
            if (token.user) {
                session.user = token.user
            }
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    jwt: {
        secret: 'secret',
        encrypted: true
    },
    adapter: FirestoreAdapter(db)
})