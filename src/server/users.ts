"use server"

// these are deprecated server actions; we use the authClient from better-auth instead.

// import { auth } from "~/lib/auth"

// export const signIn = async (email: string, password: string) => {
//     try {
//         await auth.api.signInEmail({
//             body: {
//                 email,
//                 password
//             }
//         })
//         return {
//             success: true,
//             message: "Signed in successfully."
//         }
//     } catch (error) {
//         const e = error as Error;
//         return {
//             success: false,
//             message: e.message || 'An unknown error occured.'
//         }
//     }
// }

// export const signUp = async (username: string, email: string, password: string) => {
//     try {
//         await auth.api.signUpEmail({
//             body: {
//                 email,
//                 password,
//                 name: username
//             }
//         })
        
//         return {
//             success: true,
//             message: "Signed in successfully."
//         }
//     } catch (error) {
//         const e = error as Error

//         return {
//             success: false,
//             message: e.message || 'An unknown error occured.'
//         }
//     }
// }

// /*
// export const signOut = async () => {
//     try {
//         await auth.api.signOut();
//         return {
//             success: true,
//             message: "Signed out successfully."
//         }
//     } catch (error) {
//         const e = error as Error;
//         return {
//             success: false,
//             message: e.message || 'An unknown error occurred.'
//         }
//     }
// }
// */