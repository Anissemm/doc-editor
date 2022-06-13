import { Button, Input } from '@material-tailwind/react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import * as yup from 'yup'
import { Formik } from 'formik'
import { auth } from '../../firebase'
import { useState } from 'react'
import InfinityLoader from '../../public/svg/InfinityLoader'

const loginVariants = {
  hidden: i => ({
    opacity: 0,
    translateY: i === 0 ? 100 : 0
  }),
  visible: i => ({
    opacity: 1,
    translateY: 0,
    transition: {
      duration: 1,
      delay: 0.5 * i
    }
  })
}

const MotionButton = motion(Button)

const passwordRegex = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/

const sigUpValidationSchema = yup.object({
  email: yup.string().email('Invalid Email address').required('Email required'),
  username: yup.string().min(4, 'Username must be at least 4 character long').max(30, 'Username must be at most 30 character long').required('Nickname required'),
  password: yup.string().matches(passwordRegex, "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character").required('Password required'),
  repeatPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password required')
})

const SingUpForm = ({ setForm, setEmail }) => {
  const [responseError, setResponseError] = useState(false)

  const createUser = async (email, username, password) => {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password)
      await user.updateProfile({ displayName: username, photoURL: '/image/account.png' })
      await user.sendEmailVerification()
      setForm('verification-mail-sent')

    } catch (error) {
      var errorCode = error.code;
      if (errorCode == 'auth/email-already-in-use') {
        setResponseError('Email already in use')

      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="z-1 relative font-['Poppins'] mt-10 sm:my-0 font-semibold flex flex-col justify-center items-center text-gray-400">
      <h2 className="sr-only" variants={loginVariants} custom={0}>Sign Up</h2>
      <Formik
        initialValues={{ email: '', username: '', password: '', repeatPassword: '' }}
        validationSchema={sigUpValidationSchema}
        onChange={() => {

        }}
        onSubmit={async (values, { setSubmitting }) => {
          const { password, email, username } = values
          setEmail(email)
          setSubmitting(true)
          await createUser(email, username, password)
          setSubmitting(false)
        }}
      >
        {formik => {
          return (
            <>
              <AnimatePresence>
                {formik.isSubmitting && <motion.div transition={{ duration: 0.5 }} className='mx-auto flex items-center justify-center w-[250px] h-full absolute 
                z-10 -top-5 left-0 rounded-lg right-0 bg-gray-400 opacity-80'>
                  <InfinityLoader className="w-20 h-20" />
                </motion.div>}
              </AnimatePresence>
              <form className='w-[220px] !text-md' onSubmit={formik.handleSubmit}>
                <div className='mb-2.5 signup-input'>
                  <Input
                    className='!text-gray-200'
                    outline={true}
                    color='gray'
                    size="md"
                    type="email"
                    id="sign-up-mail"
                    name="email"
                    error={(formik.touched.email && formik.errors.email) || (responseError && responseError)}
                    onChange={(e) => {
                      setResponseError(false)
                      formik.handleChange(e)
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    placeholder='Email'
                  />
                </div>

                <div className='mb-2.5 signup-input'>
                  <Input
                    outline={true}
                    color='gray'
                    size="md"
                    id="sign-up-username"
                    type="text"
                    name="username"
                    error={formik.touched.username && formik.errors.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    values={formik.values.username}
                    placeholder='Nickname' />
                </div>

                <div className='mb-2.5 signup-input'>
                  <Input
                    outline={true}
                    color='gray'
                    size="md"
                    id="sign-up-pass"
                    type="password"
                    name="password"
                    error={formik.touched.password && formik.errors.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    values={formik.values.password}
                    placeholder='Password' />
                </div>

                <div className='mb-2.5 signup-input'>
                  <Input
                    outline={true}
                    color='gray'
                    size="md"
                    id="sign-up-pass-repeat"
                    type="password"
                    name="repeatPassword"
                    error={formik.touched.repeatPassword && formik.errors.repeatPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.repeatPassword}
                    placeholder='Confirm password' />
                </div>

                <div className='mb-2.5 text-xs font-normal text-center px-1'>
                  By creating an account, you agree to the
                  <Link href="/terms_and_use">
                    <a className='px-1 hover:text-gray-500 focus:text-gray-500 transition 
                    duration underline'>Terms and Use</a>
                  </Link>
                  and
                  <Link href="/privacy_policy">
                    <a className='px-1 hover:text-gray-500 focus:text-gray-500 transition 
                    duration underline'>Privacy Policy</a>
                  </Link>.
                  <MotionButton
                    type="submit"
                    variants={loginVariants}
                    custom={1}
                    color='blueGray'
                    buttonType="filled"
                    size="md"
                    block={true}
                    rounded={false}
                    iconOnly={false}
                    ripple="light"
                    className='mt-3 bg-gray-700 shadow-sm'
                    aria-label='Sing in with Email and Password'
                  >
                    Sign Up
                  </MotionButton>
                  <p className='text-sm text-center py-4'>
                    <button
                      type="button"
                      onClick={() => { setForm('signin') }}
                      className='bg-transparent text-sm  px-1 border-none pl-1 hover:text-gray-500 focus:text-gray-500 transition 
                            duration-200 ml-auto underline'>
                      I am already a member.
                    </button>
                  </p>
                </div>
              </form>
            </>
          )
        }}
      </Formik>
    </motion.div>
  )
}

export default SingUpForm