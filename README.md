# prisma2-unchecked-relations

## Actions Undertaken

#### Working Example

1. `npm install`
2. Copy the example Schema from the [Prisma Relations Documentation](https://www.prisma.io/docs/concepts/components/prisma-schema/relations#types-of-relations) into `schema.prisma`
3. I had to reset (delete the tables from the Quickstart database) and then run `npx prisma db push`
4. I confirmed the tables were setup with the TablePlus App (because prisma studio didn't work).
5. Run `npm run dev`
6. Check the database, category and post should be connected