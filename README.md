# prisma2-unchecked-relations

The summary is, for Prisma to use the `PostCreateInput` or `PostUpdateInput` everything in the respective input must match the type exactly. Otherwise, `PostUncheckedCreateInput` or `PostUncheckedUpdateInput` is used. Unchecked inputs don't have access to `connect`, or `set`, etc. with some relation types.

The `Arg` types:

```javascript
/**
* Post create
*/
export type PostCreateArgs = {
/**
    * Select specific fields to fetch from the Post
**/
select?: PostSelect | null
/**
    * Choose, which related nodes to fetch as well.
**/
include?: PostInclude | null
/**
    * The data needed to create a Post.
**/
data: XOR<PostCreateInput, PostUncheckedCreateInput>
}

/**
* Post update
*/
export type PostUpdateArgs = {
/**
    * Select specific fields to fetch from the Post
**/
select?: PostSelect | null
/**
    * Choose, which related nodes to fetch as well.
**/
include?: PostInclude | null
/**
    * The data needed to update a Post.
**/
data: XOR<PostUpdateInput, PostUncheckedUpdateInput>
/**
    * Choose, which Post to update.
**/
where: PostWhereUniqueInput
}
```

The input types:

```javascript
export type PostCreateInput = {
    author: UserCreateNestedOneWithoutPostsInput
    categories?: CategoryCreateNestedManyWithoutPostsInput
    profile?: ProfileCreateNestedOneWithoutPostsInput
}

export type PostUncheckedCreateInput = {
    id?: number
    authorId: number
    profileId?: number | null
}

export type PostUpdateInput = {
    author?: UserUpdateOneRequiredWithoutPostsInput
    categories?: CategoryUpdateManyWithoutPostsInput
    profile?: ProfileUpdateOneWithoutPostsInput
}

export type PostUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    authorId?: IntFieldUpdateOperationsInput | number
    profileId?: NullableIntFieldUpdateOperationsInput | number | null
}
```

How the `connect` functionality fits in for category (only available when on standard input type - when all types match):

```javascript
export type CategoryCreateNestedManyWithoutPostsInput = {
    create?: XOR<Enumerable<CategoryCreateWithoutPostsInput>, Enumerable<CategoryUncheckedCreateWithoutPostsInput>>
    connectOrCreate?: Enumerable<CategoryCreateOrConnectWithoutPostsInput>
    connect?: Enumerable<CategoryWhereUniqueInput>
}

export type CategoryWhereUniqueInput = {
    id?: number
}
```

This relates to https://github.com/prisma/prisma/issues/5788

The example schema was taken from the [Prisma Relations Documentation](https://www.prisma.io/docs/concepts/components/prisma-schema/relations#types-of-relations)

## DBs

I tested on both SQLite and PostgreSQL 13.2.

## Setup

1. `npm install`
2. Reset database (delete the existing tables from the database - if any) and then run `npx prisma db push`
3. Confirm tables were setup correctly (I used TablePlus for this)

## Working Example

1. Do setup
2. Run `npm run dev`
3. Check the database, category and post should be connected

## Failing Example 1

*This error was caused by referencing the `authorId` field directly (which is only available in the Unchecked type `PostUncheckedCreateInput`). In isolation, it would create the 1-1 relation, the error is thrown here because the `PostUncheckedCreateInput` does not know about the `categories` relation. Referencing `authorId` directly, has resulted in Prisma utilising the `PostUncheckedCreateInput` type, as opposed to the desired `PostCreateInput`.*

*Fixing this error is as simple as using the methodology from the `PostCreateInput` type. E.g.:*

```
// Create a post
const newPost = await prisma.post.create({
    data: {
        // ???
        author: {
            connect: {
                id: newUser.id
            }
        },
        categories: {
            connect: {
                id: newCategory.id
            }
        },
    },
})
```

1. Do setup (if you didn't already do it in the working example)
2. Run `npm run fail1`
3. Review throw from prisma

```
> node ./failScript1.js

(node:9005) UnhandledPromiseRejectionWarning: Error:
Invalid `prisma.post.create()` invocation:

{
  data: {
    authorId: 9,
    categories: {
    ~~~~~~~~~~
      connect: {
        id: 9
      }
    }
  }
}

Unknown arg `categories` in data.categories for type PostUncheckedCreateInput. Available args:

type PostUncheckedCreateInput {
  id?: Int
  authorId: Int
}
```

#### Failing Example 2

*This error was caused by using the wrong datatype in the ID (the ID is a string, whereas Prisma was looking for a number in `PostUpdateInput`). As a result, the `Unchecked` type (`PostUncheckedUpdateInput`) was used, which doesn't have access to the categories relation, or connect functionality. If the ID was a number, the typings would have matched and the desired `PostUpdateInput` type would have been used by Prisma, which has access to the categories relation (and connect functionality).*

1. Do setup (if you didn't already do it in the working example)
2. Run `npm run fail2`
3. Review throw from prisma

```
> node ./failScript2.js

(node:15944) UnhandledPromiseRejectionWarning: Error:
Invalid `prisma.post.update()` invocation:

{
  where: {
    id: 5
  },
  include: {
    author: true,
    categories: true,
    profile: true
  },
  data: {
    categories: {
    ~~~~~~~~~~
      connect: {
        id: '6' // <- note the id is a string - id in CategoryWhereUniqueInput is meant to be a number
      }
    }
  }
}

Unknown arg `categories` in data.categories for type PostUncheckedUpdateInput. Available args:

type PostUncheckedUpdateInput {
  id?: Int | IntFieldUpdateOperationsInput
  authorId?: Int | IntFieldUpdateOperationsInput
  profileId?: Int | NullableIntFieldUpdateOperationsInput | Null
}
```