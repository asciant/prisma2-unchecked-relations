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

}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
