import React from 'react'
import { Input } from '@material-tailwind/react'

const SingUpForm = () => {
  return (
    <form>
        <Input type="email" id="sign-up-mail" name="email" placeholder='Your Email' />
        <Input id="sign-up-username" type="text" name="username" placeholder='Your Nickname' />
        <Input id="sign-up-pass" type="password" name="email" placeholder='Your password' />
        <Input id="sign-up-pass-repeat" type="passeord" name="email" placeholder='Repeat password' />
    </form>
  )
}

export default SingUpForm