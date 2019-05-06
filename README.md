# Marble Seeds

Marble seeds it's a mixture of Koa, React and Node that allows you to create fast web-enabled applications. Out of the box, you get 3 applications, an **API server**, a **React client** and a **React Administrator**.

Marble Seeds also comes with a facility of scaffoldings, task, queues and more!

As a dependency you have to have up and running Mongo, Redis, Node and NPM.

To be able to use the scaffolding, you also need to have standard, which you can install with:

```
npm install standard --global
```

### Set up

After you clone the repository, you need to install al the NPM libraries

```bash
npm install
```

You can find all the default enviroment variables that configure the ports, databases and services in: **.env.default** and can override it in a file **.env.development**

For example a simple **.env.development**

```
MONGO_DB=your_new_project_db
```

To run the project, there are 3 different node projects that you can run with:

```bash
make api-server
make admin-server
make app-server
```

Api server will run a koa api, admin and app are two react projects that consume that API

You need run this task for generate initial translations.

```bash
node tasks/translations/synchronize-translations.js
```

By default, Marble Seeds have an admin application that will allow to visualize the database, users and more.

The easiest way to create your first user in the database is:

```bash
node tasks/create-admin --email admin@app.com --password foobar --screenName admin
```

Or create and load seed data from `tasks/base/seed-data.json` with:

```bash
node tasks/seed-data.js --file tasks/base-data/seed-data.json
```

Now, you can go point your browser to http://localhost:5000/admin/ and log in with that user, and start using the admin application.

By default, Marble Seeds have 3 different and powerfull tools to augment the user objects:

- Roles - Which will allow you to create and guard for permissions.
- Organizations - A user can only be part of one organization
- Groups - Groups of users who can be related in different ways.

If you want to start creating your application, with full support on the admin and API, you can use the scaffolding to create new modules, with full ui on the admin, to do so, you can run the next command:

```bash
node tasks/scaffolding/admin/scaffold-admin
```

The scaffolding will ask for the name of your database models, fields and generate all the code needed for the API and administrator app to work with this model.

Once you create this scaffolding, the model will be created in /models, the api application will be updated with the endpoint required to do a full CRUD and the admin has created all the ui to work with this model.

If you created a model called "artist", you can go to http://localhost:5000/admin/artist/ and generate new entries in the database.

If you want to add this to the sidebar menu, you can edit the file */admin/frontend/components/sidebar.js* import the list:

```bash
import Artist from '../pages/investors/list'
```

And add to the getMenuItems array in the same file:

```
{
  title: 'Artist',
  icon: 'file-o',
  to: '/artist',
  open: false,
  dropdown: [
    Artist.asSidebarItem()
  ]
}
```

At this point, you will have all the api calls required for the admin app, but they are all only available for the admin users.

To use this in the application, you will need to create your own API call outside of the /api/routers/admin folder as you might require them

## Production set up

To set up servers to run you app in production, follow this guide: https://www.notion.so/marbleform/Marble-seeds-server-from-0-e678d21f951546abae66f3f35bc7a420

