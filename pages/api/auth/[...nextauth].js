import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import YandexProvider from 'next-auth/providers/yandex'
import CredentialsProvider from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@lowfront/firebase-adapter"
import { db, auth } from "../../../firebase"
import { signIn } from "next-auth/react";

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
            async authorize(credentials, req) {
                const { email, password } = credentials

                try {
                    const credentialUser = await auth.signInWithEmailAndPassword(email, password)
                    const { user } = credentialUser
                    console.log(user)

                    if (!user.emailVerified) {
                        throw new Error('mail-not-verified')
                    }

                    if (user) {
                        return {
                            email: user.email,
                            image: user.photoURL,
                            name: user.displayName,
                            id: user.uid
                        }
                    }
                } catch (err) {
                    return new Error(err.message)
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user?.id) {
                token.user = user
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user = token.user
            }
            return session
        }
    },
    secret: 'secret',
    session: { strategy: 'jwt' },
    jwt: {
        secret: 'secret',
        encrypted: true
    },
    events: {
        async singOut() {
            auth.signOut()
        }
    },
    adapter: FirestoreAdapter(db)
})