# prisma2-unchecked-relations

## Actions Undertaken

### DBs

I tested on both SQLite and PostgreSQL 13.2.

### Setup

1. `npm install`
2. Copy the example Schema from the [Prisma Relations Documentation](https://www.prisma.io/docs/concepts/components/prisma-schema/relations#types-of-relations) into `schema.prisma`
3. Reset database (delete the tables from the Quickstart database) and then run `npx prisma db push`
4. Confirm tables were setup correctly (I used TablePlus for this)

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

#### Notes

The thing that got me so confused with this, was that I had separate `update` statements in different files (that had made connections within the database row using the `authorId` method from `failScript.js`). It seems that connecting this way means that any future updates to that same database row will always use the `UncheckedCreateInput` or `UncheckedUpdateInput`.

Anyway, hope this helps anyone else who stumbles across this.