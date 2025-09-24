// import React, { useState, useEffect } from 'react'
// import { signInWithEmail, signOut, getCurrentUser, registerUser } from '../utils/supabaseClient'
// import { toast } from 'react-toastify'
// import { User } from '@supabase/supabase-js'

// export function Auth() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [isRegistering, setIsRegistering] = useState(false)

//   useEffect(() => {
//     const fetchUser = async () => {
//       const currentUser = await getCurrentUser()
//       setUser(currentUser)
//     }
//     fetchUser()
//   }, [])

//   const handleSignIn = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       const { user } = await signInWithEmail(email, password)
//       setUser(user)
//       toast.success('Signed in successfully!')
//     } catch (error) {
//       console.error('Error signing in:', error)
//       if (error instanceof Error) {
//         if (error.message === 'Invalid login credentials') {
//           toast.error('Invalid email or password. Please try again.')
//         } else {
//           toast.error('An error occurred while signing in. Please try again.')
//         }
//       } else {
//         toast.error('An unexpected error occurred. Please try again.')
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       const { user } = await registerUser(email, password)
//       setUser(user)
//       toast.success('Registered successfully! Please check your email to confirm your account.')
//     } catch (error) {
//       console.error('Error registering:', error)
//       if (error instanceof Error) {
//         toast.error(`Registration failed: ${error.message}`)
//       } else {
//         toast.error('An unexpected error occurred during registration. Please try again.')
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleSignOut = async () => {
//     setIsLoading(true)
//     try {
//       await signOut()
//       setUser(null)
//       toast.success('Signed out successfully!')
//     } catch (error) {
//       console.error('Error signing out:', error)
//       toast.error('An error occurred while signing out. Please try again.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (user) {
//     return (
//       <div className="p-4 bg-gray-100 rounded-lg">
//         <p className="mb-2">Signed in as: <strong>{user.email}</strong></p>
//         <button 
//           onClick={handleSignOut}
//           disabled={isLoading}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
//         >
//           {isLoading ? 'Signing out...' : 'Sign Out'}
//         </button>
//       </div>
//     )
//   }

//   return (
//     <div className="p-4 bg-gray-100 rounded-lg">
//       <h2 className="text-2xl font-bold mb-4">{isRegistering ? 'Register' : 'Sign In'}</h2>
//       <form onSubmit={isRegistering ? handleRegister : handleSignIn} className="space-y-4">
//         <div>
//           <label htmlFor="email" className="block mb-2">Email</label>
//           <input
//             id="email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter your email"
//             required
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>
//         <div>
//           <label htmlFor="password" className="block mb-2">Password</label>
//           <input
//             id="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your password"
//             required
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>
//         <button 
//           type="submit"
//           disabled={isLoading}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
//         >
//           {isLoading ? (isRegistering ? 'Registering...' : 'Signing in...') : (isRegistering ? 'Register' : 'Sign In')}
//         </button>
//       </form>
//       <button 
//         onClick={() => setIsRegistering(!isRegistering)} 
//         className="mt-4 text-blue-500 hover:underline"
//       >
//         {isRegistering ? 'Already have an account? Sign In' : 'Don\'t have an account? Register'}
//       </button>
//     </div>
//   )
// }

