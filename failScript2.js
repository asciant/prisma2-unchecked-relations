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

    // Create a Profile
    const newProfile = await prisma.profile.create({
        data: {
            user: {
                connect: {
                    id: newUser.id
                }
            },
        },
    })

    // Create a post
    const newPost = await prisma.post.create({
        include: {
            author: true,
            categories: true,
            profile: true
        },
        data: {
            author: {
                connect: {
                    id: newUser.id
                }
            },
        },
    })

    const updatePost = await prisma.post.update({
        where: { id: newPost.id },
        include: {
            author: true,
            categories: true,
            profile: true
        },
        data: {
            categories: {
                connect: {
                    id: newCategory.id.toString()
                }
            }
        },
    })

    console.log(updatePost)

}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
