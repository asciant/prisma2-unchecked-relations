# prisma2-unchecked-relations

This relates to https://github.com/prisma/prisma/issues/5788

The example schema was taken from the [Prisma Relations Documentation](https://www.prisma.io/docs/concepts/components/prisma-schema/relations#types-of-relations)

## Actions Undertaken

### DBs

I tested on both SQLite and PostgreSQL 13.2.

### Setup

1. `npm install`
2. Reset database (delete the existing tables from the database - if any) and then run `npx prisma db push`
3. Confirm tables were setup correctly (I used TablePlus for this)

#### Working Example

1. Do setup
2. Run `npm run dev`
3. Check the database, category and post should be connected

#### Failing Example

1. Do setup (if you didn't already do it in the working example)
2. Run `npm run fail`
3. Review throw from prisma

```
> node ./failScript.js

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

