# Create Your First Application
Now that you've set up Harper, let's build a simple Book API. Start by cloning the template:

```bash
git clone https://github.com/HarperDB/application-template my-book-app
cd my-book-app
```

The template includes:
- **schema.graphql** – Your GraphQL schema definition
- **resources.js** – For custom application logic
- **config.yaml** – Application-level settings

## Define a GraphQL Schema
Edit your `schema.graphql` file to create a Book table:
```graphql
type Book @table @export {
  id: ID @primaryKey
  title: String!
  author: String!
  publishedYear: Int
  genre: String
}
```

The schema above does several important things:
- Creates a `Book` table with the `@table` directive
- Makes the table accessible via REST and GraphQL using the `@export` directive
- Defines an `id` field as the primary key with the `@primaryKey` directive
- Requires `title` and `author` fields (marked with `!`)
- Adds optional `publishedYear` and `genre` fields

When you start your application, Harper will automatically create this table resource.

## Extend the Resource Class
Now let's create the business logic for our Book API by implementing a custom resource class. Update your `resources.js` file:

```js
export class Books extends Resource {
  // Get a book by ID or list all books
  get() {
    const id = this.getId();
    
    if (id) {
      // Return a single book
      return this.table.get(id);
    } else {
      // Return all books
      return this.table.get();
    }
  }
  
  // Create a new book
  post(data) {    
    // Validate required fields
    if (!data.title || !data.author) {
      return { error: "Title and author are required" };
    }
    
    // Prevent primary key overriding
    if (data.id) delete data.id;
    
    try {
      return this.table.post(data);
    } catch (error) {
      return { error: "Error creating book", details: error.message };
    }
  }
}
```
Let's break down what this JavaScript file is doing:

### Resource Class Extension
```js
export class Books extends Resource {
```

This line creates a custom `Books` class that extends Harper's built-in `Resource` class. By doing this, we inherit all the standard functionality while allowing us to customize behavior.

### GET Method
```js
get() {
  const id = this.getId();
  
  if (id) {
    return this.table.get(id);
  } else {
    return this.table.get();
  }
}
```

The `get()` method handles HTTP GET requests to our Book endpoint. It:
- Logs that a request was received (helpful for debugging)
- Checks if an ID was provided in the URL path
- If an ID exists, returns a single book by that ID
- If no ID exists, checks for a `genre` query parameter
- Returns all books, filtered by genre if specified

### POST Method
```js
post(data) {
  // Validate required fields
  if (!data.title || !data.author) {
    return { error: "Title and author are required" };
  }
  
  // Prevent primary key overriding
  if (data.id) delete data.id;
  
  return this.table.post(data);
}
```

The `post()` method handles HTTP POST requests to create new books. It:
- Handles both string and object data formats
- Validates that required fields (`title` and `author`) are present
- Removes any provided `id` field to prevent primary key conflicts
- Creates the book record in the database
- Returns the result or an error message if something goes wrong

## Run and Test
1. Start your application:
    ```bash
    harperdb dev .
    ```
2. Create a book:
    ```bash\
    curl -X POST -H "Content-Type: application/json" \ -d '{"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "publishedYear": 1925, "genre": "Fiction"}' \ http://localhost:9926/Books
    ```
3. Retrieve a book by ID:
    ```bash
    curl http://localhost:9926/Book/BOOK_ID_HERE
    ```
4. Get all books in a genre:
    ```bash
    curl http://localhost:9926/Book?genre=Fiction
    ```

This simple Book API demonstrates Harper's key features:
- Schema-based table definitions with GraphQL
- Custom resource extensions for business logic
- Automatic REST endpoint generation
- Built-in data validation and error handling

You can build on this foundation by adding more fields, implementing additional methods, or creating relationships to other tables.