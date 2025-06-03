# Create Your First Application
Now that you've set up Harper, let's build a simple API. Harper lets you build powerful APIs with minimal effort. In just a few minutes, you'll have a functional REST API with automatic validation, indexing, and querying—all without writing a single line of code.

## Setup Your Project
Start by cloning the Harper application template:

```bash
git clone https://github.com/HarperDB/application-template my-book-app
cd my-book-app
```

## Create a Complete API with Just a Schema
Harper's power comes from its schema-first approach. Edit your `schema.graphql` file to define a Book table:

```graphql
type Book @table @export {
  id: ID @primaryKey
  title: String! @indexed
  author: String! @indexed
  publishedYear: Int
  genre: String @indexed
}
```

That's it! This simple schema gives you:

- Automatic table creation with the `@table` directive
- Full REST API with the `@export` directive (GET, POST, PUT, DELETE)
- Data validation (title and author are required with `!`)
- Fast querying with `@indexed` fields
- Auto-generated primary keys with `@primaryKey`


## Start Your Application
```bash
harperdb dev .
```
Harper automatically creates your Book table and REST endpoints. You now have a complete API at `http://localhost:9926/Book/`

## Test Your API
### Create a book:
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "publishedYear": 1925, "genre": "Fiction"}' \
  http://localhost:9926/Book
```

### Get all books:
```bash
curl http://localhost:9926/Book
```

### Query by indexed fields:
```bash
curl "http://localhost:9926/Book?author=F. Scott Fitzgerald"
curl "http://localhost:9926/Book?genre=Fiction"
curl "http://localhost:9926/Book?publishedYear=1925&select(title,author)"
```

### Get a specific book:
```bash
curl http://localhost:9926/Book/BOOK_ID_HERE
```

## What You Get Automatically
Harper provides enterprise-grade features out of the box:

- **Content negotiation** (JSON, CBOR, MessagePack, CSV)
- **Authentication** (Basic, JWT, Cookie)
- **Caching headers** and ETags
- **Data validation** based on your schema
- **Automatic indexing** for fast queries
- **Error handling** and proper HTTP status codes

## Add Custom Logic (Optional)
Only when you need custom business logic should you add code. Create a `resources.js` file to extend the default behavior:

```js
export class Books extends Resource {
  // Add custom validation or computed fields
  post(data) {
    if (!data.title || !data.author) {
      return { error: "Title and author are required" };
    }
    
    // Add publication decade for analytics
    if (data.publishedYear) {
      data.decade = Math.floor(data.publishedYear / 10) * 10;
    }
    
    return this.table.post(data);
  }
}
```

## Key Takeaway
Harper's schema-driven approach means you can build production-ready APIs in minutes, not hours. Start with pure schema definitions to get 90% of your functionality, then add custom code only where needed. This gives you the best of both worlds: rapid development with the flexibility to customize when required.