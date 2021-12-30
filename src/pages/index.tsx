import React from "react"

import Layout from "@components/shared/Layout"

// const Loader = () => {
//   return (
//     <div className="w-full h-full my-12 font-mono text-2xl animate-pulse">
//       Loading...
//     </div>
//   )
// }

// const Error = () => {
//   return (
//     <div className="w-full h-full font-mono text-2xl text-red-600">
//       Error happened while loading...
//     </div>
//   )
// }

function Home() {
  // const utils = trpc.useContext()

  return (
    <Layout protectedRoute>
      <h1 className="text-3xl font-semibold">Forever QR</h1>

      <hr />
    </Layout>
  )
}
export default Home
