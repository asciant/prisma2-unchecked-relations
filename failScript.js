const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// A `main` function so that you can use async/await
async function main() {

    // Create the user
    const newUser = await prisma.user.create({
    data: {},
    })

    // Create a Category
    const newCategory = await prisma.category.create({
        data: {},
    })

    // Create a post
    const newPost = await prisma.post.create({
        data: {
            // ✅
            // author: {
            //     connect: {
            //         id: newUser.id
            //     }
            // },
            // 🛑
            authorId: newUser.id,
            categories: {
                connect: {
                    id: newCategory.id
                }
            },
        },
    })

    // // Connect Post to a Category
    // // This will fail 🙅🏻‍♂️
    // const connectedPost = await prisma.post.update({
    //     where: { id: newPost.id },
    //     data: {
    //         categories: {
    //             connect: {
    //                 id: newCategory.id
    //             }
    //         },
    //      }
    // })

    // // Connect Category to a Post
    // const connectedCategory = await prisma.category.update({
    //     where: { id: newCategory.id },
    //     data: {
    //         posts: {
    //             connect: {
    //                 id: newPost.id
    //             }
    //         },
    //         description: 'This will not fail'
    //      }
    // })

}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
